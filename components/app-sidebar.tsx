"use client"

import { Zap, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { ProfileSettings } from "@/components/profile-settings"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const baseMenuItems = [
  { title: "Dashboard", id: "dashboard", emoji: "🏠" },
  { title: "Modules", id: "modules", emoji: "📚" },
  { title: "Quizzes", id: "quizzes", emoji: "❓" },
  { title: "Certificates", id: "certificates", emoji: "🏆" },
  { title: "Leaderboard", id: "leaderboard", emoji: "🏆" },
]

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { user, profile } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showProfileSettings, setShowProfileSettings] = useState(false)

  const menuItems = profile?.role === "admin"
    ? [...baseMenuItems, { title: "Admin", id: "admin", emoji: "🛠️" }]
    : baseMenuItems

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg">
            🦅
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              LASU Learn
            </h2>
            <p className="text-xs text-muted-foreground">Computer Science Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start gap-3 rounded-xl hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          {/* User Profile */}
          <div
            onClick={() => setShowProfileSettings(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowProfileSettings(true) }}
            role="button"
            tabIndex={0}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 cursor-pointer hover:from-green-500/20 hover:to-blue-500/20 transition-colors"
          >
            <Avatar className="h-10 w-10 ring-2 ring-green-500/30">
              <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold">
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-sidebar-foreground">{user?.user_metadata?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground">{profile?.course || "Full Stack Bootcamp"}</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold text-sidebar-foreground">Level {profile?.level || 1}</span>
              </div>
              <span className="text-sm font-bold text-orange-500">
                {profile?.xp || 0} / {(profile?.level || 1) * 1000} XP
              </span>
            </div>
            <Progress value={((profile?.xp || 0) % 1000) / 10} className="h-2 bg-yellow-500/20" />
            <p className="text-xs text-muted-foreground">
              {1000 - ((profile?.xp || 0) % 1000)} XP to level {(profile?.level || 1) + 1}! 🚀
            </p>
          </div>

          {/* Current Streak */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-sidebar-foreground">Streak</span>
            </div>
            <Badge variant="secondary" className="bg-red-500/20 text-red-600 dark:text-red-400 font-bold">
              {profile?.streak || 0} days
            </Badge>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors border border-sidebar-border"
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-sidebar-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-sidebar-foreground" />
              )}
              <span className="text-sm font-medium text-sidebar-foreground">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-300"}`}>
              <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </button>
        </div>
      </SidebarFooter>

      {/* Profile Settings Modal */}
      {showProfileSettings && user && <ProfileSettings user={user} onClose={() => setShowProfileSettings(false)} />}
    </Sidebar>
  )
}
