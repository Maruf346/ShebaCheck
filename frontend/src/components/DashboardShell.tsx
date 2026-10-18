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
    <main className={`mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8 ${admin ? "text-slate-900" : ""}`}>
      <aside className={`${admin ? "admin-surface" : "surface"} h-fit p-3`}>
        <div className="border-b border-warm-200 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-700">{admin ? "Operations" : "Workspace"}</p>
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
          <p className="mt-1 text-sm leading-5 text-warm-600">{subtitle}</p>
        </div>
        <nav className="mt-3 grid gap-1" aria-label={`${title} navigation`}>
          {nav.map((item, index) => (
            <button
              key={item.label}
              className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                index === 0 ? "bg-forest-700 text-white" : "text-warm-700 hover:bg-warm-100"
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
