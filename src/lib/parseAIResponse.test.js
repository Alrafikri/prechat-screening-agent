import { describe, it, expect } from 'vitest'
import { parseAIResponse } from './parseAIResponse'

describe('parseAIResponse', () => {
  it('parses a question response from tool call', () => {
    const toolCall = {
      choices: [{
        message: {
          content: null,
          tool_calls: [{
            function: {
              name: 'tampilkan_pertanyaan',
              arguments: JSON.stringify({
                type: 'question',
                id: 'q_1',
                teks: 'Apakah nyeri terasa menjalar?',
                format: 'yesno'
              })
            }
          }]
        }
      }]
    }
    expect(parseAIResponse(toolCall)).toEqual({
      type: 'question',
      id: 'q_1',
      teks: 'Apakah nyeri terasa menjalar?',
      format: 'yesno'
    })
  })

  it('parses a finalize response from tool call', () => {
    const toolCall = {
      choices: [{
        message: {
          content: null,
          tool_calls: [{
            function: {
              name: 'finalisasi_screening',
              arguments: JSON.stringify({
                type: 'finalize',
                ringkasan: 'Demam 3 hari',
                diagnosis: 'ISPA',
                kode_icd10: 'J00',
                spesialisasi: 'Sp.PD',
                alasan_rekomendasi: 'Infeksi saluran napas'
              })
            }
          }]
        }
      }]
    }
    expect(parseAIResponse(toolCall)).toEqual({
      type: 'finalize',
      ringkasan: 'Demam 3 hari',
      diagnosis: 'ISPA',
      kode_icd10: 'J00',
      spesialisasi: 'Sp.PD',
      alasan_rekomendasi: 'Infeksi saluran napas'
    })
  })

  it('parses a question response from text JSON', () => {
    const textResponse = {
      choices: [{
        message: {
          content: 'Beberapa teks pengantar.\n\n{"type":"question","id":"q_2","teks":"Pilih lokasi nyeri","format":"multiple_choice","pilihan":["Kepala","Dada","Perut"]}\n\nTeks penutup.',
          tool_calls: null
        }
      }]
    }
    expect(parseAIResponse(textResponse)).toEqual({
      type: 'question',
      id: 'q_2',
      teks: 'Pilih lokasi nyeri',
      format: 'multiple_choice',
      pilihan: ['Kepala', 'Dada', 'Perut']
    })
  })

  it('parses a finalize response from text JSON', () => {
    const textResponse = {
      choices: [{
        message: {
          content: '{"type":"finalize","ringkasan":"Batuk 5 hari","diagnosis":"Bronkitis","kode_icd10":"J20","spesialisasi":"Sp.PD","alasan_rekomendasi":"Infeksi saluran napas bawah"}',
          tool_calls: null
        }
      }]
    }
    expect(parseAIResponse(textResponse)).toEqual({
      type: 'finalize',
      ringkasan: 'Batuk 5 hari',
      diagnosis: 'Bronkitis',
      kode_icd10: 'J20',
      spesialisasi: 'Sp.PD',
      alasan_rekomendasi: 'Infeksi saluran napas bawah'
    })
  })

  it('returns null for plain text without JSON', () => {
    const plain = {
      choices: [{
        message: {
          content: 'Halo, ada yang bisa saya bantu?',
          tool_calls: null
        }
      }]
    }
    expect(parseAIResponse(plain)).toBeNull()
  })

  it('returns null for empty response', () => {
    const empty = { choices: [{ message: { content: null, tool_calls: null } }] }
    expect(parseAIResponse(empty)).toBeNull()
  })
})
