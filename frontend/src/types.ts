import type { LucideIcon } from "lucide-react";

export type AppPage =
  | "home"
  | "login"
  | "register"
  | "provider-register"
  | "search"
  | "profile"
  | "booking"
  | "customer-dashboard"
  | "provider-dashboard"
  | "admin-dashboard";

export type StatusTone = "success" | "warning" | "neutral" | "danger" | "info";

export interface NavItem {
  label: string;
  page: AppPage;
  icon?: LucideIcon;
}

export interface Provider {
  id: number;
  name: string;
  category: string;
  area: string;
  rating: number;
  reviews: number;
  verifiedIdentity: boolean;
  completedJobs: number;
  cancellationRate: number;
  responseTime: string;
  startingPrice: number;
  image: string;
  bio: string;
  tags: string[];
  portfolio: string[];
  availability?: ("Today" | "Tomorrow" | "This weekend")[];
  services?: { id: number; name: string; description: string; price: number }[];
}

export interface Booking {
  id: string;
  provider: string;
  service: string;
  area: string;
  date: string;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled" | "Dispute Open";
  price: number;
  reviewEligible: boolean;
}

export interface AdminCase {
  id: string;
  reviewer: string;
  provider: string;
  risk: "Low" | "Medium" | "High";
  reason: string;
  evidence: string;
}
