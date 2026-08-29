import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/currentUser";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Terminal from "@/components/terminal/Terminal";

export default async function TerminalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            CLOEV Tools
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
            Terminal
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Terminal Linux simulasi untuk menjalankan
            perintah dasar dan berinteraksi dengan
            lingkungan virtual CLOEV.
          </p>
        </div>

        <Terminal
          fullName={user.full_name}
        />
      </div>
    </DashboardLayout>
  );
}