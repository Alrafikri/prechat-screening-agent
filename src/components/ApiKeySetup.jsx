import { useState } from 'react'

const MODELS = [
  { value: 'openai/gpt-oss-20b:free', label: '🆓 GPT-OSS 20B — Gratis, paling stabil (direkomendasikan)' },
  { value: 'openrouter/free', label: '🆓 OpenRouter Free Router — otomatis pilih, kualitas bervariasi' },
  { value: 'google/gemini-flash-1.5', label: '⚡ Gemini Flash 1.5 — Cepat & andal' },
  { value: 'openai/gpt-4o-mini', label: '💰 GPT-4o Mini — Murah & andal' },
  { value: 'anthropic/claude-haiku-3', label: '💰 Claude Haiku 3 — Kualitas premium' },
]

export default function ApiKeySetup({ onSave, initialConfig }) {
  const [apiKey, setApiKey] = useState(initialConfig?.apiKey ?? '')
  const [model, setModel] = useState(initialConfig?.model ?? MODELS[0].value)
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!apiKey.startsWith('sk-or-')) {
      setError("Format tidak valid — kunci harus dimulai dengan 'sk-or-...'")
      return
    }
    setError('')
    const config = { apiKey, model }
    localStorage.setItem('rme-api-config', JSON.stringify(config))
    onSave(config)
  }

  return (
    <div style={styles.page}>
      <div style={styles.kawung} aria-hidden="true" />

      <div style={styles.wrap}>
        <header style={styles.appBar}>
          <div style={styles.logo}>🩺</div>
          <span style={styles.appName}>Asisten Anamnesis <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>AI</em></span>
        </header>

        <div style={styles.card}>
          {/* Hero */}
          <div style={styles.hero}>
            <div style={styles.heroIcon}>🔑</div>
            <h1 style={styles.h1}>Hubungkan AI ke Aplikasi Ini</h1>
            <p style={styles.heroSub}>Ikuti 3 langkah mudah berikut. Hanya perlu dilakukan sekali.</p>
          </div>

          <hr style={styles.divider} />

          {/* Steps */}
          <p style={styles.eyebrow}>Cara Mendapatkan Kunci API</p>
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.badge}>1</div>
              <div style={styles.stepTitle}>Daftar di OpenRouter</div>
              <p style={styles.stepDesc}>Buka situs OpenRouter dan buat akun gratis. Tidak perlu kartu kredit.</p>
              <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={styles.stepLink}>Buka Situs →</a>
            </div>

            <div style={styles.step}>
              <div style={styles.badge}>2</div>
              <div style={styles.stepTitle}>Buat API Key</div>
              <p style={styles.stepDesc}>Di dashboard klik <strong>API Keys</strong> lalu klik tombol ini:</p>
              <div style={styles.dashMock} aria-hidden="true">
                <div style={styles.dashDots}>
                  <span style={{ ...styles.dot, background: '#FF5F57' }} />
                  <span style={{ ...styles.dot, background: '#FEBC2E' }} />
                  <span style={{ ...styles.dot, background: '#28C840' }} />
                </div>
                <div style={styles.dashNav}>
                  <span style={styles.navItem}>Models</span>
                  <span style={{ ...styles.navItem, ...styles.navActive }}>API Keys</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.dashBtn}>+ Create Key</span>
                  <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>← klik ini</span>
                </div>
              </div>
              <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" style={styles.stepLink}>Buka Halaman →</a>
            </div>

            <div style={styles.step}>
              <div style={styles.badge}>3</div>
              <div style={styles.stepTitle}>Tempel di Sini</div>
              <p style={styles.stepDesc}>Salin kunci yang muncul (dimulai dengan <code style={styles.code}>sk-or-...</code>) dan tempel di kolom bawah.</p>
            </div>
          </div>

          {/* Privacy */}
          <div style={styles.privacy}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
            <span>Kunci API Anda <strong>hanya disimpan di perangkat ini</strong> dan tidak pernah dikirim ke server manapun selain langsung ke OpenRouter.</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="apikey" style={styles.label}>
                Kunci API OpenRouter <span style={styles.labelHint}>(wajib)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="apikey"
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-or-v1-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  style={{ ...styles.input, paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  style={styles.eyeBtn}
                  aria-label={showKey ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
                >
                  {showKey ? '🙈' : '👁'}
                </button>
              </div>
              {error && <p style={styles.errorMsg}>{error}</p>}
            </div>

            <div style={styles.field}>
              <label htmlFor="model" style={styles.label}>
                Model AI <span style={styles.labelHint}>(pilih sesuai kebutuhan)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="model"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  style={styles.select}
                >
                  {MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <span style={styles.selectCaret}>▾</span>
              </div>
            </div>

            <hr style={styles.divider} />
            <button type="submit" style={styles.btnPrimary}>Simpan &amp; Mulai →</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const KAWUNG_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Ccircle cx='22' cy='9' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.13'/%3E%3Ccircle cx='22' cy='35' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.13'/%3E%3Ccircle cx='9' cy='22' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.13'/%3E%3Ccircle cx='35' cy='22' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.13'/%3E%3C/svg%3E")`

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 60px', position: 'relative' },
  kawung: { position: 'fixed', inset: 0, backgroundImage: KAWUNG_SVG, pointerEvents: 'none', zIndex: 0 },
  wrap: { position: 'relative', zIndex: 1, width: '100%', maxWidth: 660 },
  appBar: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logo: { width: 38, height: 38, background: 'var(--accent)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 2px 8px rgba(212,146,10,.35)' },
  appName: { fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' },
  card: { background: 'var(--surface)', borderRadius: 22, padding: '44px 40px', boxShadow: 'var(--shadow-card)' },
  hero: { textAlign: 'center', marginBottom: 32 },
  heroIcon: { width: 64, height: 64, background: 'var(--accent-light)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 16px', border: '1px solid rgba(212,146,10,.18)' },
  h1: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10, lineHeight: 1.2 },
  heroSub: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 400, margin: '0 auto' },
  divider: { border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' },
  eyebrow: { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 },
  step: { background: 'var(--ground)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '18px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 },
  badge: { width: 26, height: 26, background: 'var(--accent)', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(212,146,10,.4)' },
  stepTitle: { fontSize: 13, fontWeight: 700, lineHeight: 1.3 },
  stepDesc: { fontSize: 12, color: 'var(--muted)', lineHeight: 1.55, flex: 1 },
  stepLink: { fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', padding: '5px 10px', background: 'var(--accent-light)', borderRadius: 6, border: '1px solid rgba(212,146,10,.2)', alignSelf: 'flex-start' },
  dashMock: { background: '#161B2E', borderRadius: 7, padding: '8px 10px' },
  dashDots: { display: 'flex', gap: 4, marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: '50%' },
  dashNav: { display: 'flex', gap: 5, marginBottom: 7 },
  navItem: { fontSize: 8.5, color: 'rgba(255,255,255,.35)', padding: '2px 6px', borderRadius: 4 },
  navActive: { color: 'rgba(255,255,255,.9)', background: 'rgba(212,146,10,.25)' },
  dashBtn: { fontSize: 8.5, fontWeight: 700, background: 'var(--accent)', color: '#fff', padding: '3px 8px', borderRadius: 4 },
  code: { fontFamily: 'monospace', background: 'rgba(26,35,50,.07)', padding: '1px 4px', borderRadius: 3, fontSize: 11 },
  privacy: { background: 'var(--green-light)', border: '1.5px solid rgba(45,106,79,.2)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 28, fontSize: 13, color: '#1E4D38', lineHeight: 1.55 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 700 },
  labelHint: { fontSize: 12, color: 'var(--muted)', fontWeight: 400 },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--surface)' },
  eyeBtn: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--muted)', padding: 4 },
  errorMsg: { fontSize: 12, color: '#B91C1C' },
  select: { width: '100%', padding: '12px 36px 12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface)', appearance: 'none' },
  selectCaret: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', fontSize: 13 },
  btnPrimary: { width: '100%', padding: 15, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', boxShadow: '0 4px 14px rgba(212,146,10,.38)' },
}
