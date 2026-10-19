import { useState, type ReactNode } from "react";
import { LogOut, type LucideIcon } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

export function DashboardShell({
  title,
  subtitle,
  nav,
  children,
  admin = false
}: {
  title: string;
  subtitle: string;
  nav: { label: string; icon: LucideIcon; target: string }[];
  children: ReactNode;
  admin?: boolean;
}) {
  const [activeTarget, setActiveTarget] = useState(nav[0]?.target);
  const { user, logout } = useAuth();

  return (
    <main className="relative z-10 mx-auto grid min-w-0 max-w-7xl gap-6 px-4 py-5 text-brand-ink sm:gap-7 sm:px-6 sm:py-7 lg:px-8">
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">{admin ? "Operations workspace" : "Your workspace"}</p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.035em] text-warm-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-600 sm:text-[15px]">{subtitle}</p>
        </div>
        {user && (
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs font-semibold text-warm-600 sm:inline-block">
              Signed in as <strong className="text-warm-900">{user.first_name || user.email}</strong>
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </header>
      <nav className="scrollbar-none -mx-4 flex min-w-0 gap-1 overflow-x-auto border-y border-warm-200 bg-white/90 px-4 py-2 shadow-[0_3px_12px_rgb(120_53_15/4%)] sm:mx-0 sm:rounded-2xl sm:border sm:px-2" aria-label={`${title} navigation`}>
          {nav.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={activeTarget === item.target ? "page" : undefined}
              className={`focus-ring flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors sm:px-3.5 sm:text-sm ${
                activeTarget === item.target ? "bg-amber-50 text-amber-950" : "text-warm-600 hover:bg-warm-50 hover:text-warm-900"
              }`}
              onClick={() => {
                setActiveTarget(item.target);
                document.getElementById(item.target)?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                  block: "start",
                });
              }}
            >
              <item.icon className={`h-4 w-4 ${activeTarget === item.target ? "text-brand-amber" : "text-warm-500"}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
      </nav>
      <section className="min-w-0 space-y-6">{children}</section>
    </main>
  );
}
