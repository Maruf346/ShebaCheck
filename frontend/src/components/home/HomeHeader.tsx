import { Bell, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { homeLocations } from "../../data/homeContent";
import type { AppPage } from "../../types";
import { HomeBrand } from "./HomeBrand";
import { HomeDropdown } from "./HomeDropdown";

const locationOptions = homeLocations.map((area) => ({
  value: area,
  label: area === "Gulshan 1 & 2" ? "Gulshan 1, Dhaka" : area,
}));

interface HomeHeaderProps {
  location: string;
  onLocationChange: (location: string) => void;
  onSection: (id: string) => void;
  onNotifications: () => void;
  onBook: () => void;
  setPage: (page: AppPage) => void;
}

const sectionLinks = [
  { id: "services", label: "Find Services" },
  { id: "how-it-works", label: "How It Works" },
  { id: "become-provider", label: "Become a Provider" },
];

export function HomeHeader({
  location,
  onLocationChange,
  onSection,
  onNotifications,
  onBook,
  setPage,
}: HomeHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-3 z-30 mx-auto max-w-marketplace px-4 md:top-4 md:px-8">
      <div className="flex min-h-16 items-center gap-3 rounded-full border border-white bg-white px-4 py-[11px] shadow-home-header md:min-h-[70px] md:gap-5 md:px-5 md:py-3.5 wide:gap-8 wide:px-6">
        <a
          className="shrink-0 rounded-lg"
          href="#home"
          aria-label="ShebaCheck home"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0 });
          }}
        >
          <HomeBrand />
        </a>
        <nav
          className="hidden items-center gap-5 whitespace-nowrap lg:flex wide:gap-7"
          aria-label="Main navigation"
        >
          {sectionLinks.map(({ id, label }, index) => (
            <a
              key={id}
              className={`py-1 text-sm leading-[21px] transition-colors duration-[160ms] hover:text-brand-ink ${index === 0 ? "border-b-2 border-brand-amber font-bold text-brand-ink" : "font-semibold text-stone-500"}`}
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                onSection(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <HomeDropdown
            label="Your Dhaka location"
            value={location}
            options={locationOptions}
            onChange={onLocationChange}
            icon={MapPin}
            className="hidden w-[190px] md:block lg:hidden wide:block"
            triggerClassName="bg-stone-50 px-3 py-2"
          />
          <button
            className="shrink-0 place-items-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors duration-[160ms] hover:bg-amber-100 size-9 relative hidden md:inline-grid"
            aria-label="Notifications"
            title="Notifications"
            onClick={onNotifications}
          >
            <Bell size={17} />
            <span className="absolute top-[7px] right-2 box-content size-[7px] rounded-full border-2 border-white bg-brand-amber" />
          </button>
          <button
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] hidden min-h-[34px] gap-[7px] !border-stone-200 px-4 py-2 text-xs leading-4 text-stone-800 hover:bg-stone-100 md:inline-flex"
            onClick={() => setPage("customer-dashboard")}
          >
            Sign In
          </button>
          <button
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] hidden min-h-[34px] gap-[7px] bg-brand-ink px-[13px] py-2 text-[11px] leading-4 text-brand-yellow shadow-[0_2px_5px_rgb(17_24_39/15%)] hover:bg-black xs:inline-flex md:px-5 md:text-xs"
            onClick={onBook}
          >
            Book a Pro
          </button>
          <button
            className="shrink-0 place-items-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors duration-[160ms] hover:bg-amber-100 inline-grid size-[34px] md:size-9 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="absolute top-[calc(100%+8px)] right-4 left-4 flex flex-col gap-1 rounded-[20px] border border-stone-200 bg-white p-4 shadow-[0_12px_30px_rgb(0_0_0/10%)] md:right-8 md:left-8 lg:hidden [&_:is(a,button)]:rounded-lg [&_:is(a,button)]:p-3 [&_:is(a,button)]:text-left [&_:is(a,button)]:font-semibold [&_:is(a,button):hover]:bg-amber-50"
          id="home-mobile-menu"
          aria-label="Mobile navigation"
        >
          {sectionLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                onSection(id);
              }}
            >
              {label}
            </a>
          ))}
          <button onClick={() => setPage("customer-dashboard")}>Sign In</button>
        </nav>
      )}
    </header>
  );
}
