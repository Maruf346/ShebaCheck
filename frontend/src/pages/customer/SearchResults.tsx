import { Filter, SlidersHorizontal } from "lucide-react";
import { providers } from "../../data/mockData";
import type { Provider } from "../../types";
import { ProviderCard } from "../../components/ProviderCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SelectField } from "../../components/ui/SelectField";

export function SearchResults({ onSelectProvider }: { onSelectProvider: (provider: Provider, page: "profile" | "booking") => void }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="surface h-fit p-5">
        <div className="flex items-center gap-2 border-b border-warm-200 pb-4">
          <Filter className="h-5 w-5 text-amber-700" aria-hidden="true" />
          <h2 className="font-bold text-warm-900">Filters</h2>
        </div>
        <div className="mt-5 grid gap-4">
          <SelectField label="Category" options={["All services", "Electrical", "Plumbing", "AC Repair", "Cleaning"]} />
          <SelectField label="Area" options={["All Dhaka", "Mirpur", "Dhanmondi", "Uttara", "Mohammadpur"]} />
          <SelectField label="Budget" options={["Any budget", "Under ৳700", "৳700 - ৳1,500", "৳1,500+"]} />
          <SelectField label="Rating" options={["Any rating", "4.8+", "4.5+", "4.0+"]} />
          <SelectField label="Availability" options={["Any time", "Today", "Tomorrow", "This weekend"]} />
          <SelectField label="Verification" options={["All providers", "Verified identity", "Work history checked"]} />
          <Button variant="secondary" icon={<SlidersHorizontal className="h-4 w-4" />}>
            Apply filters
          </Button>
        </div>
      </aside>

      <section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-700">Search results</p>
            <h1 className="mt-2 text-3xl font-bold text-warm-900">Trusted home service providers in Dhaka</h1>
            <p className="mt-2 text-warm-600">{providers.length} demo results for home services near Mirpur, Dhanmondi, Uttara, and Mohammadpur.</p>
          </div>
          <SelectField label="Sort by" options={["Recommended", "Highest Rated", "Most Experienced"]} className="md:w-56" />
        </div>

        <div className="mt-6 grid gap-5">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} onProfile={() => onSelectProvider(provider, "profile")} onBook={() => onSelectProvider(provider, "booking")} />
          ))}
        </div>

        <Card className="mt-6 flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
          <p className="text-sm font-medium text-warm-600">Showing 4 of 24 illustrative provider records.</p>
          <Button variant="secondary">Load more providers</Button>
        </Card>
      </section>
    </main>
  );
}
