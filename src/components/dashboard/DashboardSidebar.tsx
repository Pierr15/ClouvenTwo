"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cloud,
  FolderOpen,
  Grid2X2,
  LogOut,
  Settings,
  ShieldCheck,
  Terminal,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

/* ==================================================
   MENU
================================================== */

const mainMenus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Grid2X2,
  },
  {
    title: "Anggota",
    href: "/members",
    icon: Users,
  },
  {
    title: "Pelajaran",
    href: "/schedule",
    icon: CalendarDays,
  },
  {
    title: "Tugas",
    href: "/assignments",
    icon: ClipboardList,
  },
  {
    title: "Apel Pagi",
    href: "/apel",
    icon: ShieldCheck,
  },
];

const cloudMenus = [
  {
    title: "Explorer",
    href: "/explorer",
    icon: FolderOpen,
  },
  {
    title: "Terminal",
    href: "/terminal",
    icon: Terminal,
  },
];

const toolMenus = [
  {
    title: "Alat",
    href: "/tools",
    icon: Wrench,
  },
];

/* ==================================================
   SIDEBAR
================================================== */

type DashboardSidebarProps = {
  initialCollapsed: boolean;
};

export default function DashboardSidebar({
  initialCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const [accountOpen, setAccountOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col overflow-visible border-r border-slate-800/80 bg-[#111827] transition-all duration-300 ${
        collapsed ? "w-20.5" : "w-70"
      }`}
    >
      {/* ============================
          LOGO
      ============================ */}

      <div className="shrink-0 px-5 py-6">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Cloud className="h-6 w-6 text-white" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-wide text-white">
                CLOEV
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Cloud Eleven
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================
          COLLAPSE BUTTON
      ============================ */}

      <button
        type="button"
        onClick={() => {
          setCollapsed((value) => {
            const nextValue = !value;

            document.cookie = `cloev-sidebar-collapsed=${String(
              nextValue,
            )}; Path=/; Max-Age=31536000; SameSite=Lax`;

            setAccountOpen(false);

            return nextValue;
          });
        }}
        aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        className="absolute -right-3.5 top-27 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-lg transition hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* ============================
          MENU SCROLL
      ============================ */}

      <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <SidebarSection title="Menu Utama" collapsed={collapsed}>
          {mainMenus.map((menu) => (
            <SidebarMenuItem
              key={menu.href}
              title={menu.title}
              href={menu.href}
              icon={menu.icon}
              collapsed={collapsed}
              active={isMenuActive(pathname, menu.href)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="CLOEV" collapsed={collapsed}>
          {cloudMenus.map((menu) => (
            <SidebarMenuItem
              key={menu.href}
              title={menu.title}
              href={menu.href}
              icon={menu.icon}
              collapsed={collapsed}
              active={isMenuActive(pathname, menu.href)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Tools" collapsed={collapsed}>
          {toolMenus.map((menu) => (
            <SidebarMenuItem
              key={menu.href}
              title={menu.title}
              href={menu.href}
              icon={menu.icon}
              collapsed={collapsed}
              active={isMenuActive(pathname, menu.href)}
            />
          ))}
        </SidebarSection>
      </div>

      {/* ============================
          ACCOUNT
      ============================ */}

      <div className="relative shrink-0 border-t border-slate-800/70 p-4">
        {/* Dropdown */}
        <div
          className={`absolute z-50 overflow-hidden rounded-xl border border-slate-700 bg-[#111827] shadow-2xl shadow-black/40 transition-all duration-250 ease-out ${
            collapsed
              ? "bottom-4 left-full ml-3 w-52 origin-bottom-left"
              : "bottom-full left-4 right-4 mb-3 origin-bottom"
          } ${
            accountOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0"
          }`}
        >
          <Link
            href="/profile"
            onClick={() => setAccountOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <UserRound className="h-4 w-4 text-slate-500" />
            Profil
          </Link>

          <Link
            href="/settings"
            onClick={() => setAccountOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Settings className="h-4 w-4 text-slate-500" />
            Pengaturan
          </Link>

          <div className="mx-3 border-t border-slate-800" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>

        {/* Trigger */}
        <button
          type="button"
          onClick={() => setAccountOpen((value) => !value)}
          aria-expanded={accountOpen}
          aria-label="Menu akun"
          className={`w-full rounded-2xl border border-slate-800/70 bg-slate-800/60 p-3 transition hover:border-blue-500/30 hover:bg-slate-800 ${
            collapsed ? "flex justify-center" : "flex items-center gap-3"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-blue-400">
            II
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-semibold text-white">
                  Student
                </p>

                <p className="text-xs text-slate-500">XI TKJ 2</p>
              </div>

              <ChevronRight
                className={`ml-auto h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  accountOpen ? "-rotate-90" : "rotate-0"
                }`}
              />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

/* ==================================================
   ACTIVE ROUTE
================================================== */

function isMenuActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ==================================================
   SIDEBAR SECTION
================================================== */

type SidebarSectionProps = {
  title: string;
  collapsed: boolean;
  children: ReactNode;
};

function SidebarSection({ title, collapsed, children }: SidebarSectionProps) {
  return (
    <section className="mb-7">
      {!collapsed && (
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          {title}
        </p>
      )}

      <div className="space-y-1">{children}</div>
    </section>
  );
}

/* ==================================================
   SIDEBAR MENU ITEM
================================================== */

type SidebarMenuItemProps = {
  title: string;
  href: string;
  icon: ComponentType<{
    className?: string;
  }>;
  collapsed: boolean;
  active: boolean;
};

function SidebarMenuItem({
  title,
  href,
  icon: Icon,
  collapsed,
  active,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={`group relative flex items-center rounded-xl transition-all duration-200 ${
        collapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"
      } ${
        active
          ? "bg-blue-600/15 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 h-6 w-0.75 rounded-r-full bg-blue-500" />
      )}

      <Icon
        className={`h-5 w-5 shrink-0 transition-colors ${
          active ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400"
        }`}
      />

      {!collapsed && (
        <span
          className={`text-sm font-medium ${
            active ? "text-white" : "text-slate-400 group-hover:text-white"
          }`}
        >
          {title}
        </span>
      )}
    </Link>
  );
}
