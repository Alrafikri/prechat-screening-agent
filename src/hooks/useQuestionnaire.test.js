import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuestionnaire } from './useQuestionnaire'

const mockCallOpenRouter = vi.fn()
vi.mock('../lib/openrouter', () => ({
  callOpenRouter: (...args) => mockCallOpenRouter(...args)
}))

const apiConfig = { apiKey: 'sk-or-test', model: 'openrouter/free' }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useQuestionnaire', () => {
  it('starts in greeting phase', () => {
    const { result } = renderHook(() => useQuestionnaire({ apiConfig }))
    expect(result.current.phase).toBe('greeting')
    expect(result.current.keluhan).toBe('')
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.answers).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('transitions to question_loop after submitKeluhan', async () => {
    mockCallOpenRouter.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({ type: 'question', id: 'q_1', teks: 'Apakah demam?', format: 'yesno' }),
          tool_calls: null
        }
      }]
    })

    const { result } = renderHook(() => useQuestionnaire({ apiConfig }))

    await act(async () => {
      await result.current.submitKeluhan('Demam sejak 3 hari')
    })

    expect(result.current.phase).toBe('question_loop')
    expect(result.current.keluhan).toBe('Demam sejak 3 hari')
    expect(result.current.currentQuestion).toEqual({ type: 'question', id: 'q_1', teks: 'Apakah demam?', format: 'yesno' })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('transitions to done on finalize response', async () => {
    const finalizeData = {
      type: 'finalize',
      ringkasan: 'Demam 3 hari',
      diagnosis: 'ISPA',
      kode_icd10: 'J00',
      spesialisasi: 'Sp.PD',
      alasan_rekomendasi: 'Infeksi saluran napas'
    }

    mockCallOpenRouter.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify(finalizeData),
          tool_calls: null
        }
      }]
    })

    const { result } = renderHook(() => useQuestionnaire({ apiConfig }))
    const onFinalize = vi.fn()

    await act(async () => {
      await result.current.submitKeluhan('Demam 3 hari', { onFinalize })
    })

    expect(result.current.phase).toBe('done')
  })

  it('retry clears error and re-calls API', async () => {
    mockCallOpenRouter.mockRejectedValueOnce(new Error('Network error'))
    mockCallOpenRouter.mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({ type: 'question', id: 'q_1', teks: 'Apakah demam?', format: 'yesno' }),
          tool_calls: null
        }
      }]
    })

    const { result } = renderHook(() => useQuestionnaire({ apiConfig }))

    await act(async () => {
      await result.current.submitKeluhan('Demam 3 hari')
    })

    expect(result.current.error).toBeTruthy()

    await act(async () => {
      await result.current.retry()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.phase).toBe('question_loop')
  })

  it('collects answers through submitAnswer', async () => {
    mockCallOpenRouter
      .mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({ type: 'question', id: 'q_1', teks: 'Apakah demam?', format: 'yesno' }),
            tool_calls: null
          }
        }]
      })
      .mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({ type: 'question', id: 'q_2', teks: 'Seberapa parah?', format: 'rating' }),
            tool_calls: null
          }
        }]
      })

    const { result } = renderHook(() => useQuestionnaire({ apiConfig }))

    await act(async () => {
      await result.current.submitKeluhan('Demam 3 hari')
    })

    await act(async () => {
      await result.current.submitAnswer('Ya')
    })

    expect(result.current.answers).toHaveLength(1)
    expect(result.current.answers[0]).toMatchObject({ question: 'q_1', answer: 'Ya' })
    expect(result.current.currentQuestion.format).toBe('rating')
  })
})
