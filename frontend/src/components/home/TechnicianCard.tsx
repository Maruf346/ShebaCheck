import {
  AirVent,
  BadgeCheck,
  ChevronRight,
  MapPin,
  Refrigerator,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import type { HomeTechnician } from "../../data/homeContent";

const serviceIcons = {
  Electrical: Zap,
  "AC Repair": AirVent,
  Plumbing: Wrench,
  "Appliance Repair": Refrigerator,
};

export function TechnicianCard({
  technician,
  onProfile,
  onBook,
}: {
  technician: HomeTechnician;
  onProfile: () => void;
  onBook: () => void;
}) {
  const Icon =
    serviceIcons[technician.category as keyof typeof serviceIcons] ?? Wrench;
  return (
    <article
      className="home-technician home-white-panel"
      aria-label={`${technician.name}, ${technician.specialty}`}
    >
      <button
        className="home-technician-profile"
        onClick={onProfile}
        aria-label={`View ${technician.name}'s profile`}
      >
        <span className="home-technician-avatar">
          <img
            src={technician.image}
            alt={technician.name}
            width={64}
            height={64}
            loading="lazy"
          />
          <span className="home-technician-check" title="Demo NID verified">
            <BadgeCheck size={13} aria-hidden="true" />
          </span>
        </span>
        <span className="home-technician-identity">
          <span className="home-technician-name">{technician.name}</span>
          <span className="home-technician-specialty">
            <Icon size={14} aria-hidden="true" />
            {technician.specialty}
          </span>
          <span className="home-technician-area">
            <MapPin size={12} aria-hidden="true" />
            {technician.area}
          </span>
        </span>
      </button>
      <dl
        className="home-technician-stats"
        aria-label="Illustrative provider statistics"
      >
        <div>
          <dt>Exp.</dt>
          <dd>{technician.years} Yrs</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>
            <Star size={12} fill="currentColor" aria-hidden="true" />
            {technician.rating.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt>Jobs</dt>
          <dd>{technician.completedJobs}+</dd>
        </div>
      </dl>
      <dl className="home-technician-details">
        <div>
          <dt>Cancellation:</dt>
          <dd className="home-cancellation">
            <span />
            {technician.cancellationRate}% ({technician.cancellationLabel})
          </dd>
        </div>
        <div>
          <dt>{technician.detailLabel}:</dt>
          <dd>{technician.detail}</dd>
        </div>
      </dl>
      <div className="home-technician-booking">
        <div>
          <span className="home-service-label">{technician.serviceLabel}</span>
          <p className="home-technician-price">
            <span className="taka">&#2547;</span> {technician.startingPrice}
          </p>
        </div>
        <button
          className="home-button home-button--amber"
          aria-label={`Book ${technician.name}`}
          onClick={onBook}
        >
          Book <ChevronRight size={15} />
        </button>
      </div>
    </article>
  );
}
