import { useState, type FormEvent } from "react";
import { Bookmark, CalendarCheck, CheckCircle2, MessageSquareWarning, Send, Settings, Star, UserRound } from "lucide-react";
import { bookings, providers } from "../../data/mockData";
import type { Provider } from "../../types";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";

const nav = [
  { label: "Overview", icon: UserRound, target: "customer-overview" },
  { label: "Bookings", icon: CalendarCheck, target: "customer-bookings" },
  { label: "Reviews", icon: Star, target: "customer-reviews" },
  { label: "Saved Providers", icon: Bookmark, target: "customer-saved" },
  { label: "Dispute Reports", icon: MessageSquareWarning, target: "customer-disputes" },
  { label: "Profile Settings", icon: Settings, target: "customer-settings" }
];

export function CustomerDashboard({
  onSelectProvider,
}: {
  onSelectProvider: (provider: Provider, page: "profile" | "booking") => void;
}) {
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [profileName, setProfileName] = useState("Farhana Akter");
  const [profilePhone, setProfilePhone] = useState("01712345678");
  const [profileSaved, setProfileSaved] = useState(false);

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewSubmitted(true);
    setReviewBookingId(null);
    setReviewText("");
  }

  function submitDispute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisputeSubmitted(true);
    setDisputeOpen(false);
  }

  return (
    <DashboardShell title="Customer dashboard" subtitle="Manage bookings, saved providers, reviews, and account settings." nav={nav}>
      <div id="customer-overview" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Upcoming" value="1" detail="confirmed booking" icon={CalendarCheck} />
        <StatCard label="Review eligible" value="1" detail="completed booking" icon={Star} />
        <StatCard label="Saved providers" value="3" detail="ready to rebook" icon={Bookmark} />
      </div>

      <Card id="customer-bookings" className="scroll-mt-28 overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-warm-200 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg font-bold tracking-tight text-warm-900 sm:text-xl">Upcoming and past bookings</h2>
          <p className="text-sm leading-5 text-warm-600">Review actions are available for eligible completed bookings.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
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
                    {booking.reviewEligible ? (
                      <Button variant="secondary" onClick={() => setReviewBookingId(booking.id)}>
                        <Star className="h-4 w-4" aria-hidden="true" /> Write review
                      </Button>
                    ) : <span className="text-xs font-medium text-warm-500">Not eligible</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {reviewBookingId && (
        <Card className="border-amber-200 bg-amber-50/50 p-4 sm:p-6" role="region" aria-label="Write a booking review">
          <form className="grid gap-4" onSubmit={submitReview}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-800">Booking {reviewBookingId}</p>
              <h2 className="mt-1 text-lg font-bold text-warm-900">How did it go?</h2>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-warm-800">
              Your review
              <textarea required minLength={8} maxLength={600} rows={3} value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="focus-ring w-full resize-y rounded-xl border border-warm-200 bg-white p-3 text-sm font-normal" placeholder="Share details that may help other customers." />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="submit"><Send className="h-4 w-4" aria-hidden="true" /> Submit review</Button>
              <Button type="button" variant="ghost" onClick={() => setReviewBookingId(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}
      {reviewSubmitted && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900" role="status">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Review saved in this demo session.
        </p>
      )}

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <Card id="customer-saved" className="scroll-mt-28 min-w-0 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Your shortlist</p>
              <h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Saved providers</h2>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800"><Bookmark className="h-5 w-5" aria-hidden="true" /></span>
          </div>
          <div className="mt-4 grid gap-3">
            {providers.slice(0, 3).map((provider) => (
              <div key={provider.id} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-warm-200 bg-white p-3 sm:gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <img src={provider.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-warm-900">{provider.name}</p>
                    <p className="truncate text-sm text-warm-600">{provider.category} in {provider.area}</p>
                  </div>
                </div>
                <Button className="shrink-0 px-3 sm:px-4" variant="secondary" onClick={() => onSelectProvider(provider, "booking")}>Rebook</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card id="customer-disputes" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Support</p>
              <h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Dispute reports</h2>
              <p className="mt-1 text-sm leading-5 text-warm-600">Document a concern linked to a completed booking.</p>
            </div>
            <MessageSquareWarning className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          </div>
          {disputeSubmitted ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900" role="status">Demo report received. No case was sent to a service team.</p>
          ) : disputeOpen ? (
            <form className="mt-4 grid gap-3" onSubmit={submitDispute}>
              <label className="grid gap-2 text-sm font-semibold text-warm-800">What happened?
                <textarea required minLength={10} rows={3} className="focus-ring w-full rounded-xl border border-warm-200 p-3 text-sm font-normal" placeholder="Describe the issue and related booking." />
              </label>
              <div className="flex flex-wrap gap-2"><Button type="submit">Send demo report</Button><Button type="button" variant="ghost" onClick={() => setDisputeOpen(false)}>Cancel</Button></div>
            </form>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4">
              <p className="text-sm text-warm-600">No open reports. Start a demo report if a booking needs support.</p>
              <Button className="mt-3" variant="secondary" onClick={() => setDisputeOpen(true)}>Start a report</Button>
            </div>
          )}
        </Card>

        <Card id="customer-reviews" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><Star className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Community</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Your reviews</h2></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-warm-600">{reviewSubmitted ? "Your latest demo review has been saved for this session." : "Reviews can be added to eligible completed bookings from the booking list."}</p>
          {reviewSubmitted && <Badge tone="warning">Saved in demo session</Badge>}
        </Card>

        <Card id="customer-settings" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><Settings className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Account</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Profile settings</h2></div>
          </div>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setProfileSaved(true); }}>
            <label className="grid gap-1.5 text-xs font-bold text-warm-700">Full name<input required value={profileName} onChange={(event) => { setProfileName(event.target.value); setProfileSaved(false); }} className="focus-ring min-h-11 rounded-xl border border-warm-200 px-3 text-sm font-medium" /></label>
            <label className="grid gap-1.5 text-xs font-bold text-warm-700">Phone number<input required inputMode="tel" value={profilePhone} onChange={(event) => { setProfilePhone(event.target.value); setProfileSaved(false); }} className="focus-ring min-h-11 rounded-xl border border-warm-200 px-3 text-sm font-medium" /></label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><Button type="submit">Save profile</Button>{profileSaved && <span className="text-sm font-semibold text-amber-900" role="status">Saved in this demo session.</span>}</div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
