import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, CalendarCheck, FileCheck2, Gauge, MessageSquareWarning, ShieldQuestion, Users, Wrench } from "lucide-react";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { ApiError, listBookings, listDisputes, listProviderReviews, searchProviders, type ApiDispute, type ApiReview } from "../../api/client";

const nav = [
  { label: "Overview", icon: Gauge, target: "admin-overview" },
  { label: "Users", icon: Users, target: "admin-review-queue" },
  { label: "Providers", icon: Wrench, target: "admin-provider-ops" },
  { label: "Verification", icon: FileCheck2, target: "admin-verification" },
  { label: "Bookings", icon: CalendarCheck, target: "admin-trends" },
  { label: "Reviews", icon: MessageSquareWarning, target: "admin-review-queue" },
  { label: "Disputes", icon: ShieldQuestion, target: "admin-disputes" },
  { label: "ML Monitoring", icon: BarChart3, target: "admin-ml" }
];

export function AdminDashboard() {
  const [reviewedCases, setReviewedCases] = useState<string[]>([]);
  const [providerCount, setProviderCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [disputes, setDisputes] = useState<ApiDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([searchProviders(), listBookings(), listDisputes(), listProviderReviews()])
      .then(([providerPage, bookingPage, disputePage, reviewPage]) => {
        if (!active) return;
        setProviderCount(providerPage.count);
        setBookingCount(bookingPage.count);
        setPendingVerification(providerPage.results.filter((provider) => !provider.verified_identity).length);
        setDisputes(disputePage.results);
        setReviews(reviewPage.results);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof ApiError ? cause.message : "Could not load operations data.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <DashboardShell title="Admin dashboard" subtitle="Operational controls, review quality, verification, disputes, and ML model health." nav={nav} admin>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 font-semibold text-amber-900">
        {loading ? "Loading live operations data…" : error ? `Live data could not be loaded: ${error}` : "Provider, booking, review, and dispute data is live. ML metrics remain illustrative until an evaluation endpoint is connected."}
      </div>

      <div id="admin-overview" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard admin label="Providers" value={String(providerCount)} detail="active provider profiles" icon={Wrench} />
        <StatCard admin label="Bookings" value={String(bookingCount)} detail="saved requests" icon={CalendarCheck} />
        <StatCard admin label="Pending verification" value={String(pendingVerification)} detail="identity review pending" icon={FileCheck2} />
        <StatCard admin label="Open disputes" value={String(disputes.filter((dispute) => ["open", "in_review"].includes(dispute.status)).length)} detail="awaiting operations" icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card id="admin-trends" className="scroll-mt-28 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-warm-900 sm:text-xl">Booking trends and cancellation rates</h2>
          <div className="mt-5 flex h-52 items-end gap-2 rounded-2xl border border-warm-200 bg-warm-50 p-3 sm:mt-6 sm:h-64 sm:gap-3 sm:p-4">
            {[52, 68, 61, 82, 76, 91, 88, 95].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-brand-amber" style={{ height: `${height}%` }} />
                <span className="text-xs font-semibold text-warm-500">W{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Booking growth" value="+12.4%" />
            <MiniMetric label="Cancellation rate" value="3.2%" />
            <MiniMetric label="Dispute rate" value="0.8%" />
          </div>
        </Card>

        <Card id="admin-ml" className="scroll-mt-28 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-warm-900 sm:text-xl">ML performance panel</h2>
          <p className="mt-1 text-sm text-warm-500">Model version: review-risk-demo-v0.3</p>
          <div className="mt-5 grid gap-4">
            {[
              ["Precision", "0.86"],
              ["Recall", "0.74"],
              ["F1-score", "0.79"],
              ["Review queue SLA", "92%"]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-warm-700">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-warm-100">
                  <div className="h-2 rounded-full bg-brand-amber" style={{ width: `${Number(value) ? Number(value) * 100 : 92}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card id="admin-review-queue" className="scroll-mt-28 overflow-hidden">
        <div className="border-b border-warm-200 p-5">
          <h2 className="text-lg font-bold text-warm-900 sm:text-xl">Suspicious review activity</h2>
          <p className="mt-1 text-sm text-warm-500">Risk indicators are demo signals for operator review, not automatic enforcement.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-warm-50 text-xs uppercase tracking-[0.12em] text-warm-500">
              <tr>
                {["Case", "Reviewer", "Provider", "Risk", "Reason summary", "Evidence", "Action"].map((head) => (
                  <th key={head} className="px-5 py-3 font-bold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t border-warm-100">
                  <td className="px-5 py-4 font-semibold text-warm-900">REV-{review.id}</td>
                  <td className="px-5 py-4">{review.customer_name}</td>
                  <td className="px-5 py-4">{review.provider_name}</td>
                  <td className="px-5 py-4"><Badge tone={review.rating <= 2 ? "warning" : "neutral"}>{review.rating} / 5</Badge></td>
                  <td className="px-5 py-4">{review.body}</td>
                  <td className="px-5 py-4 font-semibold text-amber-800">Booking #{review.booking}</td>
                  <td className="px-5 py-4"><Button variant={reviewedCases.includes(String(review.id)) ? "ghost" : "secondary"} disabled={reviewedCases.includes(String(review.id))} onClick={() => setReviewedCases((current) => [...current, String(review.id)])}>{reviewedCases.includes(String(review.id)) ? "Reviewed" : "Mark reviewed"}</Button></td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td className="px-5 py-8 text-center text-warm-600" colSpan={7}>No customer reviews to display yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OpsPanel id="admin-verification" title="Verification management" items={["14 NID checks awaiting manual review", "8 portfolio submissions need evidence quality check", "5 provider reference calls scheduled"]} />
        <OpsPanel id="admin-disputes" title="Dispute management" items={disputes.length ? disputes.map((dispute) => `#${dispute.id} · ${dispute.status.replace(/_/g, " ")} · ${dispute.provider_name}`) : ["No disputes have been opened yet."]} />
        <OpsPanel id="admin-provider-ops" title="Provider operations" items={["Provider records are demo data", "Identity status requires a separate human review", "No automatic enforcement action is enabled"]} />
      </div>
    </DashboardShell>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-warm-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-warm-900">{value}</p>
    </div>
  );
}

function OpsPanel({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <Card id={id} className="scroll-mt-28 p-4 sm:p-6">
      <h2 className="text-lg font-bold text-warm-900 sm:text-xl">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-warm-200 bg-warm-50 p-3 text-sm font-semibold text-warm-700">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}
