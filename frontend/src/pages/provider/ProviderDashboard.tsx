import { useState, type FormEvent } from "react";
import { BadgeCheck, CalendarClock, CheckCircle2, Image, ListChecks, MessageSquare, Plus, RefreshCcw, Save, Send, ShieldCheck, UserCheck, XCircle } from "lucide-react";
import { providerRequests } from "../../data/mockData";
import { DashboardShell } from "../../components/DashboardShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InputField } from "../../components/ui/InputField";
import { StatCard } from "../../components/ui/StatCard";

const nav = [
  { label: "Overview", icon: BadgeCheck, target: "provider-overview" },
  { label: "Booking Requests", icon: CalendarClock, target: "provider-requests" },
  { label: "Services", icon: ListChecks, target: "provider-services" },
  { label: "Availability", icon: RefreshCcw, target: "provider-availability" },
  { label: "Portfolio", icon: Image, target: "provider-portfolio" },
  { label: "Reviews", icon: MessageSquare, target: "provider-reviews" },
  { label: "Verification", icon: UserCheck, target: "provider-verification" }
];

export function ProviderDashboard() {
  const [requests, setRequests] = useState(providerRequests);
  const [availabilityFormOpen, setAvailabilityFormOpen] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState(["DB board replacement, Mirpur DOHS", "Kitchen lighting upgrade, Kazipara"]);
  const [portfolioDraft, setPortfolioDraft] = useState("");
  const [serviceEditing, setServiceEditing] = useState(false);
  const [serviceName, setServiceName] = useState("Electrical inspection");
  const [servicePrice, setServicePrice] = useState("৳650");
  const [serviceAreas, setServiceAreas] = useState("Mirpur, Kazipara, Agargaon");
  const [serviceSaved, setServiceSaved] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [replySaved, setReplySaved] = useState(false);

  function updateRequest(id: string, status: string) {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
  }

  function addUnavailableDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("unavailable-date"));
    setUnavailableDates((current) => current.includes(date) ? current : [...current, date].sort());
    setAvailabilityFormOpen(false);
  }

  function addPortfolioItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item = portfolioDraft.trim();
    if (!item) return;
    setPortfolio((current) => [item, ...current]);
    setPortfolioDraft("");
  }

  return (
    <DashboardShell title="Provider dashboard" subtitle="Manage requests, schedule, services, verification, and reputation." nav={nav}>
      <div id="provider-overview" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Demo earnings" value="৳48.6k" detail="last 30 days" icon={BadgeCheck} />
        <StatCard label="Completion" value="96%" detail="accepted jobs" icon={CheckCircle2} />
        <StatCard label="Response time" value="12m" detail="median demo value" icon={CalendarClock} />
        <StatCard label="Verification" value="3/4" detail="steps complete" icon={ShieldCheck} />
      </div>

      <Card id="provider-requests" className="scroll-mt-28 overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-warm-200 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-warm-900 sm:text-xl">Booking requests and appointments</h2>
            <p className="mt-1 text-sm text-warm-600">Review each request and update its demo status.</p>
          </div>
          <Button variant="secondary" onClick={() => setAvailabilityFormOpen((open) => !open)}><CalendarClock className="h-4 w-4" aria-hidden="true" />Set unavailable dates</Button>
        </div>
        <div className="grid gap-3 p-4 sm:gap-4 sm:p-5">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-warm-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-warm-900">{request.service}</p>
                    <Badge tone={request.status === "New request" ? "info" : request.status === "Needs reschedule" || request.status === "Reschedule requested" ? "warning" : request.status === "Declined" ? "neutral" : "success"}>{request.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-warm-600">{request.customer} · {request.area} · {request.slot}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Button disabled={request.status === "Confirmed" || request.status === "Completed" || request.status === "Declined"} onClick={() => updateRequest(request.id, "Confirmed")} icon={<CheckCircle2 className="h-4 w-4" />}>Accept</Button>
                  <Button disabled={request.status === "Completed" || request.status === "Declined"} variant="secondary" onClick={() => updateRequest(request.id, "Reschedule requested")} icon={<RefreshCcw className="h-4 w-4" />}>Reschedule</Button>
                  <Button disabled={request.status === "Completed" || request.status === "Declined"} variant="secondary" onClick={() => updateRequest(request.id, "Declined")} icon={<XCircle className="h-4 w-4" />}>Reject</Button>
                  <Button disabled={request.status !== "Confirmed"} variant="secondary" onClick={() => updateRequest(request.id, "Completed")}>Mark complete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <Card id="provider-services" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Offerings</p><h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Services and prices</h2></div>
            <Button variant="secondary" onClick={() => { setServiceEditing((editing) => !editing); setServiceSaved(false); }}>{serviceEditing ? "Cancel" : "Edit details"}</Button>
          </div>
          <div className="mt-4 grid gap-4">
            <InputField label="Primary service" value={serviceName} readOnly={!serviceEditing} onChange={(event) => setServiceName(event.target.value)} />
            <InputField label="Starting price" value={servicePrice} readOnly={!serviceEditing} onChange={(event) => setServicePrice(event.target.value)} />
            <InputField label="Service areas" value={serviceAreas} readOnly={!serviceEditing} onChange={(event) => setServiceAreas(event.target.value)} />
            {serviceEditing && <Button onClick={() => { setServiceEditing(false); setServiceSaved(true); }}><Save className="h-4 w-4" aria-hidden="true" />Save service details</Button>}
            {serviceSaved && <p className="text-sm font-semibold text-amber-900" role="status">Service details saved in this demo session.</p>}
          </div>
        </Card>
        <Card id="provider-verification" className="scroll-mt-28 p-4 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Trust profile</p>
          <h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Profile verification</h2>
          <div className="mt-4 grid gap-3">
            {["NID checked", "Phone verified", "Work portfolio reviewed", "Reference check pending"].map((item, index) => (
              <div key={item} className="flex items-center justify-between gap-3 rounded-xl border border-warm-200 bg-white p-3">
                <span className="font-semibold text-warm-800">{item}</span>
                <Badge tone={index < 3 ? "success" : "warning"}>{index < 3 ? "Complete" : "Pending"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <Card id="provider-availability" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Schedule</p><h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Availability</h2></div><CalendarClock className="h-5 w-5 text-amber-700" aria-hidden="true" /></div>
          <p className="mt-2 text-sm leading-6 text-warm-600">Keep your schedule current so customers can request a time that works.</p>
          {availabilityFormOpen && <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={addUnavailableDate}><label className="grid flex-1 gap-1.5 text-xs font-bold text-warm-700">Unavailable date<input name="unavailable-date" type="date" required min={new Date().toISOString().slice(0, 10)} className="focus-ring min-h-11 rounded-xl border border-warm-200 bg-white px-3 text-sm" /></label><Button className="self-end" type="submit">Add date</Button></form>}
          <div className="mt-4 flex flex-wrap gap-2">{unavailableDates.length ? unavailableDates.map((date) => <Badge key={date} tone="warning">Unavailable · {date}</Badge>) : <Badge tone="success">Accepting requests</Badge>}</div>
        </Card>

        <Card id="provider-portfolio" className="scroll-mt-28 p-4 sm:p-6">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Work samples</p><h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Portfolio</h2></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{portfolio.map((item) => <div key={item} className="flex min-w-0 items-start gap-2 rounded-xl border border-warm-200 bg-warm-50 p-3 text-sm font-medium leading-5 text-warm-700"><Image className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />{item}</div>)}</div>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={addPortfolioItem}><input aria-label="Portfolio project description" value={portfolioDraft} onChange={(event) => setPortfolioDraft(event.target.value)} className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-warm-200 px-3 text-sm" placeholder="Add a completed project" /><Button type="submit"><Plus className="h-4 w-4" aria-hidden="true" />Add sample</Button></form>
        </Card>
      </div>

      <Card id="provider-reviews" className="scroll-mt-28 p-4 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><MessageSquare className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Customer feedback</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Reviews</h2></div></div>
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl border border-warm-200 bg-white p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-warm-900">“Arrived on time and explained the repair clearly.”</p><p className="mt-1 text-sm text-warm-600">Verified demo booking · 5 stars</p></div><Badge tone="warning">Reply in demo</Badge></div>
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setReplySaved(true); setReviewReply(""); }}><input aria-label="Reply to customer review" value={reviewReply} onChange={(event) => { setReviewReply(event.target.value); setReplySaved(false); }} required className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-warm-200 px-3 text-sm" placeholder="Write a professional response" /><Button type="submit"><Send className="h-4 w-4" aria-hidden="true" />Send reply</Button></form>
        {replySaved && <p className="mt-2 text-sm font-semibold text-amber-900" role="status">Reply saved in this demo session.</p>}
      </Card>
    </DashboardShell>
  );
}
