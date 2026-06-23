export default function DoctorCard({ dokter, alasan }) {
  if (!dokter) return null
  return (
    <div style={styles.wrap}>
      <div style={styles.avatar}>{dokter.nama.startsWith('dr.') ? '👨‍⚕️' : '👩‍⚕️'}</div>
      <div style={styles.info}>
        <div style={styles.name}>{dokter.nama}</div>
        <div style={styles.spec}>{dokter.bio}</div>
      </div>
      {alasan && <p style={styles.reason}>✦ {alasan}</p>}
    </div>
  )
}

const styles = {
  wrap: { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(26,35,50,.06)' },
  avatar: { width: 48, height: 48, borderRadius: 14, background: 'var(--accent-light)', border: '1.5px solid rgba(212,146,10,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 3 },
  spec: { fontSize: 12.5, color: 'var(--muted)' },
  reason: { width: '100%', fontSize: 12, color: 'var(--green)', background: 'var(--green-light)', border: '1px solid rgba(45,106,79,.2)', borderRadius: 6, padding: '8px 12px', lineHeight: 1.5 },
}
