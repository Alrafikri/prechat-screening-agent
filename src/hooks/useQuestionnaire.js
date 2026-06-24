import { useState, useCallback, useRef } from 'react'
import { callOpenRouter } from '../lib/openrouter'
import { parseAIResponse } from '../lib/parseAIResponse'
import { QUESTIONNAIRE_PROMPT } from '../lib/questionnairePrompt'

export function useQuestionnaire({ apiConfig, onFinalize }) {
  const [phase, setPhase] = useState('greeting')
  const [keluhan, setKeluhan] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([{ role: 'system', content: QUESTIONNAIRE_PROMPT }])

  const callApi = useCallback(async (history) => {
    const data = await callOpenRouter({
      apiKey: apiConfig.apiKey,
      model: apiConfig.model,
      messages: history,
      tools: [
        {
          type: 'function',
          function: {
            name: 'tampilkan_pertanyaan',
            description: 'Tampilkan pertanyaan ke pasien dalam format tertentu',
            parameters: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['question'] },
                id: { type: 'string' },
                teks: { type: 'string' },
                format: { type: 'string', enum: ['freetext', 'single_choice', 'multiple_choice', 'yesno', 'rating'] },
                pilihan: { type: 'array', items: { type: 'string' } },
                min: { type: 'number' },
                max: { type: 'number' },
                skalaMin: { type: 'number' },
                skalaMax: { type: 'number' },
                labelMin: { type: 'string' },
                labelMax: { type: 'string' },
              },
              required: ['type', 'id', 'teks', 'format'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'finalisasi_screening',
            description: 'Selesaikan screening dan buat ringkasan klinis.',
            parameters: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['finalize'] },
                ringkasan: { type: 'string' },
                diagnosis: { type: 'string' },
                kode_icd10: { type: 'string' },
                spesialisasi: { type: 'string' },
                alasan_rekomendasi: { type: 'string' },
              },
              required: ['type', 'ringkasan', 'diagnosis', 'kode_icd10', 'spesialisasi', 'alasan_rekomendasi'],
            },
          },
        },
      ],
    })

    const parsed = parseAIResponse(data)
    if (!parsed) {
      throw new Error('Tidak dapat memahami respons AI. Silakan coba lagi.')
    }

    return parsed
  }, [apiConfig])

  const submitKeluhan = useCallback(async (text, { onFinalize: extOnFinalize } = {}) => {
    setIsLoading(true)
    setError(null)
    setKeluhan(text)

    const history = [...historyRef.current, { role: 'user', content: `Keluhan utama: ${text}` }]
    historyRef.current = history

    try {
      const parsed = await callApi(history)
      const updatedHistory = [...history, { role: 'assistant', content: JSON.stringify(parsed) }]
      historyRef.current = updatedHistory

      if (parsed.type === 'finalize') {
        setPhase('done')
        const fn = extOnFinalize || onFinalize
        if (fn) fn(parsed)
      } else {
        setCurrentQuestion(parsed)
        setPhase('question_loop')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }, [callApi, onFinalize])

  const submitAnswer = useCallback(async (answer) => {
    setIsLoading(true)
    setError(null)

    setAnswers(prev => [...prev, { question: currentQuestion.id, answer }])

    const history = [
      ...historyRef.current,
      { role: 'user', content: JSON.stringify({ answer, questionId: currentQuestion.id }) },
    ]
    historyRef.current = history

    try {
      const parsed = await callApi(history)
      const updatedHistory = [...history, { role: 'assistant', content: JSON.stringify(parsed) }]
      historyRef.current = updatedHistory

      if (parsed.type === 'finalize') {
        setPhase('done')
        if (onFinalize) onFinalize(parsed)
      } else {
        setCurrentQuestion(parsed)
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }, [callApi, onFinalize, currentQuestion])

  const retry = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const parsed = await callApi(historyRef.current)
      const updatedHistory = [...historyRef.current, { role: 'assistant', content: JSON.stringify(parsed) }]
      historyRef.current = updatedHistory

      if (parsed.type === 'finalize') {
        setPhase('done')
        if (onFinalize) onFinalize(parsed)
      } else {
        setCurrentQuestion(parsed)
        setPhase('question_loop')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }, [callApi, onFinalize])

  return { phase, keluhan, currentQuestion, answers, isLoading, error, submitKeluhan, submitAnswer, retry }
}
