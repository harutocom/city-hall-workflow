// /app
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
// authOptionsのパスはご自身の環境に合わせてください
import { authOptions } from "@/lib/nextauth";

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
