export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface ${className}`}>{children}</div>;
}
