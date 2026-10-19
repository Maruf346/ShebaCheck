import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  ArrowRight,
  Shield,
  Coins,
  Cpu,
  Layers,
  MapPin,
  Star,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { estimateJobCost, type JobEstimateResponse, type MatchedProvider } from "../../api/client";
import type { AppPage, Provider } from "../../types";
import { homeLocations } from "../../data/homeContent";

interface SmartDiagnosticPageProps {
  setPage: (page: AppPage, providerId?: number) => void;
  onSelectProvider?: (provider: Provider, nextPage: "profile" | "booking") => void;
}

const SAMPLE_PROMPTS = [
  {
    label: "❄️ AC blowing warm air",
    query: "My 1.5 ton split AC is blowing room temperature air and outside unit compressor is silent",
    area: "Gulshan 1 & 2",
  },
  {
    label: "⚡ Breaker trips repeatedly",
    query: "Main circuit breaker trips instantly every time the water pump or geyser is turned on",
    area: "Mirpur 10",
  },
  {
    label: "🚰 Concealed pipe leaking",
    query: "Concealed water pipe leaking inside bathroom wall tiles, causing damp bubbles on bedroom wall",
    area: "Dhanmondi",
  },
  {
    label: "🧹 3-BHK flat deep clean",
    query: "Thorough deep cleaning for newly rented 3 BHK 1600 sft apartment before family moving in",
    area: "Banani",
  },
  {
    label: "🧊 Refrigerator warm bottom",
    query: "Samsung no-frost refrigerator freezer is frozen but bottom food section is completely warm",
    area: "Uttara",
  },
];

