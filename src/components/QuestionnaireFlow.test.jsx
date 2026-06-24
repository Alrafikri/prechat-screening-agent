import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import QuestionnaireFlow from './QuestionnaireFlow'

vi.mock('../hooks/useQuestionnaire', () => ({
  useQuestionnaire: vi.fn(() => ({
    phase: 'greeting',
    keluhan: '',
    currentQuestion: null,
    answers: [],
    isLoading: false,
    error: null,
    submitKeluhan: vi.fn(),
    submitAnswer: vi.fn(),
    retry: vi.fn(),
  }))
}))

const baseProps = {
  apiConfig: { apiKey: 'sk-or-test', model: 'test' },
  onSymptom: vi.fn(),
  onFinalize: vi.fn(),
  screeningResult: null,
  onHandoff: vi.fn(),
  onNewChat: vi.fn(),
  onChangeSettings: vi.fn(),
}

describe('QuestionnaireFlow', () => {
  it('renders top bar with settings button', () => {
    render(<QuestionnaireFlow {...baseProps} />)
    expect(screen.getByText('Skrining Awal')).toBeTruthy()
    expect(screen.getByLabelText('Pengaturan')).toBeTruthy()
  })

  it('renders GreetingScreen in greeting phase', () => {
    render(<QuestionnaireFlow {...baseProps} />)
    expect(screen.getByText(/Perawat Sari/)).toBeTruthy()
  })

  it('renders exit banner when screeningResult exists', () => {
    render(<QuestionnaireFlow {...baseProps} screeningResult={{ ringkasan: 'Demam' }} />)
    expect(screen.getByText(/Skrining selesai/)).toBeTruthy()
  })

  it('renders error state with retry button', async () => {
    const { useQuestionnaire } = await import('../hooks/useQuestionnaire')
    useQuestionnaire.mockReturnValueOnce({
      phase: 'question_loop',
      keluhan: 'Demam',
      currentQuestion: null,
      answers: [],
      isLoading: false,
      error: 'Terjadi kesalahan koneksi',
      submitKeluhan: vi.fn(),
      submitAnswer: vi.fn(),
      retry: vi.fn(),
    })
    render(<QuestionnaireFlow {...baseProps} />)
    expect(screen.getByText(/Terjadi kesalahan/)).toBeTruthy()
    expect(screen.getByText('Coba Lagi')).toBeTruthy()
  })
})
