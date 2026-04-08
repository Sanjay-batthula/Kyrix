"use client"

import { useState, useEffect, useCallback } from "react"
import { MessageSquareDashed } from "lucide-react"
import { MessageList } from "./message-list"
import { Composer, ModelSelector, type AIModel } from "./composer"
import { Button } from "@/components/ui/button"

export interface Message {
  id: string
  role: "user" | "assistantA" | "assistantB"
  content: string
  createdAt: Date
  imageData?: string
}

const STORAGE_KEY = "chat-messages"
const MODEL_A_KEY = "chat-model-a"
const MODEL_B_KEY = "chat-model-b"

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreamingA, setIsStreamingA] = useState(false)
  const [isStreamingB, setIsStreamingB] = useState(false)
  const [errorA, setErrorA] = useState<string | null>(null)
  const [errorB, setErrorB] = useState<string | null>(null)
  const [abortA, setAbortA] = useState<AbortController | null>(null)
  const [abortB, setAbortB] = useState<AbortController | null>(null)
  const [modelA, setModelA] = useState<AIModel>("openai/gpt-4")
  const [modelB, setModelB] = useState<AIModel>("google/gemini-2.0-flash-001")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setMessages(parsed.map((m: Message) => ({ ...m, createdAt: new Date(m.createdAt) })))
      }
      const savedA = localStorage.getItem(MODEL_A_KEY) as AIModel | null
      const savedB = localStorage.getItem(MODEL_B_KEY) as AIModel | null
      if (savedA) setModelA(savedA)
      if (savedB) setModelB(savedB)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch (e) { console.error(e) }
  }, [messages])

  const handleModelAChange = useCallback((m: AIModel) => {
    setModelA(m); localStorage.setItem(MODEL_A_KEY, m)
  }, [])
  const handleModelBChange = useCallback((m: AIModel) => {
    setModelB(m); localStorage.setItem(MODEL_B_KEY, m)
  }, [])

  const streamResponse = useCallback(async (
    messages: Message[],
    model: AIModel,
    assistantMsgId: string,
    setStreaming: (v: boolean) => void,
    setError: (v: string | null) => void,
    setAbort: (c: AbortController | null) => void,
    signal: AbortSignal
  ) => {
    setStreaming(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
            imageData: m.imageData,
          })),
          model,
        }),
        signal,
      })
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("No response body")
      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((msg) => msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg)
        )
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) => msg.id === assistantMsgId ? { ...msg, content: msg.content || "[Cancelled]" } : msg)
        )
      } else {
        setError(e instanceof Error ? e.message : "An error occurred")
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMsgId))
      }
    } finally {
      setStreaming(false)
      setAbort(null)
    }
  }, [])

  const sendMessage = useCallback(async (content: string, imageData?: string) => {
    if ((!content.trim() && !imageData) || isStreamingA || isStreamingB) return

    setErrorA(null)
    setErrorB(null)

    const userMsg: Message = {
      id: generateId(), role: "user",
      content: content.trim() || "Describe this image",
      createdAt: new Date(), imageData,
    }
    const msgA: Message = { id: generateId(), role: "assistantA", content: "", createdAt: new Date() }
    const msgB: Message = { id: generateId(), role: "assistantB", content: "", createdAt: new Date() }

    const history = [...messages, userMsg]
    setMessages([...history, msgA, msgB])

    const ctrlA = new AbortController()
    const ctrlB = new AbortController()
    setAbortA(ctrlA)
    setAbortB(ctrlB)

    // Stream both in parallel — only pass user+assistant history, not the empty placeholders
    streamResponse(history, modelA, msgA.id, setIsStreamingA, setErrorA, setAbortA, ctrlA.signal)
    streamResponse(history, modelB, msgB.id, setIsStreamingB, setErrorB, setAbortB, ctrlB.signal)
  }, [messages, isStreamingA, isStreamingB, modelA, modelB, streamResponse])

  const retry = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUser) return
    const idx = messages.findIndex((m) => m.id === lastUser.id)
    setMessages(messages.slice(0, idx))
    setErrorA(null); setErrorB(null)
    setTimeout(() => sendMessage(lastUser.content, lastUser.imageData), 100)
  }, [messages, sendMessage])

  const stopStreaming = useCallback(() => {
    abortA?.abort(); abortB?.abort()
  }, [abortA, abortB])

  const clearChat = useCallback(() => {
    setMessages([]); setErrorA(null); setErrorB(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Group messages into turns: [{user, assistantA, assistantB}]
  const turns: Array<{
    user: Message
    assistantA?: Message
    assistantB?: Message
  }> = []
  for (let i = 0; i < messages.length; ) {
    if (messages[i].role === "user") {
      const user = messages[i]
      const assistantA = messages[i + 1]?.role === "assistantA" ? messages[i + 1] : undefined
      const assistantB = messages[i + 2]?.role === "assistantB" ? messages[i + 2] : undefined
      // If A and B are swapped, fix
      let a = assistantA, b = assistantB
      if (assistantA && assistantA.role === "assistantB" && assistantB && assistantB.role === "assistantA") {
        a = assistantB
        b = assistantA
      }
      turns.push({ user, assistantA: a, assistantB: b })
      i += 1 + (a ? 1 : 0) + (b ? 1 : 0)
    } else {
      i++
    }
  }

  return (
    <div className="relative h-dvh bg-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="flex w-full items-center justify-between px-6 py-4 border-b border-stone-200">
        <Button onClick={clearChat} variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-100 hover:bg-zinc-200">
          <MessageSquareDashed className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-serif font-bold">What would you like to do?</h1>
        <div className="w-9" /> {/* spacer */}
      </div>

      {/* Model selectors */}
      <div className="flex w-full max-w-5xl mx-auto gap-4 px-4 pt-4">
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Model A</span>
          <ModelSelector value={modelA} onChange={handleModelAChange} disabled={isStreamingA || isStreamingB} />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Model B</span>
          <ModelSelector value={modelB} onChange={handleModelBChange} disabled={isStreamingA || isStreamingB} />
        </div>
      </div>

      {/* Chat area: turns, side-by-side */}
      <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto gap-4 px-4 mt-4 overflow-y-auto">
        {turns.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-60 select-none">
            <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-4" />
            <div className="text-xl font-semibold">Hi, my name is Kyrix</div>
            <div className="text-base text-stone-500">Send a message to begin chatting with the Kyrix AI</div>
          </div>
        )}
        {turns.map((turn, idx) => (
          <div key={turn.user.id} className="mb-6">
            {/* User prompt */}
            <div className="text-base font-semibold text-gray-700 mb-2">You: {turn.user.content}</div>
            {/* Side-by-side model responses */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white rounded-lg p-4 border border-stone-200 min-h-[120px] max-h-[320px] h-[180px] flex flex-col">
                <div className="font-bold mb-1">{modelA}</div>
                <div className="whitespace-pre-line text-sm overflow-auto flex-1">
                  {turn.assistantA?.content || (isStreamingA && idx === turns.length - 1 ? <span className="text-stone-400">Thinking...</span> : "")}
                  {errorA && idx === turns.length - 1 && (
                    <span className="text-red-500">{errorA}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-4 border border-stone-200 min-h-[120px] max-h-[320px] h-[180px] flex flex-col">
                <div className="font-bold mb-1">{modelB}</div>
                <div className="whitespace-pre-line text-sm overflow-auto flex-1">
                  {turn.assistantB?.content || (isStreamingB && idx === turns.length - 1 ? <span className="text-stone-400">Thinking...</span> : "")}
                  {errorB && idx === turns.length - 1 && (
                    <span className="text-red-500">{errorB}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="w-full max-w-3xl mx-auto pb-6 px-4 pt-2">
        <Composer
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreamingA || isStreamingB}
          disabled={!!errorA || !!errorB}
          selectedModel={modelA}
          onModelChange={handleModelAChange}
          hideModelSelector
        />
      </div>
    </div>
  )
}