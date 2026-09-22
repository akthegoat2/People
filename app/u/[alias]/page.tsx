"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/people/navbar";
import { Sidebar } from "@/components/people/sidebar";
import { BottomNav } from "@/components/people/bottom-nav";
import { ProfileView, RotateAliasButton } from "@/components/people/profile-view";
import { usePeople } from "@/contexts/people-context";

export default function UserPage() {
  const params = useParams();
  const alias = decodeURIComponent(params.alias as string);
  const { alias: mine, refreshAlias } = usePeople();
  const isMine = alias === mine;

  return (
    <div className="min-h-screen pb-24 lg:pb-10">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {isMine && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[12px] text-slate-400">This is your pseudonymous profile.</span>
              <RotateAliasButton onRotate={refreshAlias} />
            </div>
          )}
          <ProfileView alias={alias} />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
