import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionScreen from './QuestionScreen'

describe('QuestionScreen', () => {
  it('renders yesno question with Ya/Tidak buttons', () => {
    render(<QuestionScreen question={{ id: 'q_1', teks: 'Apakah demam?', format: 'yesno' }} onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText('Apakah demam?')).toBeTruthy()
    expect(screen.getByText('Ya')).toBeTruthy()
    expect(screen.getByText('Tidak')).toBeTruthy()
  })

  it('renders single choice with clickable options', () => {
    const question = { id: 'q_2', teks: 'Pilih lokasi', format: 'single_choice', pilihan: ['Kepala', 'Dada', 'Perut'] }
    render(<QuestionScreen question={question} onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText('Kepala')).toBeTruthy()
    expect(screen.getByText('Dada')).toBeTruthy()
    expect(screen.getByText('Perut')).toBeTruthy()
  })

  it('renders multiple choice with checkboxes and count', () => {
    const question = { id: 'q_3', teks: 'Gejala lain?', format: 'multiple_choice', pilihan: ['Batuk', 'Pilek', 'Sakit Tenggorokan'] }
    render(<QuestionScreen question={question} onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText('Lanjut (0 dipilih)')).toBeTruthy()
  })

  it('renders rating scale from 1-10', () => {
    const question = { id: 'q_4', teks: 'Skala nyeri?', format: 'rating', skalaMin: 1, skalaMax: 10, labelMin: 'Tidak nyeri', labelMax: 'Sangat nyeri' }
    render(<QuestionScreen question={question} onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('10')).toBeTruthy()
  })

  it('renders freetext with textarea', () => {
    render(<QuestionScreen question={{ id: 'q_5', teks: 'Ceritakan lebih lanjut', format: 'freetext' }} onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('calls onSubmit with yesno answer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<QuestionScreen question={{ id: 'q_1', teks: 'Apakah demam?', format: 'yesno' }} onSubmit={onSubmit} isLoading={false} />)
    await user.click(screen.getByText('Ya'))
    await user.click(screen.getByText('Lanjut'))
    expect(onSubmit).toHaveBeenCalledWith('Ya')
  })

  it('calls onSubmit with single choice answer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const question = { id: 'q_2', teks: 'Pilih', format: 'single_choice', pilihan: ['A', 'B'] }
    render(<QuestionScreen question={question} onSubmit={onSubmit} isLoading={false} />)
    await user.click(screen.getByText('A'))
    await user.click(screen.getByText('Lanjut'))
    expect(onSubmit).toHaveBeenCalledWith('A')
  })

  it('calls onSubmit with multiple choice answer as array', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const question = { id: 'q_3', teks: 'Pilih', format: 'multiple_choice', pilihan: ['A', 'B', 'C'] }
    render(<QuestionScreen question={question} onSubmit={onSubmit} isLoading={false} />)
    await user.click(screen.getByText('A'))
    await user.click(screen.getByText('C'))
    await user.click(screen.getByText('Lanjut (2 dipilih)'))
    expect(onSubmit).toHaveBeenCalledWith(['A', 'C'])
  })

  it('calls onSubmit with rating value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const question = { id: 'q_4', teks: 'Skala?', format: 'rating', skalaMin: 1, skalaMax: 5 }
    render(<QuestionScreen question={question} onSubmit={onSubmit} isLoading={false} />)
    await user.click(screen.getByText('3'))
    await user.click(screen.getByText('Lanjut'))
    expect(onSubmit).toHaveBeenCalledWith(3)
  })

  it('disables button while loading', () => {
    render(<QuestionScreen question={{ id: 'q_1', teks: 'Test', format: 'yesno' }} onSubmit={() => {}} isLoading={true} />)
    expect(screen.getByText('Memproses...')).toBeTruthy()
  })
})
