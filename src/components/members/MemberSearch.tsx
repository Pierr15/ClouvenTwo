"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function MemberSearch({
  value = "",
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Cari nama siswa atau NIS..."
          className="h-12 rounded-xl border-slate-700 bg-slate-900 pl-12 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
        />
      </div>
    </div>
  );
}