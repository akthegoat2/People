"use client";

import { Navbar } from "@/components/people/navbar";
import { Sidebar } from "@/components/people/sidebar";
import { BottomNav } from "@/components/people/bottom-nav";
import { Footer } from "@/components/people/footer";
import { LiveEngine } from "@/components/people/live-engine";

export default function LivePage() {
  return (
    <div className="min-h-screen pb-24 lg:pb-10">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <LiveEngine />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
