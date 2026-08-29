import {
  Badge,
  GraduationCap,
  Users,
} from "lucide-react";

type Props = {
  totalMembers: number;
};

export default function MemberHeader({
  totalMembers,
}: Props) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Users className="h-9 w-9 text-cyan-400" />

            <div>
              <h1 className="text-3xl font-bold text-white">
                Anggota Kelas
              </h1>

              <p className="mt-1 text-slate-400">
                Daftar seluruh siswa XI TKJ 2
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <GraduationCap className="h-5 w-5 text-cyan-400" />

            <div>
              <p className="text-xs text-slate-400">
                Kelas
              </p>

              <p className="font-semibold text-white">
                XI TKJ 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Badge className="h-5 w-5 text-cyan-400" />

            <div>
              <p className="text-xs text-slate-400">
                Total Siswa
              </p>

              <p className="font-semibold text-white">
                {totalMembers} Orang
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}