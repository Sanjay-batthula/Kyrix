"use client"

import type React from "react"

import { useState, useRef, useCallback, type KeyboardEvent, useEffect } from "react"
import { Square, Mic, MicOff, Brain, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { AudioWaveform } from "./audio-waveform"

export type AIModel = "google/gemini-2.0-flash-001" | "openai/gpt-4o" | "anthropic/claude-sonnet-4"

export const AI_MODELS: { id: AIModel; name: string; icon: string }[] = [
  { id: "google/gemini-2.0-flash-001", name: "Gemini", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYM-_oCfjiysWdSUR-8tzX8fUEtcdTo1naJg&s" },
  { id: "openai/gpt-4o", name: "GPT-4o", icon: "data:image/png;base64,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" },
  { id: "anthropic/claude-sonnet-4", name: "Claude", icon: "data:image/png;base64,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" },
]

interface ComposerProps {
  onSend: (content: string, imageData?: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled?: boolean
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

export function Composer({ onSend, onStop, isStreaming, disabled, selectedModel, onModelChange }: ComposerProps) {
  const [value, setValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showImageBounce, setShowImageBounce] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const baseTextRef = useRef("")
  const finalTranscriptsRef = useRef("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let newFinalText = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript
              newFinalText += transcript + " "
            }
          }

          if (newFinalText) {
            finalTranscriptsRef.current += newFinalText
            setValue(baseTextRef.current + finalTranscriptsRef.current)
            setTimeout(() => handleInput(), 0)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("[v0] Speech recognition error:", event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    // Trigger intro animation after mount
    setHasAnimated(true)
  }, [])

  const playClickSound = useCallback(() => {
    const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/click-FM4Xaa1FJj237591TiZw4yL1fIxdOw.mp3")
    audio.volume = 0.5
    audio.play().catch(() => {})
  }, [])

  const playRecordSound = useCallback(() => {
    const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/record-CNHOyjcpri6lx5C2sGXncDtFVDwspO.mp3")
    audio.volume = 0.5
    audio.play().catch(() => {})
  }, [])

  const toggleRecording = useCallback(() => {
    playClickSound()

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
        setMediaStream(null)
      }
    } else {
      playRecordSound()
      baseTextRef.current = value
      finalTranscriptsRef.current = ""
      recognitionRef.current.start()
      setIsRecording(true)

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaStream(stream)
        })
        .catch((err) => {
          console.error("[v0] Error getting microphone stream:", err)
        })
    }
  }, [isRecording, value, playClickSound, playRecordSound, mediaStream])

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])

  const handleSend = useCallback(() => {
    if ((!value.trim() && !uploadedImage) || isStreaming || disabled) return
    playClickSound()

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
    onSend(value || "Describe this image", uploadedImage || undefined)
    setValue("")
    setUploadedImage(null)
    baseTextRef.current = ""
    finalTranscriptsRef.current = ""
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value, uploadedImage, isStreaming, disabled, onSend, isRecording, playClickSound])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      playClickSound()

      const file = e.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadedImage(event.target?.result as string)
          setShowImageBounce(true)
          setTimeout(() => setShowImageBounce(false), 400)
        }
        reader.readAsDataURL(file)
      }
      e.target.value = ""
    },
    [playClickSound],
  )

  const removeImage = useCallback(() => {
    setUploadedImage(null)
  }, [])

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0]

  return (
    <div className={cn("fixed bottom-4 left-0 right-0 px-4 pointer-events-none z-10", hasAnimated && "composer-intro")}>
      <div className="relative max-w-2xl mx-auto pointer-events-auto">
        <div
          className={cn(
            "flex flex-col gap-3 p-4 bg-white border-stone-200 transition-all duration-200 border-none border-0 overflow-hidden relative rounded-3xl",
            "focus-within:border-stone-300 focus-within:ring-2 focus-within:ring-stone-200",
          )}
          style={{
            boxShadow:
              "rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 69, 0.06) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.06) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.06) 0px 6px 6px -3px, rgba(14, 63, 126, 0.06) 0px 12px 12px -6px, rgba(14, 63, 126, 0.06) 0px 24px 24px -12px",
          }}
        >
          <div className="flex gap-2 items-center">
            {uploadedImage && (
              <div className={cn("relative shrink-0", showImageBounce && "image-bounce")}>
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded image"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-800 hover:bg-stone-900 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                handleInput()
              }}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Type a message... (Shift+Enter for new line)"}
              disabled={isStreaming || disabled}
              rows={1}
              className={cn(
                "flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-stone-800 placeholder:text-stone-400",
                "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                "max-h-[56px] overflow-y-auto",
              )}
              aria-label="Message input"
            />

            {isRecording && (
              <div className="shrink-0 w-24">
                <AudioWaveform isRecording={isRecording} stream={mediaStream} />
              </div>
            )}

            {isStreaming ? (
              <button
                onClick={() => {
                  playClickSound()
                  onStop()
                }}
                className="relative h-9 w-9 shrink-0 transition-all rounded-full flex items-center justify-center cursor-pointer hover:scale-105"
                aria-label="Stop generating"
              >
                <img src="/icon.png" alt="Loading..." width={64} height={64} />
                <Square
                  className="w-4 h-4 absolute drop-shadow-md text-red-700"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={(!value.trim() && !uploadedImage) || disabled}
                className={cn(
                  "relative h-9 w-9 shrink-0 transition-all rounded-full flex items-center justify-center",
                  (!value.trim() && !uploadedImage) || disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105",
                )}
                aria-label="Send message"
              >
                <img src="/icon.png" alt="Loading..." width={64} height={64} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload image"
            />

            <div className="relative">
              <Button
                onClick={toggleRecording}
                disabled={isStreaming || disabled}
                size="icon"
                className={cn(
                  "h-9 w-9 shrink-0 transition-all rounded-full relative z-10",
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white animate-bounce-subtle"
                    : "bg-zinc-100 hover:bg-zinc-200 text-stone-700",
                )}
                aria-label={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            <Button
              onClick={() => {
                playClickSound()
                fileInputRef.current?.click()
              }}
              disabled={isStreaming || disabled}
              size="icon"
              className="h-9 w-9 shrink-0 bg-zinc-100 hover:bg-zinc-200 text-stone-700 rounded-full"
              aria-label="Attach image"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-zinc-100" asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isStreaming || disabled}
                  className="h-9 w-9 shrink-0 bg-zinc-100 hover:bg-zinc-200 text-stone-700 rounded-full"
                  aria-label="Select AI model"
                  onClick={playClickSound}
                >
                  <Brain className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="start"
                  side="top"
                  sideOffset={8}
                  className="w-40 px-2 py-2 rounded-2xl z-[9999]"
                >
                  {AI_MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => {
                        playClickSound()
                        onModelChange(model.id)
                      }}
                      className={cn(
                        "flex items-center cursor-pointer gap-3 rounded-lg",
                        selectedModel === model.id && "bg-stone-100",
                      )}
                    >
                      <Image
                        src={model.icon || "/placeholder.svg"}
                        alt={model.name}
                        width={20}
                        height={20}
                        className="rounded-sm object-contain w-4 h-4"
                      />
                      <span className="text-sm">{model.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>

            <span className="text-xs text-stone-400">{currentModel.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple ModelSelector for use in ChatShell and elsewhere
export function ModelSelector({ value, onChange, disabled }: { value: AIModel; onChange: (model: AIModel) => void; disabled?: boolean }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as AIModel)}
      disabled={disabled}
      className="border rounded-lg px-2 py-1 text-sm bg-white text-stone-800"
      aria-label="Select AI model"
    >
      {AI_MODELS.map(model => (
        <option key={model.id} value={model.id}>{model.name}</option>
      ))}
    </select>
  )
}
