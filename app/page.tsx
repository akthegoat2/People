"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { ModulesContent } from "@/components/modules-content"
import { LessonViewer } from "@/components/lesson-viewer"
import { LeaderboardContent } from "@/components/leaderboard-content"
import { QuizzesContent } from "@/components/quizzes-content"
import { CertificatesContent } from "@/components/certificates-content"
import { AdminContent } from "@/components/admin-content"
import { AuthWrapper } from "@/components/auth-wrapper"
import { AuthProvider } from "@/contexts/auth-context"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedLesson, setSelectedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null)

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardContent onNavigate={setActiveView} />
      case "modules":
        return (
          <ModulesContent
            onStartLesson={(moduleId, lessonId) => {
              setSelectedLesson({ moduleId, lessonId })
              setActiveView("lesson")
            }}
          />
        )
      case "lesson":
        return (
          <LessonViewer
            moduleId={selectedLesson?.moduleId || ""}
            lessonId={selectedLesson?.lessonId || ""}
            onBack={() => setActiveView("modules")}
          />
        )
      case "quizzes":
        return <QuizzesContent />
      case "leaderboard":
        return <LeaderboardContent />
      case "certificates":
        return <CertificatesContent />
      case "admin":
        return <AdminContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <AuthWrapper>
      <AuthProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-background dark:to-background">
            <AppSidebar activeView={activeView} onViewChange={setActiveView} />
            <main className="flex-1 p-4 md:p-6 lg:p-8 relative">
              <SidebarTrigger className="absolute top-2 left-2 lg:hidden" />
              {renderContent()}
            </main>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </AuthWrapper>
  )
}
