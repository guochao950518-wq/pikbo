-- PIKBO product foundation: private assets, projects, async jobs, and an
-- auditable credit ledger. Reservation settlement updates status while every
-- balance-changing refund/grant remains a separate idempotent row.
-- Server routes use SUPABASE_SERVICE_ROLE_KEY;
-- browser clients never receive it and have no direct table access.

create extension if not exists pgcrypto;

create table if not exists public.pikbo_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pikbo_projects_owner_updated_idx
  on public.pikbo_projects (owner_id, updated_at desc);

create table if not exists public.pikbo_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  project_id uuid references public.pikbo_projects(id) on delete set null,
  role text not null check (role in (
    'front', 'side', 'back', 'packaging',
    'output_source', 'output_watermarked', 'poster'
  )),
  file_name text not null,
  content_type text not null,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  storage_bucket text not null default 'pikbo-assets',
  storage_path text not null unique,
  status text not null check (status in ('pending', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pikbo_assets_owner_created_idx
  on public.pikbo_assets (owner_id, created_at desc);

create table if not exists public.pikbo_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  project_id uuid references public.pikbo_projects(id) on delete set null,
  retry_of_job_id uuid references public.pikbo_generation_jobs(id) on delete set null,
  idempotency_key text not null,
  status text not null check (status in (
    'queued', 'running', 'succeeded', 'failed', 'canceled'
  )),
  progress integer not null default 0 check (progress between 0 and 100),
  input jsonb not null,
  provider text not null check (provider in ('fal', 'demo')),
  provider_request_id text unique,
  model text not null,
  output_asset_id uuid references public.pikbo_assets(id) on delete set null,
  output_url text,
  poster_url text,
  demo boolean not null default false,
  watermark boolean not null default true,
  estimated_credits integer not null default 0 check (estimated_credits >= 0),
  charged_credits integer not null default 0 check (charged_credits >= 0),
  credit_status text not null check (credit_status in (
    'not_required', 'reserved', 'charged', 'refunded'
  )),
  attempt integer not null default 1 check (attempt between 1 and 10),
  max_attempts integer not null default 3 check (max_attempts between 1 and 10),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  unique (owner_id, idempotency_key)
);

create index if not exists pikbo_jobs_owner_updated_idx
  on public.pikbo_generation_jobs (owner_id, updated_at desc);
create index if not exists pikbo_jobs_project_updated_idx
  on public.pikbo_generation_jobs (project_id, updated_at desc);

create table if not exists public.pikbo_credit_accounts (
  owner_id text primary key,
  balance integer not null check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.pikbo_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  generation_job_id uuid references public.pikbo_generation_jobs(id) on delete set null,
  kind text not null check (kind in ('reservation', 'refund', 'grant', 'adjustment')),
  amount integer not null,
  status text not null check (status in ('reserved', 'charged', 'refunded', 'posted')),
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists pikbo_credit_ledger_owner_created_idx
  on public.pikbo_credit_ledger (owner_id, created_at desc);

create table if not exists public.pikbo_webhook_events (
  id text primary key,
  provider text not null,
  provider_request_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pikbo_subscriptions (
  session_id text primary key,
  plan text not null check (plan in ('free', 'creator', 'shop')),
  credits integer check (credits is null or credits >= 0),
  period_key text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null check (status in ('active', 'canceled', 'past_due')),
  updated_at timestamptz not null default now()
);

create or replace function public.pikbo_upsert_subscription_entitlement(
  p_session_id text,
  p_plan text,
  p_credits integer,
  p_period_key text,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_status text,
  p_updated_at timestamptz
) returns setof public.pikbo_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous public.pikbo_subscriptions%rowtype;
  v_should_reset boolean;
  v_previous_balance integer;
  v_delta integer;
  v_ledger_key text;
begin
  select s.* into v_previous
  from public.pikbo_subscriptions s
  where s.session_id = p_session_id
  for update;

  v_should_reset := not found
    or v_previous.plan is distinct from p_plan
    or v_previous.period_key is distinct from p_period_key
    or (
      v_previous.status is distinct from p_status
      and p_status in ('active', 'canceled')
    );

  insert into public.pikbo_subscriptions(
    session_id, plan, credits, period_key, stripe_customer_id,
    stripe_subscription_id, status, updated_at
  ) values (
    p_session_id, p_plan, p_credits, p_period_key, p_stripe_customer_id,
    p_stripe_subscription_id, p_status, p_updated_at
  )
  on conflict (session_id) do update set
    plan = excluded.plan,
    credits = excluded.credits,
    period_key = excluded.period_key,
    stripe_customer_id = excluded.stripe_customer_id,
    stripe_subscription_id = excluded.stripe_subscription_id,
    status = excluded.status,
    updated_at = excluded.updated_at;

  if p_credits is not null and v_should_reset then
    select a.balance into v_previous_balance
    from public.pikbo_credit_accounts a
    where a.owner_id = p_session_id
    for update;

    if not found then
      v_previous_balance := 0;
      insert into public.pikbo_credit_accounts(owner_id, balance, updated_at)
      values (p_session_id, greatest(p_credits, 0), p_updated_at);
    else
      update public.pikbo_credit_accounts
      set balance = greatest(p_credits, 0), updated_at = p_updated_at
      where owner_id = p_session_id;
    end if;

    v_delta := greatest(p_credits, 0) - v_previous_balance;
    v_ledger_key := concat(
      'subscription:', p_session_id, ':', coalesce(p_period_key, 'none'),
      ':', p_plan, ':', p_status
    );
    if v_delta <> 0 then
      insert into public.pikbo_credit_ledger(
        owner_id, generation_job_id, kind, amount, status, idempotency_key
      ) values (
        p_session_id, null,
        case when v_delta > 0 then 'grant' else 'adjustment' end,
        v_delta, 'posted', v_ledger_key
      ) on conflict (idempotency_key) do nothing;
    end if;
  end if;

  return query
  select s.* from public.pikbo_subscriptions s
  where s.session_id = p_session_id;
end;
$$;

create unique index if not exists pikbo_webhook_provider_request_idx
  on public.pikbo_webhook_events (provider, provider_request_id);

create or replace function public.pikbo_claim_webhook_event(
  p_event_id text,
  p_provider text,
  p_request_id text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer;
begin
  insert into public.pikbo_webhook_events(id, provider, provider_request_id)
  values (p_event_id, p_provider, p_request_id)
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

-- Lazily creates an account from the current signed-session allowance during
-- migration. Once Supabase Auth is active, account provisioning should happen
-- at signup and p_initial_balance should be ignored for existing rows.
create or replace function public.pikbo_reserve_generation_credits(
  p_owner_id text,
  p_job_id uuid,
  p_amount integer,
  p_initial_balance integer
) returns table(balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'invalid_credit_amount';
  end if;

  insert into public.pikbo_credit_accounts(owner_id, balance)
  values (p_owner_id, greatest(p_initial_balance, 0))
  on conflict (owner_id) do nothing;

  select a.balance into v_balance
  from public.pikbo_credit_accounts a
  where a.owner_id = p_owner_id
  for update;

  if exists (
    select 1 from public.pikbo_credit_ledger
    where idempotency_key = 'reserve:' || p_job_id::text
  ) then
    return query select v_balance;
    return;
  end if;

  if v_balance < p_amount then
    raise exception 'insufficient_credits';
  end if;

  v_balance := v_balance - p_amount;
  update public.pikbo_credit_accounts
  set balance = v_balance, updated_at = now()
  where owner_id = p_owner_id;

  insert into public.pikbo_credit_ledger(
    owner_id, generation_job_id, kind, amount, status, idempotency_key
  ) values (
    p_owner_id, p_job_id, 'reservation', -p_amount, 'reserved',
    'reserve:' || p_job_id::text
  );

  return query select v_balance;
end;
$$;

create or replace function public.pikbo_settle_generation_credits(
  p_owner_id text,
  p_job_id uuid,
  p_outcome text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_amount integer;
  v_status text;
begin
  if p_outcome not in ('charged', 'refunded') then
    raise exception 'invalid_credit_outcome';
  end if;

  select abs(l.amount), l.status into v_amount, v_status
  from public.pikbo_credit_ledger l
  where l.idempotency_key = 'reserve:' || p_job_id::text
    and l.owner_id = p_owner_id
  for update;

  if v_amount is null then
    raise exception 'credit_reservation_not_found';
  end if;

  if p_outcome = 'charged' then
    if v_status <> 'reserved' then
      return;
    end if;
    update public.pikbo_credit_ledger
    set status = 'charged'
    where idempotency_key = 'reserve:' || p_job_id::text;
    return;
  end if;

  if v_status <> 'reserved' then
    return;
  end if;

  if exists (
    select 1 from public.pikbo_credit_ledger
    where idempotency_key = 'refund:' || p_job_id::text
  ) then
    return;
  end if;

  update public.pikbo_credit_accounts
  set balance = balance + v_amount, updated_at = now()
  where owner_id = p_owner_id;

  update public.pikbo_credit_ledger
  set status = 'refunded'
  where idempotency_key = 'reserve:' || p_job_id::text;

  insert into public.pikbo_credit_ledger(
    owner_id, generation_job_id, kind, amount, status, idempotency_key
  ) values (
    p_owner_id, p_job_id, 'refund', v_amount, 'posted',
    'refund:' || p_job_id::text
  );
end;
$$;

alter table public.pikbo_projects enable row level security;
alter table public.pikbo_assets enable row level security;
alter table public.pikbo_generation_jobs enable row level security;
alter table public.pikbo_credit_accounts enable row level security;
alter table public.pikbo_credit_ledger enable row level security;
alter table public.pikbo_webhook_events enable row level security;
alter table public.pikbo_subscriptions enable row level security;

revoke all on public.pikbo_projects from anon, authenticated;
revoke all on public.pikbo_assets from anon, authenticated;
revoke all on public.pikbo_generation_jobs from anon, authenticated;
revoke all on public.pikbo_credit_accounts from anon, authenticated;
revoke all on public.pikbo_credit_ledger from anon, authenticated;
revoke all on public.pikbo_webhook_events from anon, authenticated;
revoke all on public.pikbo_subscriptions from anon, authenticated;
revoke all on function public.pikbo_reserve_generation_credits(text, uuid, integer, integer) from public;
revoke all on function public.pikbo_settle_generation_credits(text, uuid, text) from public;
revoke all on function public.pikbo_claim_webhook_event(text, text, text) from public;
revoke all on function public.pikbo_upsert_subscription_entitlement(text, text, integer, text, text, text, text, timestamptz) from public;
grant execute on function public.pikbo_reserve_generation_credits(text, uuid, integer, integer) to service_role;
grant execute on function public.pikbo_settle_generation_credits(text, uuid, text) to service_role;
grant execute on function public.pikbo_claim_webhook_event(text, text, text) to service_role;
grant execute on function public.pikbo_upsert_subscription_entitlement(text, text, integer, text, text, text, text, timestamptz) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pikbo-assets',
  'pikbo-assets',
  false,
  157286400,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
