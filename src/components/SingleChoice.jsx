import { useState } from 'react'

export default function SingleChoice({ pilihan = [], onSubmit, isLoading }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={styles.wrapper}>
      <div style={styles.options}>
        {pilihan.map((p) => (
          <button
            key={p}
            style={{ ...styles.option, ...(selected === p ? styles.optionSelected : {}) }}
            onClick={() => !isLoading && setSelected(p)}
            disabled={isLoading}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        style={{ ...styles.button, opacity: !selected || isLoading ? 0.5 : 1 }}
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
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  option: { padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, textAlign: 'left', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' },
  optionSelected: { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: '#8A5E0A', fontWeight: 700 },
  button: { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, boxShadow: '0 3px 10px rgba(212,146,10,.35)', cursor: 'pointer' },
}
