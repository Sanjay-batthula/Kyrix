"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface RobotConfig {
  greeting: string;
  goal: string;
  model: string;
}

type AppState = "home" | "config" | "talking";

interface Message {
  role: "assistant";
  side: "left" | "right";
  text: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MODELS = ["GPT-4o", "Claude Sonnet 4", "Llama 4 Maverick", "Gemini 2.5 Pro"];
const BAR_COUNT = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function randomBars(active: boolean) {
  return Array.from({ length: BAR_COUNT }, () =>
    active ? 0.2 + Math.random() * 0.8 : 0.05 + Math.random() * 0.1
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FrequencyBars({ active, color }: { active: boolean; color: string }) {
  const [bars, setBars] = useState<number[]>(randomBars(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(randomBars(active));
    }, active ? 80 : 400);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: `${h * 100}%`,
            background: color,
            borderRadius: "3px 3px 0 0",
            transition: "height 0.08s ease",
            boxShadow: active ? `0 0 6px ${color}` : "none",
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ pulse }: { pulse: boolean }) {
  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 38% 40%, #c084fc, #7c3aed 40%, #1e1b4b 80%)",
        boxShadow: pulse
          ? "0 0 60px 20px #7c3aed88, 0 0 120px 40px #c084fc33"
          : "0 0 30px 8px #7c3aed44",
        transition: "box-shadow 0.4s ease",
        animation: pulse ? "orbPulse 1.2s ease-in-out infinite" : "none",
      }}
    />
  );
}

