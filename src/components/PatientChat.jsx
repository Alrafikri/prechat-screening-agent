import { useState, useEffect, useRef } from 'react'
import { useAgentLoop } from '../hooks/useAgentLoop'

export default function PatientChat({ apiConfig, onSymptom, onFinalize, screeningResult, onHandoff }) {
  const [chatMessages, setChatMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const { sendMessage, autoStart, isLoading } = useAgentLoop({
    apiKey: apiConfig.apiKey,
    model: apiConfig.model,
    onAiMessage: (text) => setChatMessages(m => [...m, { from: 'ai', text }]),
    onSymptom,
    onFinalize,
  })

  useEffect(() => { autoStart() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isLoading])

  function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading || screeningResult) return
    setChatMessages(m => [...m, { from: 'patient', text }])
    setInput('')
    sendMessage(text)
  }

  return (
    <div style={styles.page}>
      <div style={styles.kawung} aria-hidden="true" />

      {/* Top bar */}
      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <div style={styles.logo}>🩺</div>
          <div>
            <div style={styles.title}>Skrining Awal</div>
            <div style={styles.sub}>Asisten Perawat AI</div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div style={styles.chat}>
        {chatMessages.map((msg, i) => (
          <div key={i} style={msg.from === 'ai' ? styles.rowAi : styles.rowPatient}>
            {msg.from === 'ai' && <div style={styles.avatarAi}>👩‍⚕️</div>}
            <div style={msg.from === 'ai' ? styles.bubbleAi : styles.bubblePatient}>
              {msg.text}
            </div>
            {msg.from === 'patient' && <div style={styles.avatarPatient}>🧑</div>}
          </div>
        ))}

        {isLoading && (
          <div style={styles.rowAi}>
            <div style={styles.avatarAi}>👩‍⚕️</div>
            <div style={styles.typing}>
              <span style={styles.dot} />
              <span style={{ ...styles.dot, animationDelay: '0.18s' }} />
              <span style={{ ...styles.dot, animationDelay: '0.36s' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        {screeningResult && (
          <div style={styles.handoffBanner}>
            <span style={styles.handoffText}>✓ Skrining selesai — ringkasan siap untuk dokter</span>
            <button style={styles.handoffBtn} onClick={onHandoff}>Serahkan ke Dokter →</button>
          </div>
        )}
        <form onSubmit={handleSend} style={styles.inputRow}>
          <input
            style={styles.chatInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={screeningResult ? 'Skrining selesai' : 'Ketik jawaban Anda…'}
            disabled={isLoading || !!screeningResult}
          />
          <button type="submit" style={styles.sendBtn} disabled={isLoading || !!screeningResult} aria-label="Kirim">➤</button>
        </form>
      </div>

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
  page: { height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  kawung: { position: 'fixed', inset: 0, backgroundImage: KAWUNG_SVG, pointerEvents: 'none', zIndex: 0 },
  topbar: { position: 'relative', zIndex: 10, background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, background: 'var(--accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 2px 6px rgba(212,146,10,.3)', flexShrink: 0 },
  title: { fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' },
  sub: { fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 },
  chat: { flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 },
  rowAi: { display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: 'flex-start', maxWidth: '80%' },
  rowPatient: { display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: 'flex-end', flexDirection: 'row-reverse', maxWidth: '80%' },
  avatarAi: { width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-light)', border: '1.5px solid rgba(212,146,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
  avatarPatient: { width: 30, height: 30, borderRadius: '50%', background: '#E8F0FF', border: '1.5px solid rgba(59,130,246,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
  bubbleAi: { padding: '12px 16px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '16px 16px 16px 4px', fontSize: 14, lineHeight: 1.6, boxShadow: '0 1px 4px rgba(26,35,50,.06)' },
  bubblePatient: { padding: '12px 16px', background: 'var(--accent)', color: '#fff', borderRadius: '16px 16px 4px 16px', fontSize: 14, lineHeight: 1.6, boxShadow: '0 2px 8px rgba(212,146,10,.3)' },
  typing: { padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 5, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block', animation: 'bounce 1.1s ease-in-out infinite' },
  bottomBar: { position: 'relative', zIndex: 10, background: 'var(--surface)', borderTop: '1.5px solid var(--border)', padding: '12px 16px', flexShrink: 0 },
  handoffBanner: { background: 'var(--green-light)', border: '1.5px solid rgba(45,106,79,.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  handoffText: { fontSize: 13, color: '#1E4D38', fontWeight: 600 },
  handoffBtn: { background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 800, boxShadow: '0 3px 10px rgba(45,106,79,.35)', whiteSpace: 'nowrap' },
  inputRow: { display: 'flex', alignItems: 'center', gap: 8 },
  chatInput: { flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, outline: 'none', background: 'var(--ground)' },
  sendBtn: { width: 46, height: 46, background: 'var(--accent)', border: 'none', borderRadius: 10, fontSize: 18, color: '#fff', flexShrink: 0, boxShadow: '0 3px 10px rgba(212,146,10,.35)' },
}
