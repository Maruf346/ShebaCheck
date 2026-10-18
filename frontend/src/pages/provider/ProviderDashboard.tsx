import { BadgeCheck, CalendarClock, CheckCircle2, Image, ListChecks, MessageSquare, RefreshCcw, ShieldCheck, UserCheck, XCircle } from "lucide-react";
import { providerRequests } from "../../data/mockData";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InputField } from "../../components/ui/InputField";
import { StatCard } from "../../components/ui/StatCard";

const nav = [
  { label: "Overview", icon: BadgeCheck },
  { label: "Booking Requests", icon: CalendarClock },
  { label: "Services", icon: ListChecks },
  { label: "Availability", icon: RefreshCcw },
  { label: "Portfolio", icon: Image },
  { label: "Reviews", icon: MessageSquare },
  { label: "Verification", icon: UserCheck }
];

export function ProviderDashboard() {
  return (
    <DashboardShell title="Provider dashboard" subtitle="Manage requests, schedule, services, verification, and reputation." nav={nav}>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Demo earnings" value="৳48.6k" detail="last 30 days" icon={BadgeCheck} />
        <StatCard label="Completion" value="96%" detail="accepted jobs" icon={CheckCircle2} />
        <StatCard label="Response time" value="12m" detail="median demo value" icon={CalendarClock} />
        <StatCard label="Verification" value="3/4" detail="steps complete" icon={ShieldCheck} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-warm-200 p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-warm-900">Booking requests and appointments</h2>
            <p className="mt-1 text-sm text-warm-600">Actions are UI-only and ready for later DRF integration.</p>
          </div>
          <Button variant="secondary">Set unavailable dates</Button>
        </div>
        <div className="grid gap-4 p-5">
          {providerRequests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-warm-200 p-4">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-warm-900">{request.service}</p>
                    <Badge tone={request.status === "New request" ? "info" : request.status === "Needs reschedule" ? "warning" : "success"}>{request.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-warm-600">{request.customer} · {request.area} · {request.slot}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <Button icon={<CheckCircle2 className="h-4 w-4" />}>Accept</Button>
                  <Button variant="secondary" icon={<RefreshCcw className="h-4 w-4" />}>Reschedule</Button>
                  <Button variant="secondary" icon={<XCircle className="h-4 w-4" />}>Reject</Button>
                  <Button variant="secondary">Mark complete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-warm-900">Services and prices</h2>
          <div className="mt-4 grid gap-4">
            <InputField label="Primary service" value="Electrical inspection" readOnly />
            <InputField label="Starting price" value="৳650" readOnly />
            <InputField label="Service areas" value="Mirpur, Kazipara, Agargaon" readOnly />
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold text-warm-900">Profile verification</h2>
          <div className="mt-4 grid gap-3">
            {["NID checked", "Phone verified", "Work portfolio reviewed", "Reference check pending"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-warm-200 p-3">
                <span className="font-semibold text-warm-800">{item}</span>
                <Badge tone={index < 3 ? "success" : "warning"}>{index < 3 ? "Complete" : "Pending"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
