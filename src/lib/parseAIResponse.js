export function parseAIResponse(response) {
  const msg = response?.choices?.[0]?.message
  if (!msg) return null

  const toolCalls = msg.tool_calls ?? []

  // Prioritize tool calls
  if (toolCalls.length > 0) {
    for (const call of toolCalls) {
      try {
        const args = JSON.parse(call.function.arguments)
        if (args.type === 'question' || args.type === 'finalize') {
          return args
        }
      } catch { /* empty */ }
    }
  }

  // Fallback: scan text for JSON block
  if (msg.content) {
    const jsonRegex = /\{(?:[^{}]|"(?:\\.|[^"\\])*")*\}/g
    const matches = msg.content.match(jsonRegex)
    if (matches) {
      for (const match of matches) {
        try {
          const parsed = JSON.parse(match)
          if (parsed.type === 'question' || parsed.type === 'finalize') {
            return parsed
          }
        } catch { /* empty */ }
      }
    }
  }

  return null
}
