import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GreetingScreen from './GreetingScreen'

describe('GreetingScreen', () => {
  it('renders greeting text and textarea', () => {
    render(<GreetingScreen onKeluhanSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText(/Perawat Sari/)).toBeTruthy()
    expect(screen.getByPlaceholderText(/keluhan/)).toBeTruthy()
    expect(screen.getByText('Lanjut')).toBeTruthy()
  })

  it('disables button when input is empty', () => {
    render(<GreetingScreen onKeluhanSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText('Lanjut').closest('button')).toBeDisabled()
  })

  it('enables button when input has text', async () => {
    const user = userEvent.setup()
    render(<GreetingScreen onKeluhanSubmit={() => {}} isLoading={false} />)
    const input = screen.getByPlaceholderText(/keluhan/)
    await user.type(input, 'Demam sejak 3 hari')
    expect(screen.getByText('Lanjut').closest('button')).toBeEnabled()
  })

  it('calls onKeluhanSubmit with input text on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<GreetingScreen onKeluhanSubmit={onSubmit} isLoading={false} />)
    const input = screen.getByPlaceholderText(/keluhan/)
    await user.type(input, 'Demam sejak 3 hari')
    await user.click(screen.getByText('Lanjut'))
    expect(onSubmit).toHaveBeenCalledWith('Demam sejak 3 hari')
  })

  it('disables button while loading', () => {
    render(<GreetingScreen onKeluhanSubmit={() => {}} isLoading={true} />)
    const input = screen.getByPlaceholderText(/keluhan/)
    fireEvent.change(input, { target: { value: 'Demam' } })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading text on button while loading', () => {
    render(<GreetingScreen onKeluhanSubmit={() => {}} isLoading={true} />)
    expect(screen.getByText('Memproses...')).toBeTruthy()
  })
})
