import { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup'
import PatientChat from './components/PatientChat'
import DoctorView from './components/DoctorView'

function loadConfig() {
  try {
    const stored = localStorage.getItem('rme-api-config')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function App() {
  const [apiConfig, setApiConfig] = useState(loadConfig)
  const [view, setView] = useState(() => (loadConfig() ? 'patient' : 'setup'))
  const [symptoms, setSymptoms] = useState([])
  const [screeningResult, setScreeningResult] = useState(null)

  function handleApiSave(config) {
    setApiConfig(config)
    setView('patient')
  }

  function handleSymptom(gejala, nilai) {
    setSymptoms(s => [...s, { gejala, nilai }])
  }

  function handleFinalize(result) {
    setScreeningResult(result)
  }

  function handleHandoff() {
    setView('doctor')
  }

  function handleChangeSettings() {
    setView('setup')
  }

  if (view === 'setup') return <ApiKeySetup onSave={handleApiSave} />

  if (view === 'patient') return (
    <PatientChat
      apiConfig={apiConfig}
      onSymptom={handleSymptom}
      onFinalize={handleFinalize}
      screeningResult={screeningResult}
      onHandoff={handleHandoff}
    />
  )

  if (view === 'doctor') return (
    <DoctorView
      screeningResult={screeningResult}
      symptoms={symptoms}
      onChangeSettings={handleChangeSettings}
    />
  )
}
