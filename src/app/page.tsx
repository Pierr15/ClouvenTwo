import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();

  const session = cookieStore.get("xi-tkj2-session");

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");
}