export function matchDoctor(spesialisasi, dokterList) {
  if (!dokterList.length) return null
  const key = spesialisasi.toLowerCase()
  const match = dokterList.find(d => d.spesialisasi.toLowerCase() === key)
  if (match) return match
  return dokterList.find(d => d.spesialisasi === 'GP') ?? null
}
