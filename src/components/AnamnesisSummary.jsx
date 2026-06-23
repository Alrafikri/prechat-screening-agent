export default function AnamnesisSummary({ symptoms }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <p style={styles.eyebrow}>Ringkasan AI</p>
        <h2 style={styles.panelTitle}>Gejala Tercatat</h2>
      </div>
      <div style={styles.panelBody}>
        {symptoms.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Belum ada gejala tercatat.</p>
        )}
        {symptoms.map((s, i) => (
          <div key={i} style={styles.item}>
            <span style={styles.dot} />
            <div>
              <div style={styles.itemKey}>{s.gejala}</div>
              <div style={styles.itemVal}>{s.nilai}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  panel: { background: 'var(--surface)', borderRight: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  panelHeader: { padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)' },
  eyebrow: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 },
  panelTitle: { fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' },
  panelBody: { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 },
  item: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 },
  itemKey: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: 2 },
  itemVal: { fontSize: 13.5, lineHeight: 1.45 },
}
