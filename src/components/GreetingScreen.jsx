import { useState, useRef, useEffect } from 'react'

export default function GreetingScreen({ onKeluhanSubmit, isLoading }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const hour = new Date().getHours()
  const waktu = hour < 12 ? 'pagi' : hour < 18 ? 'sore' : 'malam'

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onKeluhanSubmit(value.trim())
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>👩‍⚕️</div>
        <p style={styles.greeting}>
          Selamat {waktu}, saya Perawat Sari. Apakah bisa diberitahu keluhan yang dirasakan?
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            ref={inputRef}
            style={styles.textarea}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Tulis keluhan Anda di sini..."
            rows={4}
            disabled={isLoading}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: !value.trim() || isLoading ? 0.5 : 1,
            }}
            disabled={!value.trim() || isLoading}
          >
            {isLoading ? 'Memproses...' : 'Lanjut'}
          </button>
        </form>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 20,
    padding: '32px 28px',
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 4px 24px rgba(26,35,50,.06)',
    animation: 'fadeIn 0.35s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  avatar: {
    fontSize: 40,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 16,
    lineHeight: 1.7,
    textAlign: 'center',
    color: 'var(--text)',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.6,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    background: 'var(--ground)',
  },
  button: {
    alignSelf: 'flex-end',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 800,
    boxShadow: '0 3px 10px rgba(212,146,10,.35)',
    cursor: 'pointer',
  },
}
