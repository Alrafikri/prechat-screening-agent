import { useQuestionnaire } from '../hooks/useQuestionnaire'
import GreetingScreen from './GreetingScreen'
import QuestionScreen from './QuestionScreen'

export default function QuestionnaireFlow({ apiConfig, onFinalize, screeningResult, onHandoff, onNewChat, onChangeSettings }) {
  const { phase, currentQuestion, isLoading, error, submitKeluhan, submitAnswer, retry } = useQuestionnaire({
    apiConfig,
    onFinalize,
  })

  function handleKeluhanSubmit(text) {
    submitKeluhan(text)
  }

  function handleAnswer(value) {
    submitAnswer(value)
  }

  return (
    <div style={styles.page}>
      <div style={styles.kawung} aria-hidden="true" />

      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <div style={styles.logo}>🩺</div>
          <div>
            <div style={styles.title}>Skrining Awal</div>
            <div style={styles.sub}>Asisten Perawat AI</div>
          </div>
        </div>
        <button style={styles.settingsBtn} onClick={onChangeSettings} aria-label="Pengaturan">⚙</button>
      </header>

      {screeningResult && (
        <div style={styles.banner}>
          <span style={styles.bannerText}>✓ Skrining selesai</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.bannerBtn} onClick={onNewChat}>🔄 Baru</button>
            <button style={styles.bannerBtn} onClick={onHandoff}>Serahkan ke Dokter →</button>
          </div>
        </div>
      )}

      {!screeningResult && (
        <div style={styles.body}>
          {phase === 'greeting' && (
            <GreetingScreen onKeluhanSubmit={handleKeluhanSubmit} isLoading={isLoading} />
          )}

          {phase === 'question_loop' && currentQuestion && !error && (
            <QuestionScreen
              question={currentQuestion}
              onSubmit={handleAnswer}
              isLoading={isLoading}
            />
          )}

          {error && (
            <div style={styles.errorContainer}>
              <div style={styles.errorCard}>
                <p style={styles.errorText}>{error}</p>
                <button style={styles.retryBtn} onClick={retry} disabled={isLoading}>
                  {isLoading ? 'Memproses...' : 'Coba Lagi'}
                </button>
              </div>
            </div>
          )}

          {isLoading && !error && phase !== 'greeting' && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingDots}>
                <span style={styles.dot} />
                <span style={{ ...styles.dot, animationDelay: '0.18s' }} />
                <span style={{ ...styles.dot, animationDelay: '0.36s' }} />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,80%,100%{transform:translateY(0);opacity:.5}
          40%{transform:translateY(-5px);opacity:1}
        }
      `}</style>
    </div>
  )
}

const KAWUNG_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Ccircle cx='22' cy='9' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.08'/%3E%3Ccircle cx='22' cy='35' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.08'/%3E%3Ccircle cx='9' cy='22' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.08'/%3E%3Ccircle cx='35' cy='22' r='5.5' fill='none' stroke='%23D4920A' stroke-width='0.7' opacity='0.08'/%3E%3C/svg%3E")`

const styles = {
  page: { height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  kawung: { position: 'fixed', inset: 0, backgroundImage: KAWUNG_SVG, pointerEvents: 'none', zIndex: 0 },
  topbar: { position: 'relative', zIndex: 10, background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  settingsBtn: { fontSize: 16, color: 'var(--muted)', background: 'var(--ground)', border: '1.5px solid var(--border)', borderRadius: 7, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  logo: { width: 34, height: 34, background: 'var(--accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 2px 6px rgba(212,146,10,.3)', flexShrink: 0 },
  title: { fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' },
  sub: { fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 },
  body: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 },
  banner: { position: 'relative', zIndex: 10, background: 'var(--green-light)', borderBottom: '1.5px solid rgba(45,106,79,.25)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 },
  bannerText: { fontSize: 13, color: '#1E4D38', fontWeight: 600 },
  bannerBtn: { background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 800, boxShadow: '0 3px 10px rgba(45,106,79,.35)', whiteSpace: 'nowrap', cursor: 'pointer' },
  errorContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorCard: { background: '#FFF0F0', border: '1.5px solid #FFCCCC', borderRadius: 16, padding: '24px 28px', maxWidth: 400, textAlign: 'center' },
  errorText: { fontSize: 14, color: '#CC3333', marginBottom: 16, lineHeight: 1.6 },
  retryBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer' },
  loadingContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingDots: { display: 'flex', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block', animation: 'bounce 1.1s ease-in-out infinite' },
}
