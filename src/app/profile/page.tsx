import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getProfile } from "@/services/profileService";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileLogout from "@/components/profile/ProfileLogout";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      <ProfileHeader profile={profile} />

      <ProfileInfo profile={profile} />

      <ProfileAbout profile={profile} />

      <ProfileLogout />
    </main>
  );
}
