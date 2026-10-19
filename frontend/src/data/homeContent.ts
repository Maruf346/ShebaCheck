import {
  AirVent,
  Banknote,
  Brush,
  Fingerprint,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import type { Provider } from "../types";

export const homeCategories = [
  { label: "All", icon: null },
  { label: "Electrical", icon: Zap },
  { label: "AC Repair", icon: AirVent },
  { label: "Plumbing", icon: Wrench },
  { label: "Deep Clean", icon: Brush },
] as const;

export const homeZones = [
  "All Zones",
  "Gulshan & Banani",
  "Dhanmondi",
  "Uttara Hub",
  "Mirpur 10",
] as const;
export const homeLocations = [
  "Gulshan 1 & 2",
  "Banani & DOHS",
  "Dhanmondi",
  "Uttara Sectors",
  "Mirpur 10",
  "Mohammadpur",
];
export const locationZones: Record<string, string> = {
  "Gulshan 1 & 2": "Gulshan & Banani",
  "Banani & DOHS": "Gulshan & Banani",
  Dhanmondi: "Dhanmondi",
  "Uttara Sectors": "Uttara Hub",
  "Mirpur 10": "Mirpur 10",
  Mohammadpur: "Mohammadpur",
};

export interface HomeTechnician extends Provider {
  specialty: string;
  years: number;
  zones: string[];
  cancellationLabel: string;
  detailLabel: string;
  detail: string;
  serviceLabel: string;
}

// Synthetic records transcribed from the supplied Figma frame, not verified accounts.
export const homeTechnicians: HomeTechnician[] = [
  {
    id: 101,
    name: "Md. Rafiqul Islam",
    category: "Electrical",
    specialty: "Master Electrician",
    area: "Mirpur 10, Dhaka",
    zones: ["Mirpur 10", "Gulshan & Banani"],
    years: 11,
    rating: 4.9,
    reviews: 186,
    verifiedIdentity: true,
    completedJobs: 342,
    cancellationRate: 1.2,
    cancellationLabel: "Low",
    responseTime: "Usually replies in 12 min",
    startingPrice: 500,
    image: "/images/providers/rafiqul-islam.jpg",
    bio: "An experienced electrical technician specializing in distribution boards, safe home wiring, and electrical diagnostics across Mirpur, Gulshan, and Banani.",
    tags: [
      "Verified NID on file",
      "11 years of experience",
      "7-day service policy",
    ],
    portfolio: [
      "Distribution board replacement, Mirpur 10",
      "Apartment rewiring, Banani",
      "Electrical safety inspection, Gulshan 1",
    ],
    detailLabel: "Warranty",
    detail: "7-Day Free Fix",
    serviceLabel: "Diagnostic Visit",
  },
  {
    id: 102,
    name: "Tanvir Hossain",
    category: "AC Repair",
    specialty: "Inverter AC Specialist",
    area: "Dhanmondi, Dhaka",
    zones: ["Dhanmondi", "Gulshan & Banani"],
    years: 8,
    rating: 4.8,
    reviews: 213,
    verifiedIdentity: true,
    completedJobs: 450,
    cancellationRate: 0.9,
    cancellationLabel: "Exceptional",
    responseTime: "Usually replies in 15 min",
    startingPrice: 850,
    image: "/images/providers/tanvir-hossain.jpg",
    bio: "Inverter AC diagnostics, pressure testing, jet cleaning, and seasonal maintenance for homes and offices in Dhanmondi, Gulshan, and Banani.",
    tags: ["Verified NID on file", "8 years of experience", "Pressure testing"],
    portfolio: [
      "Office inverter AC service, Gulshan 2",
      "AC jet wash, Dhanmondi 27",
      "Cooling performance check, Banani",
    ],
    detailLabel: "Jet Wash Pack",
    detail: "Master Pressure",
    serviceLabel: "AC Master Service",
  },
  {
    id: 103,
    name: "Belal Ahmed",
    category: "Plumbing",
    specialty: "Master Sanitary Tech",
    area: "Uttara Sector 7",
    zones: ["Uttara Hub", "Mirpur 10"],
    years: 9,
    rating: 4.9,
    reviews: 124,
    verifiedIdentity: true,
    completedJobs: 189,
    cancellationRate: 0.8,
    cancellationLabel: "Ultra Low",
    responseTime: "Usually replies in 30 min",
    startingPrice: 400,
    image: "/images/providers/belal-ahmed.jpg",
    bio: "Sanitary installation, concealed leak detection, and water line repairs for apartments across Uttara and Mirpur.",
    tags: ["Verified NID on file", "9 years of experience", "Leak detection"],
    portfolio: [
      "Concealed pipe repair, Uttara Sector 3",
      "Basin installation, Uttara Sector 7",
      "Water line inspection, Mirpur 10",
    ],
    detailLabel: "Response Time",
    detail: "~30 Mins",
    serviceLabel: "Leakage Diagnostic",
  },
  {
    id: 104,
    name: "Sumon Mia",
    category: "Appliance Repair",
    specialty: "Appliance Tech",
    area: "Mohammadpur",
    zones: ["Mohammadpur", "Dhanmondi"],
    years: 7,
    rating: 4.7,
    reviews: 98,
    verifiedIdentity: true,
    completedJobs: 164,
    cancellationRate: 1.4,
    cancellationLabel: "Low",
    responseTime: "Usually replies in 20 min",
    startingPrice: 600,
    image: "/images/providers/sumon-mia.jpg",
    bio: "Refrigerator and washing machine diagnostics, component repairs, and appliance maintenance in Mohammadpur and Dhanmondi.",
    tags: [
      "Verified NID on file",
      "7 years of experience",
      "Parts quoted separately",
    ],
    portfolio: [
      "Refrigerator compressor service, Mohammadpur",
      "Washing machine inspection, Dhanmondi",
      "Appliance maintenance, Lalmatia",
    ],
    detailLabel: "Spare Parts",
    detail: "Original Guaranteed",
    serviceLabel: "Full Inspection",
  },
];

export const featuredTechnician: HomeTechnician = {
  ...homeTechnicians[0],
  id: 100,
  name: "Featured home service professional",
  area: "Gulshan 1, Dhaka",
  image: "/images/providers/featured-technician.jpg",
  startingPrice: 450,
};

export const protectionSteps = [
  {
    title: "100% NID & Police Vetted",
    body: "Every technician undergoes digital verification with the Bangladesh National Identity registry, physical home address check, and trade tests.",
    note: "Biometric records kept on file",
    icon: Fingerprint,
  },
  {
    title: "Locked BDT Pricing & Escrow",
    body: "Never argue about prices at your front door. All rates are locked in Bangladeshi Taka (\u09f3). Payment stays safe in platform escrow until job approval.",
    note: "bKash, Nagad & Card protected",
    icon: Banknote,
  },
  {
    title: "7-Day Workmanship Warranty",
    body: "If an issue resurfaces within 7 days, a senior technician arrives to resolve it without charging any additional labor fee. Dhaka dispute desk mediates 24/7.",
    note: "Free re-service guarantee",
    icon: ShieldCheck,
  },
];

export const homeTestimonials = [
  {
    name: "Nusrat Anam",
    initials: "NA",
    detail: "Dhanmondi, Road 7/A \u2022 Electrical Rewiring",
    quote:
      "Living alone with my elderly mother in Dhanmondi 7/A, technician security was always our biggest hesitation. Seeing the technician's government NID badge and photo beforehand gave us complete peace of mind. Rafiqul bhai fixed our distribution board cleanly.",
  },
  {
    name: "Saif Khan",
    initials: "SK",
    detail: "Gulshan 2 \u2022 Master Inverter AC Repair",
    quote:
      "Our office inverter AC broke down during an intense heatwave in Gulshan 2. Tanvir arrived in exactly 35 minutes with vacuum pump and pressure gauges. The locked \u09f3850 fee on the app meant zero bargaining tension.",
  },
  {
    name: "Tahmina Maliha",
    initials: "TM",
    detail: "Uttara Sector 3 \u2022 Concealed Pipe Repair",
    quote:
      "We had a concealed pipe leak flooding our master bath ceiling in Uttara Sector 3. Plumber Belal diagnosed it accurately within 15 minutes using non-invasive thermal checks. 7-day guarantee gave us total assurance.",
  },
];

export const homeDialogContent = {
  about: {
    title: "About ShebaCheck",
    paragraphs: [
      "ShebaCheck connects verified local service professionals with residential and commercial customers across Dhaka.",
      "Providers are verified through government identity records, trade experience reviews, and customer feedback. Service requests are routed directly to assigned technicians.",
      "Always verify the job requirements and quote details with your technician upon arrival before work begins.",
    ],
  },
  requirements: {
    title: "Verification requirements",
    paragraphs: [
      "Provider applications require a valid Bangladesh National ID, verified mobile number, local service address, and validated trade experience.",
      "Technicians are required to maintain high standards of workmanship, punctuality, and transparent pricing on all assigned bookings.",
      "Customer reviews and completion rates are updated live after every completed service.",
    ],
  },
  notifications: {
    title: "Notifications",
    paragraphs: [
      "All caught up! Booking updates, technician arrivals, and appointment reminders will be delivered to your account dashboard.",
    ],
  },
  verification: {
    title: "Background verification policy",
    paragraphs: [
      "The verified badge indicates provider identity documents and contact details have been vetted and approved.",
      "We check government NID credentials and maintain verified records for all active technicians on the platform.",
    ],
  },
  warranty: {
    title: "7-day service warranty",
    paragraphs: [
      "ShebaCheck covers a recurrence of the same workmanship issue within seven days of a completed booking. If a problem recurs, a technician will re-inspect and resolve the issue.",
      "Customers can easily report issues directly from their completed bookings in the customer dashboard.",
    ],
  },
  escrow: {
    title: "Dispute resolution & escrow",
    paragraphs: [
      "Customer estimates are locked upfront with zero surprise door fees. Payment is only confirmed upon satisfactory job completion.",
      "Our Dhaka operations support team mediates any pricing or workmanship disputes directly through the customer dashboard.",
    ],
  },
  support: {
    title: "Safety hotline & dispatch",
    paragraphs: [
      "Our support and dispatch team is available to assist with booking questions, scheduling adjustments, and service inquiries.",
      "You can also manage appointments and report disputes directly through your customer dashboard.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    paragraphs: [
      "ShebaCheck protects your personal information. Your contact number and address are only shared with the confirmed technician for your booking.",
      "We do not sell or share customer data with third parties. All accounts are managed securely via authenticated sessions.",
    ],
  },
  terms: {
    title: "Terms of service",
    paragraphs: [
      "Bookings submitted through ShebaCheck are sent directly to the selected service provider. Appointments can be rescheduled or cancelled before technician dispatch.",
      "Pricing estimates reflect standard labor and diagnostics; specialized parts or additional repairs require customer consent before installation.",
    ],
  },
} as const;

export type HomeDialogKind = keyof typeof homeDialogContent;