export function SmartDiagnosticPage({ setPage }: SmartDiagnosticPageProps) {
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("Gulshan 1 & 2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobEstimateResponse | null>(null);

  async function handleAnalyze(textToAnalyze?: string, areaToUse?: string) {
    const text = (textToAnalyze ?? query).trim();
    if (text.length < 5) {
      setError("Please describe the problem in a few words (at least 5 characters).");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await estimateJobCost({
        problem_description: text,
        area: areaToUse ?? selectedArea,
      });
      setResult(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Diagnostic service temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  function handlePromptClick(prompt: (typeof SAMPLE_PROMPTS)[0]) {
    setQuery(prompt.query);
    setSelectedArea(prompt.area);
    handleAnalyze(prompt.query, prompt.area);
  }

  function handleBookProvider(providerId: number) {
    setPage("booking", providerId);
  }

  function handleViewProfile(providerId: number) {
    setPage("profile", providerId);
  }

  return (
    <main className="mx-auto max-w-marketplace px-4 py-8 md:px-8 md:py-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-6 md:p-10 shadow-home-panel md:rounded-panel">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-900 mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-amber-600 animate-pulse" />
            Machine Learning Diagnostic &amp; Fair-Price Estimator
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-ink tracking-tight leading-[1.15]">
            Describe your repair problem. <br />
            <span className="text-amber-600">
              Get ML cost range &amp; top technicians.
            </span>
          </h1>
          <p className="mt-3.5 text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl">
            Trained on real Dhaka repair services. Our NLP classifier analyzes symptoms, predicts transparent labor cost bounds, parts required, and scores verified local specialists with zero hidden markups.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <section className="mt-8 rounded-3xl border border-stone-200/80 bg-white p-6 md:p-8 shadow-sm">
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="diagnostic-input" className="block text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                Problem Description (English or Bengali / Banglish)
              </label>
              <div className="relative">
                <textarea
                  id="diagnostic-input"
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Master bedroom inverter AC is blowing room temperature air and outside unit makes buzzing vibration sound..."
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 p-4 text-sm font-medium text-stone-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col justify-between">
              <div>
                <label htmlFor="diagnostic-area" className="block text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                  Location / Zone
                </label>
                <div className="relative">
                  <select
                    id="diagnostic-area"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-3.5 py-3 text-sm font-semibold text-stone-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                  >
                    {homeLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 md:mt-0 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-ink px-6 py-3.5 text-sm font-bold text-amber-300 shadow-lg shadow-black/10 hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Cpu className="size-4 animate-spin text-amber-300" />
                    Analyzing ML Model…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-amber-400" />
                    Run Smart Diagnostic
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
              <Search className="size-3" /> Try sample:
            </span>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePromptClick(p)}
                className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              {error}
            </div>
          )}
        </form>
      </section>

      {/* Loading Skeleton / Pulse Scanner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-4 animate-pulse">
              <Cpu className="size-7 animate-spin" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-800">
              Running NLP Feature Extraction &amp; Regression…
            </h3>
            <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
              Tokenizing problem description, computing TF-IDF similarity vectors, and calculating fair Dhaka labor rates.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results View */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-8 space-y-8"
          >
            {/* Diagnostic Core Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Diagnostic Breakdown */}
              <div className="lg:col-span-2 rounded-3xl border border-stone-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-amber-800">
                      <Wrench className="size-5" />
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                        Predicted Category: {result.predicted_category}
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-stone-900">
                        {result.service_label}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    {Math.round(result.confidence * 100)}% Model Confidence
                  </div>
                </div>

                {/* Root Cause & Diagnostic Summary */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-amber-600" />
                    AI Diagnostic &amp; Root Cause
                  </h3>
                  <p className="text-sm md:text-base font-medium text-stone-700 leading-relaxed bg-amber-50/40 rounded-2xl border border-amber-100 p-4">
                    {result.diagnostic_summary}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Clock className="size-3 text-stone-500" /> Est. Time
                    </span>
                    <strong className="text-lg md:text-xl font-extrabold text-stone-900">
                      ~{result.duration_minutes} mins
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Shield className="size-3 text-stone-500" /> Complexity
                    </span>
                    <strong className="text-lg md:text-xl font-extrabold text-stone-900">
                      {result.complexity}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Coins className="size-3 text-stone-500" /> Fair Labor
                    </span>
                    <strong className="text-lg md:text-xl font-extrabold text-amber-700">
                      &#2547;{result.price_estimate}
                    </strong>
                  </div>
                </div>

                {/* Likely Parts Required */}
                {result.recommended_parts && result.recommended_parts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                      <Wrench className="size-3.5 text-amber-600" />
                      Expected Replacement Parts &amp; Consumables
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.recommended_parts.map((part) => (
                        <span
                          key={part}
                          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs"
                        >
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: Fair-Price Gauge */}
              <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-b from-stone-900 to-black p-6 md:p-8 text-white shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      ShebaCheck ML Fair Price
                    </span>
                    <TrendingDown className="size-4 text-emerald-400" />
                  </div>

                  <div className="mt-4">
                    <span className="text-xs text-stone-400">Predicted Median Fair Cost</span>
                    <div className="text-4xl md:text-5xl font-black text-amber-300 mt-1">
                      <span className="text-2xl mr-1">&#2547;</span>
                      {result.price_estimate}
                    </div>
                  </div>

                  {/* Range visual */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-stone-400">
                      <span>Low: &#2547;{result.price_min}</span>
                      <span>High: &#2547;{result.price_max}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-stone-800 overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-600 rounded-full" />
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight pt-1">
                      Based on standard labor rates across {selectedArea} with zero middleman surcharge.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <BadgeCheck className="size-4" />
                    Price Lock Protection
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Book any technician below with this estimated diagnostic fee locked in your escrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Matched Technicians Section */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                    Smart Match Results
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                    Top Verified Specialists for this Diagnostic
                  </h2>
                </div>
                <p className="text-xs font-medium text-stone-500">
                  Ranked by ML diagnostic fit, area proximity, and verified rating
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {result.matched_providers.map((provider) => (
                  <article
                    key={provider.id}
                    className="flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={provider.image_url}
                          alt={provider.name}
                          className="size-14 rounded-2xl object-cover border border-amber-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop";
                          }}
                        />
                        <div>
                          <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                            {provider.name}
                          </h3>
                          <span className="text-xs text-stone-500 font-medium">
                            {provider.category} &bull; {provider.years_experience} yrs exp
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-800 shrink-0">
                        <Sparkles className="size-3 text-amber-600" />
                        {provider.match_score}% Match
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-xs font-medium text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-stone-400" />
                        <span>{provider.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="size-3.5 fill-current" />
                          <span>{provider.rating.toFixed(1)}</span>
                          <span className="text-stone-400 font-normal">({provider.review_count})</span>
                        </div>
                        <span className="text-stone-500 text-[11px]">{provider.response_time}</span>
                      </div>
                    </div>

                    {/* Service info */}
                    <div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs">
                      <span className="text-stone-400 font-semibold block text-[10px] uppercase">
                        Matched Service
                      </span>
                      <strong className="text-stone-800 font-bold block truncate">
                        {provider.service_name}
                      </strong>
                      <span className="text-amber-800 font-extrabold mt-1 block">
                        &#2547;{provider.service_price ? Number(provider.service_price).toFixed(0) : Number(provider.starting_price).toFixed(0)} starting
                      </span>
                    </div>

                    <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewProfile(provider.id)}
                        className="rounded-xl border border-stone-200 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBookProvider(provider.id)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-brand-ink py-2.5 text-xs font-bold text-amber-300 hover:bg-black transition-colors"
                      >
                        Book Now
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
