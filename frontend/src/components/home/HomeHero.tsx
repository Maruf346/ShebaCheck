import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Navigation,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { homeCategories, homeLocations } from "../../data/homeContent";
import { HomeDropdown } from "./HomeDropdown";

const locationOptions = homeLocations.map((area) => ({
  value: area,
  label: area,
}));

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
    <section
      className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] wide:grid-cols-[minmax(0,676fr)_minmax(0,476fr)]"
      aria-labelledby="home-title"
    >
      <motion.div
        className="p-4 xs:p-6 md:p-8 lg:min-h-[528px] wide:p-10 rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] leading-[15px] font-bold text-amber-800 md:gap-2 md:px-[13px] md:text-xs md:leading-[18px] [&_svg]:text-brand-amber"
            onClick={onDemo}
            title="All statistics, verification, reviews, and service promises are illustrative"
          >
            <BadgeCheck size={16} />
            <span>Bangladesh's First 100% NID-Verified Home Platform</span>
          </button>
        </div>
        <h1
          id="home-title"
          className="mt-4 mb-3 max-w-[620px] text-[28px] leading-8 font-extrabold xs:mt-5 xs:mb-4 xs:text-4xl xs:leading-10 md:text-[46px] md:leading-[50px] lg:max-w-none lg:text-[40px] lg:leading-[44px] wide:text-[46px] wide:leading-[48px] [&_span]:text-brand-amber"
        >
          Find skilled professionals <span>you can trust.</span>
        </h1>
        <p className="mb-5 text-sm leading-[22px] text-stone-600 xs:mb-6 xs:text-[15px] xs:leading-6 md:mb-8 md:text-base md:leading-[25px] wide:text-lg wide:leading-7">
          National ID verified technicians, police cleared records, and locked
          BDT rates. Every job backed by our 7-day workmanship warranty across
          Dhaka.
        </p>
        <form
          className="flex min-h-[62px] flex-wrap items-center gap-2 rounded-[20px] border border-stone-200 bg-stone-50 p-2 shadow-[0_1px_2px_rgb(0_0_0/4%)] md:flex-nowrap md:rounded-full lg:flex-wrap lg:rounded-[20px] wide:flex-nowrap wide:rounded-full"
          role="search"
          onSubmit={onSearch}
        >
          <label className="flex min-h-10 min-w-0 flex-1 basis-full items-center gap-2 rounded-xl pl-2 text-stone-400 transition-[box-shadow,color] focus-within:text-amber-700 focus-within:ring-1 focus-within:ring-amber-500/25 md:min-h-9 md:basis-auto md:pl-3 lg:basis-full wide:min-h-0 wide:basis-auto [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[13px] [&_input]:leading-5 [&_input]:font-medium [&_input]:text-stone-800 [&_input]:outline-none [&_input::placeholder]:text-stone-400">
            <Search size={21} aria-hidden="true" />
            <input
              aria-label="What service do you need?"
              placeholder="What service do you need?"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
          </label>
          <HomeDropdown
            label="Service area"
            value={location}
            options={locationOptions}
            onChange={onLocation}
            icon={Navigation}
            className="min-w-0 flex-1 md:w-48 md:flex-initial lg:w-auto lg:flex-1 wide:w-48 wide:flex-initial"
            triggerClassName="min-h-[42px] rounded-[14px] px-2.5 py-2 md:rounded-full md:px-3 md:py-[7px] lg:rounded-[14px] wide:rounded-full"
          />
          <button
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-[42px] gap-1 px-2.5 py-2.5 text-[11px] leading-5 xs:gap-[7px] xs:px-3.5 xs:text-xs xs:leading-5 md:min-h-11 md:px-[22px] md:py-[11px] md:text-sm bg-brand-amber text-white shadow-home-button hover:bg-[#ed8f00] hover:shadow-home-button-hover"
            type="submit"
          >
            Find Pros <ArrowRight size={18} />
          </button>
        </form>
        <div
          className="mt-4 flex flex-wrap items-center gap-[7px] xs:mt-6 md:mt-7 md:gap-2"
          aria-label="Service categories"
        >
          <span className="mr-1 hidden text-[10px] leading-[15px] font-bold uppercase text-stone-400 card-grid:inline md:text-xs md:leading-[18px]">
            Categories:
          </span>
          {homeCategories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-[background,border-color] duration-[160ms] hover:border-amber-300 hover:bg-amber-50 aria-pressed:border-brand-yellow aria-pressed:bg-brand-yellow aria-pressed:font-bold aria-pressed:text-white aria-pressed:shadow-[0_4px_12px_rgb(255_160_0/20%)] [&_svg]:text-brand-amber [&[aria-pressed=true]_svg]:text-white min-h-9 gap-1 px-2 py-[7px] text-[10px] leading-[18px] font-semibold xs:gap-1.5 xs:px-3 xs:text-[11px] md:min-h-[34px] md:px-4 md:text-xs md:leading-[18px]"
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
        className="relative flex min-h-[390px] min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/50 bg-home-featured p-6 text-white xs:p-7 md:min-h-[400px] md:rounded-panel md:p-8 lg:min-h-0 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:bottom-1/2 before:bg-home-highlight before:content-[''] [&>*]:relative"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
        aria-labelledby="featured-service-title"
      >
        <div className="[&_h2]:text-[28px] [&_h2]:leading-[34px] [&_h2]:font-extrabold md:[&_h2]:text-3xl md:[&_h2]:leading-9 [&_p]:mt-1.5 [&_p]:max-w-[270px] [&_p]:text-sm [&_p]:leading-5 [&_p]:font-medium [&_p]:text-[#fff7d6] md:[&_p]:max-w-[400px] lg:[&_p]:max-w-[270px]">
          <span className="mb-4 inline-flex rounded-full bg-white px-3.5 py-1 text-[11px] leading-[17px] font-extrabold uppercase text-stone-800">
            Popular
          </span>
          <h2 id="featured-service-title">Hire a Service Man</h2>
          <p>
            Need help with wiring, repair or installations in Dhaka? Certified
            pros ready in 45 mins.
          </p>
        </div>
        <div className="my-6 flex items-center justify-between gap-5 lg:my-4">
          <div>
            <span className="block text-[11px] leading-[17px] font-bold uppercase text-[#fff5cc]">
              Diagnostic Visit
            </span>
            <p className="text-3xl leading-[42px] font-extrabold xs:text-4xl xs:leading-[42px]">
              <span className="taka">&#2547;</span> 450
            </p>
            <span className="mt-0.5 block text-[10px] leading-4 font-medium text-[#fff2c6] xs:text-xs">
              Locked fee &bull; 0 advance
            </span>
          </div>
          <div className="relative size-[108px] shrink-0 rounded-2xl border border-white/50 bg-white/20 p-1.5 shadow-[0_8px_12px_rgb(146_64_14/16%)] xs:size-32 md:size-36 [&_img]:size-full [&_img]:rounded-[11px] [&_img]:object-cover">
            <img
              src="/images/providers/featured-technician.jpg"
              alt="Featured service technician in a green work shirt"
              width={144}
              height={144}
              fetchPriority="high"
            />
            <span
              className="absolute right-2 bottom-2 grid h-7 w-6 place-items-center rounded-full bg-white text-brand-amber"
              title="Illustrative verification badge"
            >
              <BadgeCheck size={15} />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-11 gap-[7px] px-6 py-3 text-sm leading-5 flex-1 bg-white text-brand-ink !font-extrabold shadow-[0_3px_6px_rgb(180_83_9/15%)] hover:bg-stone-100 [&_svg]:text-brand-amber"
            onClick={onBook}
          >
            Book Now <CalendarDays size={17} />
          </button>
          <button
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20 text-white transition-colors duration-[160ms] hover:bg-white/35 aria-pressed:bg-white/35"
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
