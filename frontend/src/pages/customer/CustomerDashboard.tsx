import { useEffect, useState, type FormEvent } from "react";
import { Bookmark, CalendarCheck, MessageSquareWarning, Send, Settings, Star, UserRound } from "lucide-react";
import {
  ApiError,
  createDispute,
  createReview,
  listBookings,
  listDisputes,
  listFavoriteProviders,
  listReviews,
  removeFavoriteProvider,
  type ApiBooking,
  type ApiDispute,
  type ApiFavoriteProvider,
  type ApiReview,
} from "../../api/client";
import { adaptBooking, adaptProvider } from "../../api/adapters";
import { useAuth } from "../../auth/AuthProvider";
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
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [apiBookings, setApiBookings] = useState<ApiBooking[]>([]);
  const [favorites, setFavorites] = useState<ApiFavoriteProvider[]>([]);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [disputes, setDisputes] = useState<ApiDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeBookingId, setDisputeBookingId] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [profileName, setProfileName] = useState(user?.first_name ?? "");
  const [profileLastName, setProfileLastName] = useState(user?.last_name ?? "");
  const [profilePhone, setProfilePhone] = useState(user?.phone ?? "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [removingFavorite, setRemovingFavorite] = useState<number | null>(null);

  async function reloadData() {
    setLoading(true);
    setLoadError("");
    try {
      const [bookingPage, favoritePage, reviewPage, disputePage] = await Promise.all([
        listBookings(), listFavoriteProviders(), listReviews(undefined, true), listDisputes(),
      ]);
      setApiBookings(bookingPage.results);
      setFavorites(favoritePage.results);
      setReviews(reviewPage.results);
      setDisputes(disputePage.results);
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : "Could not load your account data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void reloadData(); }, []);

  const bookingViews = apiBookings.map(adaptBooking);
  const favoriteViews = favorites.map((favorite) => ({
    id: favorite.id,
    provider: adaptProvider(favorite.provider),
    favoriteId: favorite.id,
  }));
  const upcomingCount = apiBookings.filter((booking) => ["requested", "confirmed", "reschedule_requested"].includes(booking.status)).length;
  const eligibleReviewCount = apiBookings.filter((booking) => booking.status === "completed" && !reviews.some((review) => review.booking === booking.id)).length;

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewBookingId) return;
    setActionError("");
    try {
      await createReview({ booking: Number(reviewBookingId), rating: reviewRating, body: reviewText.trim() });
      setReviewBookingId(null);
      setReviewText("");
      setReviewRating(5);
      await reloadData();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Review could not be submitted.");
    }
  }

  async function submitDispute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    try {
      await createDispute({ booking_id: Number(disputeBookingId), description: disputeDescription.trim() });
      setDisputeOpen(false);
      setDisputeDescription("");
      setDisputeBookingId("");
      await reloadData();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Dispute could not be submitted.");
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    try {
      await updateAuthProfile({ first_name: profileName.trim(), last_name: profileLastName.trim(), phone: profilePhone.trim() });
      setProfileSaved(true);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Profile could not be saved.");
    }
  }

  async function removeFavorite(favoriteId: number) {
    setRemovingFavorite(favoriteId);
    setActionError("");
    try {
      await removeFavoriteProvider(favoriteId);
      setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not remove this provider.");
    } finally {
      setRemovingFavorite(null);
    }
  }

  return (
    <DashboardShell title="Customer dashboard" subtitle="Manage bookings, saved providers, reviews, and account settings." nav={nav}>
      {loadError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800" role="alert">{loadError}<button className="ml-2 font-bold underline" onClick={() => void reloadData()}>Retry</button></p>}
      {actionError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800" role="alert">{actionError}</p>}
      {loading && <p className="rounded-2xl border border-white bg-white/90 p-4 text-sm font-semibold text-warm-700" role="status">Loading your account…</p>}

      <div id="customer-overview" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Upcoming" value={String(upcomingCount)} detail="active booking requests" icon={CalendarCheck} />
        <StatCard label="Review eligible" value={String(eligibleReviewCount)} detail="completed bookings" icon={Star} />
        <StatCard label="Saved providers" value={String(favorites.length)} detail="ready to rebook" icon={Bookmark} />
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
              {bookingViews.map((booking) => (
                <tr key={booking.id} className="border-t border-warm-100">
                  <td className="px-5 py-4 font-semibold text-warm-900">{booking.id}</td>
                  <td className="px-5 py-4">{booking.provider}</td>
                  <td className="px-5 py-4">{booking.service}</td>
                  <td className="px-5 py-4">{booking.date}</td>
                  <td className="px-5 py-4">
                    <Badge tone={booking.status === "Completed" ? "success" : booking.status === "Dispute Open" ? "warning" : "info"}>{booking.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    {booking.reviewEligible && !reviews.some((review) => review.booking === Number(booking.id)) ? (
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
              Rating
              <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="focus-ring min-h-11 w-32 rounded-xl border border-warm-200 bg-white px-3 text-sm">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
              </select>
            </label>
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
            {favoriteViews.map(({ id, provider, favoriteId }) => {
              return (
                <div key={id} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-warm-200 bg-white p-3 sm:gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <img src={provider.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-warm-900">{provider.name}</p>
                      <p className="truncate text-sm text-warm-600">{provider.category} in {provider.area}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2"><Button className="px-3 sm:px-4" variant="secondary" onClick={() => onSelectProvider(provider, "booking")}>Rebook</Button>{favoriteId !== null && <Button className="px-3" variant="ghost" disabled={removingFavorite === favoriteId} aria-label={`Remove ${provider.name} from saved providers`} onClick={() => void removeFavorite(favoriteId)}>×</Button>}</div>
                </div>
              );
            })}
          </div>
          {!loading && favoriteViews.length === 0 && <p className="mt-4 rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4 text-sm text-warm-600">You have no saved providers yet. Save a provider from search results.</p>}
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
          {disputeOpen ? (
            <form className="mt-4 grid gap-3" onSubmit={submitDispute}>
              <label className="grid gap-2 text-sm font-semibold text-warm-800">Booking
                <select required value={disputeBookingId} onChange={(event) => setDisputeBookingId(event.target.value)} className="focus-ring min-h-11 rounded-xl border border-warm-200 bg-white px-3 text-sm font-normal"><option value="">Select a booking</option>{bookingViews.filter((booking) => ["Completed", "Confirmed"].includes(booking.status)).map((booking) => <option key={booking.id} value={booking.id}>{booking.id} · {booking.service}</option>)}</select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-warm-800">What happened?
                <textarea required minLength={10} rows={3} value={disputeDescription} onChange={(event) => setDisputeDescription(event.target.value)} className="focus-ring w-full rounded-xl border border-warm-200 p-3 text-sm font-normal" placeholder="Describe the issue and related booking." />
              </label>
              <div className="flex flex-wrap gap-2"><Button type="submit">Send report</Button><Button type="button" variant="ghost" onClick={() => setDisputeOpen(false)}>Cancel</Button></div>
            </form>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4">
              <p className="text-sm text-warm-600">{disputes.length ? `${disputes.length} report${disputes.length === 1 ? "" : "s"} on your account.` : "No open reports. Submit a report for a confirmed or completed booking."}</p>
              {disputes.map((dispute) => <p key={dispute.id} className="mt-2 text-xs text-warm-600">#{dispute.id} · {dispute.status.replace(/_/g, " ")}</p>)}
              <Button className="mt-3" variant="secondary" onClick={() => setDisputeOpen(true)}>Start a report</Button>
            </div>
          )}
        </Card>

        <Card id="customer-reviews" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><Star className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Community</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Your reviews</h2></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-warm-600">{reviews.length ? `${reviews.length} review${reviews.length === 1 ? "" : "s"} submitted from completed bookings.` : "Reviews can be added to eligible completed bookings from the booking list."}</p>
          {reviews.map((review) => <p key={review.id} className="mt-2 text-xs text-warm-600">{review.rating}/5 · {review.body}</p>)}
        </Card>

        <Card id="customer-settings" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><Settings className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Account</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Profile settings</h2></div>
          </div>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={saveProfile}>
            <label className="grid gap-1.5 text-xs font-bold text-warm-700">First name<input required value={profileName} onChange={(event) => { setProfileName(event.target.value); setProfileSaved(false); }} className="focus-ring min-h-11 rounded-xl border border-warm-200 px-3 text-sm font-medium" /></label>
            <label className="grid gap-1.5 text-xs font-bold text-warm-700">Last name<input value={profileLastName} onChange={(event) => { setProfileLastName(event.target.value); setProfileSaved(false); }} className="focus-ring min-h-11 rounded-xl border border-warm-200 px-3 text-sm font-medium" /></label>
            <label className="grid gap-1.5 text-xs font-bold text-warm-700">Phone number<input required inputMode="tel" value={profilePhone} onChange={(event) => { setProfilePhone(event.target.value); setProfileSaved(false); }} className="focus-ring min-h-11 rounded-xl border border-warm-200 px-3 text-sm font-medium" /></label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><Button type="submit">Save profile</Button>{profileSaved && <span className="text-sm font-semibold text-amber-900" role="status">Profile saved.</span>}</div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
