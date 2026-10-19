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
      className="home-technician flex min-h-[284px] min-w-0 flex-col p-5 transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgb(180_83_9/13%)] motion-reduce:hover:transform-none card-grid:min-h-72 wide:min-h-[303px] rounded-3xl border border-white bg-white shadow-home-panel md:rounded-panel"
      aria-label={`${technician.name}, ${technician.specialty}`}
    >
      <button
        className="mb-4 flex w-full min-w-0 items-start gap-3.5 rounded-md text-left"
        onClick={onProfile}
        aria-label={`View ${technician.name}'s profile`}
      >
        <span className="relative size-16 shrink-0 [&_img]:size-full [&_img]:rounded-2xl [&_img]:border-2 [&_img]:border-stone-100 [&_img]:object-cover">
          <img
            src={technician.image}
            alt={technician.name}
            width={64}
            height={64}
            loading="lazy"
          />
          <span
            className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-brand-yellow text-white outline outline-2 outline-white"
            title="Verified identity"
          >
            <BadgeCheck size={13} aria-hidden="true" />
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col pt-px">
          <span className="block text-base leading-[23px] font-bold md:text-[15px]">
            {technician.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs leading-4 font-medium text-stone-500 md:text-[11px] [&_svg]:text-brand-amber">
            <Icon size={14} aria-hidden="true" />
            {technician.specialty}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-4 font-medium text-stone-400 md:text-[10px]">
            <MapPin size={12} aria-hidden="true" />
            {technician.area}
          </span>
        </span>
      </button>
      <dl
        className="mb-4 grid grid-cols-3 gap-1 rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-center [&>div:nth-child(2)]:border-x [&>div:nth-child(2)]:border-[#fef0bd] [&_dt]:text-[11px] [&_dt]:leading-[17px] [&_dt]:font-medium [&_dt]:text-stone-500 [&_dd]:flex [&_dd]:items-center [&_dd]:justify-center [&_dd]:gap-0.5 [&_dd]:text-xs [&_dd]:leading-[18px] [&_dd]:font-bold [&_dd]:text-stone-800 [&_dd_svg]:text-brand-yellow"
        aria-label="Provider statistics"
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
      <dl className="mb-4 flex flex-col gap-1.5 text-xs leading-4 md:text-[11px] [&>div]:flex [&>div]:items-start [&>div]:justify-between [&>div]:gap-1.5 [&_dt]:font-medium [&_dt]:text-stone-500 [&_dd]:text-right [&_dd]:font-bold [&_dd:not([data-cancellation])]:text-stone-700">
        <div>
          <dt>Cancellation:</dt>
          <dd
            className="flex items-center justify-end gap-1 text-emerald-600 [&>span]:size-[5px] [&>span]:shrink-0 [&>span]:rounded-full [&>span]:bg-emerald-500"
            data-cancellation
          >
            <span />
            {technician.cancellationRate}% ({technician.cancellationLabel})
          </dd>
        </div>
        <div>
          <dt>{technician.detailLabel}:</dt>
          <dd>{technician.detail}</dd>
        </div>
      </dl>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
        <div>
          <span className="text-[10px] leading-[17px] font-medium text-stone-400">
            {technician.serviceLabel}
          </span>
          <p className="text-[17px] leading-6 font-extrabold">
            <span className="taka">&#2547;</span> {technician.startingPrice}
          </p>
        </div>
        <button
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-10 gap-0.5 px-5 py-[7px] text-xs leading-[18px] md:min-h-[34px] md:px-[18px] bg-brand-amber text-white shadow-home-button hover:bg-[#ed8f00] hover:shadow-home-button-hover"
          aria-label={`Book ${technician.name}`}
          onClick={onBook}
        >
          Book <ChevronRight size={15} />
        </button>
      </div>
    </article>
  );
}
