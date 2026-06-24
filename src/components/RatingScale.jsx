import { useState } from 'react'

export default function RatingScale({ skalaMin = 1, skalaMax = 10, labelMin, labelMax, onSubmit, isLoading }) {
  const [selected, setSelected] = useState(null)

  const numbers = []
  for (let i = skalaMin; i <= skalaMax; i++) numbers.push(i)

  return (
    <div style={styles.wrapper}>
      <div style={styles.scale}>
        {numbers.map((n) => (
          <button
            key={n}
            style={{ ...styles.num, ...(selected === n ? styles.numSelected : {}) }}
            onClick={() => !isLoading && setSelected(n)}
            disabled={isLoading}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={styles.labels}>
        {labelMin && <span style={styles.label}>{labelMin}</span>}
        {labelMax && <span style={styles.label}>{labelMax}</span>}
      </div>
      <button
        style={{ ...styles.lanjut, opacity: selected === null || isLoading ? 0.5 : 1 }}
        disabled={selected === null || isLoading}
        onClick={() => onSubmit(selected)}
      >
        {isLoading ? 'Memproses...' : 'Lanjut'}
      </button>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 14 },
  scale: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  num: { width: 42, height: 42, borderRadius: '50%', background: 'var(--surface)', border: '1.5px solid var(--border)', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' },
  numSelected: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
  labels: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' },
  label: { fontSize: 12, color: 'var(--muted)' },
  lanjut: { alignSelf: 'flex-end', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, boxShadow: '0 3px 10px rgba(212,146,10,.35)', cursor: 'pointer' },
}
