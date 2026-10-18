import type { LucideIcon } from "lucide-react";

export function DashboardShell({
  title,
  subtitle,
  nav,
  children,
  admin = false
}: {
  title: string;
  subtitle: string;
  nav: { label: string; icon: LucideIcon }[];
  children: React.ReactNode;
  admin?: boolean;
}) {
  return (
    <main className={`mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 ${admin ? "text-warm-900" : ""}`}>
      <aside className={`${admin ? "admin-surface" : "surface"} h-fit min-w-0 p-3`}>
        <div className="border-b border-warm-200 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">{admin ? "Operations" : "Workspace"}</p>
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
          <p className="mt-1 text-sm leading-5 text-warm-600">{subtitle}</p>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible" aria-label={`${title} navigation`}>
          {nav.map((item, index) => (
            <button
              key={item.label}
              className={`focus-ring flex min-h-10 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors lg:w-full ${
                index === 0 ? "bg-brand-amber text-white shadow-home-button" : "text-warm-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </main>
  );
}
