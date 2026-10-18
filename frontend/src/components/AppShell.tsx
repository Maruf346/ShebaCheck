import {
  BriefcaseBusiness,
  CalendarDays,
  Gauge,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../types";
import { HomeBrand } from "./home/HomeBrand";
import { Button } from "./ui/Button";

const links: { label: string; page: AppPage; icon: typeof Search }[] = [
  { label: "Find Services", page: "search", icon: Search },
  { label: "How It Works", page: "home", icon: ShieldCheck },
  {
    label: "Become a Provider",
    page: "provider-dashboard",
    icon: BriefcaseBusiness,
  },
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
  if (page === "home") return <>{children}</>;

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="sticky top-3 z-50 mx-auto max-w-marketplace px-4 md:top-4 md:px-8">
        <div className="flex min-h-16 items-center gap-3 rounded-full border border-white bg-white px-4 py-2.5 shadow-home-header md:min-h-[70px] md:gap-5 md:px-5 md:py-3 wide:gap-8 wide:px-6">
          <button
            className="focus-ring shrink-0 rounded-lg text-left"
            onClick={() => setPage("home")}
            aria-label="Go to ShebaCheck homepage"
          >
            <HomeBrand />
          </button>

          <nav className="hidden items-center gap-4 whitespace-nowrap lg:flex wide:gap-6" aria-label="Primary navigation">
            {links.map((link) => (
              <button
                key={link.label}
                className={`focus-ring inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors ${
                  page === link.page ? "text-brand-ink" : "text-warm-600 hover:text-brand-ink"
                }`}
                onClick={() => setPage(link.page)}
              >
                <link.icon className="h-4 w-4 text-brand-amber" aria-hidden="true" />
                {link.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <Button variant="secondary" onClick={() => setPage("customer-dashboard")}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Sign In
            </Button>
            <button
              className="focus-ring grid size-10 shrink-0 place-items-center rounded-full border border-warm-200 bg-white text-amber-800 transition-colors hover:bg-amber-50"
              aria-label="Admin demo"
              title="Admin demo"
              onClick={() => setPage("admin-dashboard")}
            >
              <Gauge className="h-4 w-4" aria-hidden="true" />
            </button>
            <Button onClick={() => setPage("booking")}>
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book a Pro
            </Button>
          </div>

          <button
            className="hidden min-h-[34px] shrink-0 items-center gap-[7px] rounded-full bg-brand-ink px-[13px] py-2 text-[11px] font-bold leading-4 text-brand-yellow shadow-[0_2px_5px_rgb(17_24_39/15%)] transition hover:bg-black xs:inline-flex lg:hidden md:px-5 md:text-xs"
            onClick={() => setPage("booking")}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book a Pro
          </button>

          <button
            className="focus-ring ml-auto grid size-[34px] shrink-0 place-items-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors hover:bg-amber-100 md:size-9 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="app-mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <nav
            id="app-mobile-menu"
            className="absolute top-[calc(100%+8px)] right-4 left-4 grid gap-1 rounded-[20px] border border-stone-200 bg-white p-4 shadow-[0_12px_30px_rgb(0_0_0/10%)] md:right-8 md:left-8 lg:hidden"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <button
                key={link.label}
                className="focus-ring flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-warm-800 hover:bg-amber-50"
                onClick={() => {
                  setPage(link.page);
                  setOpen(false);
                }}
              >
                <link.icon className="h-4 w-4 text-brand-amber" aria-hidden="true" />
                {link.label}
              </button>
            ))}
            <button
              className="focus-ring flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-warm-800 hover:bg-amber-50"
              onClick={() => {
                setPage("customer-dashboard");
                setOpen(false);
              }}
            >
              <ShieldCheck className="h-4 w-4 text-brand-amber" aria-hidden="true" />
              Sign In
            </button>
            <button
              className="focus-ring flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-warm-800 hover:bg-amber-50"
              onClick={() => {
                setPage("admin-dashboard");
                setOpen(false);
              }}
            >
              <Gauge className="h-4 w-4 text-brand-amber" aria-hidden="true" />
              Admin demo
            </button>
          </nav>
        ) : null}
      </header>
      {children}
    </div>
  );
}
