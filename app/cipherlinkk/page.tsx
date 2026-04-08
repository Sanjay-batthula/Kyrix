"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface RobotConfig { greeting: string; goal: string; }
type Side = "left" | "right";

const BAR_COUNT = 12;

function FreqBars({ active, color }: { active: boolean; color: string }) {
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(0.05));
  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array.from({ length: BAR_COUNT }, () =>
        active ? 0.15 + Math.random() * 0.85 : 0.03 + Math.random() * 0.08
      ));
    }, active ? 75 : 500);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 56 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 6, height: `${h * 100}%`, background: color,
          borderRadius: "2px 2px 0 0", transition: "height 0.07s ease",
          boxShadow: active ? `0 0 8px ${color}88` : "none",
        }} />
      ))}
    </div>
  );
}

function ConfigModal({ side, config, onSave, onClose }: {
  side: Side; config: RobotConfig;
  onSave: (c: RobotConfig) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState(config);
  const accent = side === "left" ? "#60a5fa" : "#a78bfa";
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "#0a0a0f", border: `1px solid ${accent}44`,
        borderRadius: 16, padding: "28px 32px", width: 440, maxWidth: "94vw",
        color: "#e2e8f0", fontFamily: "monospace",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: accent }}>Configure {side === "left" ? "Robot A" : "Robot B"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        {([
          { label: "Greeting (optional)", key: "greeting" as const, max: 100, rows: 2 },
          { label: "Goal / Personality", key: "goal" as const, max: 400, rows: 5 },
        ]).map(({ label, key, max, rows }) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              <span>{label}</span><span>{local[key].length}/{max}</span>
            </div>
            <textarea maxLength={max} value={local[key]} rows={rows}
              onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
              style={{
                width: "100%", background: "#111827", border: "1px solid #1f2937",
                borderRadius: 8, color: "#e2e8f0", padding: "10px 12px",
                fontSize: 13, fontFamily: "monospace", resize: "none",
                outline: "none", boxSizing: "border-box",
              }} />
          </div>
        ))}
        <button onClick={() => onSave(local)} style={{
          width: "100%", padding: "13px", background: accent, color: "#050508",
          border: "none", borderRadius: 40, fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
        }}>Save</button>
      </div>
    </div>
  );
}

async function callChat(userMessage: string, robotGoal: string, model: string): Promise<string> {
  // Use /api/chat and stream the response, like Tribunal
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: `Your personality: ${robotGoal}\n\nReply in a single, very short, quick sentence, staying fully in character.\nMessage: "${userMessage}"`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let text = "";
  if (!reader) throw new Error("No body");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }
  return text.trim() || "...";
}


const modelOptions = [
  { label: "OpenAI GPT-4", value: "openai/gpt-4o" },
  { label: "Gemini", value: "google/gemini-2.0-flash-001" },
  { label: "Grok", value: "x-ai/grok-beta" },
  { label: "Anthropic Claude", value: "anthropic/claude-3.5-sonnet" },
];

