import { useEffect, useMemo, useState } from "react";
import { Filter, RotateCcw, SearchX } from "lucide-react";
import { ApiError, listFavoriteProviders, removeFavoriteProvider, saveFavoriteProvider, searchProviders } from "../../api/client";
import { useAuth } from "../../auth/AuthProvider";
import { adaptProvider } from "../../api/adapters";
import type { Provider } from "../../types";
import { ProviderCard } from "../../components/ProviderCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SelectField } from "../../components/ui/SelectField";

export function SearchResults({ onSelectProvider }: { onSelectProvider: (provider: Provider, page: "profile" | "booking") => void }) {
  const { user } = useAuth();
  const [category, setCategory] = useState("All services");
  const [area, setArea] = useState("All Dhaka");
  const [budget, setBudget] = useState("Any budget");
  const [rating, setRating] = useState("Any rating");
  const [availability, setAvailability] = useState("Any time");
  const [verification, setVerification] = useState("All providers");
  const [sortBy, setSortBy] = useState("Recommended");
  const [apiProviders, setApiProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Record<number, number>>({});
  const [favoriteError, setFavoriteError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "customer") { setSavedIds([]); setFavoriteIds({}); return; }
    listFavoriteProviders().then((page) => {
      setSavedIds(page.results.map((favorite) => favorite.provider.id));
      setFavoriteIds(Object.fromEntries(page.results.map((favorite) => [favorite.provider.id, favorite.id])));
    }).catch((error: unknown) => setFavoriteError(error instanceof Error ? error.message : "Could not load saved providers."));
  }, [user]);

  async function toggleFavorite(provider: Provider) {
    setFavoriteError("");
    if (!user || user.role !== "customer") { setFavoriteError("Sign in as a customer to save providers."); return; }
    try {
      if (savedIds.includes(provider.id)) {
        const favoriteId = favoriteIds[provider.id];
        if (favoriteId) await removeFavoriteProvider(favoriteId);
        setSavedIds((ids) => ids.filter((id) => id !== provider.id));
        setFavoriteIds((ids) => { const next = { ...ids }; delete next[provider.id]; return next; });
      } else {
        const favorite = await saveFavoriteProvider(provider.id);
        setSavedIds((ids) => [...ids, provider.id]);
        setFavoriteIds((ids) => ({ ...ids, [provider.id]: favorite.id }));
      }
    } catch (error) { setFavoriteError(error instanceof Error ? error.message : "Could not update saved providers."); }
  }

  const minPrice = budget === "Under ৳700" ? 0 : budget === "৳700 - ৳1,500" ? 700 : budget === "৳1,500+" ? 1500 : undefined;
  const maxPrice = budget === "Under ৳700" ? 699 : budget === "৳700 - ৳1,500" ? 1500 : undefined;
  const minRating = rating === "4.8+" ? 4.8 : rating === "4.5+" ? 4.5 : rating === "4.0+" ? 4 : undefined;
  const ordering = sortBy === "Highest Rated" ? "-average_rating,-review_count" : sortBy === "Lowest Price" ? "starting_price" : sortBy === "Most Reviewed" ? "-review_count" : undefined;
  const availableOn = availability === "Today" ? new Date().toISOString().slice(0, 10) : availability === "Tomorrow" ? new Date(Date.now() + 86400000).toISOString().slice(0, 10) : undefined;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setApiError("");
    searchProviders({
      category: category === "All services" ? undefined : category,
      area: area === "All Dhaka" ? undefined : area,
      min_price: minPrice,
      max_price: maxPrice,
      min_rating: minRating,
      identity_verified: verification === "Verified identity" ? true : undefined,
      available_on: availableOn,
      ordering,
    }).then((response) => {
      if (!active) return;
      setApiProviders(response.results.map(adaptProvider));
    }).catch((error: unknown) => {
      if (!active) return;
      if (error instanceof ApiError && error.status !== 0) {
        setApiError(error.message);
      }
      setApiProviders([]);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [category, area, minPrice, maxPrice, minRating, verification, availableOn, ordering]);

  const visibleProviders = useMemo(() => {
    const filtered = apiProviders.filter((provider) => {
      const categoryMatches = category === "All services" || provider.category === category;
      const areaMatches = area === "All Dhaka" || provider.area.toLowerCase().includes(area.toLowerCase());
      const budgetMatches = budget === "Any budget"
        || (budget === "Under ৳700" && provider.startingPrice < 700)
        || (budget === "৳700 - ৳1,500" && provider.startingPrice >= 700 && provider.startingPrice <= 1500)
        || (budget === "৳1,500+" && provider.startingPrice > 1500);
      const ratingThreshold = rating === "4.8+" ? 4.8 : rating === "4.5+" ? 4.5 : rating === "4.0+" ? 4 : 0;
      const ratingMatches = provider.rating >= ratingThreshold;
      const verificationMatches = verification === "All providers"
        || (verification === "Verified identity" && provider.verifiedIdentity)
        || (verification === "Work history checked" && provider.tags.some((tag) => tag.toLowerCase().includes("work history")));
      return categoryMatches && areaMatches && budgetMatches && ratingMatches && verificationMatches;
    });

    if (sortBy === "Highest Rated") return filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sortBy === "Lowest Price") return filtered.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortBy === "Most Reviewed") return filtered.sort((a, b) => b.reviews - a.reviews);
    return filtered;
  }, [apiProviders, area, budget, category, rating, sortBy, verification]);

  const resetFilters = () => {
    setCategory("All services");
    setArea("All Dhaka");
    setBudget("Any budget");
    setRating("Any rating");
    setAvailability("Any time");
    setVerification("All providers");
    setSortBy("Recommended");
  };

  return (
    <main className="relative z-10 mx-auto grid min-w-0 max-w-7xl gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
      <aside className="surface h-fit min-w-0 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-warm-200 pb-4">
          <Filter className="h-5 w-5 text-amber-700" aria-hidden="true" />
          <h2 className="font-bold text-warm-900">Filters</h2>
        </div>
        <div className="mt-5 grid gap-4">
          <SelectField label="Category" options={["All services", "Electrical", "Plumbing", "AC Repair", "Cleaning"]} value={category} onChange={(event) => setCategory(event.target.value)} />
          <SelectField label="Area" options={["All Dhaka", "Mirpur", "Dhanmondi", "Uttara", "Mohammadpur"]} value={area} onChange={(event) => setArea(event.target.value)} />
          <SelectField label="Budget" options={["Any budget", "Under ৳700", "৳700 - ৳1,500", "৳1,500+"]} value={budget} onChange={(event) => setBudget(event.target.value)} />
          <SelectField label="Rating" options={["Any rating", "4.8+", "4.5+", "4.0+"]} value={rating} onChange={(event) => setRating(event.target.value)} />
          <SelectField label="Availability" options={["Any time", "Today", "Tomorrow", "This weekend"]} value={availability} onChange={(event) => setAvailability(event.target.value)} />
          <SelectField label="Verification" options={["All providers", "Verified identity", "Work history checked"]} value={verification} onChange={(event) => setVerification(event.target.value)} />
          <Button type="button" variant="secondary" onClick={resetFilters} icon={<RotateCcw className="h-4 w-4" />}>
            Reset filters
          </Button>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-700">Search results</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-warm-900 sm:text-3xl">Trusted home service providers in Dhaka</h1>
            <p className="mt-2 text-sm leading-6 text-warm-600">Browse local professionals. Listings reflect live provider data when the API is available.</p>
          </div>
          <SelectField label="Sort by" options={["Recommended", "Highest Rated", "Most Reviewed", "Lowest Price"]} value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full md:w-56" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-b border-warm-200 pb-3 text-sm">
          <p className="font-semibold text-warm-700" role="status">{visibleProviders.length} {visibleProviders.length === 1 ? "provider" : "providers"} found</p>
          <span className="text-xs font-medium text-warm-500">Live API</span>
        </div>

        {apiError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">Could not load providers: {apiError}</p>}
        {favoriteError && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">{favoriteError}</p>}
        {loading && <p className="mt-4 text-sm font-medium text-warm-600" role="status">Loading providers…</p>}

        <div className="mt-5 grid min-w-0 gap-4 sm:gap-5">
          {visibleProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} onProfile={() => onSelectProvider(provider, "profile")} onBook={() => onSelectProvider(provider, "booking")} onSave={() => void toggleFavorite(provider)} isSaved={savedIds.includes(provider.id)} />
          ))}
        </div>

        {!loading && visibleProviders.length === 0 && (
          <Card className="mt-5 flex flex-col items-center gap-3 p-8 text-center" role="status">
            <SearchX className="h-8 w-8 text-amber-700" aria-hidden="true" />
            <h2 className="text-lg font-bold text-warm-900">No matching providers</h2>
            <p className="max-w-md text-sm leading-6 text-warm-600">Try a different area, price range, or verification filter.</p>
            <Button variant="secondary" onClick={resetFilters}>Clear filters</Button>
          </Card>
        )}
      </section>
    </main>
  );
}
