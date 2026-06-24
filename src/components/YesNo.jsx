import { useState } from 'react'

export default function YesNo({ onSubmit, isLoading }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={styles.wrapper}>
      <div style={styles.buttons}>
        {['Ya', 'Tidak'].map((opt) => (
          <button
            key={opt}
            style={{ ...styles.btn, ...(selected === opt ? styles.btnSelected : {}) }}
            onClick={() => !isLoading && setSelected(opt)}
            disabled={isLoading}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        style={{ ...styles.lanjut, opacity: !selected || isLoading ? 0.5 : 1 }}
        disabled={!selected || isLoading}
        onClick={() => onSubmit(selected)}
      >
        {isLoading ? 'Memproses...' : 'Lanjut'}
      </button>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 14 },
  buttons: { display: 'flex', gap: 12 },
  btn: { flex: 1, padding: '16px 0', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' },
  btnSelected: { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: '#8A5E0A' },
  lanjut: { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, boxShadow: '0 3px 10px rgba(212,146,10,.35)', cursor: 'pointer' },
}
