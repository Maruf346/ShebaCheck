import { BriefcaseBusiness, MapPin, ShieldCheck, Star, TimerReset } from "lucide-react";
import type { Provider } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function ProviderCard({
  provider,
  onProfile,
  onBook,
  compact = false
}: {
  provider: Provider;
  onProfile: () => void;
  onBook: () => void;
  compact?: boolean;
}) {
  return (
    <Card className={`overflow-hidden ${compact ? "" : "md:grid md:grid-cols-[220px_1fr]"}`}>
      <img
        src={provider.image}
        alt={`${provider.name}, ${provider.category} professional`}
        className={`${compact ? "h-48" : "h-56 md:h-full"} w-full object-cover`}
      />
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-amber-700">{provider.category}</p>
            <h3 className="mt-1 text-xl font-bold text-warm-900">{provider.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-warm-600">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {provider.area}, Dhaka
            </p>
          </div>
          <Badge tone={provider.verifiedIdentity ? "success" : "neutral"}>
            {provider.verifiedIdentity ? "Verified identity" : "Identity review pending"}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <span className="flex items-center gap-2 text-warm-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <strong>{provider.rating}</strong> ({provider.reviews})
          </span>
          <span className="flex items-center gap-2 text-warm-700">
            <BriefcaseBusiness className="h-4 w-4 text-amber-700" aria-hidden="true" />
            {provider.completedJobs} jobs
          </span>
          <span className="flex items-center gap-2 text-warm-700">
            <TimerReset className="h-4 w-4 text-amber-700" aria-hidden="true" />
            {provider.cancellationRate}% cancel
          </span>
          <span className="flex items-center gap-2 text-warm-700">
            <ShieldCheck className="h-4 w-4 text-amber-700" aria-hidden="true" />
            From ৳{provider.startingPrice}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-warm-600">{provider.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onBook}>Book This Provider</Button>
          <Button variant="secondary" onClick={onProfile}>
            View profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
