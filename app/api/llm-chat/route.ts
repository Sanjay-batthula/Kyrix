import { NextRequest, NextResponse } from 'next/server';
import { getMockResponse } from '../../../lib/mockQA';

export const runtime = 'edge';


// Gemini API (Google)
async function fetchGemini(query: string, apiKey: string) {
  // Use the latest Gemini endpoint and model name
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: query }] }],
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || data.candidates?.[0]?.content || JSON.stringify(data);
}


// OpenAI direct API
async function fetchOpenAI(query: string, apiKey: string) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: 'gpt-3.5-turbo', // fallback to a model everyone has access to
    messages: [{ role: 'user', content: query }],
    max_tokens: 1024,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || JSON.stringify(data);
}

// OpenRouter API
async function fetchOpenRouter(query: string, apiKey: string, model: string) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const body = {
    model,
    messages: [{ role: 'user', content: query }],
    max_tokens: 1024,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost', // required by OpenRouter
      'X-Title': 'Kyrix Playground',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || JSON.stringify(data);
}

// Add more model fetchers as needed

export async function POST(req: NextRequest) {
  const { query, modelA, modelB } = await req.json();
  const results: Record<string, string> = {};


  // For now, use a default name (can be extended to fetch from user/session)
  const name = 'User';
  const hour = new Date().getHours();

  results[modelA] = getMockResponse(query.trim().toLowerCase(), modelA, name, hour);
  results[modelB] = getMockResponse(query.trim().toLowerCase(), modelB, name, hour);

  return NextResponse.json({ results });
}
