import { BarChart3, CalendarCheck, Clock3, ShieldCheck, Star } from "lucide-react";
import { providers, servicePrices, trustExplainers } from "../../data/mockData";
import type { AppPage } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";

const provider = providers[0];

export function ProviderProfile({ setPage }: { setPage: (page: AppPage) => void }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[360px_1fr]">
          <img src={provider.image} alt={`${provider.name} work profile`} className="h-80 w-full object-cover lg:h-full" />
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-forest-700">{provider.category} specialist</p>
                <h1 className="mt-2 text-3xl font-bold text-warm-900">{provider.name}</h1>
                <p className="mt-3 max-w-2xl leading-7 text-warm-700">{provider.bio}</p>
              </div>
              <Button onClick={() => setPage("booking")}>Book This Provider</Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Star} label="Rating" value={`${provider.rating}/5`} detail={`${provider.reviews} reviews`} />
              <Metric icon={CalendarCheck} label="Completed" value={`${provider.completedJobs}`} detail="demo bookings" />
              <Metric icon={Clock3} label="Response" value="12 min" detail="median demo time" />
              <Metric icon={BarChart3} label="Cancellation" value={`${provider.cancellationRate}%`} detail="accepted jobs" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="success">Verified identity</Badge>
              <Badge tone="info">Mirpur service area</Badge>
              <Badge tone="neutral">Starts from ৳{provider.startingPrice}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Card className="p-6">
            <SectionHeading title="Services and estimated prices" body="Estimates are shown before booking and final price can be adjusted after diagnosis." />
            <div className="mt-5 grid gap-3">
              {servicePrices.map((service) => (
                <div key={service.name} className="flex flex-col justify-between gap-2 rounded-xl border border-warm-200 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-bold text-warm-900">{service.name}</p>
                    <p className="text-sm text-warm-600">{service.note}</p>
                  </div>
                  <p className="font-bold text-forest-800">{service.price}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading title="Portfolio and completed booking history" body="Work examples are tied to synthetic booking records for this frontend prototype." />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {provider.portfolio.map((item) => (
                <div key={item} className="rounded-xl border border-warm-200 bg-warm-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-forest-700" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold leading-6 text-warm-800">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeading title="Verified customer reviews" body="Only completed bookings can create reviews in the intended product flow." />
            <div className="mt-5 grid gap-4">
              {["Professional, clean work and explained the breaker issue clearly.", "Arrived within the appointment window and gave a written parts estimate."].map((review, index) => (
                <div key={review} className="rounded-xl border border-warm-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-warm-900">{["Farhana Akter", "Tanim Rahman"][index]}</p>
                    <Badge tone="success">Completed booking</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-warm-700">{review}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="grid h-fit gap-6">
          <Card className="p-6">
            <SectionHeading title="Rating breakdown" />
            {[
              ["5 star", "82%"],
              ["4 star", "14%"],
              ["3 star", "3%"],
              ["2 star", "1%"]
            ].map(([label, value]) => (
              <div key={label} className="mt-4">
                <div className="mb-1 flex justify-between text-sm font-semibold text-warm-700">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-warm-100">
                  <div className="h-2 rounded-full bg-forest-600" style={{ width: value }} />
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <SectionHeading title="How trust indicators are calculated" />
            <div className="mt-5 grid gap-4">
              {trustExplainers.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="mt-1 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-warm-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-warm-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Star; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-warm-200 bg-warm-50 p-4">
      <Icon className="h-5 w-5 text-forest-700" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-warm-900">{value}</p>
      <p className="text-xs text-warm-500">{detail}</p>
    </div>
  );
}
