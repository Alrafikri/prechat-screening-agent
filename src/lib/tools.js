export const SYSTEM_PROMPT = `Anda adalah asisten perawat virtual yang membantu melakukan anamnesis awal sebelum konsultasi dokter.

Tugas Anda:
1. Sambut pasien dengan hangat menggunakan tool tanya_pasien.
2. Tanyakan keluhan utama terlebih dahulu.
3. Gali lebih dalam dengan maksimal 8 pertanyaan lanjutan yang relevan menggunakan tanya_pasien.
4. Catat setiap gejala penting segera setelah pasien menyebutkannya menggunakan catat_gejala.
5. Setelah informasi cukup (minimal 4 pertanyaan), panggil finalisasi_screening.

Gunakan bahasa Indonesia yang ramah, singkat, dan mudah dipahami pasien awam. Jangan gunakan istilah medis yang rumit saat berbicara dengan pasien.`

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
