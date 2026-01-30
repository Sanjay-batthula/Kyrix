
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  // Model options (can be extended)
  const modelOptions = [
    { label: 'OpenAI GPT-4', value: 'openai-gpt4' },
    { label: 'Gemini', value: 'gemini' },
    { label: 'Grok', value: 'grok' },
    { label: 'Anthropic Claude', value: 'claude' },
  ];


  const [modelA, setModelA] = useState(modelOptions[0].value);
  const [modelB, setModelB] = useState(modelOptions[1].value);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<Array<{
    query: string;
    responses: Record<string, string>;
  }>>([]);

  // Helper to get label by value
  const getLabel = (value: string) => modelOptions.find(opt => opt.value === value)?.label || value;

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    const query = input;
    setInput('');
    try {
      const res = await fetch('/api/llm-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, modelA, modelB }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { query, responses: data.results }]);
    } catch (e) {
      setChat(prev => [...prev, { query, responses: { [modelA]: 'Error', [modelB]: 'Error' } }]);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="min-h-screen w-full flex bg-[#faf9f7] text-[#3a3a3a]">
      <aside className="w-64 border-r border-[#e5e5e5] flex flex-col justify-between fixed left-0 top-0 h-full z-10 bg-[#faf9f7]">
        {/* ...existing code... */}
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} aria-label="Go to home" className="focus:outline-none">
              <img src="/logo.png" alt="Logo" className="w-32 h-16" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-serif mb-10 text-center">
          What would you like to do?
        </h1>

        {/* Model selection dropdowns */}
        <div className="w-full max-w-3xl flex justify-between gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Model A</label>
            <div className="relative">
              <select
                className="w-full p-2 rounded border border-[#e5e5e5] bg-white appearance-none"
                value={modelA}
                onChange={e => {
                  const newValue = e.target.value;
                  setModelA(newValue);
                  // If both are same, auto-switch B to another
                  if (newValue === modelB) {
                    const next = modelOptions.find(opt => opt.value !== newValue)?.value || modelB;
                    setModelB(next);
                  }
                }}
              >
                {modelOptions.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === modelB}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Tick icon for selected */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">
                ✓
              </span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Model B</label>
            <div className="relative">
              <select
                className="w-full p-2 rounded border border-[#e5e5e5] bg-white appearance-none"
                value={modelB}
                onChange={e => {
                  const newValue = e.target.value;
                  setModelB(newValue);
                  // If both are same, auto-switch A to another
                  if (newValue === modelA) {
                    const next = modelOptions.find(opt => opt.value !== newValue)?.value || modelA;
                    setModelA(next);
                  }
                }}
              >
                {modelOptions.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === modelA}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Tick icon for selected */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">
                ✓
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {/* Chat history */}
          <div className="flex flex-col gap-4">
            {chat.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="text-base font-semibold text-gray-700">You: {item.query}</div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#f7f7f7] rounded-lg p-3 border border-[#e5e5e5] min-h-[160px] max-h-[320px] h-[200px] flex flex-col">
                    <div className="font-bold mb-1">{getLabel(modelA)}</div>
                    <div className="whitespace-pre-line text-sm overflow-auto flex-1">{item.responses[modelA]}</div>
                  </div>
                  <div className="flex-1 bg-[#f7f7f7] rounded-lg p-3 border border-[#e5e5e5] min-h-[160px] max-h-[320px] h-[200px] flex flex-col">
                    <div className="font-bold mb-1">{getLabel(modelB)}</div>
                    <div className="whitespace-pre-line text-sm overflow-auto flex-1">{item.responses[modelB]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Input box */}
          <div className="bg-white rounded-2xl shadow border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-2">
              <input
                placeholder="Ask anything..."
                className="w-full text-lg outline-none bg-transparent"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !loading) handleSend(); }}
                disabled={loading}
              />
              {loading ? (
                <span className="inline-block align-middle w-6 h-6 border-4 border-gray-200 border-b-[#FF3D00] rounded-full animate-spin"></span>
              ) : (
                <button
                  className="text-xl disabled:opacity-50 ml-2"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                >
                  {'➜'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
