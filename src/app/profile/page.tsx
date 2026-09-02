import { redirect } from "next/navigation";

import { getProfile } from "@/services/profileService";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileLogout from "@/components/profile/ProfileLogout";
import BackButton from "@/components/navigation/BackButton";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <BackButton href="/dashboard">Kembali ke Dashboard</BackButton>

      <ProfileHeader profile={profile} />

      <ProfileInfo profile={profile} />

      <ProfileAbout profile={profile} />

      <ProfileLogout />
    </main>
  );
}
