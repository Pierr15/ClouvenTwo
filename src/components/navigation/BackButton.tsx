import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function BackButton({ href, children }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
    >
      <ArrowLeft className="h-4 w-4" />

      {children}
    </Link>
  );
}
