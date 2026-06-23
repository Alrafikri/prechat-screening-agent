export async function callOpenRouter({ apiKey, model, messages, tools }) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Asisten Anamnesis AI',
    },
    body: JSON.stringify({
      model,
      messages,
      tools,
      tool_choice: 'auto',
      parallel_tool_calls: false,
      provider: { order: ['OpenRouter', 'Google', 'Mancer', 'Together', 'Novita'] },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.error?.message ?? err.message ?? `HTTP ${res.status}`
    throw new Error(msg)
  }

  return res.json()
}
