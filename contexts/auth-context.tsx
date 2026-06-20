"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { profileService, type UserProfile } from "@/lib/profile-service"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>
  awardXP: (amount: number) => Promise<boolean>
  updateStreak: () => Promise<boolean>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  updateProfile: async () => false,
  awardXP: async () => false,
  updateStreak: async () => false,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const userProfile = await profileService.getProfile(userId)
    setProfile(userProfile)
    return userProfile
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (user && mounted) {
          setUser(user)
          await fetchProfile(user.id)
        }
      } catch (err: any) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return false
    const success = await profileService.updateProfile(user.id, updates)
    if (success && profile) {
      setProfile({ ...profile, ...updates })
    }
    return success
  }, [user, profile])

  const awardXP = useCallback(async (amount: number) => {
    if (!user) return false
    const success = await profileService.awardXP(user.id, amount)
    if (success) {
      const updatedProfile = await profileService.getProfile(user.id)
      setProfile(updatedProfile)
    }
    return success
  }, [user])

  const updateStreak = useCallback(async () => {
    if (!user) return false
    const success = await profileService.updateStreak(user.id)
    if (success) {
      const updatedProfile = await profileService.getProfile(user.id)
      setProfile(updatedProfile)
    }
    return success
  }, [user])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, updateProfile, awardXP, updateStreak, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
