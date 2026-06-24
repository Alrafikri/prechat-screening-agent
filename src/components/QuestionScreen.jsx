import YesNo from './YesNo'
import SingleChoice from './SingleChoice'
import MultipleChoice from './MultipleChoice'
import RatingScale from './RatingScale'
import FreetextInput from './FreetextInput'

export default function QuestionScreen({ question, onSubmit, isLoading }) {
  if (!question) return null

  const { format, teks } = question

  function renderInput() {
    switch (format) {
      case 'yesno':
        return <YesNo onSubmit={onSubmit} isLoading={isLoading} />
      case 'single_choice':
        return <SingleChoice pilihan={question.pilihan} onSubmit={onSubmit} isLoading={isLoading} />
      case 'multiple_choice':
        return <MultipleChoice pilihan={question.pilihan} onSubmit={onSubmit} isLoading={isLoading} />
      case 'rating':
        return <RatingScale skalaMin={question.skalaMin} skalaMax={question.skalaMax} labelMin={question.labelMin} labelMax={question.labelMax} onSubmit={onSubmit} isLoading={isLoading} />
      case 'freetext':
        return <FreetextInput onSubmit={onSubmit} isLoading={isLoading} />
      default:
        return <FreetextInput onSubmit={onSubmit} isLoading={isLoading} />
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.teks}>{teks}</p>
        {renderInput()}
        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 20,
    padding: '32px 28px',
    maxWidth: 480,
    width: '100%',
    margin: '0 auto',
    boxShadow: '0 4px 24px rgba(26,35,50,.06)',
    animation: 'fadeSlide 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  teks: {
    fontSize: 16,
    lineHeight: 1.7,
    fontWeight: 600,
    color: 'var(--text)',
  },
}
