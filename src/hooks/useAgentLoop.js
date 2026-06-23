import { useState, useCallback } from 'react'
import { callOpenRouter } from '../lib/openrouter'
import { TOOLS, SYSTEM_PROMPT } from '../lib/tools'

export function useAgentLoop({ apiKey, model, onAiMessage, onSymptom, onFinalize }) {
  const [isLoading, setIsLoading] = useState(false)
  // pending stores loop state when paused waiting for patient reply to tanya_pasien
  const [pending, setPending] = useState(null)
  // msgs is the full conversation sent to OpenRouter
  const [msgs, setMsgs] = useState([{ role: 'system', content: SYSTEM_PROMPT }])

  const runLoop = useCallback(async (initialMsgs) => {
    let currentMsgs = initialMsgs

    // Use an iterative loop instead of recursion to avoid stale-closure issues
    while (true) {
      let data
      try {
        data = await callOpenRouter({ apiKey, model, messages: currentMsgs, tools: TOOLS })
      } catch (err) {
        console.error(err)
        const msg = err.message ?? ''
        let userMsg
        if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
          userMsg = 'Kunci API tidak valid. Silakan periksa kembali kunci Anda di menu Pengaturan.'
        } else if (msg.includes('402') || msg.toLowerCase().includes('insufficient')) {
          userMsg = 'Saldo OpenRouter habis. Silakan isi ulang di openrouter.ai.'
        } else if (msg.includes('429')) {
          userMsg = 'Terlalu banyak permintaan. Mohon tunggu sebentar dan coba lagi.'
        } else if (msg.toLowerCase().includes('tools') || msg.toLowerCase().includes('function')) {
          userMsg = `Model tidak mendukung fitur ini. Coba ganti model lain (contoh: OpenRouter Free Router).\n\nPesan error: ${msg}`
        } else {
          userMsg = `Terjadi kesalahan:\n${msg}`
        }
        onAiMessage(userMsg)
        setIsLoading(false)
        return
      }

      const assistantMsg = data.choices[0].message
      const withAssistant = [...currentMsgs, assistantMsg]
      const toolCalls = assistantMsg.tool_calls ?? []

      // Plain text response (no tool calls) — show it and stop
      if (toolCalls.length === 0) {
        if (assistantMsg.content) onAiMessage(assistantMsg.content)
        setMsgs(withAssistant)
        setIsLoading(false)
        return
      }

      // Process all tool calls in this response
      const autoResults = [] // tool results for catat_gejala (immediate)
      let questionCallId = null
      let questionText = null
      let finalizeArgs = null

      for (const call of toolCalls) {
        let args
        try {
          args = JSON.parse(call.function.arguments)
        } catch {
          continue
        }

        if (call.function.name === 'catat_gejala') {
          onSymptom(args.gejala, args.nilai)
          autoResults.push({ role: 'tool', tool_call_id: call.id, content: 'tercatat' })
        }
        if (call.function.name === 'tanya_pasien') {
          questionCallId = call.id
          questionText = args.pertanyaan
        }
        if (call.function.name === 'finalisasi_screening') {
          finalizeArgs = args
          autoResults.push({ role: 'tool', tool_call_id: call.id, content: 'selesai' })
        }
      }

      // Finalize — respond to all tools and stop
      if (finalizeArgs) {
        const withResults = [...withAssistant, ...autoResults]
        onFinalize(finalizeArgs)
        setMsgs(withResults)
        setIsLoading(false)
        return
      }

      // Question — pause loop, wait for patient input
      if (questionCallId) {
        onAiMessage(questionText)
        setPending({ msgs: withAssistant, autoResults, questionCallId })
        setIsLoading(false)
        return
      }

      // Only catat_gejala — auto-continue the loop
      currentMsgs = [...withAssistant, ...autoResults]
      setMsgs(currentMsgs)
      // continue the while loop with updated currentMsgs
    }
  }, [apiKey, model, onAiMessage, onSymptom, onFinalize])

  const sendMessage = useCallback(async (userText) => {
    setIsLoading(true)
    let nextMsgs

    if (pending) {
      // Patient answered the tanya_pasien question.
      // Per OpenRouter/OpenAI protocol: tool result first, then the user's reply.
      const toolResult = { role: 'tool', tool_call_id: pending.questionCallId, content: 'pertanyaan terkirim' }
      const userReply = { role: 'user', content: userText }
      nextMsgs = [...pending.msgs, ...pending.autoResults, toolResult, userReply]
      setPending(null)
    } else {
      nextMsgs = [...msgs, { role: 'user', content: userText }]
    }

    setMsgs(nextMsgs)
    await runLoop(nextMsgs)
  }, [pending, msgs, runLoop])

  const autoStart = useCallback(async () => {
    setIsLoading(true)
    const startMsgs = [...msgs, { role: 'user', content: 'Halo' }]
    setMsgs(startMsgs)
    await runLoop(startMsgs)
  }, [msgs, runLoop])

  return { sendMessage, autoStart, isLoading }
}
