import { createClient } from "@/lib/supabase"

export interface AdminModule {
  id: string
  title: string
  description: string
  emoji: string
  difficulty: string
  duration: string
  xp_reward: number
  skills: string[]
  projects: string[]
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface AdminLesson {
  id: string
  module_id: string
  title: string
  description: string
  content: string
  code_example?: string | null
  challenge?: string | null
  starter_code?: string | null
  expected_output?: string | null
  tips?: string | null
  type: string
  xp_reward: number
  estimated_time: number
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface AdminQuiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit: number
  xp_reward: number
  category: string
  type: string
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface AdminQuestion {
  id: string
  quiz_id: string
  type: string
  question: string
  code?: string | null
  options: string[] | null
  correct_answer: string
  explanation: string
  points: number
  order_index: number
  created_at?: string
  updated_at?: string
}

class AdminService {
  private get supabase() {
    return createClient()
  }

  // ── Modules ──
  async getModules(): Promise<AdminModule[]> {
    const { data } = await this.supabase.from("modules").select("*").order("order_index")
    return data || []
  }

  async createModule(module: Omit<AdminModule, "id" | "created_at" | "updated_at">): Promise<string | null> {
    const { data, error } = await this.supabase.from("modules").insert(module).select("id").single()
    if (error) { console.error("Error creating module:", error); return null }
    return data.id
  }

  async updateModule(id: string, updates: Partial<AdminModule>): Promise<boolean> {
    const { error } = await this.supabase.from("modules").update(updates).eq("id", id)
    if (error) { console.error("Error updating module:", error); return false }
    return true
  }

  async deleteModule(id: string): Promise<boolean> {
    const { error } = await this.supabase.from("modules").delete().eq("id", id)
    if (error) { console.error("Error deleting module:", error); return false }
    return true
  }

  // ── Lessons ──
  async getLessons(moduleId: string): Promise<AdminLesson[]> {
    const { data } = await this.supabase.from("lessons").select("*").eq("module_id", moduleId).order("order_index")
    return data || []
  }

  async getAllLessons(): Promise<AdminLesson[]> {
    const { data } = await this.supabase.from("lessons").select("*").order("order_index")
    return data || []
  }

  async createLesson(lesson: Omit<AdminLesson, "id" | "created_at" | "updated_at">): Promise<string | null> {
    const { data, error } = await this.supabase.from("lessons").insert(lesson).select("id").single()
    if (error) { console.error("Error creating lesson:", error); return null }
    return data.id
  }

  async updateLesson(id: string, updates: Partial<AdminLesson>): Promise<boolean> {
    const { error } = await this.supabase.from("lessons").update(updates).eq("id", id)
    if (error) { console.error("Error updating lesson:", error); return false }
    return true
  }

  async deleteLesson(id: string): Promise<boolean> {
    const { error } = await this.supabase.from("lessons").delete().eq("id", id)
    if (error) { console.error("Error deleting lesson:", error); return false }
    return true
  }

  // ── Quizzes ──
  async getQuizzes(): Promise<AdminQuiz[]> {
    const { data } = await this.supabase.from("quizzes").select("*").order("order_index")
    return data || []
  }

  async createQuiz(quiz: Omit<AdminQuiz, "id" | "created_at" | "updated_at">): Promise<string | null> {
    const { data, error } = await this.supabase.from("quizzes").insert(quiz).select("id").single()
    if (error) { console.error("Error creating quiz:", error); return null }
    return data.id
  }

  async updateQuiz(id: string, updates: Partial<AdminQuiz>): Promise<boolean> {
    const { error } = await this.supabase.from("quizzes").update(updates).eq("id", id)
    if (error) { console.error("Error updating quiz:", error); return false }
    return true
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const { error } = await this.supabase.from("quizzes").delete().eq("id", id)
    if (error) { console.error("Error deleting quiz:", error); return false }
    return true
  }

  // ── Questions ──
  async getQuestions(quizId: string): Promise<AdminQuestion[]> {
    const { data } = await this.supabase.from("questions").select("*").eq("quiz_id", quizId).order("order_index")
    return data || []
  }

  async createQuestion(question: Omit<AdminQuestion, "id" | "created_at" | "updated_at">): Promise<string | null> {
    const { data, error } = await this.supabase.from("questions").insert(question).select("id").single()
    if (error) { console.error("Error creating question:", error); return null }
    return data.id
  }

  async updateQuestion(id: string, updates: Partial<AdminQuestion>): Promise<boolean> {
    const { error } = await this.supabase.from("questions").update(updates).eq("id", id)
    if (error) { console.error("Error updating question:", error); return false }
    return true
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const { error } = await this.supabase.from("questions").delete().eq("id", id)
    if (error) { console.error("Error deleting question:", error); return false }
    return true
  }

  // ── Users / Roles ──
  async setUserRole(userId: string, role: "student" | "admin"): Promise<boolean> {
    const { error } = await this.supabase.from("profiles").update({ role }).eq("id", userId)
    if (error) { console.error("Error setting role:", error); return false }
    return true
  }

  async getUsers(): Promise<any[]> {
    const { data } = await this.supabase.from("profiles").select("id, full_name, email, role, created_at").order("created_at")
    return data || []
  }
}

export const adminService = new AdminService()
