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
      "Demo NID checked",
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
    tags: ["Demo NID checked", "8 years of experience", "Pressure testing"],
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
    tags: ["Demo NID checked", "9 years of experience", "Leak detection"],
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
      "Demo NID checked",
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
  demo: {
    title: "About this preview",
    paragraphs: [
      "ShebaCheck is a frontend demonstration. All providers, customer stories, identity checks, ratings, completed jobs, cancellation rates, availability, and earnings are illustrative demo data.",
      "The verification process, escrow, insurance, arrival times, and warranty describe the proposed service. No NID, police, payment, or partner API is connected, and no booking or payment is sent.",
      "A verification status describes a document check, not a person's character. Always consider work history, review volume, and cancellation information together.",
    ],
  },
  requirements: {
    title: "Verification requirements",
    paragraphs: [
      "The proposed provider application includes a valid Bangladesh National ID, a current profile photo, a service address, and relevant trade experience.",
      "Identity and address checks, references, and a practical skills assessment would be reviewed separately. A pending check does not imply dishonesty.",
      "This demo does not collect identity documents or conduct verification.",
    ],
  },
  notifications: {
    title: "You're all caught up",
    paragraphs: [
      "There are no new notifications. Booking updates and appointment reminders will appear here once your account is connected.",
    ],
  },
  verification: {
    title: "Background verification policy",
    paragraphs: [
      "The NID badge represents an illustrative identity-check status. No government registry or police record has been queried in this preview.",
      "In the intended service, identity checks, skills assessments, and completed bookings are separate trust indicators. An incomplete check is not evidence of wrongdoing.",
    ],
  },
  warranty: {
    title: "7-day service warranty",
    paragraphs: [
      "The proposed policy covers a recurrence of the same workmanship issue within seven days of a completed booking. Parts and unrelated repairs would be quoted separately.",
      "A customer would report the issue from the completed booking, with photos and a description, for the support team to review. This is a demo policy, not an active service guarantee.",
    ],
  },
  escrow: {
    title: "Dispute resolution & escrow",
    paragraphs: [
      "The proposed workflow lets customers document a problem against a booking and receive an operations review before disputed funds are released.",
      "No funds are held or transferred in this demo. bKash, Nagad, and card payments are proposed payment options, not connected integrations.",
    ],
  },
  support: {
    title: "Safety hotline & dispatch",
    paragraphs: [
      "16216 is placeholder content from the design, not an active ShebaCheck hotline. This preview cannot dispatch a technician or provide emergency assistance.",
      "Booking support and dispute reporting will be available through your account when the service launches.",
    ],
  },
  privacy: {
    title: "Privacy in this preview",
    paragraphs: [
      "This frontend does not send your search, address, or booking information to a server. A saved-provider preference may be stored locally in this browser.",
      "The production privacy policy will describe data collection, retention, identity verification, and account deletion before real accounts are enabled. Please use sample information in the demo.",
    ],
  },
  terms: {
    title: "Demo terms of service",
    paragraphs: [
      "Prices, availability, earnings, warranties, and trust indicators are examples for evaluating the interface. They are not live offers or confirmed service commitments.",
      "Submitting a demo booking does not schedule a real appointment or create a payment obligation.",
    ],
  },
} as const;

export type HomeDialogKind = keyof typeof homeDialogContent;
