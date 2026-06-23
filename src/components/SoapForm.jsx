import { useState } from 'react'

export default function SoapForm({ initialValues, onChange }) {
  const [vals, setVals] = useState(initialValues)

  function update(field, value) {
    setVals(v => ({ ...v, [field]: value }))
    onChange(field, value)
  }

  return (
    <div style={styles.form}>
      <Field label="Keluhan Utama" hint="Diisi AI" id="keluhan">
        <textarea rows={2} value={vals.keluhan} onChange={e => update('keluhan', e.target.value)} style={styles.textarea} />
      </Field>
      <Field label="Anamnesis" hint="Diisi AI" id="anamnesis">
        <textarea rows={4} value={vals.anamnesis} onChange={e => update('anamnesis', e.target.value)} style={styles.textarea} />
      </Field>
      <hr style={styles.divider} />
      <Field label="Diagnosis Sementara" hint="Saran AI" id="diagnosis">
        <textarea rows={2} value={vals.diagnosis} onChange={e => update('diagnosis', e.target.value)} style={styles.textarea} />
      </Field>
      <Field label="Kode ICD-10" hint="Saran AI" id="icd10">
        <input type="text" value={vals.icd10} onChange={e => update('icd10', e.target.value)} style={{ ...styles.textarea, resize: 'none', width: 140 }} />
      </Field>
    </div>
  )
}

function Field({ label, hint, id, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        {label}
        <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--accent-light)', color: '#8A5E0A', border: '1px solid rgba(212,146,10,.2)', borderRadius: 4, padding: '2px 6px' }}>
          {hint}
        </span>
      </label>
      {children}
    </div>
  )
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  textarea: { width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 13.5, lineHeight: 1.6, outline: 'none', resize: 'vertical' },
  divider: { border: 'none', borderTop: '1px solid var(--border)' },
}
