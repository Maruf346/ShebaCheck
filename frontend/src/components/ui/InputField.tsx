import { useId, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function InputField({
  label,
  hint,
  error,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="block">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-warm-900"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? `${inputId}-error` : "", hint ? `${inputId}-hint` : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`focus-ring min-h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-warm-900 placeholder:text-warm-500 ${
          error ? "border-red-300" : "border-warm-200"
        } ${className}`}
        {...props}
      />
      {error ? (
        <span
          id={`${inputId}-error`}
          className="mt-1.5 block text-xs font-medium text-red-700"
        >
          {error}
        </span>
      ) : null}
      {hint ? (
        <span
          id={`${inputId}-hint`}
          className="mt-1.5 block text-xs text-warm-500"
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
