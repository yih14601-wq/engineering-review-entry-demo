import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  LockKeyhole,
} from 'lucide-react'
import type { FieldDefinition } from './data'

const formatAmount = (value: number) =>
  value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

function AmountStepper({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition
  value: string
  onChange: (next: string) => void
}) {
  const parsedValue = Number(value.replace(/,/g, '')) || 0
  const step = field.step ?? 1000
  const updateBy = (direction: 1 | -1) => {
    onChange(formatAmount(Math.max(0, parsedValue + direction * step)))
  }

  return (
    <div className="amount-control">
      <input
        id={field.id}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="amount-unit">元</span>
      <div className="stepper-buttons">
        <button
          type="button"
          title={`增加 ${step} 元`}
          aria-label={`增加 ${step} 元`}
          onClick={() => updateBy(1)}
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          title={`减少 ${step} 元`}
          aria-label={`减少 ${step} 元`}
          onClick={() => updateBy(-1)}
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  )
}

export default function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition
  value: string
  onChange: (next: string) => void
}) {
  if (field.kind === 'amount') {
    return (
      <div className="form-field">
        <label htmlFor={field.id}>{field.label}</label>
        <AmountStepper field={field} value={value} onChange={onChange} />
      </div>
    )
  }

  if (field.kind === 'readonly') {
    return (
      <div className="form-field">
        <span className="field-label">{field.label}</span>
        <div className="readonly-control" tabIndex={0} aria-readonly="true">
          <span>{value}</span>
          <LockKeyhole size={16} aria-label="只读" />
        </div>
      </div>
    )
  }

  if (field.kind === 'select') {
    return (
      <div className="form-field">
        <label htmlFor={field.id}>{field.label}</label>
        <div className="select-control">
          <select
            id={field.id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className="form-field">
      <label htmlFor={field.id}>{field.label}</label>
      <div className={field.kind === 'date' ? 'date-control' : 'plain-control'}>
        <input
          id={field.id}
          type={field.kind === 'date' ? 'date' : 'text'}
          inputMode={field.kind === 'number' ? 'decimal' : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.kind === 'date' && <CalendarDays size={16} aria-hidden="true" />}
      </div>
    </div>
  )
}

export function FieldGrid({
  fields,
  values,
  onChange,
  contract = false,
}: {
  fields: FieldDefinition[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
  contract?: boolean
}) {
  return (
    <div className={`field-grid${contract ? ' is-contract' : ''}`}>
      {fields.map((item) => (
        <FormField
          key={item.id}
          field={item}
          value={values[item.id] ?? item.value}
          onChange={(value) => onChange(item.id, value)}
        />
      ))}
    </div>
  )
}
