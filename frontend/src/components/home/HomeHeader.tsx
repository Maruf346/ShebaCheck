import { Bell, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { homeLocations } from "../../data/homeContent";
import type { AppPage } from "../../types";
import { HomeBrand } from "./HomeBrand";

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
    <header className="home-header">
      <div className="home-header-bar">
        <a
          className="home-logo-link"
          href="#home"
          aria-label="ShebaCheck home"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0 });
          }}
        >
          <HomeBrand />
        </a>
        <nav className="home-desktop-links" aria-label="Main navigation">
          {sectionLinks.map(({ id, label }, index) => (
            <a
              key={id}
              className={index === 0 ? "is-current" : ""}
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
        <div className="home-header-actions">
          <label className="home-location-control">
            <MapPin size={16} aria-hidden="true" />
            <select
              aria-label="Your Dhaka location"
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
            >
              {homeLocations.map((area) => (
                <option key={area} value={area}>
                  {area === "Gulshan 1 & 2" ? "Gulshan 1, Dhaka" : area}
                </option>
              ))}
            </select>
            <ChevronDown size={13} aria-hidden="true" />
          </label>
          <button
            className="home-icon-button home-notifications"
            aria-label="Notifications"
            title="Notifications"
            onClick={onNotifications}
          >
            <Bell size={17} />
            <span className="home-notification-dot" />
          </button>
          <button
            className="home-button home-button--signin"
            onClick={() => setPage("customer-dashboard")}
          >
            Sign In
          </button>
          <button className="home-button home-button--dark" onClick={onBook}>
            Book a Pro
          </button>
          <button
            className="home-icon-button home-menu-toggle"
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
          className="home-mobile-menu"
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
