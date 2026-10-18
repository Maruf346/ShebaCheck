import { Bookmark, CalendarCheck, MessageSquareWarning, Settings, Star, UserRound } from "lucide-react";
import { bookings, providers } from "../../data/mockData";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";

const nav = [
  { label: "Overview", icon: UserRound },
  { label: "Bookings", icon: CalendarCheck },
  { label: "Reviews", icon: Star },
  { label: "Saved Providers", icon: Bookmark },
  { label: "Dispute Reports", icon: MessageSquareWarning },
  { label: "Profile Settings", icon: Settings }
];

export function CustomerDashboard() {
  return (
    <DashboardShell title="Customer dashboard" subtitle="Manage bookings, saved providers, reviews, and account settings." nav={nav}>
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Upcoming" value="1" detail="confirmed booking" icon={CalendarCheck} />
        <StatCard label="Review eligible" value="1" detail="completed booking" icon={Star} />
        <StatCard label="Saved providers" value="3" detail="ready to rebook" icon={Bookmark} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-warm-200 p-5">
          <h2 className="text-xl font-bold text-warm-900">Upcoming and past bookings</h2>
          <p className="mt-1 text-sm text-warm-600">Review actions appear only for eligible completed demo bookings.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-warm-50 text-xs uppercase tracking-[0.12em] text-warm-500">
              <tr>
                {["Booking", "Provider", "Service", "Date", "Status", "Action"].map((head) => (
                  <th key={head} className="px-5 py-3 font-bold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-warm-100">
                  <td className="px-5 py-4 font-semibold text-warm-900">{booking.id}</td>
                  <td className="px-5 py-4">{booking.provider}</td>
                  <td className="px-5 py-4">{booking.service}</td>
                  <td className="px-5 py-4">{booking.date}</td>
                  <td className="px-5 py-4">
                    <Badge tone={booking.status === "Completed" ? "success" : booking.status === "Dispute Open" ? "warning" : "info"}>{booking.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button variant={booking.reviewEligible ? "primary" : "secondary"} disabled={!booking.reviewEligible}>
                      {booking.reviewEligible ? "Write review" : "Not eligible"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-warm-900">Saved providers</h2>
          <div className="mt-4 grid gap-3">
            {providers.slice(0, 3).map((provider) => (
              <div key={provider.id} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-warm-200 p-3 sm:gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <img src={provider.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-warm-900">{provider.name}</p>
                    <p className="truncate text-sm text-warm-600">{provider.category} in {provider.area}</p>
                  </div>
                </div>
                <Button className="shrink-0 px-3 sm:px-4" variant="secondary">Rebook</Button>
              </div>
            ))}
          </div>
        </Card>
        <EmptyState
          title="No open dispute reports"
          body="When a customer files a dispute, the case timeline and evidence upload status will appear here."
          action="Start a report"
        />
      </div>
    </DashboardShell>
  );
}
