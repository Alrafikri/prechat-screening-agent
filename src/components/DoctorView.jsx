import { useState } from 'react'
import AnamnesisSummary from './AnamnesisSummary'
import SoapForm from './SoapForm'
import DoctorCard from './DoctorCard'
import { matchDoctor } from '../lib/matchDoctor'
import dokterList from '../data/dokter.json'

export default function DoctorView({ screeningResult, symptoms, onChangeSettings, onNewChat }) {
  const { ringkasan, diagnosis, kode_icd10, spesialisasi, alasan_rekomendasi } = screeningResult
  const dokter = matchDoctor(spesialisasi, dokterList)

  const [soapVals, setSoapVals] = useState({
    keluhan: ringkasan.split('.')[0],
    anamnesis: ringkasan,
    diagnosis,
    icd10: kode_icd10,
  })
  const [copied, setCopied] = useState(false)

  function handleChange(field, value) {
    setSoapVals(v => ({ ...v, [field]: value }))
  }

  function handleCopy() {
    const text = [
      'REKAM MEDIS ELEKTRONIK',
      '======================',
      `Keluhan Utama: ${soapVals.keluhan}`,
      `Anamnesis: ${soapVals.anamnesis}`,
      `Diagnosis Sementara: ${soapVals.diagnosis}`,
      `Kode ICD-10: ${soapVals.icd10}`,
      dokter ? `Dokter: ${dokter.nama}` : '',
    ].filter(Boolean).join('\n')

    if (!navigator.clipboard) {
      alert('Gagal menyalin. Silakan salin teks secara manual.')
      return
    }
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => { alert('Gagal menyalin. Silakan salin teks secara manual.') })
  }

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <div style={styles.logo}>🩺</div>
          <div style={styles.title}>Tinjauan Dokter</div>
          <span style={styles.badge}>✓ Skrining Selesai</span>
        </div>
        <div style={styles.topbarRight}>
          <button style={styles.settingsBtn} onClick={onNewChat}>🔄 Baru</button>
          <button style={styles.settingsBtn} onClick={onChangeSettings}>⚙ Pengaturan</button>
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Tersalin!' : '📋 Salin RME'}
          </button>
        </div>
      </header>

      {/* Main split */}
      <div style={styles.main}>
        <AnamnesisSummary symptoms={symptoms} />

        <div style={styles.rightPanel}>
          <div style={styles.soapHeader}>
            <div>
              <h2 style={styles.soapTitle}>Rekam Medis Elektronik</h2>
              <p style={styles.soapSub}>Draf oleh AI — periksa dan edit sebelum menyimpan</p>
            </div>
            <span style={styles.aiBadge}>✦ Diisi oleh AI</span>
          </div>

          <SoapForm initialValues={soapVals} onChange={handleChange} />

          <hr style={styles.divider} />

          <div>
            <p style={styles.sectionLabel}>Rekomendasi Dokter</p>
            <DoctorCard dokter={dokter} alasan={alasan_rekomendasi} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  title: { fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' },
  badge: { fontSize: 11, fontWeight: 700, background: 'var(--green-light)', color: 'var(--green)', border: '1px solid rgba(45,106,79,.25)', borderRadius: 20, padding: '3px 10px' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 8 },
  settingsBtn: { fontSize: 12, color: 'var(--muted)', background: 'var(--ground)', border: '1.5px solid var(--border)', borderRadius: 7, padding: '6px 12px', fontWeight: 600 },
  copyBtn: { background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 800, boxShadow: '0 3px 10px rgba(26,35,50,.25)' },
  main: { flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' },
  rightPanel: { overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  soapHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  soapTitle: { fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' },
  soapSub: { fontSize: 12.5, color: 'var(--muted)', marginTop: 2 },
  aiBadge: { fontSize: 11, fontWeight: 700, background: 'var(--accent-light)', color: '#8A5E0A', border: '1px solid rgba(212,146,10,.25)', borderRadius: 6, padding: '4px 10px', flexShrink: 0 },
  divider: { border: 'none', borderTop: '1px solid var(--border)' },
  sectionLabel: { fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 10 },
}
