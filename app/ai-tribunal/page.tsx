
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const modelOptions = [
	{ label: "OpenAI GPT-4", value: "openai-gpt4" },
	{ label: "Gemini", value: "gemini" },
	{ label: "Grok", value: "grok" },
	{ label: "Anthropic Claude", value: "claude" },
];

export default function Page() {
	const router = useRouter();

	const [modelA, setModelA] = useState(modelOptions[0].value);
	const [modelB, setModelB] = useState(modelOptions[1].value);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [debating, setDebating] = useState(false);
	const [chat, setChat] = useState<Array<{
		role: "A" | "B" | "system";
		content: string;
	}>>([]);
	const [turn, setTurn] = useState(0);
	const [maxTurns] = useState(5);
	const [stopped, setStopped] = useState(false);

	const getLabel = (value: string) => modelOptions.find(opt => opt.value === value)?.label || value;

	// Helper to call OpenRouter API for a model
	async function callOpenRouter(model: string, messages: {role: string, content: string}[]) {
		const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
		const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
				"HTTP-Referer": "http://localhost",
				"X-Title": "Kyrix Tribunal"
			},
			body: JSON.stringify({
				model,
				messages,
				max_tokens: 512
			})
		});
		const data = await res.json();
		return data.choices?.[0]?.message?.content || "[No response]";
	}

	// Debate logic
	async function debateLoop(topic: string, modelA: string, modelB: string) {
		setLoading(true);
		setStopped(false);
		let messages: {role: string, content: string}[] = [
			{ role: "system", content: `You are debating the topic: '${topic}'. You must only argue the POSITIVE side. Be concise and persuasive.` }
		];
		let negMessages: {role: string, content: string}[] = [
			{ role: "system", content: `You are debating the topic: '${topic}'. You must only argue the NEGATIVE side. Be concise and persuasive.` }
		];
		let turns = 0;
		let debate: Array<{role: "A"|"B"|"system", content: string}> = [];
		let lastA = "";
		let lastB = "";
		while (turns < maxTurns && !stopped) {
			// A (positive) speaks
			setChat([...debate, { role: "A", content: "..." }]);
			await new Promise(res => setTimeout(res, 800));
			const promptA = turns === 0 ? `Present your first positive argument for: ${topic}` : `Respond to the previous negative point and add another positive argument.`;
			messages.push({ role: "user", content: promptA + (lastB ? ` Previous negative: ${lastB}` : "") });
			const pos = await callOpenRouter(modelA, messages);
			messages.push({ role: "assistant", content: pos });
			debate.push({ role: "A", content: pos });
			setChat([...debate]);
			lastA = pos;
			if (stopped) break;
			// B (negative) speaks
			setChat([...debate, { role: "B", content: "..." }]);
			await new Promise(res => setTimeout(res, 800));
			const promptB = turns === 0 ? `Present your first negative argument for: ${topic}` : `Respond to the previous positive point and add another negative argument.`;
			negMessages.push({ role: "user", content: promptB + (lastA ? ` Previous positive: ${lastA}` : "") });
			const neg = await callOpenRouter(modelB, negMessages);
			negMessages.push({ role: "assistant", content: neg });
			debate.push({ role: "B", content: neg });
			setChat([...debate]);
			lastB = neg;
			turns++;
			setTurn(turns);
		}
		// Conclusion
		if (!stopped) {
			setChat([...debate, { role: "A", content: "..." }]);
			await new Promise(res => setTimeout(res, 800));
			messages.push({ role: "user", content: `Please provide a short conclusion for the positive side of the debate on: ${topic}` });
			const posCon = await callOpenRouter(modelA, messages);
			debate.push({ role: "A", content: `Conclusion: ${posCon}` });
			setChat([...debate, { role: "B", content: "..." }]);
			await new Promise(res => setTimeout(res, 800));
			negMessages.push({ role: "user", content: `Please provide a short conclusion for the negative side of the debate on: ${topic}` });
			const negCon = await callOpenRouter(modelB, negMessages);
			debate.push({ role: "B", content: `Conclusion: ${negCon}` });
			setChat([...debate]);
		}
		setLoading(false);
		setDebating(false);
	}

	function handleStart() {
		setDebating(true);
		setChat([]);
		setTurn(0);
		debateLoop(input, modelA, modelB);
	}
	function handleStop() {
		setStopped(true);
		setDebating(false);
		setLoading(false);
	}

	return (
        
		<div className="min-h-screen w-full flex flex-col items-center bg-[#faf9f7] text-[#3a3a3a] px-2 py-8">
            <aside className="w-64 border-r border-[#e5e5e5] flex flex-col justify-between fixed left-0 top-0 h-full z-10 bg-[#faf9f7]">
        {/* ...existing code... */}
        <div>
          <div className="flex items-center gap-3">
			<button onClick={() => router.push('/')} aria-label="Go to home" className="focus:outline-none">
              <img src="/logo.png" alt="Logo" className="w-32 h-16" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-6 ml-2">
						{/* Playground symbol (lightbulb for 'idea') inline SVG */}
						<span className="ml-2" aria-label="Playground Symbol">
							<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g>
									<circle cx="14" cy="12" r="7" stroke="#3a3a3a" strokeWidth="2" fill="#fff" />
									<rect x="11" y="20" width="6" height="3" rx="1.5" fill="#fff" stroke="#3a3a3a" strokeWidth="2" />
									<rect x="12.5" y="17" width="3" height="3" rx="1.5" fill="#fff" stroke="#3a3a3a" strokeWidth="1.5" />
									<line x1="14" y1="4" x2="14" y2="2" stroke="#3a3a3a" strokeWidth="2" />
									<line x1="5.636" y1="5.636" x2="4.222" y2="4.222" stroke="#3a3a3a" strokeWidth="2" />
									<line x1="22.364" y1="5.636" x2="23.778" y2="4.222" stroke="#3a3a3a" strokeWidth="2" />
								</g>
							</svg>
						</span>
						<span className="font-semibold text-lg">AI Playground</span>
					</div>
        </div>
      </aside>

			<div className="w-full max-w-2xl flex flex-col gap-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-center">
        Kyrix AI Tribunal
      </h2>
				{/* Input box for topic */}
				<div className="bg-white rounded-2xl shadow border border-[#e5e5e5] p-4">
					<div className="flex items-center gap-2">
						<input
							placeholder="Enter a debate topic..."
							className="w-full text-lg outline-none bg-transparent"
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => { if (e.key === "Enter" && !loading && !debating) handleStart(); }}
							disabled={loading || debating}
						/>
						<button
							className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold shadow-md hover:from-green-500 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 transition-all duration-200"
							onClick={handleStart}
							disabled={loading || debating || !input.trim()}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
							Start
						</button>
						<button
							className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-md hover:from-red-500 hover:to-red-700 flex items-center gap-2 disabled:opacity-50 transition-all duration-200"
							onClick={handleStop}
							disabled={!debating}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
							Stop
						</button>
					</div>
				</div>

				{/* Model selectors */}
				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block text-sm mb-1">Model A (Positive)</label>
						<div className="relative">
							<select
								className="w-full p-2 rounded border border-[#e5e5e5] bg-white appearance-none"
								value={modelA}
								onChange={e => {
									const newValue = e.target.value;
									setModelA(newValue);
									if (newValue === modelB) {
										const next = modelOptions.find(opt => opt.value !== newValue)?.value || modelB;
										setModelB(next);
									}
								}}
								disabled={debating}
							>
								{modelOptions.map(opt => (
									<option key={opt.value} value={opt.value} disabled={opt.value === modelB}>{opt.label}</option>
								))}
							</select>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">✓</span>
						</div>
					</div>
					<div className="flex-1">
						<label className="block text-sm mb-1">Model B (Negative)</label>
						<div className="relative">
							<select
								className="w-full p-2 rounded border border-[#e5e5e5] bg-white appearance-none"
								value={modelB}
								onChange={e => {
									const newValue = e.target.value;
									setModelB(newValue);
									if (newValue === modelA) {
										const next = modelOptions.find(opt => opt.value !== newValue)?.value || modelA;
										setModelA(next);
									}
								}}
								disabled={debating}
							>
								{modelOptions.map(opt => (
									<option key={opt.value} value={opt.value} disabled={opt.value === modelA}>{opt.label}</option>
								))}
							</select>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">✓</span>
						</div>
					</div>
				</div>

				{/* Chat area */}
				<div className="bg-white rounded-2xl shadow border border-[#e5e5e5] p-4 min-h-[320px] flex flex-col gap-2">
					{chat.length === 0 && (
						<div className="text-gray-400 text-center">No debate yet. Enter a topic and start!</div>
					)}
					{chat.map((msg, idx) => (
						<div key={idx} className={
							msg.role === "A"
								? "text-left"
								: msg.role === "B"
								? "text-right"
								: "text-center text-gray-500 text-sm"
						}>
							<span className={
								msg.role === "A"
									? "inline-block bg-blue-100 text-blue-900 rounded-lg px-3 py-2 my-1 max-w-[80%]"
									: msg.role === "B"
									? "inline-block bg-pink-100 text-pink-900 rounded-lg px-3 py-2 my-1 max-w-[80%]"
									: ""
							}>
								{msg.role === "A" && <b>{getLabel(modelA)}: </b>}
								{msg.role === "B" && <b>{getLabel(modelB)}: </b>}
								{msg.content === "..." ? (
									<span className="inline-block w-6 h-6 align-middle">
										<span className="inline-block align-middle w-5 h-5 border-4 border-gray-200 border-b-[#FF3D00] rounded-full animate-spin"></span>
									</span>
								) : msg.content}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
