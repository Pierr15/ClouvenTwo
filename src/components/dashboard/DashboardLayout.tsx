import { ReactNode } from "react";
import { cookies } from "next/headers";

import DashboardSidebar from "./DashboardSidebar";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies();

  const sidebarCollapsed =
    cookieStore.get("cloev-sidebar-collapsed")?.value === "true";
  return (
    <main className="flex h-screen overflow-hidden bg-[#070d1d] text-white">
      <DashboardSidebar initialCollapsed={sidebarCollapsed} />

      <div className="min-w-0 flex-1 overflow-hidden bg-[#0a1020]">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
