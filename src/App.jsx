import { useState, useCallback } from 'react'
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
  const [chatKey, setChatKey] = useState(0)

  const handleApiSave = useCallback((config) => {
    setApiConfig(config)
    setView('patient')
  }, [])

  function handleSymptom(gejala, nilai) {
    setSymptoms(s => [...s, { gejala, nilai }])
  }

  const handleNewChat = useCallback(() => {
    setScreeningResult(null)
    setSymptoms([])
    setChatKey(k => k + 1)
    setView('patient')
  }, [])

  function handleFinalize(result) {
    setScreeningResult(result)
  }

  function handleHandoff() {
    setView('doctor')
  }

  function handleChangeSettings() {
    setView('setup')
  }

  if (view === 'setup') return (
    <ApiKeySetup
      onSave={handleApiSave}
      initialConfig={apiConfig}
    />
  )

  if (view === 'patient') return (
    <PatientChat
      key={chatKey}
      apiConfig={apiConfig}
      onSymptom={handleSymptom}
      onFinalize={handleFinalize}
      screeningResult={screeningResult}
      onHandoff={handleHandoff}
      onNewChat={handleNewChat}
      onChangeSettings={handleChangeSettings}
    />
  )

  if (view === 'doctor') return (
    <DoctorView
      screeningResult={screeningResult}
      symptoms={symptoms}
      onNewChat={handleNewChat}
      onChangeSettings={handleChangeSettings}
    />
  )
}
