import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApiKeySetup from './ApiKeySetup'

beforeEach(() => localStorage.clear())

describe('ApiKeySetup', () => {
  it('renders the 3-step guide', () => {
    render(<ApiKeySetup onSave={vi.fn()} />)
    expect(screen.getByText(/Daftar di OpenRouter/i)).toBeInTheDocument()
    expect(screen.getByText(/Buat API Key/i)).toBeInTheDocument()
    expect(screen.getByText(/Tempel di Sini/i)).toBeInTheDocument()
  })

  it('shows error for invalid key format', async () => {
    const user = userEvent.setup()
    render(<ApiKeySetup onSave={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/sk-or-v1/i), 'invalid-key')
    await user.click(screen.getByRole('button', { name: /Simpan/i }))
    expect(screen.getByText(/Format tidak valid/i)).toBeInTheDocument()
  })

  it('calls onSave with key and model for valid key', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<ApiKeySetup onSave={onSave} />)
    await user.type(screen.getByPlaceholderText(/sk-or-v1/i), 'sk-or-v1-abc123')
    await user.click(screen.getByRole('button', { name: /Simpan/i }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: 'sk-or-v1-abc123' })
    )
  })

  it('saves config to localStorage on submit', async () => {
    const user = userEvent.setup()
    render(<ApiKeySetup onSave={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/sk-or-v1/i), 'sk-or-v1-abc123')
    await user.click(screen.getByRole('button', { name: /Simpan/i }))
    const stored = JSON.parse(localStorage.getItem('rme-api-config'))
    expect(stored.apiKey).toBe('sk-or-v1-abc123')
  })
})
