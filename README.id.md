# Asisten Anamnesis AI

Aplikasi skrining triase medis berbasis AI untuk melakukan wawancara awal pasien (anamnesis), mencatat gejala, dan menghasilkan draf catatan medis format SOAP.

**[Demo Langsung](https://alrafikri.github.io/prechat-screening-agent/)**

## Fitur

- **Pengaturan** — Hubungkan dengan kunci API OpenRouter Anda sendiri, pilih model (ada opsi gratis)
- **Chat Pasien** — "Perawat virtual" AI melakukan anamnesis terstruktur dalam Bahasa Indonesia
- **Pencatatan Gejala** — Gejala otomatis tercatat dan diringkas
- **Tampilan Dokter** — Lihat ringkasan gejala, edit catatan SOAP, lihat rekomendasi spesialis
- **Privasi** — Kunci API hanya disimpan di localStorage, semua permintaan langsung ke OpenRouter

## Tech Stack

- **Frontend:** React 19, Vite 8
- **AI:** OpenRouter API (kompatibel OpenAI)
- **Testing:** Vitest + Testing Library
- **Styling:** Inline styles (tanpa framework CSS)

## Mulai Cepat

1. Clone repositori
2. `npm install`
3. `npm run dev`
4. Dapatkan kunci API gratis di [OpenRouter](https://openrouter.ai)
5. Mulai sesi skrining

Model gratis tersedia: `openrouter/free` (router otomatis), `openai/gpt-oss-20b:free`, `google/gemma-4-31b-it:free`

## Pengembangan

```bash
npm run dev      # mulai server dev
npm run build    # build produksi
npm run test     # jalankan tes
npm run preview  # pratinjau build produksi
```
