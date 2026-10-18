import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Navigation,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { homeCategories, homeLocations } from "../../data/homeContent";

interface HomeHeroProps {
  category: string;
  location: string;
  query: string;
  saved: boolean;
  onCategory: (category: string) => void;
  onLocation: (location: string) => void;
  onQuery: (query: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onBook: () => void;
  onSave: () => void;
  onDemo: () => void;
}

export function HomeHero({
  category,
  location,
  query,
  saved,
  onCategory,
  onLocation,
  onQuery,
  onSearch,
  onBook,
  onSave,
  onDemo,
}: HomeHeroProps) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <motion.div
        className="home-hero-search home-white-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="home-hero-trust-row">
          <div className="home-trust-label">
            <BadgeCheck size={16} />
            <span>Bangladesh's First 100% NID-Verified Home Platform</span>
          </div>
          <button
            className="home-demo-indicator"
            onClick={onDemo}
            title="All statistics, verification, reviews, and service promises are illustrative"
          >
            <FlaskConical size={13} />
            Demo data
          </button>
        </div>
        <h1 id="home-title">
          Find skilled professionals <span>you can trust.</span>
        </h1>
        <p className="home-hero-description">
          National ID verified technicians, police cleared records, and locked
          BDT rates. Every job backed by our 7-day workmanship warranty across
          Dhaka.
        </p>
        <form className="home-search-form" role="search" onSubmit={onSearch}>
          <label className="home-search-input">
            <Search size={21} aria-hidden="true" />
            <input
              aria-label="What service do you need?"
              placeholder="What service do you need?"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
          </label>
          <label className="home-search-location">
            <Navigation size={16} aria-hidden="true" />
            <select
              aria-label="Service area"
              value={location}
              onChange={(event) => onLocation(event.target.value)}
            >
              {homeLocations.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
          <button className="home-button home-button--amber" type="submit">
            Find Pros <ArrowRight size={18} />
          </button>
        </form>
        <div className="home-category-pills" aria-label="Service categories">
          <span className="home-category-label">Categories:</span>
          {homeCategories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`home-pill${category === label ? " is-active" : ""}`}
              aria-pressed={category === label}
              onClick={() => onCategory(label)}
            >
              {Icon && <Icon size={15} aria-hidden="true" />}
              {label}
              {label === "All" && <CheckCircle2 size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </motion.div>
      <motion.article
        className="home-featured-service"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-labelledby="featured-service-title"
      >
        <div className="home-featured-heading">
          <span className="home-popular-label">Popular</span>
          <h2 id="featured-service-title">Hire a Service Man</h2>
          <p>
            Need help with wiring, repair or installations in Dhaka? Certified
            pros ready in 45 mins.
          </p>
        </div>
        <div className="home-featured-detail">
          <div>
            <span className="home-featured-eyebrow">Diagnostic Visit</span>
            <p className="home-featured-price">
              <span className="taka">&#2547;</span> 450
            </p>
            <span className="home-featured-note">
              Locked fee &bull; 0 advance
            </span>
          </div>
          <div className="home-featured-photo">
            <img
              src="/images/providers/featured-technician.jpg"
              alt="Featured service technician in a green work shirt"
              width={144}
              height={144}
              fetchPriority="high"
            />
            <span
              className="home-photo-check"
              title="Illustrative verification badge"
            >
              <BadgeCheck size={15} />
            </span>
          </div>
        </div>
        <div className="home-featured-actions">
          <button className="home-button home-button--white" onClick={onBook}>
            Book Now <CalendarDays size={17} />
          </button>
          <button
            className={`home-save-button${saved ? " is-saved" : ""}`}
            aria-label={
              saved ? "Remove saved service" : "Save service for later"
            }
            aria-pressed={saved}
            title={saved ? "Remove saved service" : "Save service for later"}
            onClick={onSave}
          >
            <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </motion.article>
    </section>
  );
}
