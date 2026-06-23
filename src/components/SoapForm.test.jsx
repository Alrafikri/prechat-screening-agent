import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SoapForm from './SoapForm'

const initial = {
  keluhan: 'Demam 3 hari',
  anamnesis: 'Demam naik turun sejak 3 hari',
  diagnosis: 'Suspek dengue fever',
  icd10: 'A90',
}

describe('SoapForm', () => {
  it('renders all 4 prefilled fields', () => {
    render(<SoapForm initialValues={initial} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Demam 3 hari')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Suspek dengue fever')).toBeInTheDocument()
    expect(screen.getByDisplayValue('A90')).toBeInTheDocument()
  })

  it('calls onChange when a field is edited', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SoapForm initialValues={initial} onChange={onChange} />)
    const keluhan = screen.getByDisplayValue('Demam 3 hari')
    await user.clear(keluhan)
    await user.type(keluhan, 'Batuk pilek')
    expect(onChange).toHaveBeenCalledWith('keluhan', expect.stringContaining('Batuk'))
  })
})
