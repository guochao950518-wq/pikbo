export class ProductApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ProductApiError";
  }
}

export class ProductPersistenceUnavailableError extends ProductApiError {
  constructor() {
    super(
      "persistent_storage_unavailable",
      "Cloud saving is not configured. Configure Supabase before using production projects or jobs.",
      503
    );
    this.name = "ProductPersistenceUnavailableError";
  }
}

export function productErrorResponse(error: unknown): Response {
  if (error instanceof ProductApiError) {
    return Response.json(
      { error: error.message, code: error.code, ...error.details },
      { status: error.status }
    );
  }
  console.error("product API error", error);
  return Response.json(
    { error: "Unexpected product service error", code: "product_service_error" },
    { status: 500 }
  );
}
