import { ReactNode } from "react";

import DashboardSidebar from "./DashboardSidebar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <main className="flex h-screen overflow-hidden bg-[#070d1d] text-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Area utama */}
      <div className="min-w-0 flex-1 overflow-hidden bg-[#0a1020]">
        <div className="h-full overflow-y-auto scrollbar-none">
          {children}
        </div>
      </div>
    </main>
  );
}