
'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NameModal from '../../components/name-modal';
export default function PlaygroundPage() {
  const router = useRouter();
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [modalName, setModalName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      setShowNameModal(true);
      setModalName('');
    } else {
      setUserName(storedName);
      setModalName(storedName);
    }
  }, []);
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

    // All available quick questions
    const quickQuestions = [
      "what is ai",
      "difference between ai and ml",
      "will ai replace human?",
      "how does ai learn?",
      "can ai be creative?",
      "what are ai limitations?",
      "is ai expensive?",
      "can ai make mistakes?",
      "how is ai used in healthcare?",
      "can ai improve productivity?",
      "is ai safe?",
      "can ai help climate change?",
      "how does ai affect society?",
      "analyze impact of ai on future employment",
      "is ai threat to data -privacy",
      "should ai be used in education",
      "how to build a project"
    ];

    // State to track which quick questions to show
    const [quickIdx, setQuickIdx] = useState(0);
    const getQuickSet = () => quickQuestions.slice(quickIdx, quickIdx + 4).length === 4
      ? quickQuestions.slice(quickIdx, quickIdx + 4)
      : quickQuestions.slice(quickIdx, quickIdx + 4).concat(quickQuestions.slice(0, 4 - quickQuestions.slice(quickIdx, quickIdx + 4).length));

    // Advance quick question set
    const advanceQuick = () => setQuickIdx((prev) => (prev + 4) % quickQuestions.length);

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

  // Handler for saving name from modal
  const handleNameSave = () => {
    localStorage.setItem('userName', modalName);
    setUserName(modalName);
    setShowNameModal(false);
  };

  return (
    <>
      {showNameModal && (
        <NameModal
          open={showNameModal}
          name={modalName}
          setName={setModalName}
          onSave={handleNameSave}
        />
      )}
      {/* ...existing code... */}
      <div className="min-h-screen w-full flex bg-[#faf9f7] text-[#3a3a3a]">
      <aside className="w-64 border-r border-[#e5e5e5] flex flex-col justify-between fixed left-0 top-0 h-full z-10 bg-[#faf9f7]">
        {/* ...existing code... */}
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} aria-label="Go to home" className="focus:outline-none">
              <img src="/logo.png" alt="Logo" className="w-32 h-16" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-6 ml-2">
            {/* Tribunal symbol (scales of justice) inline SVG */}
            <span className="ml-2" aria-label="Tribunal Symbol">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="14" y1="4" x2="14" y2="22" />
                  <line x1="7" y1="22" x2="21" y2="22" />
                  <line x1="10" y1="7" x2="18" y2="7" />
                  <path d="M10 7C8 11 6 16 10 16C14 16 12 11 10 7Z" fill="#fff"/>
                  <path d="M18 7C20 11 22 16 18 16C14 16 16 11 18 7Z" fill="#fff"/>
                  <circle cx="14" cy="4" r="1.5" fill="#fff"/>
                </g>
              </svg>
            </span>
            <span className="font-semibold text-lg">AI Tribunal</span>
            
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center px-6 ml-64">
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
          {/* Quick question options */}
          <div className="flex gap-3 mt-2 mb-2">
            {getQuickSet().map((q, idx) => (
              <button
                key={idx}
                className="px-4 py-2 rounded-lg bg-[#e5e5e5] hover:bg-[#d4d4d4] text-sm font-medium focus:outline-none"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await fetch('/api/llm-chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query: q, modelA, modelB }),
                    });
                    const data = await res.json();
                    setChat(prev => [...prev, { query: q, responses: data.results }]);
                  } catch (e) {
                    setChat(prev => [...prev, { query: q, responses: { [modelA]: 'Error', [modelB]: 'Error' } }]);
                  }
                  setLoading(false);
                  advanceQuick();
                }}
                disabled={loading}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </button>
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
