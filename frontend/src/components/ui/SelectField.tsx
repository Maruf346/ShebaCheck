import { ChevronDown } from "lucide-react";
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
      <div className="relative">
        <select
          id={selectId}
          className={`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-warm-200 bg-white py-3 pl-3.5 pr-10 text-sm text-warm-900 shadow-sm transition-[border-color,box-shadow] hover:border-amber-400 focus:border-brand-amber focus:ring-2 focus:ring-amber-100 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
