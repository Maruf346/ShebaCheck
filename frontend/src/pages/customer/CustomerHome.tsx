import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  History,
  SearchX,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { HomeDialog } from "../../components/home/HomeDialog";
import { HomeFooter } from "../../components/home/HomeFooter";
import { HomeHeader } from "../../components/home/HomeHeader";
import { HomeHero } from "../../components/home/HomeHero";
import { HomeMobileNav } from "../../components/home/HomeMobileNav";
import { TechnicianCard } from "../../components/home/TechnicianCard";
import {
  featuredTechnician,
  homeTechnicians,
  homeTestimonials,
  homeZones,
  locationZones,
  protectionSteps,
  type HomeDialogKind,
} from "../../data/homeContent";
import type { AppPage, Provider } from "../../types";
import "../../styles/home.css";

interface CustomerHomeProps {
  setPage: (page: AppPage) => void;
  onSelectProvider: (provider: Provider, page: "profile" | "booking") => void;
}

function getSavedService() {
  try {
    return localStorage.getItem("shebacheck:featured-saved") === "true";
  } catch {
    return false;
  }
}

export function CustomerHome({ setPage, onSelectProvider }: CustomerHomeProps) {
  const [category, setCategory] = useState("All");
  const [zone, setZone] = useState("All Zones");
  const [location, setLocation] = useState("Gulshan 1 & 2");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [saved, setSaved] = useState(getSavedService);
  const [announcement, setAnnouncement] = useState("");
  const [dialog, setDialog] = useState<HomeDialogKind | null>(null);

  const filtered = homeTechnicians.filter((technician) => {
    const words =
      `${technician.name} ${technician.category} ${technician.specialty} ${technician.serviceLabel} ${technician.bio}`
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u);
    const queryMatch = submittedQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((term) =>
        words.some(
          (word) => word === term || (term.length > 2 && word.startsWith(term)),
        ),
      );
    return (
      (category === "All" || technician.category === category) &&
      (zone === "All Zones" || technician.zones.includes(zone)) &&
      queryMatch
    );
  });

  function scrollToSection(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setZone(locationZones[location] ?? "All Zones");
    setHasSearched(true);
    scrollToSection("services");
  }

  function resetFilters() {
    setCategory("All");
    setZone("All Zones");
    setQuery("");
    setSubmittedQuery("");
    setHasSearched(false);
  }

  function toggleSaved() {
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      localStorage.setItem("shebacheck:featured-saved", String(nextSaved));
    } catch {
      /* Keep the selection for this visit when storage is disabled. */
    }
    setAnnouncement(
      nextSaved
        ? "Service saved for later."
        : "Service removed from saved items.",
    );
  }

  const bookFeatured = () => onSelectProvider(featuredTechnician, "booking");

  return (
    <div className="shebacheck-home">
      <a
        className="home-skip-link"
        href="#home-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("home-main")?.focus();
        }}
      >
        Skip to content
      </a>
      <HomeHeader
        location={location}
        onLocationChange={setLocation}
        onSection={scrollToSection}
        onNotifications={() => setDialog("notifications")}
        onBook={bookFeatured}
        setPage={setPage}
      />
      <main id="home-main" className="home-main" tabIndex={-1}>
        <HomeHero
          category={category}
          location={location}
          query={query}
          saved={saved}
          onCategory={setCategory}
          onLocation={setLocation}
          onQuery={setQuery}
          onSearch={search}
          onBook={bookFeatured}
          onSave={toggleSaved}
          onDemo={() => setDialog("demo")}
        />

        <section
          className="home-trust-ribbon home-white-panel"
          aria-label="Illustrative trust statistics"
        >
          {[
            {
              icon: ShieldCheck,
              title: "100% NID Checked",
              detail: "Govt NID & criminal screened",
            },
            {
              icon: ThumbsUp,
              title: "0.9% Low Cancel",
              detail: "Guaranteed arrival timing",
            },
            {
              icon: History,
              title: "\u09f30 Advance Escrow",
              detail: "Pay only after job approved",
            },
            {
              icon: BadgeCheck,
              title: "4.9 / 5.0 Rating",
              detail: "Across 24,000+ Dhaka homes",
            },
          ].map(({ icon: Icon, title, detail }) => (
            <button
              key={title}
              className="home-trust-metric"
              onClick={() => setDialog("demo")}
              title="About these demo statistics"
            >
              <span className="home-metric-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <span className="home-metric-detail">{detail}</span>
              </span>
            </button>
          ))}
        </section>

        <section
          className="home-services-section"
          id="services"
          aria-labelledby="home-services-title"
        >
          <div className="home-section-heading home-white-panel">
            <div>
              <p className="home-eyebrow">
                <span className="home-status-dot" />
                Top Rated in Your Zone
              </p>
              <h2 id="home-services-title">
                Verified Technicians Available Today
              </h2>
              <p className="home-section-description">
                Biometric NID registered and upfront locked BDT pricing.
              </p>
            </div>
            <div
              className="home-zone-pills"
              aria-label="Filter providers by area"
            >
              {homeZones.map((area) => (
                <button
                  key={area}
                  className={`home-pill${zone === area ? " is-active" : ""}`}
                  aria-pressed={zone === area}
                  onClick={() => setZone(area)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          {hasSearched && (
            <div className="home-search-feedback" role="status">
              <p>
                {filtered.length} demo{" "}
                {filtered.length === 1 ? "professional" : "professionals"}
                {submittedQuery ? ` matching "${submittedQuery}"` : ""} in{" "}
                {zone === "All Zones" ? "Dhaka" : zone}.
              </p>
              <button onClick={resetFilters}>Clear search</button>
            </div>
          )}
          <div className="home-technician-grid">
            {filtered.map((technician) => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                onProfile={() => onSelectProvider(technician, "profile")}
                onBook={() => onSelectProvider(technician, "booking")}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="home-empty home-white-panel" role="status">
              <SearchX size={32} />
              <h3>No matching professionals</h3>
              <p>There are no demo providers for this service and area yet.</p>
              <button
                className="home-button home-button--amber"
                onClick={resetFilters}
              >
                Show all professionals
              </button>
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {filtered.length} demo providers shown.
          </span>
        </section>

        <section
          className="home-protection home-white-panel"
          id="how-it-works"
          aria-labelledby="home-protection-title"
        >
          <div className="home-protection-intro">
            <p className="home-trust-label">
              <ShieldCheck size={16} />
              <span>Zero-Compromise Security Framework</span>
            </p>
            <h2 id="home-protection-title">
              How ShebaCheck Protects Your Home and Family
            </h2>
            <p>
              We rebuilt urban service delivery in Dhaka from the ground up,
              placing criminal background verification, price transparency, and
              dispute escrow first.
            </p>
          </div>
          <div className="home-protection-grid">
            {protectionSteps.map(({ title, body, note, icon: Icon }, index) => (
              <article className="home-protection-step" key={title}>
                <span className="home-step-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="home-step-note">
                  <Icon size={17} aria-hidden="true" />
                  {note}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="home-reviews-section"
          aria-labelledby="home-reviews-title"
        >
          <div className="home-section-heading home-white-panel">
            <div>
              <span className="home-eyebrow">Authentic Reviews</span>
              <h2 id="home-reviews-title">
                Stories from Gulshan, Banani &amp; Dhanmondi
              </h2>
            </div>
            <p className="home-review-eligibility">
              <BadgeCheck size={18} aria-hidden="true" />
              Only verified booking accounts can review
            </p>
          </div>
          <div className="home-reviews-grid">
            {homeTestimonials.map(({ name, initials, detail, quote }) => (
              <figure className="home-review home-white-panel" key={name}>
                <div
                  className="home-review-stars"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote>&quot;{quote}&quot;</blockquote>
                <figcaption>
                  <span className="home-review-avatar">{initials}</span>
                  <span>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          className="home-provider-banner home-white-panel"
          id="become-provider"
          aria-labelledby="home-provider-title"
        >
          <div>
            <p className="home-eyebrow">
              Are You a Skilled Electrician, Plumber, or Technician?
            </p>
            <h2 id="home-provider-title">
              Join ShebaCheck Verified Network. Earn up to{" "}
              <span className="taka">&#2547;</span>45,000/month.
            </h2>
            <p className="home-provider-description">
              Receive guaranteed bookings in your local Dhaka neighborhood with
              weekly bKash payouts, personal accident insurance cover, and
              professional tools training.
            </p>
          </div>
          <div className="home-provider-actions">
            <button
              className="home-button home-button--amber"
              onClick={() => setPage("provider-dashboard")}
            >
              Apply as Technician
            </button>
            <button
              className="home-button home-button--neutral"
              onClick={() => setDialog("requirements")}
            >
              Verification Requirements
            </button>
          </div>
        </section>
      </main>
      <HomeFooter
        onZone={(area) => {
          resetFilters();
          setZone(area);
          scrollToSection("services");
        }}
        onService={(service) => {
          resetFilters();
          setCategory(service);
          scrollToSection("services");
        }}
        onDialog={setDialog}
      />
      <HomeMobileNav
        onServices={() => scrollToSection("services")}
        onBook={bookFeatured}
        setPage={setPage}
      />
      <span className="sr-only" role="status">
        {announcement}
      </span>
      {dialog && <HomeDialog kind={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
