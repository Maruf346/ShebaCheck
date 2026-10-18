import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export function SelectField({ label, options, className = "", ...props }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-warm-900">{label}</span>
      <select
        className={`focus-ring min-h-12 w-full rounded-xl border border-warm-200 bg-white px-3.5 text-sm text-warm-900 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
