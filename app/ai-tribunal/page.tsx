"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const modelOptions = [
  { label: "OpenAI GPT-4", value: "openai/gpt-4o" },
  { label: "Gemini", value: "google/gemini-2.0-flash-001" },
  { label: "Grok", value: "x-ai/grok-beta" },
  { label: "Anthropic Claude", value: "anthropic/claude-3.5-sonnet" },
];

type Msg = { role: "A" | "B" | "system"; content: string };

async function callModel(model: string, history: { role: string; content: string }[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history, model }),
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
  return text || "[No response]";
}

export default function Page() {
  const router = useRouter();
  const [modelA, setModelA] = useState(modelOptions[0].value);
  const [modelB, setModelB] = useState(modelOptions[1].value);
  const [input, setInput] = useState("");
  const [debating, setDebating] = useState(false);
  const [chat, setChat] = useState<Msg[]>([]);
  const [stopped, setStopped] = useState(false);
  const maxTurns = 4;

  const getLabel = (v: string) => modelOptions.find((o) => o.value === v)?.label || v;

  async function debateLoop(topic: string) {
    setDebating(true);
    setStopped(false);

    let localChat: Msg[] = [{ role: "system", content: `Topic: "${topic}" — ${getLabel(modelA)} FOR vs ${getLabel(modelB)} AGAINST.` }];
    setChat([...localChat]);

    const historyA: { role: string; content: string }[] = [
      { role: "user", content: `You are in a structured debate arguing STRONGLY FOR: "${topic}". Be persuasive and concise (2-3 sentences). Rebut opponent's points. Start with your opening argument.` }
    ];
    const historyB: { role: string; content: string }[] = [];

    const addTyping = (side: "A" | "B") => { localChat = [...localChat, { role: side, content: "..." }]; setChat([...localChat]); };
    const replaceTyping = (side: "A" | "B", content: string) => {
      localChat = [...localChat.slice(0, -1), { role: side, content }];
      setChat([...localChat]);
    };

    for (let i = 0; i < maxTurns; i++) {
      if (stopped) break;

      // Model A speaks
      addTyping("A");
      let responseA = "";
      try { responseA = await callModel(modelA, historyA); } catch (e: any) { responseA = `[Error: ${e.message}]`; }
      replaceTyping("A", responseA);
      historyA.push({ role: "assistant", content: responseA });

      if (stopped) break;

      // Seed B on first turn, then give it A's response
      if (i === 0) {
        historyB.push({ role: "user", content: `You are in a structured debate arguing STRONGLY AGAINST: "${topic}". Be persuasive, concise (2-3 sentences). The FOR side just said: "${responseA}". Rebut this and argue AGAINST.` });
      } else {
        historyB.push({ role: "user", content: `FOR side said: "${responseA}". Rebut and continue arguing AGAINST.` });
      }

      // Model B speaks
      addTyping("B");
      let responseB = "";
      try { responseB = await callModel(modelB, historyB); } catch (e: any) { responseB = `[Error: ${e.message}]`; }
      replaceTyping("B", responseB);
      historyB.push({ role: "assistant", content: responseB });
      historyA.push({ role: "user", content: `AGAINST side said: "${responseB}". Rebut and continue arguing FOR.` });
    }

    if (!stopped) {
      // Conclusion A
      historyA.push({ role: "user", content: "Give your final closing argument in 1-2 sentences." });
      addTyping("A");
      let concA = "";
      try { concA = await callModel(modelA, historyA); } catch {}
      replaceTyping("A", `✅ Conclusion: ${concA}`);

      // Conclusion B
      historyB.push({ role: "user", content: "Give your final closing argument in 1-2 sentences." });
      addTyping("B");
      let concB = "";
      try { concB = await callModel(modelB, historyB); } catch {}
      replaceTyping("B", `✅ Conclusion: ${concB}`);
    }

    setDebating(false);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#faf9f7] text-[#3a3a3a] px-2 py-8">
      <aside className="w-64 border-r border-[#e5e5e5] flex flex-col fixed left-0 top-0 h-full z-10 bg-[#faf9f7] p-4">
        <button onClick={() => router.push("/")} className="focus:outline-none">
          <img src="/logo.png" alt="Logo" className="w-32 h-16" />
        </button>
        <div className="flex items-center gap-2 mt-6">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="12" r="7" stroke="#3a3a3a" strokeWidth="2" fill="#fff" />
            <rect x="11" y="20" width="6" height="3" rx="1.5" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
            <line x1="14" y1="4" x2="14" y2="2" stroke="#3a3a3a" strokeWidth="2" />
          </svg>
          <span className="font-semibold text-lg">AI Playground</span>
        </div>
      </aside>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Kyrix AI Tribunal</h2>

        <div className="bg-white rounded-2xl shadow border border-[#e5e5e5] p-4">
          <div className="flex items-center gap-2">
            <input
              placeholder="Enter a debate topic..."
              className="w-full text-lg outline-none bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !debating && input.trim()) debateLoop(input); }}
              disabled={debating}
            />
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold disabled:opacity-50 whitespace-nowrap"
              onClick={() => debateLoop(input)} disabled={debating || !input.trim()}>→ Start</button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold disabled:opacity-50 whitespace-nowrap"
              onClick={() => { setStopped(true); setDebating(false); }} disabled={!debating}>✕ Stop</button>
          </div>
        </div>

        <div className="flex gap-4">
          {[{ label: "Model A (Positive)", val: modelA, set: setModelA, other: modelB },
            { label: "Model B (Negative)", val: modelB, set: setModelB, other: modelA }].map(({ label, val, set, other }) => (
            <div key={label} className="flex-1">
              <label className="block text-sm mb-1">{label}</label>
              <select className="w-full p-2 rounded border border-[#e5e5e5] bg-white" value={val}
                onChange={(e) => set(e.target.value)} disabled={debating}>
                {modelOptions.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.value === other}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow border border-[#e5e5e5] p-4 min-h-[320px] flex flex-col gap-2">
          {chat.length === 0 && <div className="text-gray-400 text-center mt-8">Enter a topic and start the debate!</div>}
          {chat.map((msg, i) => (
            <div key={i} className={msg.role === "A" ? "flex justify-start" : msg.role === "B" ? "flex justify-end" : "flex justify-center"}>
              <span className={
                msg.role === "A" ? "bg-blue-100 text-blue-900 rounded-2xl px-4 py-2 my-1 max-w-[75%] shadow text-sm"
                : msg.role === "B" ? "bg-green-100 text-green-900 rounded-2xl px-4 py-2 my-1 max-w-[75%] shadow text-sm"
                : "text-gray-500 text-xs text-center py-1"
              }>
                {msg.role !== "system" && <b>{getLabel(msg.role === "A" ? modelA : modelB)}: </b>}
                {msg.content === "..." 
                  ? <span className="inline-block w-4 h-4 border-4 border-gray-200 border-b-blue-500 rounded-full animate-spin align-middle" />
                  : msg.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}