import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-white hover:bg-forest-800 border-forest-700",
  secondary: "bg-white text-forest-800 hover:bg-forest-50 border-warm-200",
  ghost: "bg-transparent text-warm-700 hover:bg-warm-100 border-transparent",
  danger: "bg-red-700 text-white hover:bg-red-800 border-red-700"
};

export function Button({ children, className = "", variant = "primary", icon, ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
