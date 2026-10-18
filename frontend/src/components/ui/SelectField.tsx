import { useId, type SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export function SelectField({
  label,
  options,
  className = "",
  id,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="block">
      <label
        htmlFor={selectId}
        className="mb-2 block text-sm font-semibold text-warm-900"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`focus-ring min-h-12 w-full rounded-xl border border-warm-200 bg-white px-3.5 text-sm text-warm-900 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
