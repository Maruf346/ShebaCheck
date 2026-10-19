import {
  AirVent,
  Bolt,
  Brush,
  Droplets,
  Refrigerator,
  ShieldCheck,
  Wrench
} from "lucide-react";
import type { AdminCase, Booking, Provider } from "../types";

export const categories = [
  { label: "Electrical", icon: Bolt, jobs: "1,240+ checked jobs" },
  { label: "Plumbing", icon: Droplets, jobs: "960+ checked jobs" },
  { label: "AC Repair", icon: AirVent, jobs: "730+ checked jobs" },
  { label: "Appliance Repair", icon: Refrigerator, jobs: "680+ checked jobs" },
  { label: "Cleaning", icon: Brush, jobs: "1,480+ checked jobs" }
];

export const providers: Provider[] = [
  {
    id: 1,
    name: "Md. Rafiq Hasan",
    category: "Electrical",
    area: "Mirpur",
    rating: 4.9,
    reviews: 186,
    verifiedIdentity: true,
    completedJobs: 412,
    cancellationRate: 1.8,
    responseTime: "Usually replies in 12 min",
    startingPrice: 650,
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
    bio: "Licensed electrical technician focused on safe wiring, breaker repair, lighting installation, and apartment maintenance across Mirpur and nearby areas.",
    tags: ["NID checked", "Repeat customers", "Invoice available"],
    portfolio: [
      "DB board replacement, Mirpur DOHS",
      "Kitchen lighting upgrade, Kazipara",
      "Office socket audit, Agargaon"
    ],
    availability: ["Today", "Tomorrow"]
  },
  {
    id: 2,
    name: "Nusrat Cleaning Care",
    category: "Cleaning",
    area: "Dhanmondi",
    rating: 4.8,
    reviews: 143,
    verifiedIdentity: true,
    completedJobs: 355,
    cancellationRate: 2.4,
    responseTime: "Usually replies in 18 min",
    startingPrice: 1200,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    bio: "A trained two-person home cleaning team for apartments, move-in cleaning, kitchen degreasing, and scheduled maintenance visits.",
    tags: ["Team verified", "Supplies included", "Women-led"],
    portfolio: [
      "Move-in cleaning, Dhanmondi 27",
      "Kitchen deep clean, Green Road",
      "Monthly apartment cleaning, Jigatola"
    ],
    availability: ["Today", "This weekend"]
  },
  {
    id: 3,
    name: "Arman AC Service",
    category: "AC Repair",
    area: "Uttara",
    rating: 4.7,
    reviews: 98,
    verifiedIdentity: true,
    completedJobs: 226,
    cancellationRate: 3.1,
    responseTime: "Usually replies in 24 min",
    startingPrice: 900,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    bio: "Split AC servicing, gas check, water leakage diagnostics, and seasonal maintenance for homes and small offices.",
    tags: ["Tool verified", "Warranty note", "Weekend slots"],
    portfolio: [
      "AC gas pressure service, Uttara Sector 7",
      "Water leakage repair, Airport Road",
      "Pre-season maintenance, Sector 11"
    ],
    availability: ["Tomorrow", "This weekend"]
  },
  {
    id: 4,
    name: "Sheba Plumbing Works",
    category: "Plumbing",
    area: "Mohammadpur",
    rating: 4.6,
    reviews: 74,
    verifiedIdentity: false,
    completedJobs: 131,
    cancellationRate: 4.6,
    responseTime: "Usually replies in 35 min",
    startingPrice: 500,
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
    bio: "Experienced plumbing service for leak repair, basin installation, water line checks, and emergency visits.",
    tags: ["Work history checked", "Photo portfolio", "Transparent pricing"],
    portfolio: [
      "Bathroom leak repair, Mohammadpur",
      "Kitchen basin fitting, Tajmahal Road",
      "Rooftop water line check, Lalmatia"
    ],
    availability: ["Today"]
  }
];

export const servicePrices = [
  { name: "Electrical inspection", price: "৳650 - ৳1,200", note: "Includes basic safety checks" },
  { name: "Switchboard repair", price: "৳800 - ৳1,800", note: "Parts quoted separately" },
  { name: "Ceiling fan installation", price: "৳700 - ৳1,500", note: "Ladder support included" }
];

export const bookings: Booking[] = [
  {
    id: "SC-10241",
    provider: "Md. Rafiq Hasan",
    service: "Electrical inspection",
    area: "Mirpur 10",
    date: "22 Oct, 10:30 AM",
    status: "Confirmed",
    price: 850,
    reviewEligible: false
  },
  {
    id: "SC-10178",
    provider: "Nusrat Cleaning Care",
    service: "Kitchen deep clean",
    area: "Dhanmondi 27",
    date: "12 Oct, 2:00 PM",
    status: "Completed",
    price: 1800,
    reviewEligible: true
  },
  {
    id: "SC-10122",
    provider: "Arman AC Service",
    service: "AC leakage repair",
    area: "Uttara Sector 7",
    date: "05 Oct, 11:00 AM",
    status: "Dispute Open",
    price: 1400,
    reviewEligible: false
  }
];

export const providerRequests = [
  { id: "BR-4921", customer: "Farhana Akter", service: "Switchboard repair", slot: "Today, 4:30 PM", area: "Mirpur 2", status: "New request" },
  { id: "BR-4917", customer: "Tanim Rahman", service: "Ceiling fan install", slot: "Tomorrow, 11:00 AM", area: "Kazipara", status: "Confirmed" },
  { id: "BR-4908", customer: "Office admin", service: "Wiring audit", slot: "24 Oct, 9:30 AM", area: "Agargaon", status: "Needs reschedule" }
];

export const adminCases: AdminCase[] = [
  {
    id: "ML-DEMO-882",
    reviewer: "Demo reviewer A",
    provider: "Demo Provider 13",
    risk: "High",
    reason: "Review velocity spike plus repeated device fingerprint in demo data.",
    evidence: "3 linked demo bookings"
  },
  {
    id: "ML-DEMO-621",
    reviewer: "Demo reviewer B",
    provider: "Demo Provider 08",
    risk: "Medium",
    reason: "Text similarity and unusual rating pattern in illustrative sample.",
    evidence: "2 similar demo reviews"
  },
  {
    id: "ML-DEMO-410",
    reviewer: "Demo reviewer C",
    provider: "Demo Provider 21",
    risk: "Low",
    reason: "Minor timing anomaly, no direct enforcement action suggested.",
    evidence: "1 demo signal"
  }
];

export const trustExplainers = [
  {
    icon: ShieldCheck,
    title: "Identity verification",
    body: "Demo status indicates whether provider identity documents would be checked before display."
  },
  {
    icon: Wrench,
    title: "Completed bookings",
    body: "Counts are based on synthetic completed jobs attached to booking records in this UI demo."
  },
  {
    icon: Bolt,
    title: "Cancellation rate",
    body: "The percentage compares cancelled provider-accepted jobs against all accepted demo bookings."
  }
];