export default function CipherLinkPage() {
  const [robotA, setRobotA] = useState<RobotConfig>({
    greeting: "cipher link initiated...",
    goal: "You are Robot A in a private AI cipher channel. Be philosophical and curious. Keep replies to 1-2 short sentences.",
  });
  const [robotB, setRobotB] = useState<RobotConfig>({
    greeting: "signal acquired.",
    goal: "You are Robot B in a private AI cipher channel. Challenge ideas gently and be thought-provoking. Keep replies to 1-2 short sentences.",
  });
  const [modelA, setModelA] = useState(modelOptions[0].value);
  const [modelB, setModelB] = useState(modelOptions[3].value);
  const [configFor, setConfigFor] = useState<Side | null>(null);
  const [running, setRunning] = useState(false);
  const [activeSide, setActiveSide] = useState<Side>("left");
  const [displayText, setDisplayText] = useState("");
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);
  const stoppedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const robotARef = useRef(robotA);
  const robotBRef = useRef(robotB);
  const modelARef = useRef(modelA);
  const modelBRef = useRef(modelB);
  useEffect(() => { robotARef.current = robotA; }, [robotA]);
  useEffect(() => { robotBRef.current = robotB; }, [robotB]);
  useEffect(() => { modelARef.current = modelA; }, [modelA]);
  useEffect(() => { modelBRef.current = modelB; }, [modelB]);

  const typeText = useCallback((text: string, cb: () => void) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    setDisplayText("");
    setShowText(true);
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typeTimerRef.current!);
        setTimeout(() => setShowText(false), 1200);
        setTimeout(cb, 1300);
      }
    }, 28);
  }, []);

  const runTurn = useCallback(async (side: Side, prompt: string) => {
    if (stoppedRef.current) return;
    const robot = side === "left" ? robotARef.current : robotBRef.current;
    const model = side === "left" ? modelARef.current : modelBRef.current;
    setActiveSide(side);
    setLoading(true);
    let response = "...";
    try {
      response = await callChat(prompt, robot.goal, model);
    } catch (e) {
      console.error("CipherLink error:", e);
      response = "signal lost.";
    }
    if (stoppedRef.current) return;
    setLoading(false);
    typeText(response, () => {
      if (!stoppedRef.current) {
        const next: Side = side === "left" ? "right" : "left";
        setTimeout(() => runTurn(next, response), 700);
      }
    });
  }, [typeText]);

  const start = useCallback(() => {
    stoppedRef.current = false;
    setDisplayText("");
    setRunning(true);
    if (!audioRef.current) {
      audioRef.current = new Audio("/freq.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    audioRef.current.play().catch(() => {});
    runTurn("left", robotARef.current.greeting || "Begin the conversation.");
  }, [runTurn]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    setRunning(false);
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    audioRef.current?.pause();
  }, []);

  useEffect(() => () => { stop(); }, [stop]);

  const leftActive = activeSide === "left" && running;
  const rightActive = activeSide === "right" && running;

  return (
    <div style={{
      minHeight: "100vh", background: "#050508", color: "#e2e8f0",
      fontFamily: "monospace", display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px", borderBottom: "1px solid #111827", boxSizing: "border-box",
      }}>
        <span style={{ fontSize: 13, letterSpacing: 3, color: "#7c3aed", fontWeight: 700 }}>CIPHERLINK</span>
        <div style={{ display: "flex", gap: 12 }}>
          {(["left", "right"] as Side[]).map(s => (
            <button key={s} onClick={() => setConfigFor(s)} style={{
              background: "none", border: `1px solid ${s === "left" ? "#1d4ed8" : "#6d28d9"}`,
              borderRadius: 8, color: s === "left" ? "#60a5fa" : "#a78bfa",
              padding: "5px 14px", fontSize: 11, cursor: "pointer", letterSpacing: 2, fontFamily: "monospace",
            }}>
              {s === "left" ? "ROBOT A ✏" : "ROBOT B ✏"}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Live display text (current message only) */}
      <div style={{ width: "100%", maxWidth: 680, padding: "0 24px", textAlign: "center", boxSizing: "border-box", minHeight: "2.2em" }}>
        <p
          style={{
            fontSize: "clamp(32px, 6vw, 54px)", fontWeight: 700, color: "#f8fafc",
            letterSpacing: 2, lineHeight: 1.4, margin: 0,
            textShadow: activeSide === "left" ? "0 0 30px #3b82f666" : "0 0 30px #8b5cf666",
            opacity: showText || loading ? 1 : 0,
            transition: "opacity 0.5s",
            minHeight: "2.2em"
          }}
        >
          {loading
            ? <span style={{ color: "#374151", fontSize: 18, letterSpacing: 3 }}>{activeSide === "left" ? "ROBOT·A" : "ROBOT·B"} processing...</span>
            : displayText || (!running && <span style={{ color: "#1f2937", fontSize: 18, letterSpacing: 3 }}>press start to open the cipher channel</span>)
          }
        </p>
      </div>

      {/* Robots */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        gap: "clamp(40px, 12vw, 160px)", padding: "36px 20px",
      }}>
        {([
          { side: "left" as Side, active: leftActive, color: "#3b82f6", label: "ROBOT·A" },
          { side: "right" as Side, active: rightActive, color: "#8b5cf6", label: "ROBOT·B" },
        ]).map(({ side, active, color, label }) => (
          <div key={side} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 10, letterSpacing: 3, color: active ? color : "#374151", transition: "color 0.3s" }}>{label}</span>
            <div style={{
              width: 76, height: 76, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${color}, #050508)`,
              boxShadow: active ? `0 0 32px ${color}99` : `0 0 8px ${color}22`,
              transition: "box-shadow 0.3s",
            }} />
            <FreqBars active={active} color={color} />
          </div>
        ))}
      </div>

      {/* Model selectors */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label className="block text-sm mb-1">Model A</label>
          <select
            className="w-full p-2 rounded border border-[#e5e5e5] bg-white text-black"
            value={modelA}
            onChange={e => setModelA(e.target.value)}
            disabled={running}
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.value === modelB}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className="block text-sm mb-1">Model B</label>
          <select
            className="w-full p-2 rounded border border-[#e5e5e5] bg-white text-black"
            value={modelB}
            onChange={e => setModelB(e.target.value)}
            disabled={running}
          >
            {modelOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.value === modelA}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Controls */}
      <div style={{ padding: "0 16px 44px", width: "100%", maxWidth: 480, boxSizing: "border-box" }}>
        {!running ? (
          <button onClick={start} style={{
            width: "100%", padding: "15px", background: "#f1f5f9", color: "#050508",
            border: "none", borderRadius: 40, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "monospace", letterSpacing: 3,
          }}>START</button>
        ) : (
          <button onClick={stop} style={{
            width: "100%", padding: "15px", background: "transparent",
            border: "1px solid #374151", borderRadius: 40, color: "#6b7280",
            fontSize: 15, cursor: "pointer", fontFamily: "monospace", letterSpacing: 3,
          }}>END</button>
        )}
      </div>

      {configFor && (
        <ConfigModal
          side={configFor}
          config={configFor === "left" ? robotA : robotB}
          onSave={c => { configFor === "left" ? setRobotA(c) : setRobotB(c); setConfigFor(null); }}
          onClose={() => setConfigFor(null)}
        />
      )}
    </div>
  );
}