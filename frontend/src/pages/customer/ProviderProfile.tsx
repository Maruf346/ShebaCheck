import { useEffect, useState } from "react";
import { BarChart3, Bolt, CalendarCheck, Clock3, ShieldCheck, Star, Wrench } from "lucide-react";
import { listReviewsForProvider, type ApiReview } from "../../api/client";
import { getBookingServices } from "../../data/bookingServices";
import type { AppPage, Provider } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";

const trustExplainers = [
  {
    icon: ShieldCheck,
    title: "Identity verification",
    body: "Provider identity documents are checked and cross-referenced against government NID records before a profile is displayed."
  },
  {
    icon: Wrench,
    title: "Completed bookings",
    body: "Counts reflect real confirmed bookings that have been marked completed by the provider and acknowledged by the customer."
  },
  {
    icon: Bolt,
    title: "Cancellation rate",
    body: "The percentage of provider-accepted bookings that were later cancelled or declined, out of all accepted bookings."
  }
];

export function ProviderProfile({ setPage, provider }: { setPage: (page: AppPage) => void; provider: Provider }) {
  const servicePrices = getBookingServices(provider).map((service) => ({ ...service, price: `\u09f3${service.price}`, note: "Starting estimate. Parts quoted separately." }));
  const [reviews, setReviews] = useState<ApiReview[]>([]);

  useEffect(() => {
    if (!provider.id) return;
    listReviewsForProvider(provider.id)
      .then((page) => setReviews(page.results))
      .catch(() => undefined);
  }, [provider.id]);

  // Compute rating distribution from real reviews
  const ratingCounts = [5, 4, 3, 2].map((star) => ({
    label: `${star} star`,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const totalReviews = reviews.length;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[360px_1fr]">
          <img src={provider.image} alt={`${provider.name} work profile`} className="h-80 w-full object-cover lg:h-full" />
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-amber-700">{provider.category} specialist</p>
                <h1 className="mt-2 text-3xl font-bold text-warm-900">{provider.name}</h1>
                <p className="mt-3 max-w-2xl leading-7 text-warm-700">{provider.bio}</p>
              </div>
              <Button onClick={() => setPage("booking")}>Book This Provider</Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Star} label="Rating" value={`${provider.rating}/5`} detail={`${provider.reviews} reviews`} />
              <Metric icon={CalendarCheck} label="Completed" value={`${provider.completedJobs}`} detail="completed bookings" />
              <Metric icon={Clock3} label="Response" value={provider.responseTime.replace("Usually replies in ", "")} detail="typical response" />
              <Metric icon={BarChart3} label="Cancellation" value={`${provider.cancellationRate}%`} detail="accepted jobs" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone={provider.verifiedIdentity ? "success" : "neutral"}>{provider.verifiedIdentity ? "Verified identity" : "Identity check pending"}</Badge>
              <Badge tone="info">{provider.area} service area</Badge>
              <Badge tone="neutral">Starts from ৳{provider.startingPrice}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Card className="p-6">
            <SectionHeading title="Services and estimated prices" body="Estimates are shown before booking and the final price can be adjusted after diagnosis." />
            <div className="mt-5 grid gap-3">
              {servicePrices.map((service) => (
                <div key={service.name} className="flex flex-col justify-between gap-2 rounded-xl border border-warm-200 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-bold text-warm-900">{service.name}</p>
                    <p className="text-sm text-warm-600">{service.note}</p>
                  </div>
                  <p className="font-bold text-amber-900">{service.price}</p>
                </div>
              ))}
            </div>
          </Card>

          {provider.portfolio.length > 0 && (
            <Card className="p-6">
              <SectionHeading title="Portfolio" body="Past work samples submitted by this provider." />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {provider.portfolio.map((item) => (
                  <div key={item} className="rounded-xl border border-warm-200 bg-warm-50 p-4">
                    <ShieldCheck className="h-5 w-5 text-amber-700" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold leading-6 text-warm-800">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <SectionHeading title="Verified customer reviews" body="Only customers with completed bookings can leave a review." />
            <div className="mt-5 grid gap-4">
              {reviews.length === 0 && (
                <p className="rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4 text-sm text-warm-600">No reviews yet for this provider.</p>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-warm-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-warm-900">{review.customer_name}</p>
                    <Badge tone="success">{review.rating}/5 ★</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-warm-700">{review.body}</p>
                  {review.provider_reply && (
                    <p className="mt-2 border-l-2 border-amber-400 pl-3 text-sm text-warm-600">Provider reply: {review.provider_reply}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="grid h-fit gap-6">
          <Card className="p-6">
            <SectionHeading title="Rating breakdown" />
            {ratingCounts.map(({ label, count }) => {
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={label} className="mt-4">
                  <div className="mb-1 flex justify-between text-sm font-semibold text-warm-700">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-warm-100">
                    <div className="h-2 rounded-full bg-brand-amber" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {totalReviews === 0 && <p className="mt-4 text-sm text-warm-500">No reviews yet.</p>}
          </Card>

          <Card className="p-6">
            <SectionHeading title="How trust indicators are calculated" />
            <div className="mt-5 grid gap-4">
              {trustExplainers.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
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
      <Icon className="h-5 w-5 text-amber-700" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-warm-900">{value}</p>
      <p className="text-xs text-warm-500">{detail}</p>
    </div>
  );
}
