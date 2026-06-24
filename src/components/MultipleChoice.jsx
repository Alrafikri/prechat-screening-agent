import { useState } from 'react'

export default function MultipleChoice({ pilihan = [], onSubmit, isLoading }) {
  const [selected, setSelected] = useState([])

  function toggle(opt) {
    if (isLoading) return
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    )
  }

  const count = selected.length

  return (
    <div style={styles.wrapper}>
      <div style={styles.options}>
        {pilihan.map((p) => {
          const isSelected = selected.includes(p)
          return (
            <button
              key={p}
              style={{ ...styles.option, ...(isSelected ? styles.optionSelected : {}) }}
              onClick={() => toggle(p)}
              disabled={isLoading}
            >
              <span style={styles.checkbox}>{isSelected ? '☑' : '☐'}</span>
              {p}
            </button>
          )
        })}
      </div>
      <button
        style={{ ...styles.button, opacity: count === 0 || isLoading ? 0.5 : 1 }}
        disabled={count === 0 || isLoading}
        onClick={() => onSubmit(selected)}
      >
        {isLoading ? 'Memproses...' : `Lanjut (${count} dipilih)`}
      </button>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 14 },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  option: { padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, textAlign: 'left', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 },
  optionSelected: { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: '#8A5E0A', fontWeight: 700 },
  checkbox: { fontSize: 18, width: 22, textAlign: 'center' },
  button: { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, boxShadow: '0 3px 10px rgba(212,146,10,.35)', cursor: 'pointer' },
}
