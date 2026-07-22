import { redirect } from "next/navigation";

export default function LegacyModelsPage() {
  redirect("/create#models");
}