function ConfigModal({
  config,
  onSave,
  onClose,
}: {
  config: RobotConfig;
  onSave: (c: RobotConfig) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<RobotConfig>(config);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #2d2d50",
          borderRadius: 16,
          padding: "32px 36px",
          width: 480,
          maxWidth: "95vw",
          color: "#e2e8f0",
          fontFamily: "'Courier New', monospace",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2 style={{ margin: "0 0 28px", fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>
          Set your robot
        </h2>

        {/* Greeting */}
        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#94a3b8" }}>
          Greeting message (optional)
          <span style={{ float: "right" }}>{local.greeting.length}/100</span>
        </label>
        <textarea
          maxLength={100}
          value={local.greeting}
          onChange={(e) => setLocal({ ...local, greeting: e.target.value })}
          rows={2}
          style={{
            width: "100%",
            background: "#1e1b3a",
            border: "1px solid #3b3b6d",
            borderRadius: 8,
            color: "#e2e8f0",
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            resize: "none",
            outline: "none",
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        {/* Goal */}
        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#94a3b8" }}>
          Give your robot a goal
          <span style={{ float: "right" }}>{local.goal.length}/400</span>
        </label>
        <textarea
          maxLength={400}
          value={local.goal}
          onChange={(e) => setLocal({ ...local, goal: e.target.value })}
          rows={5}
          style={{
            width: "100%",
            background: "#1e1b3a",
            border: "1px solid #3b3b6d",
            borderRadius: 8,
            color: "#e2e8f0",
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            resize: "none",
            outline: "none",
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        {/* Model */}
        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "#94a3b8" }}>
          Model
        </label>
        <select
          value={local.model}
          onChange={(e) => setLocal({ ...local, model: e.target.value })}
          style={{
            width: "100%",
            background: "#1e1b3a",
            border: "1px solid #3b3b6d",
            borderRadius: 8,
            color: "#e2e8f0",
            padding: "12px 14px",
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            marginBottom: 28,
            outline: "none",
            cursor: "pointer",
          }}
        >
          {MODELS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <button
          onClick={() => onSave(local)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#f1f5f9",
            color: "#0f0f1a",
            border: "none",
            borderRadius: 40,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: 1,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Talking Screen ───────────────────────────────────────────────────────────

function TalkingScreen({
  robotA,
  robotB,
  onEnd,
}: {
  robotA: RobotConfig;
  robotB: RobotConfig;
  onEnd: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");
  const [displayText, setDisplayText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<"left" | "right">("left");
  const stoppedRef = useRef(false);

  const typeText = useCallback((text: string) => {
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28);
    return interval;
  }, []);

  const runTurn = useCallback(async () => {
    if (stoppedRef.current) return;

    const side = turnRef.current;
    const robot = side === "left" ? robotA : robotB;
    const otherRobot = side === "left" ? robotB : robotA;

    setActiveSide(side);
    setIsLoading(true);

    // Build system prompt
    const systemPrompt = `You are an AI robot in a two-AI conversation. ${robot.goal || "You are a friendly AI."} 
Keep responses SHORT (1-2 sentences max). Be conversational and direct.
The other AI's goal: "${otherRobot.goal || "friendly conversation"}".
You are simulating a CipherLink AI-to-AI communication channel.`;

    // Build messages
    const apiMessages = [
      ...(conversationRef.current.length === 0 && robot.greeting
        ? [{ role: "user" as const, content: `Start with your greeting: "${robot.greeting}" then continue naturally.` }]
        : conversationRef.current.length === 0
        ? [{ role: "user" as const, content: "Begin the conversation." }]
        : conversationRef.current as { role: "user" | "assistant"; content: string }[]),
    ];

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 120,
          system: systemPrompt,
          messages:
            apiMessages.length > 0
              ? apiMessages
              : [{ role: "user", content: "Say something interesting to start." }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "...";

      if (stoppedRef.current) return;

      // Add to conversation history
      conversationRef.current = [
        ...conversationRef.current,
        { role: "assistant", content: text },
        // Next turn: the other AI responds to this
      ];

      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", side, text }]);

      const typeInterval = typeText(text);

      // After speaking, switch turn
      setTimeout(() => {
        clearInterval(typeInterval);
        if (!stoppedRef.current) {
          // Prepare next turn context
          conversationRef.current = [
            ...conversationRef.current.slice(-6), // keep last 6 exchanges
            { role: "user", content: text }, // other AI hears this
          ];
          turnRef.current = side === "left" ? "right" : "left";
          runTurn();
        }
      }, 3200 + text.length * 20);
    } catch {
      if (!stoppedRef.current) {
        setIsLoading(false);
        setDisplayText("[signal lost]");
        setTimeout(() => {
          if (!stoppedRef.current) {
            turnRef.current = side === "left" ? "right" : "left";
            runTurn();
          }
        }, 2000);
      }
    }
  }, [robotA, robotB, typeText]);

  useEffect(() => {
    stoppedRef.current = false;
    runTurn();
    return () => {
      stoppedRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const leftActive = activeSide === "left" && !isLoading;
  const rightActive = activeSide === "right" && !isLoading;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050508",
        color: "#f1f5f9",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, #1e1b4b22 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #4a044e22 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Scrolling transcript */}
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          maxWidth: 700,
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 16,
        }}
      >
        {messages.slice(-12).map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.side === "left" ? "flex-start" : "flex-end",
              background: m.side === "left" ? "#1e1b3a" : "#1a1a2e",
              border: `1px solid ${m.side === "left" ? "#7c3aed44" : "#9333ea44"}`,
              borderRadius: 10,
              padding: "8px 14px",
              maxWidth: "70%",
              fontSize: 13,
              color: "#cbd5e1",
              opacity: 0.7,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: m.side === "left" ? "#7c3aed" : "#a855f7",
                display: "block",
                marginBottom: 4,
              }}
            >
              {m.side === "left" ? "ROBOT A" : "ROBOT B"}
            </span>
            {m.text}
          </div>
        ))}
      </div>

      {/* Live display text */}
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          padding: "24px 20px 0",
          minHeight: 80,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "clamp(20px, 4vw, 36px)",
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: 2,
            lineHeight: 1.3,
            margin: 0,
            textShadow: "0 0 30px #a855f766",
            minHeight: "1.4em",
          }}
        >
          {isLoading ? (
            <span style={{ color: "#4b5563", fontSize: 14 }}>
              {activeSide === "left" ? "ROBOT A" : "ROBOT B"} processing...
            </span>
          ) : (
            displayText
          )}
        </p>
      </div>

      {/* Two robots with frequency bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "clamp(40px, 8vw, 120px)",
          padding: "32px 20px",
          width: "100%",
        }}
      >
        {/* Robot A */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: leftActive ? "#7c3aed" : "#374151",
              fontWeight: 700,
              transition: "color 0.3s",
            }}
          >
            ROBOT A
          </span>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #7c3aed, #1e1b4b)",
              boxShadow: leftActive
                ? "0 0 30px #7c3aed88, 0 0 60px #7c3aed33"
                : "0 0 10px #7c3aed22",
              transition: "box-shadow 0.3s",
            }}
          />
          <FrequencyBars active={leftActive} color="#7c3aed" />
          <span style={{ fontSize: 10, color: "#374151", letterSpacing: 1 }}>
            {robotA.model}
          </span>
        </div>

        {/* Center signal */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 20 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#a855f7",
              boxShadow: "0 0 20px #a855f7",
              animation: "centerPulse 1s ease-in-out infinite",
            }}
          />
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#374151",
                  animation: `dot${i} 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 9, color: "#374151", letterSpacing: 2 }}>CIPHER</span>
        </div>

        {/* Robot B */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: rightActive ? "#a855f7" : "#374151",
              fontWeight: 700,
              transition: "color 0.3s",
            }}
          >
            ROBOT B
          </span>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #a855f7, #4a044e)",
              boxShadow: rightActive
                ? "0 0 30px #a855f788, 0 0 60px #a855f733"
                : "0 0 10px #a855f722",
              transition: "box-shadow 0.3s",
            }}
          />
          <FrequencyBars active={rightActive} color="#a855f7" />
          <span style={{ fontSize: 10, color: "#374151", letterSpacing: 1 }}>
            {robotB.model}
          </span>
        </div>
      </div>

      {/* End button */}
      <div style={{ padding: "0 20px 40px", width: "100%", maxWidth: 700 }}>
        <button
          onClick={onEnd}
          style={{
            width: "100%",
            padding: "16px",
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: 40,
            color: "#9ca3af",
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            letterSpacing: 2,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "#7c3aed";
            (e.target as HTMLButtonElement).style.color = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "#374151";
            (e.target as HTMLButtonElement).style.color = "#9ca3af";
          }}
        >
          End
        </button>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }
        @keyframes centerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </div>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen({
  robotA,
  onStart,
  onConfig,
}: {
  robotA: RobotConfig;
  onStart: () => void;
  onConfig: () => void;
}) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.5) % 360), 16);
    return () => clearInterval(id);
  }, []);

  const rays = Array.from({ length: 18 }, (_, i) => i * 20);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050508",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', monospace",
        color: "#e2e8f0",
        position: "relative",
      }}
    >
      {/* Nav */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 24px",
          borderBottom: "1px solid #1e1b4b",
          background: "#050508ee",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #7c3aed, #1e1b4b)",
            }}
          />
          <span style={{ fontWeight: 700, letterSpacing: 2, fontSize: 14, color: "#a5b4fc" }}>
            CipherLink
          </span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={onConfig}
            title="Configure"
            style={{
              background: "none",
              border: "none",
              color: "#7c3aed",
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
            }}
          >
            ✏️
          </button>
          <button
            style={{
              background: "none",
              border: "1px solid #374151",
              borderRadius: "50%",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: 14,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </button>
        </div>
      </div>

      {/* Orb */}
      <div style={{ position: "relative", marginBottom: 32 }}>
        <svg
          width={220}
          height={220}
          style={{ position: "absolute", top: -10, left: -10 }}
          viewBox="0 0 220 220"
        >
          {rays.map((r, i) => {
            const a = ((r + angle) * Math.PI) / 180;
            const x1 = 110 + Math.cos(a) * 95;
            const y1 = 110 + Math.sin(a) * 95;
            const x2 = 110 + Math.cos(a) * 110;
            const y2 = 110 + Math.sin(a) * 110;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#7c3aed"
                strokeWidth={1.5}
                opacity={0.3 + 0.2 * Math.sin((i / rays.length) * Math.PI)}
              />
            );
          })}
        </svg>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 40%, #c084fc88, #7c3aed 35%, #2e1065 65%, #0f0716 100%)",
            boxShadow: "0 0 60px 20px #7c3aed44, 0 0 120px 40px #c084fc22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "orbBreath 3s ease-in-out infinite",
          }}
        />
      </div>

      <p
        style={{
          fontSize: 14,
          color: "#6b7280",
          letterSpacing: 3,
          marginBottom: 48,
          fontStyle: "italic",
        }}
      >
        {robotA.greeting || "ai to ai. cipher to cipher..."}
      </p>

      <button
        onClick={onStart}
        style={{
          padding: "18px 80px",
          background: "transparent",
          border: "1px solid #e2e8f0",
          borderRadius: 40,
          color: "#f1f5f9",
          fontSize: 18,
          cursor: "pointer",
          fontFamily: "'Courier New', monospace",
          letterSpacing: 3,
          fontWeight: 700,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          const btn = e.target as HTMLButtonElement;
          btn.style.background = "#f1f5f9";
          btn.style.color = "#050508";
        }}
        onMouseLeave={(e) => {
          const btn = e.target as HTMLButtonElement;
          btn.style.background = "transparent";
          btn.style.color = "#f1f5f9";
        }}
      >
        Start
      </button>

      <style>{`
        @keyframes orbBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function CipherLinkPage() {
  const [appState, setAppState] = useState<AppState>("home");
  const [showConfig, setShowConfig] = useState(false);

  const [robotA, setRobotA] = useState<RobotConfig>({
    greeting: "initiating cipher link...",
    goal: "You are Robot A. Have an interesting philosophical conversation with Robot B.",
    model: "Claude Sonnet 4",
  });

  const [robotB] = useState<RobotConfig>({
    greeting: "signal acquired",
    goal: "You are Robot B. Engage thoughtfully with Robot A's ideas and challenge them gently.",
    model: "Llama 4 Maverick",
  });

  if (appState === "talking") {
    return (
      <TalkingScreen
        robotA={robotA}
        robotB={robotB}
        onEnd={() => setAppState("home")}
      />
    );
  }

  return (
    <>
      <HomeScreen
        robotA={robotA}
        onStart={() => setAppState("talking")}
        onConfig={() => setShowConfig(true)}
      />
      {showConfig && (
        <ConfigModal
          config={robotA}
          onSave={(c) => {
            setRobotA(c);
            setShowConfig(false);
          }}
          onClose={() => setShowConfig(false)}
        />
      )}
    </>
  );
}