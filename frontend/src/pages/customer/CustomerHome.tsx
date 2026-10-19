import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  History,
  SearchX,
  ShieldCheck,
  Sparkles,
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
  homeTestimonials,
  homeZones,
  locationZones,
  protectionSteps,
  type HomeDialogKind,
  type HomeTechnician,
} from "../../data/homeContent";
import type { AppPage, Provider } from "../../types";
import { ApiError, listFavoriteProviders, listReviews, removeFavoriteProvider, saveFavoriteProvider, searchProviders, type ApiReview } from "../../api/client";
import { useAuth } from "../../auth/AuthProvider";
import { adaptHomeTechnician } from "../../api/adapters";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

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
  const { user } = useAuth();
  const [favoriteProviderIds, setFavoriteProviderIds] = useState<number[]>([]);
  const [apiTechnicians, setApiTechnicians] = useState<HomeTechnician[]>([]);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");
  const [liveReviews, setLiveReviews] = useState<ApiReview[]>([]);
  const [category, setCategory] = useState("All");
  const [zone, setZone] = useState("All Zones");
  const [location, setLocation] = useState("Gulshan 1 & 2");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [saved, setSaved] = useState(getSavedService);
  const [announcement, setAnnouncement] = useState("");
  const [dialog, setDialog] = useState<HomeDialogKind | null>(null);

  useEffect(() => {
    let active = true;
    searchProviders({ ordering: "-average_rating" })
      .then((response) => {
        if (!active) return;
        setApiTechnicians(response.results.map(adaptHomeTechnician));
        setApiAvailable(true);
        setApiMessage(response.results.length ? "Verified local professionals" : "No provider profiles found.");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setApiAvailable(false);
        setApiMessage(error instanceof ApiError && error.status !== 0 ? `API unavailable: ${error.message}` : "Connecting to service network…");
      })
      .finally(() => { if (active) setApiLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    listReviews()
      .then((page) => {
        if (!active) return;
        // Take up to 3 reviews with a body, preferring highest-rated
        const sorted = [...page.results]
          .filter((r) => r.body && r.body.trim().length > 20)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setLiveReviews(sorted);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user || user.role !== "customer") return;
    listFavoriteProviders()
      .then((page) => {
        setFavoriteProviderIds(page.results.map((favorite) => favorite.provider.id));
        if (apiTechnicians[0]) setSaved(page.results.some((favorite) => favorite.provider.id === apiTechnicians[0].id));
      })
      .catch(() => undefined);
  }, [user, apiTechnicians]);

  const technicians = apiTechnicians;

  const reviewsToDisplay = useMemo(() => {
    const liveItems = liveReviews.map((r) => ({
      key: `live-${r.id}`,
      name: r.customer_name,
      initials: getInitials(r.customer_name),
      detail: `${r.provider_name ? `${r.provider_name} • ` : ""}Verified booking`,
      quote: r.body,
      rating: r.rating,
    }));
    if (liveItems.length >= 3) {
      return liveItems.slice(0, 3);
    }
    const fallbackItems = homeTestimonials.map((t) => ({ key: `static-${t.name}`, ...t, rating: 5 }));
    const combined = [...liveItems];
    for (const item of fallbackItems) {
      if (combined.length >= 3) break;
      if (!combined.some((c) => c.name === item.name)) {
        combined.push(item);
      }
    }
    return combined.slice(0, 3);
  }, [liveReviews]);

  const filtered = technicians.filter((technician) => {
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
    document.getElementById(id)?.scrollIntoView({
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

  async function toggleSaved() {
    const liveProviderId = apiTechnicians[0]?.id;
    const isSaved = liveProviderId ? favoriteProviderIds.includes(liveProviderId) : saved;
    const nextSaved = !isSaved;
    if (user?.role === "customer" && apiTechnicians.length) {
      try {
        if (nextSaved) {
          await saveFavoriteProvider(liveProviderId!);
          setFavoriteProviderIds((ids) => ids.includes(liveProviderId!) ? ids : [...ids, liveProviderId!]);
        } else {
          const page = await listFavoriteProviders();
          const favorite = page.results.find((item) => item.provider.id === liveProviderId);
          if (favorite) await removeFavoriteProvider(favorite.id);
          setFavoriteProviderIds((ids) => ids.filter((id) => id !== liveProviderId));
        }
      } catch {
        setAnnouncement("Sign in as a customer to save providers.");
        return;
      }
    } else if (nextSaved && liveProviderId && !user) {
      setAnnouncement("Sign in to save live providers.");
      return;
    }
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

  const bookFeatured = () => {
    if (apiTechnicians.length > 0) {
      onSelectProvider(apiTechnicians[0], "booking");
    } else {
      setPage("search");
    }
  };

  return (
    <div className="shebacheck-home relative min-h-screen overflow-hidden bg-home-canvas pt-3 pb-[calc(72px+env(safe-area-inset-bottom))] font-sans text-sm leading-[21px] tracking-normal text-brand-ink md:pt-4 md:pb-0 [&_*]:tracking-normal [&_svg]:shrink-0 motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none [&_:is(button,a,select):focus-visible]:outline [&_:is(button,a,select):focus-visible]:outline-[3px] [&_:is(button,a,select):focus-visible]:outline-offset-4 [&_:is(button,a,select):focus-visible]:outline-brand-amber [&_button]:[-webkit-tap-highlight-color:transparent] [&_section[id]]:scroll-mt-[110px]">
      <a
        className="fixed -top-20 left-4 z-[60] rounded-md bg-brand-ink px-[18px] py-3 text-white focus:top-3"
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
      <main
        id="home-main"
        className="relative z-10 mx-auto flex w-full max-w-marketplace flex-col gap-6 px-4 pt-5 pb-6 focus:outline-none md:gap-8 md:px-8 md:pt-6 md:pb-10"
        tabIndex={-1}
      >
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
          onAbout={() => setDialog("about")}
        />

        <motion.section
          className="grid grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 md:gap-6 md:px-6 lg:grid-cols-4 lg:gap-0 wide:p-7 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
          aria-label="Trust statistics"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
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
            <motion.button
              key={title}
              className="flex min-w-0 flex-col items-start gap-2.5 text-left md:flex-row md:items-center lg:border-r lg:border-stone-100 lg:px-2.5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0 wide:gap-4 wide:px-4 [&_strong]:block [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:font-bold md:[&_strong]:text-base md:[&_strong]:leading-6 lg:[&_strong]:text-[13px] lg:[&_strong]:leading-5 wide:[&_strong]:text-base wide:[&_strong]:leading-6"
              onClick={() => setDialog("about")}
              title="ShebaCheck trust framework"
              variants={reveal}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-amber-100 bg-amber-50 text-brand-amber md:size-12 lg:size-10 wide:size-12 wide:rounded-2xl">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <span className="mt-0.5 block text-[10px] leading-[15px] font-medium text-stone-500 md:mt-0 md:text-[11px] md:leading-4 lg:text-[10px] wide:text-[11px]">
                  {detail}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.section>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-5 rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-white p-6 md:p-8 shadow-home-panel"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-start md:items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Sparkles className="size-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                New &bull; Machine Learning Diagnostics
              </span>
              <h2 className="text-xl md:text-2xl font-black text-brand-ink">
                Not sure about repair costs? Ask our AI Fair-Price Estimator
              </h2>
              <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
                Describe the problem in plain words. Our NLP model estimates realistic Dhaka labor costs, parts, and matches certified technicians.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPage("ai-diagnostic")}
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-brand-ink px-5 py-3 text-xs md:text-sm font-bold text-amber-300 shadow-md hover:bg-black transition-colors"
          >
            Try AI Estimator
            <ArrowRight className="size-4" />
          </button>
        </motion.div>

        <section
          className="flex flex-col gap-6"
          id="services"
          aria-labelledby="home-services-title"
        >
          <div className="flex min-h-[120px] flex-col items-start justify-between gap-5 p-6 md:gap-4 wide:flex-row wide:items-center [&_h2]:mt-1 [&_h2]:text-[22px] [&_h2]:leading-[29px] [&_h2]:font-extrabold md:[&_h2]:text-[23px] md:[&_h2]:leading-8 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel">
            <div>
              <p className="flex items-center gap-2 text-[10px] leading-4 font-extrabold uppercase text-[#f59b00] md:text-xs md:leading-[18px]">
                <span className="size-2.5 shrink-0 rounded-full bg-brand-yellow" />
                Top Rated in Your Zone
              </p>
              <h2 id="home-services-title">
                Verified Technicians Available Today
              </h2>
              <p className="mt-1.5 text-xs leading-[18px] font-medium text-stone-500 md:mt-0.5 md:leading-4">
                {apiMessage || "Biometric NID registered and upfront locked BDT pricing."}
              </p>
            </div>
            <div
              className="flex max-w-full shrink-0 flex-wrap items-center gap-2 md:flex-nowrap md:pb-1"
              aria-label="Filter providers by area"
            >
              {homeZones.map((area) => (
                <button
                  key={area}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-[background,border-color] duration-[160ms] hover:border-amber-300 hover:bg-amber-50 aria-pressed:border-brand-yellow aria-pressed:bg-brand-yellow aria-pressed:font-bold aria-pressed:text-white aria-pressed:shadow-[0_4px_12px_rgb(255_160_0/20%)] [&_svg]:text-brand-amber [&[aria-pressed=true]_svg]:text-white min-h-9 gap-1.5 px-3 py-[5px] text-[11px] leading-[18px] font-bold md:min-h-[30px] md:px-[15px]"
                  aria-pressed={zone === area}
                  onClick={() => setZone(area)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          {hasSearched && (
            <div
              className="home-search-feedback flex flex-wrap items-center justify-between gap-3 px-2 text-[13px] text-amber-950 [&_button]:font-bold [&_button]:underline [&_button]:underline-offset-[3px]"
              role="status"
            >
              <p>
                {filtered.length}{" "}
                {filtered.length === 1 ? "professional" : "professionals"}
                {submittedQuery ? ` matching "${submittedQuery}"` : ""} in{" "}
                {zone === "All Zones" ? "Dhaka" : zone}.
              </p>
              <button onClick={resetFilters}>Clear search</button>
            </div>
          )}
          <motion.div
            className="grid grid-cols-1 gap-4 empty:hidden card-grid:grid-cols-2 md:gap-6 wide:grid-cols-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {filtered.map((technician) => (
              <motion.div
                key={technician.id}
                variants={reveal}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="min-w-0 h-full"
              >
                <TechnicianCard
                  technician={technician}
                  onProfile={() => onSelectProvider(technician, "profile")}
                  onBook={() => onSelectProvider(technician, "booking")}
                />
              </motion.div>
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center gap-4 px-6 py-10 text-center [&>svg]:text-amber-700 [&_h3]:text-xl [&_h3]:font-bold [&_p]:text-stone-500 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
              role="status"
            >
              <SearchX size={32} />
              <h3>No matching professionals</h3>
              <p>{apiLoading ? "Loading provider listings…" : apiAvailable && apiTechnicians.length === 0 ? "No provider profiles have been published yet." : "There are no providers for this service and area yet."}</p>
              <button
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-11 gap-[7px] px-6 py-3 text-sm leading-5 bg-brand-amber text-white shadow-home-button hover:bg-[#ed8f00] hover:shadow-home-button-hover"
                onClick={resetFilters}
              >
                Show all professionals
              </button>
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {filtered.length} providers shown.
          </span>
        </section>

        <section
          className="px-6 py-7 md:p-9 wide:p-12 [&_h2]:text-[28px] [&_h2]:leading-[34px] [&_h2]:font-extrabold md:[&_h2]:text-[32px] md:[&_h2]:leading-[38px] lg:[&_h2]:text-[34px] lg:[&_h2]:leading-10 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
          id="how-it-works"
          aria-labelledby="home-protection-title"
        >
          <div className="mb-7 max-w-2xl md:mb-10 [&>p:last-child]:mt-2.5 [&>p:last-child]:text-sm [&>p:last-child]:leading-[22px] [&>p:last-child]:text-stone-600 md:[&>p:last-child]:text-base md:[&>p:last-child]:leading-6">
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] leading-4 font-bold text-brand-amber md:gap-2 md:px-[13px] md:text-xs md:leading-4 [&_svg]:text-brand-amber mb-3.5">
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 wide:gap-6">
            {protectionSteps.map(({ title, body, note, icon: Icon }, index) => (
              <motion.article
                className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-stone-50 p-5 lg:min-h-[270px] wide:p-6 [&_h3]:mb-2 [&_h3]:text-[17px] [&_h3]:leading-[26px] [&_h3]:font-bold [&>p]:max-w-[640px] [&>p]:text-sm [&>p]:leading-5 [&>p]:text-stone-600 lg:[&>p]:max-w-none"
                key={title}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <span className="mb-5 grid size-12 place-items-center rounded-full bg-brand-yellow text-lg leading-[27px] font-extrabold text-white shadow-[0_6px_16px_-2px_rgb(255_160_0/35%)]">
                  0{index + 1}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="mt-auto flex items-center gap-2 pt-5 text-[11px] leading-[18px] font-bold text-[#ed9700]">
                  <Icon size={17} aria-hidden="true" />
                  {note}
                </span>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col gap-6"
          aria-labelledby="home-reviews-title"
        >
          <div className="flex min-h-[108px] flex-col items-start justify-between gap-5 p-6 md:gap-4 wide:flex-row wide:items-center [&_h2]:mt-1 [&_h2]:text-[22px] [&_h2]:leading-[29px] [&_h2]:font-extrabold md:[&_h2]:text-[23px] md:[&_h2]:leading-8 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel">
            <div>
              <span className="flex items-center gap-2 text-[10px] leading-4 font-extrabold uppercase text-[#f59b00] md:text-xs md:leading-[18px]">
                Authentic Reviews
              </span>
              <h2 id="home-reviews-title">
                Stories from Gulshan, Banani &amp; Dhanmondi
              </h2>
            </div>
            <p className="flex shrink-0 items-start gap-1.5 text-[11px] leading-[16.5px] font-medium text-stone-500 md:items-center md:text-xs md:leading-[18px] [&_svg]:text-brand-amber">
              <BadgeCheck size={18} aria-hidden="true" />
              Only verified booking accounts can review
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 items-stretch">
            {reviewsToDisplay.map(({ key, name, initials, detail, quote, rating }) => (
              <motion.figure
                className="m-0 flex h-full flex-col p-6 lg:min-h-[313px] [&_blockquote]:mb-5 [&_blockquote]:text-sm [&_blockquote]:leading-[23px] [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:text-stone-600 [&_figcaption]:mt-auto [&_figcaption]:flex [&_figcaption]:items-center [&_figcaption]:gap-3 [&_figcaption]:border-t [&_figcaption]:border-stone-100 [&_figcaption]:pt-3.5 [&_figcaption_strong]:block [&_figcaption_strong]:text-[13px] [&_figcaption_strong]:leading-5 [&_figcaption_strong]:font-bold [&_figcaption>span:last-child>span]:block [&_figcaption>span:last-child>span]:text-[10px] [&_figcaption>span:last-child>span]:leading-[17px] [&_figcaption>span:last-child>span]:font-medium [&_figcaption>span:last-child>span]:text-stone-500 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
                key={key}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div
                  className="mb-3.5 flex items-center gap-[3px] text-brand-yellow"
                  aria-label={`${rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={17}
                      fill={index < rating ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote>&quot;{quote}&quot;</blockquote>
                <figcaption>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-amber-200 bg-amber-50 text-xs leading-[18px] font-bold text-amber-800">
                    {initials}
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col items-start justify-between gap-6 px-6 py-7 md:p-10 wide:flex-row wide:items-center [&>div:first-child]:max-w-[760px] wide:[&>div:first-child]:max-w-xl [&_h2]:mt-1 [&_h2]:mb-2 [&_h2]:text-[26px] [&_h2]:leading-[33px] [&_h2]:font-extrabold md:[&_h2]:text-[29px] md:[&_h2]:leading-9 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
          id="become-provider"
          aria-labelledby="home-provider-title"
        >
          <div>
            <p className="flex items-center gap-2 text-[10px] leading-4 font-extrabold uppercase text-[#f59b00] md:text-xs md:leading-[18px]">
              Are You a Skilled Electrician, Plumber, or Technician?
            </p>
            <h2 id="home-provider-title">
              Join ShebaCheck Verified Network. Earn up to{" "}
              <span className="taka">&#2547;</span>45,000/month.
            </h2>
            <p className="text-sm leading-[23px] font-medium text-stone-500 md:text-base md:leading-6">
              Receive guaranteed bookings in your local Dhaka neighborhood with
              weekly bKash payouts, personal accident insurance cover, and
              professional tools training.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-wrap gap-3 md:w-auto md:flex-nowrap">
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-[50px] flex-1 gap-[7px] px-[18px] py-3.5 text-xs leading-5 md:flex-initial md:px-[23px] md:text-[13px] bg-brand-amber text-white shadow-home-button hover:bg-[#ed8f00] hover:shadow-home-button-hover"
              onClick={() => setPage("provider-register")}
            >
              Apply as Technician
            </button>
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-[50px] flex-1 gap-[7px] px-[18px] py-3.5 text-xs leading-5 md:flex-initial md:px-[23px] md:text-[13px] !border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100"
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
