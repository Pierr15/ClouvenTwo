"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import LoginChecker from "./LoginChecker";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getDeviceId } from "../../lib/device";

type LoginForm = {
  fullName: string;
  nis: string;
  birthDate: string;
  pin: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          deviceId: getDeviceId(),
          userAgent: navigator.userAgent,
        }),
      });

      console.log("STATUS =", res.status);

      const text = await res.text();

      console.log("BODY =", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        alert("Response bukan JSON.");
        return;
      }

      if (result.success) {
        reset();
        router.replace("/dashboard");
        return;
      }

      alert(result.message ?? "Login gagal.");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6">
      <LoginChecker />

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Dashboard XI TKJ 2
            </h1>

            <p className="mt-2 text-slate-400 text-sm">
              Silakan login untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>

              <Input
                id="fullName"
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                {...register("fullName", {
                  required: true,
                })}
              />
            </div>

            <div>
              <Label htmlFor="nis">NIS</Label>

              <Input
                id="nis"
                placeholder="Contoh: 25.23012"
                inputMode="numeric"
                {...register("nis", {
                  required: true,
                })}
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Tanggal Lahir</Label>

              <Input
                id="birthDate"
                type="date"
                {...register("birthDate", {
                  required: true,
                })}
              />
            </div>

            <div>
              <Label htmlFor="pin">PIN 6 Digit</Label>

              <Input
                id="pin"
                type="password"
                placeholder="••••••"
                maxLength={6}
                inputMode="numeric"
                {...register("pin", {
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                })}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11"
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-5">
            <p className="text-center text-xs text-slate-500">
              Login pertama kali?
            </p>

            <p className="mt-1 text-center text-xs text-slate-600">
              Isi nama, NIS, tanggal lahir, lalu buat PIN 6 digit.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}