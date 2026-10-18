import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function InputField({ label, hint, error, className = "", ...props }: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-warm-900">{label}</span>
      <input
        className={`focus-ring min-h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-warm-900 placeholder:text-warm-500 ${
          error ? "border-red-300" : "border-warm-200"
        } ${className}`}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-red-700">{error}</span> : null}
      {hint ? <span className="mt-1.5 block text-xs text-warm-500">{hint}</span> : null}
    </label>
  );
}
