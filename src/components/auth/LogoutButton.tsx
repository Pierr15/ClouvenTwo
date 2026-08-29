"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
    >
      Keluar
    </button>
  );
}