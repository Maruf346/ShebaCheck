import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../types";
import { Button } from "./ui/Button";

const links: { label: string; page: AppPage }[] = [
  { label: "Find Services", page: "search" },
  { label: "How It Works", page: "home" },
  { label: "Become a Provider", page: "provider-dashboard" },
  { label: "Sign In", page: "customer-dashboard" }
];

export function AppShell({
  page,
  setPage,
  children
}: {
  page: AppPage;
  setPage: (page: AppPage) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isAdmin = page === "admin-dashboard" || page === "provider-dashboard";

  return (
    <div className={isAdmin ? "min-h-screen bg-slate-50" : "min-h-screen bg-warm-50"}>
      <header className={`${isAdmin ? "border-slate-200 bg-white" : "border-warm-200 bg-white/95"} sticky top-0 z-50 border-b backdrop-blur`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="focus-ring flex items-center gap-2 rounded-xl text-left"
            onClick={() => setPage("home")}
            aria-label="Go to ShebaCheck homepage"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800 text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight text-warm-900">ShebaCheck</span>
              <span className="block text-xs font-semibold text-forest-700">Demo UI</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {links.map((link) => (
              <button
                key={link.label}
                className={`focus-ring rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  page === link.page ? "bg-forest-50 text-forest-800" : "text-warm-700 hover:bg-warm-100"
                }`}
                onClick={() => setPage(link.page)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="secondary" onClick={() => setPage("admin-dashboard")}>
              Admin demo
            </Button>
            <Button onClick={() => setPage("booking")}>Book a service</Button>
          </div>

          <button
            className="focus-ring rounded-xl border border-warm-200 p-2 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-warm-200 bg-white px-4 py-3 lg:hidden">
            <div className="grid gap-2">
              {links.map((link) => (
                <button
                  key={link.label}
                  className="focus-ring rounded-xl px-3 py-2 text-left text-sm font-semibold text-warm-800 hover:bg-warm-100"
                  onClick={() => {
                    setPage(link.page);
                    setOpen(false);
                  }}
                >
                  {link.label}
                </button>
              ))}
              <Button onClick={() => setPage("booking")}>Book a service</Button>
            </div>
          </div>
        ) : null}
      </header>
      {children}
    </div>
  );
}
