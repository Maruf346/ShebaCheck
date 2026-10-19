import type { HTMLAttributes } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`surface transition-[border-color,box-shadow] duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
}
