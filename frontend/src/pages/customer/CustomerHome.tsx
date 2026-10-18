import { CalendarCheck, CheckCircle2, MapPin, Search, ShieldCheck, Star, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { categories, providers } from "../../data/mockData";
import type { AppPage } from "../../types";
import { ProviderCard } from "../../components/ProviderCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InputField } from "../../components/ui/InputField";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function CustomerHome({ setPage }: { setPage: (page: AppPage) => void }) {
  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="inline-flex rounded-full border border-forest-100 bg-forest-50 px-3 py-1 text-sm font-bold text-forest-800">
              Trust-first home services in Dhaka
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-warm-900 md:text-5xl">
              Find skilled professionals you can trust.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-warm-700">
              Compare verified work history, booking completion, customer reviews, and cancellation patterns before you invite someone into your home.
            </p>

            <Card className="mt-8 p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <InputField label="Service" placeholder="Electrical, plumbing, cleaning" />
                <InputField label="Location" placeholder="Mirpur, Dhanmondi, Uttara" />
                <Button className="self-end" icon={<Search className="h-4 w-4" />} onClick={() => setPage("search")}>
                  Search
                </Button>
              </div>
            </Card>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["12k+", "demo completed bookings"],
                ["4.8/5", "average demo rating"],
                ["24 hr", "support response target"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-3">
                  <p className="text-xl font-bold text-warm-900">{value}</p>
                  <p className="text-xs font-semibold text-warm-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Bright Dhaka apartment living room ready for home service"
              className="h-full min-h-[420px] w-full rounded-2xl object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-6 w-6 text-forest-700" aria-hidden="true" />
                <div>
                  <p className="font-bold text-warm-900">Evidence before booking</p>
                  <p className="mt-1 text-sm leading-6 text-warm-600">
                    Verification labels, job history, and review eligibility are shown separately so customers can make a careful choice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading title="Popular categories" body="Browse the most requested services in Dhaka with checked work histories and transparent price ranges." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category.label}
              className="focus-ring rounded-2xl border border-warm-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-forest-200"
              onClick={() => setPage("search")}
            >
              <category.icon className="h-7 w-7 text-forest-700" aria-hidden="true" />
              <p className="mt-4 font-bold text-warm-900">{category.label}</p>
              <p className="mt-1 text-sm text-warm-500">{category.jobs}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading title="Recommended providers" body="Synthetic demo providers using Bangladeshi locations, prices, and trust indicators." />
            <Button variant="secondary" onClick={() => setPage("search")}>
              View all providers
            </Button>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {providers.slice(0, 2).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onProfile={() => setPage("profile")} onBook={() => setPage("booking")} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <SectionHeading title="How ShebaCheck works" body="The marketplace flow is simple, but the decision support is evidence-backed." />
        {[
          [Search, "Search and compare", "Filter by area, budget, rating, availability, and verification status."],
          [ShieldCheck, "Review trust signals", "Read booking history, cancellation rate, response time, and eligible customer reviews."],
          [CalendarCheck, "Book clearly", "Confirm address, timing, estimated price, and cancellation terms before requesting service."]
        ].map(([Icon, title, body]) => (
          <Card key={String(title)} className="p-6">
            <Icon className="h-8 w-8 text-forest-700" aria-hidden="true" />
            <h3 className="mt-5 text-lg font-bold text-warm-900">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-warm-600">{body as string}</p>
          </Card>
        ))}
      </section>

      <section className="bg-forest-900 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-emerald-200">Trust and safety</p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Verification is a signal, not a label of character.</h2>
            <p className="mt-3 text-base leading-7 text-emerald-50/85">
              ShebaCheck presents multiple indicators side by side so customers do not have to rely on a single badge.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [CheckCircle2, "Review eligibility", "Only completed demo bookings can be reviewed."],
              [UsersRound, "Dispute reports", "Customers can document issues for operations review."],
              [Star, "Balanced ratings", "Ratings are paired with volume, recency, and cancellation data."]
            ].map(([Icon, title, body]) => (
              <div key={String(title)} className="rounded-2xl border border-white/15 bg-white/8 p-5">
                <Icon className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <p className="mt-4 font-bold">{title as string}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/80">{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading title="Customer testimonials" body="Illustrative customer feedback for the prototype experience." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["I could see job history before calling.", "The cancellation terms were clear.", "Saved provider lists made repeat work easier."].map((quote, index) => (
            <Card key={quote} className="p-6">
              <p className="text-sm leading-6 text-warm-700">“{quote}”</p>
              <p className="mt-4 font-bold text-warm-900">{["Sadia, Dhanmondi", "Muntasir, Uttara", "Nabila, Mohammadpur"][index]}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-warm-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-warm-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold text-warm-900">ShebaCheck demo frontend</p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Built for Dhaka service discovery, using synthetic demo data.
          </p>
        </div>
      </footer>
    </main>
  );
}
