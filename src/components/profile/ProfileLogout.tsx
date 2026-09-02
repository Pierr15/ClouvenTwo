import { LogOut, TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfileLogout() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-red-500/10 bg-[#111a2e] p-5 shadow-lg shadow-red-950/10 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <LogOut className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Akun
            </p>

            <h2 className="text-xl font-bold text-white">Keluar dari Akun?</h2>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Setelah keluar, kamu harus login kembali menggunakan PIN untuk
            mengakses CLOEV.
          </p>

          <div className="mt-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-white/10 bg-[#111a2e] text-white">
                <AlertDialogHeader>
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <TriangleAlert className="h-7 w-7 text-amber-400" />
                  </div>

                  <AlertDialogTitle className="text-center text-lg font-bold text-white">
                    Keluar dari akun?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-center leading-6 text-slate-400">
                    Kamu yakin ingin keluar dari akun ini?
                    <br />
                    Setelah logout, kamu harus login kembali menggunakan PIN.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2 sm:gap-2">
                  <AlertDialogCancel className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
                    Batal
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
