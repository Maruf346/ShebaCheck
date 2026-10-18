import { AlertTriangle, BarChart3, CalendarCheck, FileCheck2, Gauge, MessageSquareWarning, ShieldQuestion, Users, Wrench } from "lucide-react";
import { adminCases } from "../../data/mockData";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";

const nav = [
  { label: "Overview", icon: Gauge },
  { label: "Users", icon: Users },
  { label: "Providers", icon: Wrench },
  { label: "Verification", icon: FileCheck2 },
  { label: "Bookings", icon: CalendarCheck },
  { label: "Reviews", icon: MessageSquareWarning },
  { label: "Disputes", icon: ShieldQuestion },
  { label: "ML Monitoring", icon: BarChart3 }
];

export function AdminDashboard() {
  return (
    <DashboardShell title="Admin dashboard" subtitle="Operational controls, review quality, verification, disputes, and ML model health." nav={nav} admin>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        All statistics, verification states, and ML predictions on this screen are illustrative demo data.
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard admin label="Providers" value="1,284" detail="demo active records" icon={Wrench} />
        <StatCard admin label="Bookings" value="8,742" detail="demo lifetime total" icon={CalendarCheck} />
        <StatCard admin label="Pending verification" value="93" detail="needs ops review" icon={FileCheck2} />
        <StatCard admin label="Flagged activity" value="27" detail="illustrative signals" icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-950">Booking trends and cancellation rates</h2>
          <div className="mt-6 flex h-64 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {[52, 68, 61, 82, 76, 91, 88, 95].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-forest-700" style={{ height: `${height}%` }} />
                <span className="text-xs font-semibold text-slate-500">W{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Booking growth" value="+12.4%" />
            <MiniMetric label="Cancellation rate" value="3.2%" />
            <MiniMetric label="Dispute rate" value="0.8%" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-950">ML performance panel</h2>
          <p className="mt-1 text-sm text-slate-500">Model version: review-risk-demo-v0.3</p>
          <div className="mt-5 grid gap-4">
            {[
              ["Precision", "0.86"],
              ["Recall", "0.74"],
              ["F1-score", "0.79"],
              ["Review queue SLA", "92%"]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-slate-700">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-forest-700" style={{ width: `${Number(value) ? Number(value) * 100 : 92}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-950">Suspicious review activity</h2>
          <p className="mt-1 text-sm text-slate-500">Risk indicators are demo signals for operator review, not automatic enforcement.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                {["Case", "Reviewer", "Provider", "Risk", "Reason summary", "Evidence", "Action"].map((head) => (
                  <th key={head} className="px-5 py-3 font-bold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-950">{caseItem.id}</td>
                  <td className="px-5 py-4">{caseItem.reviewer}</td>
                  <td className="px-5 py-4">{caseItem.provider}</td>
                  <td className="px-5 py-4">
                    <Badge tone={caseItem.risk === "High" ? "danger" : caseItem.risk === "Medium" ? "warning" : "neutral"}>{caseItem.risk}</Badge>
                  </td>
                  <td className="px-5 py-4">{caseItem.reason}</td>
                  <td className="px-5 py-4 font-semibold text-forest-700">{caseItem.evidence}</td>
                  <td className="px-5 py-4">
                    <Button variant="secondary">Review Case</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OpsPanel title="Verification management" items={["14 NID checks awaiting manual review", "8 portfolio submissions need evidence quality check", "5 provider reference calls scheduled"]} />
        <OpsPanel title="Dispute management" items={["3 booking disputes awaiting provider response", "2 refund recommendations in review", "11 closed cases this week in demo data"]} />
      </div>
    </DashboardShell>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function OpsPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}
