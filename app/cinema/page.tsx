import { redirect } from "next/navigation";

export default function LegacyCinemaPage() {
  redirect("/create?mode=cinema");
}
