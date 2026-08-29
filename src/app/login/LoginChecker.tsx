"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginChecker() {
  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) return;

        const result = await res.json();

        if (result.success) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkLogin();
  }, [router]);

  return null;
}