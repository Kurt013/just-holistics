'use client';

interface Props {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ options, selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === opt.value
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:border-green-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}