import { Zap } from "lucide-react";

export function HomeBrand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`home-brand${footer ? " home-brand--footer" : ""}`}>
      <span className="home-brand-mark">
        <Zap size={23} fill="currentColor" aria-hidden="true" />
      </span>
      <span>
        Sheba<span className="home-brand-accent">Check</span>
      </span>
    </span>
  );
}
