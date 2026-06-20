"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  Brain,
  Users,
  Layers,
} from "lucide-react"
import {
  adminService,
  type AdminModule,
  type AdminLesson,
  type AdminQuiz,
  type AdminQuestion,
} from "@/lib/admin-service"

export function AdminContent() {
  const [tab, setTab] = useState("modules")

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Manage learning content and users</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="modules" className="flex items-center gap-2 shrink-0">
            <Layers className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Modules</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2 shrink-0">
            <Brain className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2 shrink-0">
            <Brain className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 shrink-0">
            <Users className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <ModulesManager />
        </TabsContent>
        <TabsContent value="lessons">
          <LessonsManager />
        </TabsContent>
        <TabsContent value="quizzes">
          <QuizzesManager />
        </TabsContent>
        <TabsContent value="questions">
          <QuestionsManager />
        </TabsContent>
        <TabsContent value="users">
          <UsersManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Modules Manager ───────────────────────────────────────────────

function ModulesManager() {
  const [modules, setModules] = useState<AdminModule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminModule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", description: "", emoji: "📚", difficulty: "Beginner", duration: "2 weeks", xp_reward: 100, skills: "", projects: "" })

  const fetch = useCallback(async () => {
    setLoading(true)
    const data = await adminService.getModules()
    setModules(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: "", description: "", emoji: "📚", difficulty: "Beginner", duration: "2 weeks", xp_reward: 100, skills: "", projects: "" })
    setShowForm(true)
  }

  const openEdit = (m: AdminModule) => {
    setEditing(m)
    setForm({
      title: m.title,
      description: m.description,
      emoji: m.emoji,
      difficulty: m.difficulty,
      duration: m.duration,
      xp_reward: m.xp_reward,
      skills: m.skills.join(", "),
      projects: m.projects.join(", "),
    })
    setShowForm(true)
  }

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      emoji: form.emoji,
      difficulty: form.difficulty,
      duration: form.duration,
      xp_reward: form.xp_reward,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      projects: form.projects.split(",").map((s) => s.trim()).filter(Boolean),
      order_index: editing?.order_index ?? modules.length,
    }
    if (editing) {
      await adminService.updateModule(editing.id, payload)
    } else {
      await adminService.createModule(payload)
    }
    setShowForm(false)
    fetch()
  }

  const remove = async () => {
    if (deleteId) {
      await adminService.deleteModule(deleteId)
      setDeleteId(null)
      fetch()
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading modules...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Modules ({modules.length})</h2>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Module
        </Button>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-sm text-gray-500">{m.description.slice(0, 100)}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{m.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{m.duration}</Badge>
                    <Badge variant="outline" className="text-xs">{m.xp_reward} XP</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEdit(m)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setDeleteId(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {modules.length === 0 && (
          <div className="text-center py-8 text-gray-500">No modules yet. Click "Add Module" to create one.</div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Module" : "Create Module"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Emoji</Label>
                <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              </div>
              <div>
                <Label>Difficulty</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>XP Reward</Label>
              <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Skills (comma-separated)</Label>
              <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <div>
              <Label>Projects (comma-separated)</Label>
              <Input value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete module?</AlertDialogTitle>
            <AlertDialogDescription>This will also delete all lessons in this module.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Lessons Manager ─────────────────────────────────────────────

function LessonsManager() {
  const [lessons, setLessons] = useState<AdminLesson[]>([])
  const [modules, setModules] = useState<AdminModule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminLesson | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterModule, setFilterModule] = useState<string>("")
  const [form, setForm] = useState({
    module_id: "", title: "", description: "", content: "", code_example: "",
    challenge: "", starter_code: "", expected_output: "", tips: "",
    type: "theory", xp_reward: 25, estimated_time: 30,
  })

  const fetch = useCallback(async () => {
    setLoading(true)
    const [lessonsData, modulesData] = await Promise.all([adminService.getAllLessons(), adminService.getModules()])
    setLessons(lessonsData)
    setModules(modulesData)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const displayed = filterModule ? lessons.filter((l) => l.module_id === filterModule) : lessons

  const openCreate = () => {
    setEditing(null)
    setForm({ module_id: modules[0]?.id || "", title: "", description: "", content: "", code_example: "", challenge: "", starter_code: "", expected_output: "", tips: "", type: "theory", xp_reward: 25, estimated_time: 30 })
    setShowForm(true)
  }

  const openEdit = (l: AdminLesson) => {
    setEditing(l)
    setForm({
      module_id: l.module_id, title: l.title, description: l.description, content: l.content,
      code_example: l.code_example || "", challenge: l.challenge || "", starter_code: l.starter_code || "",
      expected_output: l.expected_output || "", tips: l.tips || "", type: l.type, xp_reward: l.xp_reward, estimated_time: l.estimated_time,
    })
    setShowForm(true)
  }

  const save = async () => {
    const payload = {
      module_id: form.module_id, title: form.title, description: form.description, content: form.content,
      code_example: form.code_example || null, challenge: form.challenge || null, starter_code: form.starter_code || null,
      expected_output: form.expected_output || null, tips: form.tips || null, type: form.type, xp_reward: form.xp_reward,
      estimated_time: form.estimated_time, order_index: editing?.order_index ?? displayed.length,
    }
    if (editing) {
      await adminService.updateLesson(editing.id, payload)
    } else {
      await adminService.createLesson(payload)
    }
    setShowForm(false)
    fetch()
  }

  const remove = async () => {
    if (deleteId) {
      await adminService.deleteLesson(deleteId)
      setDeleteId(null)
      fetch()
    }
  }

  const moduleName = (id: string) => modules.find((m) => m.id === id)?.title || id

  if (loading) return <div className="text-center py-8 text-gray-500">Loading lessons...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Module filter:</Label>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="">All modules</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Lesson
        </Button>
      </div>

      <div className="space-y-3">
        {displayed.map((l) => (
          <Card key={l.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">{l.title}</div>
                <div className="text-sm text-gray-500">{moduleName(l.module_id)} — {l.description.slice(0, 80)}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{l.type}</Badge>
                  <Badge variant="outline" className="text-xs">{l.estimated_time}min</Badge>
                  <Badge variant="outline" className="text-xs">{l.xp_reward} XP</Badge>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" onClick={() => openEdit(l)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setDeleteId(l.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {displayed.length === 0 && (
          <div className="text-center py-8 text-gray-500">No lessons found.</div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Module</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.module_id}
                onChange={(e) => setForm({ ...form, module_id: e.target.value })}
              >
                {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Content (Markdown)</Label>
              <Textarea className="min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div>
              <Label>Code Example</Label>
              <Textarea className="min-h-[80px]" value={form.code_example} onChange={(e) => setForm({ ...form, code_example: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>theory</option>
                  <option>practice</option>
                  <option>project</option>
                </select>
              </div>
              <div>
                <Label>XP Reward</Label>
                <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Est. Time (min)</Label>
                <Input type="number" value={form.estimated_time} onChange={(e) => setForm({ ...form, estimated_time: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Challenge</Label>
              <Textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
            </div>
            <div>
              <Label>Starter Code</Label>
              <Textarea className="min-h-[80px]" value={form.starter_code} onChange={(e) => setForm({ ...form, starter_code: e.target.value })} />
            </div>
            <div>
              <Label>Expected Output</Label>
              <Input value={form.expected_output} onChange={(e) => setForm({ ...form, expected_output: e.target.value })} />
            </div>
            <div>
              <Label>Tips</Label>
              <Textarea value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Quizzes Manager ──────────────────────────────────────────────

function QuizzesManager() {
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminQuiz | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "", description: "", difficulty: "Beginner", time_limit: 15,
    xp_reward: 50, category: "javascript", type: "multiple-choice",
  })

  const fetch = useCallback(async () => {
    setLoading(true)
    const data = await adminService.getQuizzes()
    setQuizzes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: "", description: "", difficulty: "Beginner", time_limit: 15, xp_reward: 50, category: "javascript", type: "multiple-choice" })
    setShowForm(true)
  }

  const openEdit = (q: AdminQuiz) => {
    setEditing(q)
    setForm({ title: q.title, description: q.description, difficulty: q.difficulty, time_limit: q.time_limit, xp_reward: q.xp_reward, category: q.category, type: q.type })
    setShowForm(true)
  }

  const save = async () => {
    const payload = {
      ...form,
      order_index: editing?.order_index ?? quizzes.length,
    }
    if (editing) {
      await adminService.updateQuiz(editing.id, payload)
    } else {
      await adminService.createQuiz(payload)
    }
    setShowForm(false)
    fetch()
  }

  const remove = async () => {
    if (deleteId) {
      await adminService.deleteQuiz(deleteId)
      setDeleteId(null)
      fetch()
    }
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Loading quizzes...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Quizzes ({quizzes.length})</h2>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Quiz
        </Button>
      </div>

      <div className="space-y-3">
        {quizzes.map((q) => (
          <Card key={q.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{q.title}</div>
                <div className="text-sm text-gray-500">{q.description.slice(0, 100)}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                  <Badge variant="outline" className="text-xs">{q.category}</Badge>
                  <Badge variant="outline" className="text-xs">{q.time_limit}min</Badge>
                  <Badge variant="outline" className="text-xs">{q.xp_reward} XP</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEdit(q)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setDeleteId(q.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {quizzes.length === 0 && (
          <div className="text-center py-8 text-gray-500">No quizzes yet.</div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Difficulty</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="react">React</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>multiple-choice</option>
                  <option>coding</option>
                  <option>mixed</option>
                  <option>true-false</option>
                </select>
              </div>
              <div>
                <Label>Time Limit (min)</Label>
                <Input type="number" value={form.time_limit} onChange={(e) => setForm({ ...form, time_limit: Number(e.target.value) })} />
              </div>
              <div>
                <Label>XP Reward</Label>
                <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
            <AlertDialogDescription>This will also delete all questions in this quiz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Questions Manager ────────────────────────────────────────────

function QuestionsManager() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([])
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminQuestion | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterQuiz, setFilterQuiz] = useState<string>("")
  const [form, setForm] = useState({
    quiz_id: "", type: "multiple-choice", question: "", code: "",
    options_text: "", correct_answer: "", explanation: "", points: 10,
  })

  const fetch = useCallback(async () => {
    setLoading(true)
    const [quizzesData, allLessons] = await Promise.all([adminService.getQuizzes(), Promise.resolve(null)])
    setQuizzes(quizzesData)
    if (filterQuiz) {
      const qs = await adminService.getQuestions(filterQuiz)
      setQuestions(qs)
    } else {
      setQuestions([])
    }
    setLoading(false)
  }, [filterQuiz])

  useEffect(() => { fetch() }, [fetch])

  const filteredQuestions = filterQuiz ? questions : []

  const openCreate = () => {
    if (!filterQuiz) return
    setEditing(null)
    setForm({ quiz_id: filterQuiz, type: "multiple-choice", question: "", code: "", options_text: "", correct_answer: "", explanation: "", points: 10 })
    setShowForm(true)
  }

  const openEdit = (q: AdminQuestion) => {
    setEditing(q)
    setForm({
      quiz_id: q.quiz_id, type: q.type, question: q.question, code: q.code || "",
      options_text: (q.options || []).join("\n"), correct_answer: q.correct_answer,
      explanation: q.explanation, points: q.points,
    })
    setShowForm(true)
  }

  const save = async () => {
    const payload = {
      quiz_id: form.quiz_id, type: form.type, question: form.question, code: form.code || null,
      options: form.type === "multiple-choice" ? form.options_text.split("\n").map((s) => s.trim()).filter(Boolean) : null,
      correct_answer: form.correct_answer, explanation: form.explanation, points: form.points,
      order_index: editing?.order_index ?? filteredQuestions.length,
    }
    if (editing) {
      await adminService.updateQuestion(editing.id, payload as any)
    } else {
      await adminService.createQuestion(payload as any)
    }
    setShowForm(false)
    fetch()
  }

  const remove = async () => {
    if (deleteId) {
      await adminService.deleteQuestion(deleteId)
      setDeleteId(null)
      fetch()
    }
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Quiz:</Label>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterQuiz}
            onChange={(e) => setFilterQuiz(e.target.value)}
          >
            <option value="">Select a quiz</option>
            {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
          </select>
        </div>
        {filterQuiz && (
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        )}
      </div>

      {!filterQuiz ? (
        <div className="text-center py-8 text-gray-500">Select a quiz above to manage its questions.</div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, i) => (
            <Card key={q.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">Q{i + 1}. {q.question}</div>
                    <div className="text-sm text-gray-500">{q.type} — {q.points} pts</div>
                    {q.options && q.options.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Options: {q.options.join(", ")}
                      </div>
                    )}
                    <div className="text-sm mt-1"><strong>Answer:</strong> {q.correct_answer}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => openEdit(q)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setDeleteId(q.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">No questions yet for this quiz.</div>
          )}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Question" : "Create Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>multiple-choice</option>
                  <option>coding</option>
                  <option>true-false</option>
                </select>
              </div>
              <div>
                <Label>Points</Label>
                <Input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
              </div>
            </div>
            {form.type === "multiple-choice" && (
              <div>
                <Label>Options (one per line)</Label>
                <Textarea className="min-h-[100px]" value={form.options_text} onChange={(e) => setForm({ ...form, options_text: e.target.value })} />
              </div>
            )}
            {form.type === "coding" && (
              <div>
                <Label>Code</Label>
                <Textarea className="min-h-[80px]" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
            )}
            <div>
              <Label>Correct Answer</Label>
              <Input value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} />
            </div>
            <div>
              <Label>Explanation</Label>
              <Textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} className="flex items-center gap-2"><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Users Manager ────────────────────────────────────────────────

function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const data = await adminService.getUsers()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin"
    await adminService.setUserRole(userId, newRole)
    fetch()
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Loading users...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Users ({users.length})</h2>
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.full_name}</div>
                <div className="text-sm text-gray-500">{u.email || "No email"}</div>
                <div className="text-xs text-gray-400">Joined: {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}>
                  {u.role || "student"}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => toggleRole(u.id, u.role || "student")}>
                  Toggle to {u.role === "admin" ? "student" : "admin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  )
}
