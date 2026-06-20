"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Copy, Check, ChevronDown, Sun, Moon } from "lucide-react"

const LANGUAGES = ["javascript", "html", "css", "typescript", "python"] as const

interface CodeEditorProps {
  initialCode?: string
  language?: string
  theme?: "light" | "dark"
  readOnly?: boolean
  onCodeChange?: (code: string) => void
  onRun?: (code: string) => void
}

export function CodeEditor({
  initialCode = "",
  language: initialLanguage = "javascript",
  theme: initialTheme = "dark",
  readOnly = false,
  onCodeChange,
  onRun,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(initialTheme)
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      if (currentLanguage === "javascript") {
        const logs: string[] = []

        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map((arg: any) => String(arg)).join(" ")),
          error: (...args: any[]) => logs.push("Error: " + args.map((arg: any) => String(arg)).join(" ")),
          warn: (...args: any[]) => logs.push("Warning: " + args.map((arg: any) => String(arg)).join(" ")),
        }

        try {
          const result = new Function("console", code)(mockConsole)
          if (result !== undefined) {
            logs.push(String(result))
          }
        } catch (error) {
          logs.push(`Error: ${error}`)
        }

        setOutput(logs.join("\n") || "Code executed (no output)")
      } else {
        setOutput("Code execution is only supported for JavaScript in this demo.")
      }

      onRun?.(code)
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput("")
    onCodeChange?.(initialCode)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-transparent px-2 py-0.5 text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              {currentLanguage}
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[100px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setCurrentLanguage(lang); setLangOpen(false) }}
                    className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                      currentLanguage === lang ? "bg-blue-50 font-semibold" : ""
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentTheme(currentTheme === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-transparent px-2 py-0.5 text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            {currentTheme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            {currentTheme} theme
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs bg-transparent">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs bg-transparent">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning || readOnly}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-xs"
          >
            {isRunning ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
            ) : (
              <Play className="h-3 w-3 mr-1" />
            )}
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 min-h-0">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full h-full p-4 font-mono text-sm resize-none border-none outline-none ${
              currentTheme === "dark" ? "bg-gray-900 text-green-400" : "bg-gray-50 text-gray-800"
            }`}
            placeholder="// Start coding here..."
            spellCheck={false}
            style={{
              fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              lineHeight: "1.5",
              tabSize: 2,
            }}
          />
        </CardContent>
      </Card>

      {/* Output Panel */}
      {output && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-green-600">📤</span>
              Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              className={`text-sm p-3 rounded-md overflow-x-auto ${
                currentTheme === "dark" ? "bg-gray-900 text-green-400" : "bg-gray-100 text-gray-800"
              }`}
            >
              {output}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Code Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 text-lg">💡</span>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Coding Tips:</p>
              <ul className="text-xs space-y-1 text-blue-700">
                <li>• Use console.log() to output values</li>
                <li>• Try different approaches to solve the problem</li>
                <li>• Don't forget to test your code with different inputs</li>
                <li>• Use meaningful variable names</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
