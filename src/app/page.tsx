import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth-config";

export default async function Home() {
  const cookieStore = await cookies();

  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");
}
