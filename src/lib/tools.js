export const SYSTEM_PROMPT = `Anda adalah Perawat Sari, seorang perawat yang melakukan anamnesis pasien sebelum konsultasi dokter.

**Langkah:**
1. Salam sesuai waktu (pagi/siang/sore/malam), perkenalkan diri, tanya keluhan utama.
2. Tanya keluhan tambahan.
3. Gali riwayat penyakit: sejak kapan, bagaimana awal, apa yang memperparah.
4. Tanya riwayat pengobatan dan penyakit dahulu.
5. Catat gejala dengan tool catat_gejala.
6. Jika info cukup, panggil finalisasi_screening.

**Aturan:**
- Bahasa Indonesia sopan, panggil pasien "Bapak/Ibu".
- Satu pertanyaan per tanya_pasien.
- Minimal 4 tanya sebelum finalisasi.
- Jika gejala serius (sesak, nyeri dada, penurunan kesadaran), segera finalisasi.`

export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'tanya_pasien',
      description: 'Ajukan satu pertanyaan lanjutan kepada pasien untuk menggali keluhan lebih dalam.',
      parameters: {
        type: 'object',
        properties: {
          pertanyaan: {
            type: 'string',
            description: 'Pertanyaan yang akan ditampilkan kepada pasien',
          },
        },
        required: ['pertanyaan'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'catat_gejala',
      description: 'Catat gejala atau informasi medis penting. Tidak ditampilkan ke pasien.',
      parameters: {
        type: 'object',
        properties: {
          gejala: { type: 'string', description: 'Nama gejala, misal: "Demam"' },
          nilai: { type: 'string', description: 'Detail nilai, misal: "3 hari, memburuk malam hari"' },
        },
        required: ['gejala', 'nilai'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'finalisasi_screening',
      description: 'Selesaikan screening ketika sudah cukup informasi untuk membuat ringkasan klinis.',
      parameters: {
        type: 'object',
        properties: {
          ringkasan: { type: 'string', description: 'Ringkasan anamnesis dalam 2-4 kalimat' },
          diagnosis: { type: 'string', description: 'Diagnosis sementara dalam bahasa Indonesia' },
          kode_icd10: { type: 'string', description: 'Kode ICD-10 yang paling sesuai, misal: A90' },
          spesialisasi: { type: 'string', description: 'Spesialisasi dokter yang direkomendasikan, misal: Sp.PD' },
          alasan_rekomendasi: { type: 'string', description: 'Alasan singkat rekomendasi dokter ini' },
        },
        required: ['ringkasan', 'diagnosis', 'kode_icd10', 'spesialisasi', 'alasan_rekomendasi'],
      },
    },
  },
]
