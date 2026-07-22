import { redirect } from "next/navigation";

export default function LegacyImagePage() {
  redirect("/create?mode=image");
}
