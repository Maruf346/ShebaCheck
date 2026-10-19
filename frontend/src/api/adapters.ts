import type { ApiBooking, ApiProvider } from "./client";
import type { Booking, Provider } from "../types";
import type { HomeTechnician } from "../data/homeContent";

const fallbackImages: Record<string, string> = {
  Electrical: "/images/providers/rafiqul-islam.jpg",
  "AC Repair": "/images/providers/tanvir-hossain.jpg",
  Plumbing: "/images/providers/belal-ahmed.jpg",
  "Appliance Repair": "/images/providers/sumon-mia.jpg",
  Cleaning: "/images/providers/sumon-mia.jpg",
};

export function adaptProvider(provider: ApiProvider): Provider {
  return {
    id: provider.id,
    name: provider.name,
    category: provider.category,
    area: provider.area,
    rating: Number(provider.rating ?? 0),
    reviews: Number(provider.reviews ?? 0),
    verifiedIdentity: provider.verified_identity,
    completedJobs: Number(provider.completed_jobs ?? 0),
    cancellationRate: Number(provider.cancellation_rate ?? 0),
    responseTime: provider.response_time || "Response time not yet available",
    startingPrice: Number(provider.starting_price ?? 0),
    image: provider.image || fallbackImages[provider.category] || "/images/providers/featured-technician.jpg",
    bio: provider.bio,
    tags: provider.tags ?? [],
    portfolio: (provider.portfolio ?? []).map((item) => item.title),
    services: (provider.services ?? []).map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: Number(service.price),
    })),
  };
}

export function adaptHomeTechnician(provider: ApiProvider): HomeTechnician {
  const adapted = adaptProvider(provider);
  return {
    ...adapted,
    specialty: provider.services[0]?.name || provider.category || "Home service professional",
    years: provider.years_experience,
    zones: provider.area ? [provider.area] : [],
    cancellationLabel: Number(provider.cancellation_rate) < 2 ? "Low" : "Typical",
    detailLabel: "Response time",
    detail: provider.response_time || "Contact for availability",
    serviceLabel: provider.services[0]?.name || "View available services",
  };
}

const bookingStatuses: Record<ApiBooking["status"], Booking["status"]> = {
  requested: "Requested",
  confirmed: "Confirmed",
  reschedule_requested: "Requested",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Cancelled",
  dispute_open: "Dispute Open",
};

export function adaptBooking(booking: ApiBooking): Booking & { providerId: number; appointmentAt: string } {
  return {
    id: String(booking.id),
    provider: booking.provider_name,
    service: booking.service_name,
    area: booking.area,
    date: new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(booking.appointment_at)),
    status: bookingStatuses[booking.status],
    price: Number(booking.price_estimate),
    reviewEligible: booking.status === "completed",
    providerId: booking.provider,
    appointmentAt: booking.appointment_at,
  };
}
