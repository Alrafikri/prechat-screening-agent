import { useState, useRef, useEffect } from 'react'

export default function FreetextInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  return (
    <div style={styles.wrapper}>
      <textarea
        ref={inputRef}
        style={styles.textarea}
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={3}
        disabled={isLoading}
      />
      <button
        style={{ ...styles.button, opacity: !value.trim() || isLoading ? 0.5 : 1 }}
        disabled={!value.trim() || isLoading}
        onClick={() => onSubmit(value.trim())}
      >
        {isLoading ? 'Memproses...' : 'Lanjut'}
      </button>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 14 },
  textarea: { width: '100%', padding: '14px 16px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'inherit', background: 'var(--ground)' },
  button: { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, boxShadow: '0 3px 10px rgba(212,146,10,.35)', cursor: 'pointer' },
}
