interface SegmentOption {
  id: string
  label: string
}

interface IOSSegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (id: string) => void
}

export default function IOSSegmentedControl({ options, value, onChange }: IOSSegmentedControlProps) {
  return (
    <div className="ios-segmented">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`ios-segmented-item${value === opt.id ? ' active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
