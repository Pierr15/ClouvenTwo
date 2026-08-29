import { Mic2 } from "lucide-react";

export default function ApelHeader() {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="rounded-xl bg-cyan-500/10 p-3">
        <Mic2 className="h-7 w-7 text-cyan-400" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">
          Pemimpin Apel
        </h1>

        <p className="text-slate-400">
          Informasi pemimpin apel hari ini dan berikutnya.
        </p>
      </div>
    </div>
  );
}