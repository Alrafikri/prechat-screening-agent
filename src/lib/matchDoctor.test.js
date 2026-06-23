import { describe, it, expect } from 'vitest'
import dokterList from '../data/dokter.json'
import { matchDoctor } from './matchDoctor'

describe('matchDoctor', () => {
  it('returns exact spesialisasi match', () => {
    const result = matchDoctor('Sp.PD', dokterList)
    expect(result.spesialisasi).toBe('Sp.PD')
  })

  it('is case-insensitive', () => {
    const result = matchDoctor('sp.a', dokterList)
    expect(result.spesialisasi).toBe('Sp.A')
  })

  it('falls back to GP when no match', () => {
    const result = matchDoctor('Sp.UNKNOWN', dokterList)
    expect(result.spesialisasi).toBe('GP')
  })

  it('returns null when list is empty', () => {
    const result = matchDoctor('Sp.PD', [])
    expect(result).toBeNull()
  })
})
