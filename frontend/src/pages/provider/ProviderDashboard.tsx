import { useEffect, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Camera,
  CheckCircle2,
  Cpu,
  FileCheck,
  Image,
  ListChecks,
  MessageSquare,
  Plus,
  RefreshCcw,
  RotateCcw,
  Save,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  XCircle,
} from "lucide-react";
import {
  ApiError,
  createAvailabilityBlock,
  createPortfolioItem,
  createProviderService,
  deleteAvailabilityBlock,
  deletePortfolioItem,
  deleteProviderService,
  getBookingSummary,
  getMyProviderProfile,
  listAvailabilityBlocks,
  listBookings,
  listPortfolioItems,
  listReviewsForProvider,
  listProviderServices,
  replyToReview,
  resetNidVerification,
  updateBookingStatus,
  updateProviderService,
  verifyNidDocument,
  type ApiBooking,
  type ApiPortfolioItem,
  type ApiProviderService,
  type ApiReview,
  type NidVerificationResponse,
} from "../../api/client";
import { adaptProvider } from "../../api/adapters";
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
  const [requests, setRequests] = useState<ApiBooking[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getMyProviderProfile>> | null>(null);
  const [services, setServices] = useState<ApiProviderService[]>([]);
  const [portfolio, setPortfolio] = useState<ApiPortfolioItem[]>([]);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [availabilityFormOpen, setAvailabilityFormOpen] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<{id:number; date:string; reason:string}[]>([]);
  const [portfolioDraft, setPortfolioDraft] = useState("");
  const [serviceEditing, setServiceEditing] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceSaved, setServiceSaved] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<number | null>(null);
  const [deletingAvailabilityId, setDeletingAvailabilityId] = useState<number | null>(null);
  const [nidScanning, setNidScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<NidVerificationResponse | null>(null);
  const [ocrError, setOcrError] = useState("");

  async function handleScanSample(testCardType: string) {
    setNidScanning(true);
    setOcrError("");
    try {
      const res = await verifyNidDocument({ test_card: testCardType });
      setOcrResult(res);
      if (res.profile_verified) {
        setProfile((prev) => (prev ? { ...prev, verified_identity: true } : prev));
      }
    } catch (err: unknown) {
      setOcrError(err instanceof Error ? err.message : "Failed to run NID OCR.");
    } finally {
      setNidScanning(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNidScanning(true);
    setOcrError("");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await verifyNidDocument({ nid_image: base64Data });
        setOcrResult(res);
        if (res.profile_verified) {
          setProfile((prev) => (prev ? { ...prev, verified_identity: true } : prev));
        }
      } catch (err: unknown) {
        setOcrError(err instanceof Error ? err.message : "Failed to verify NID image.");
      } finally {
        setNidScanning(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleResetVerification() {
    setNidScanning(true);
    try {
      await resetNidVerification();
      setOcrResult(null);
      setProfile((prev) => (prev ? { ...prev, verified_identity: false } : prev));
    } catch (err: unknown) {
      setOcrError(err instanceof Error ? err.message : "Failed to reset verification.");
    } finally {
      setNidScanning(false);
    }
  }

  async function reloadData() {
    setLoading(true);
    setLoadError("");
    try {
      const [bookingPage, bookingSummary, ownProfile, servicePage, portfolioPage, availabilityPage] = await Promise.all([
        listBookings(), getBookingSummary(), getMyProviderProfile(), listProviderServices(), listPortfolioItems(), listAvailabilityBlocks(),
      ]);
      const reviewPage = await listReviewsForProvider(ownProfile.id);
      setRequests(bookingPage.results);
      setSummary(bookingSummary);
      setProfile(ownProfile);
      setServices(servicePage.results);
      setPortfolio(portfolioPage.results);
      setUnavailableDates(availabilityPage.results);
      setReviews(reviewPage.results);
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : "Could not load provider workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void reloadData(); }, []);

  async function updateRequest(id: number, status: ApiBooking["status"]) {
    setUpdatingId(id);
    setActionError("");
    try {
      await updateBookingStatus(id, status);
      await reloadData();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Booking status could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  }

  function addUnavailableDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("unavailable-date"));
    createAvailabilityBlock({ date }).then((created) => {
      setUnavailableDates((current) => [...current, created].sort((a, b) => a.date.localeCompare(b.date)));
      setAvailabilityFormOpen(false);
      setActionMessage("Unavailable date saved.");
    }).catch((error: unknown) => setActionError(error instanceof Error ? error.message : "Could not save unavailable date."));
  }

  async function removeAvailabilityBlock(blockId: number) {
    setDeletingAvailabilityId(blockId);
    setActionError("");
    try {
      await deleteAvailabilityBlock(blockId);
      setUnavailableDates((current) => current.filter((d) => d.id !== blockId));
      setActionMessage("Unavailable date removed.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not remove unavailable date.");
    } finally {
      setDeletingAvailabilityId(null);
    }
  }

  function addPortfolioItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item = portfolioDraft.trim();
    if (!item) return;
    createPortfolioItem({ title: item }).then((created) => {
      setPortfolio((current) => [created, ...current]);
      setPortfolioDraft("");
      setActionMessage("Portfolio item added.");
    }).catch((error: unknown) => setActionError(error instanceof Error ? error.message : "Could not save portfolio item."));
  }

  async function removePortfolioItem(itemId: number) {
    if (!window.confirm("Delete this portfolio item?")) return;
    setDeletingPortfolioId(itemId);
    setActionError("");
    try {
      await deletePortfolioItem(itemId);
      setPortfolio((current) => current.filter((item) => item.id !== itemId));
      setActionMessage("Portfolio item deleted.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not delete this portfolio item.");
    } finally {
      setDeletingPortfolioId(null);
    }
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    try {
      const saved = editingServiceId
        ? await updateProviderService(editingServiceId, { name: serviceName, price: servicePrice, description: serviceDescription })
        : await createProviderService({ name: serviceName, price: servicePrice, description: serviceDescription });
      setServices((current) => editingServiceId ? current.map((service) => service.id === saved.id ? saved : service) : [...current, saved]);
      setServiceName(""); setServicePrice(""); setServiceDescription(""); setEditingServiceId(null); setServiceEditing(false); setServiceSaved(true);
    } catch (error) { setActionError(error instanceof Error ? error.message : "Could not save this service."); }
  }

  async function removeService(serviceId: number) {
    if (!window.confirm("Are you sure you want to delete this service offering?")) return;
    setDeletingServiceId(serviceId);
    setActionError("");
    try {
      await deleteProviderService(serviceId);
      setServices((current) => current.filter((s) => s.id !== serviceId));
      if (editingServiceId === serviceId) {
        setEditingServiceId(null);
        setServiceEditing(false);
      }
      setActionMessage("Service deleted successfully from database.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not delete this service.");
    } finally {
      setDeletingServiceId(null);
    }
  }

  async function sendReviewReply(reviewId: number, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const updated = await replyToReview(reviewId, reviewReply.trim());
      setReviews((current) => current.map((review) => review.id === updated.id ? updated : review));
      setReviewReply(""); setActionMessage("Your reply has been posted.");
    } catch (error) { setActionError(error instanceof Error ? error.message : "Could not send reply."); }
  }

  const displayProfile = profile ? adaptProvider(profile) : null;

  return (
    <DashboardShell title="Provider dashboard" subtitle="Manage requests, schedule, services, verification, and reputation." nav={nav}>
      {loading && <p className="rounded-2xl border border-white bg-white/90 p-4 text-sm font-semibold text-warm-700" role="status">Loading provider workspace…</p>}
      {loadError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{loadError}<button className="ml-2 font-bold underline" onClick={() => void reloadData()}>Retry</button></p>}
      {actionError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{actionError}</p>}
      {actionMessage && <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900" role="status">{actionMessage}</p>}
      <div id="provider-overview" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completed bookings" value={String(summary.completed ?? 0)} detail="all-time" icon={BadgeCheck} />
        <StatCard label="Active requests" value={String((summary.requested ?? 0) + (summary.confirmed ?? 0))} detail="need attention" icon={CheckCircle2} />
        <StatCard label="Response time" value={displayProfile?.responseTime || "—"} detail="provider profile" icon={CalendarClock} />
        <StatCard label="Verification" value={displayProfile?.verifiedIdentity ? "Verified" : "Pending"} detail="identity review" icon={ShieldCheck} />
      </div>

      <Card id="provider-requests" className="scroll-mt-28 overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-warm-200 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-warm-900 sm:text-xl">Booking requests and appointments</h2>
            <p className="mt-1 text-sm text-warm-600">Review each request and manage its booking status.</p>
          </div>
          <Button variant="secondary" onClick={() => setAvailabilityFormOpen((open) => !open)}><CalendarClock className="h-4 w-4" aria-hidden="true" />Set unavailable dates</Button>
        </div>
        <div className="grid gap-3 p-4 sm:gap-4 sm:p-5">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-warm-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-warm-900">{request.service_name}</p>
                    <Badge tone={request.status === "requested" ? "info" : request.status === "reschedule_requested" ? "warning" : ["declined", "cancelled"].includes(request.status) ? "neutral" : "success"}>{request.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-warm-600">{request.customer_name} · {request.area} · {new Date(request.appointment_at).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Button disabled={updatingId === request.id || request.status !== "requested"} onClick={() => void updateRequest(request.id, "confirmed")} icon={<CheckCircle2 className="h-4 w-4" />}>Accept</Button>
                  <Button disabled={updatingId === request.id || !["requested", "confirmed"].includes(request.status)} variant="secondary" onClick={() => void updateRequest(request.id, "reschedule_requested")} icon={<RefreshCcw className="h-4 w-4" />}>Reschedule</Button>
                  <Button disabled={updatingId === request.id || !["requested", "confirmed"].includes(request.status)} variant="secondary" onClick={() => void updateRequest(request.id, "declined")} icon={<XCircle className="h-4 w-4" />}>Reject</Button>
                  <Button disabled={updatingId === request.id || request.status !== "confirmed"} variant="secondary" onClick={() => void updateRequest(request.id, "completed")}>Mark complete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid min-w-0 gap-5 xl:grid-cols-2 items-start">
        <Card id="provider-services" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Offerings</p><h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Services and prices</h2></div><Button variant="secondary" onClick={() => { setServiceEditing((editing) => !editing); setEditingServiceId(null); setServiceName(""); setServicePrice(""); setServiceDescription(""); setServiceSaved(false); }}>{serviceEditing ? "Cancel" : "Add service"}</Button></div>
          <div className="mt-4 grid gap-3">
            {services.map((service) => (
              <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warm-200 bg-white p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-warm-900">{service.name}</p>
                  <p className="text-xs text-warm-600 truncate">{service.description || "No description"} &bull; &#2547;{service.price}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="secondary" onClick={() => { setEditingServiceId(service.id); setServiceName(service.name); setServicePrice(service.price); setServiceDescription(service.description); setServiceEditing(true); }}>Edit</Button>
                  <button
                    type="button"
                    disabled={deletingServiceId === service.id}
                    onClick={() => void removeService(service.id)}
                    className="focus-ring inline-flex size-9 items-center justify-center rounded-xl border border-warm-200 text-stone-400 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
                    title={`Delete ${service.name}`}
                    aria-label={`Delete ${service.name}`}
                  >
                    {deletingServiceId === service.id ? <RefreshCcw className="size-4 animate-spin text-amber-700" /> : <Trash2 className="size-4" />}
                  </button>
                </div>
              </div>
            ))}
            {!services.length && <p className="rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4 text-sm text-warm-600">No services published yet. Click &quot;Add service&quot; to list your offerings.</p>}
          </div>
          {serviceEditing && (
            <form className="mt-4 grid gap-3" onSubmit={saveService}>
              <InputField label="Service name" required value={serviceName} onChange={(event) => setServiceName(event.target.value)} />
              <InputField label="Starting price (BDT)" required type="number" min="0" step="0.01" value={servicePrice} onChange={(event) => setServicePrice(event.target.value)} />
              <label className="grid gap-1.5 text-sm font-semibold text-warm-800">
                Description
                <textarea value={serviceDescription} onChange={(event) => setServiceDescription(event.target.value)} className="focus-ring min-h-20 rounded-xl border border-warm-200 p-3 text-sm font-normal" />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit"><Save className="h-4 w-4" aria-hidden="true" />{editingServiceId ? "Update service" : "Save service"}</Button>
                {editingServiceId && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={deletingServiceId === editingServiceId}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => void removeService(editingServiceId)}
                  >
                    {deletingServiceId === editingServiceId ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    Delete service
                  </Button>
                )}
              </div>
            </form>
          )}
          {serviceSaved && <p className="mt-3 text-sm font-semibold text-amber-900" role="status">Service saved.</p>}
        </Card>

        <div className="flex flex-col gap-5">
          <Card id="provider-verification" className="scroll-mt-28 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-warm-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 mb-1">
                <Sparkles className="size-3 text-amber-600" />
                Local AI OCR &bull; Zero 3rd-Party APIs
              </div>
              <h2 className="text-lg font-bold text-warm-900 sm:text-xl">
                National ID Verification Panel
              </h2>
            </div>

            <Badge tone={profile?.verified_identity ? "success" : "warning"}>
              {profile?.verified_identity ? "Verified (NID Checked)" : "Verification Required"}
            </Badge>
          </div>

          <p className="mt-3 text-xs leading-5 text-warm-600">
            Upload a clear scan/photo of your Bangladesh Smart NID or traditional NID card. Our local machine learning OCR model verifies card formatting, extracts your NID number &amp; DOB, and matches the name against your registered account for instant badge activation.
          </p>

          {/* Upload and Sample Buttons */}
          <div className="mt-4 rounded-2xl border-2 border-dashed border-warm-200 bg-warm-50/60 p-4 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-2">
              <ScanLine className="size-5" />
            </div>
            <p className="text-xs font-bold text-warm-900">Upload Your Bangladesh National ID</p>
            <p className="text-[11px] text-warm-500 mt-0.5">Supports PNG, JPG, or WebP</p>

            <label className="mt-3 inline-flex items-center gap-2 cursor-pointer rounded-xl bg-brand-ink px-4 py-2 text-xs font-bold text-amber-300 shadow-sm hover:bg-black transition-colors">
              <Upload className="size-3.5" />
              <span>Choose NID Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={nidScanning}
                className="hidden"
              />
            </label>

            {/* Quick 1-click test pills */}
            <div className="mt-4 pt-3 border-t border-warm-200/60 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold text-warm-500">1-Click Test Samples:</span>
              <button
                type="button"
                onClick={() => handleScanSample("sample_smart_nid")}
                disabled={nidScanning}
                className="rounded-full border border-warm-200 bg-white px-2.5 py-1 text-[11px] font-bold text-warm-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 transition-colors disabled:opacity-50"
              >
                10-Digit Smart NID
              </button>
              <button
                type="button"
                onClick={() => handleScanSample("sample_legacy_nid")}
                disabled={nidScanning}
                className="rounded-full border border-warm-200 bg-white px-2.5 py-1 text-[11px] font-bold text-warm-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 transition-colors disabled:opacity-50"
              >
                17-Digit Laminated NID
              </button>
              <button
                type="button"
                onClick={() => handleScanSample("sample_mismatch")}
                disabled={nidScanning}
                className="rounded-full border border-warm-200 bg-white px-2.5 py-1 text-[11px] font-bold text-warm-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 transition-colors disabled:opacity-50"
              >
                Test Mismatch (Reject)
              </button>
            </div>
          </div>

          {/* Scanning Progress */}
          {nidScanning && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
                <Cpu className="size-4 animate-spin text-amber-700" />
                <span>Running Local ML OCR &amp; Binarization Engine…</span>
              </div>
              <p className="mt-1 text-[10px] text-amber-700">
                Extracting contours, matching token n-grams, and checking Bangladesh NID checksum rules.
              </p>
            </div>
          )}

          {ocrError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {ocrError}
            </div>
          )}

          {/* OCR Result Breakdown */}
          {ocrResult && (
            <div className={`mt-4 rounded-2xl border p-4 space-y-3 ${ocrResult.is_verified ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${ocrResult.is_verified ? "text-emerald-800" : "text-red-800"}`}>
                  {ocrResult.is_verified ? <CheckCircle2 className="size-4 text-emerald-600" /> : <ShieldAlert className="size-4 text-red-600" />}
                  {ocrResult.is_verified ? "Identity Verified Successfully" : "Verification Rejected"}
                </span>
                <span className="text-[11px] font-bold text-warm-500">
                  OCR Confidence: {Math.round((ocrResult.ocr_confidence ?? 0.9) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-warm-100 bg-white p-2.5">
                  <span className="block text-[10px] font-bold uppercase text-warm-400">Card Format</span>
                  <strong className="text-warm-800">{ocrResult.card_type}</strong>
                </div>
                <div className="rounded-xl border border-warm-100 bg-white p-2.5">
                  <span className="block text-[10px] font-bold uppercase text-warm-400">NID Number</span>
                  <strong className="text-warm-800 tracking-wider font-mono">{ocrResult.masked_nid}</strong>
                </div>
                <div className="rounded-xl border border-warm-100 bg-white p-2.5">
                  <span className="block text-[10px] font-bold uppercase text-warm-400">Holder Name</span>
                  <strong className="text-warm-800">{ocrResult.holder_name}</strong>
                </div>
                <div className="rounded-xl border border-warm-100 bg-white p-2.5">
                  <span className="block text-[10px] font-bold uppercase text-warm-400">Name Match Score</span>
                  <strong className={ocrResult.name_match_score && ocrResult.name_match_score >= 65 ? "text-emerald-700 font-extrabold" : "text-red-700 font-extrabold"}>
                    {ocrResult.name_match_score}% Match
                  </strong>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-warm-600">
                {ocrResult.verification_reason}
              </p>

              {ocrResult.is_verified && (
                <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <BadgeCheck className="size-3.5 text-emerald-600" />
                    Badge active across marketplace
                  </span>
                  <button
                    type="button"
                    onClick={handleResetVerification}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-warm-500 hover:text-warm-800 transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card id="provider-availability" className="scroll-mt-28 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Schedule</p>
                <h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Availability</h2>
              </div>
              <Button
                variant="secondary"
                onClick={() => setAvailabilityFormOpen((open) => !open)}
              >
                {availabilityFormOpen ? "Cancel" : "Block date"}
              </Button>
            </div>
            <p className="mt-2 text-sm leading-6 text-warm-600">Keep your schedule current so customers can request a time that works.</p>
            {availabilityFormOpen && (
              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={addUnavailableDate}>
                <label className="grid flex-1 gap-1.5 text-xs font-bold text-warm-700">
                  Unavailable date
                  <input name="unavailable-date" type="date" required min={new Date().toISOString().slice(0, 10)} className="focus-ring min-h-11 rounded-xl border border-warm-200 bg-white px-3 text-sm" />
                </label>
                <Button className="self-end" type="submit">Add date</Button>
              </form>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {unavailableDates.length ? (
                unavailableDates.map((date) => (
                  <span
                    key={date.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900"
                  >
                    Unavailable &bull; {date.date}
                    <button
                      type="button"
                      disabled={deletingAvailabilityId === date.id}
                      onClick={() => void removeAvailabilityBlock(date.id)}
                      className="ml-0.5 rounded-full p-0.5 text-amber-700 hover:bg-amber-200 hover:text-amber-950 transition-colors"
                      title="Remove blocked date"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))
              ) : (
                <Badge tone="success">Accepting requests</Badge>
              )}
            </div>
          </Card>

          <Card id="provider-portfolio" className="scroll-mt-28 p-4 sm:p-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Work samples</p>
              <h2 className="mt-1 text-lg font-bold text-warm-900 sm:text-xl">Portfolio</h2>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {portfolio.map((item) => (
                <div key={item.id} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-warm-200 bg-warm-50 p-3 text-sm font-medium leading-5 text-warm-700">
                  <div className="flex items-center gap-2 min-w-0">
                    <Image className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <button
                    type="button"
                    disabled={deletingPortfolioId === item.id}
                    onClick={() => void removePortfolioItem(item.id)}
                    className="shrink-0 p-1 text-stone-400 hover:text-red-700 transition-colors"
                    title={`Delete ${item.title}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              {!portfolio.length && <p className="col-span-2 text-xs text-warm-500">No portfolio projects uploaded yet.</p>}
            </div>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={addPortfolioItem}>
              <input aria-label="Portfolio project description" value={portfolioDraft} onChange={(event) => setPortfolioDraft(event.target.value)} className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-warm-200 px-3 text-sm" placeholder="Add a completed project" />
              <Button type="submit"><Plus className="h-4 w-4" aria-hidden="true" />Add sample</Button>
            </form>
          </Card>
        </div>
      </div>

      <Card id="provider-reviews" className="scroll-mt-28 p-4 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><MessageSquare className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">Customer feedback</p><h2 className="text-lg font-bold text-warm-900 sm:text-xl">Reviews</h2></div></div>
        <div className="mt-4 grid gap-3">{reviews.map((review) => <div key={review.id} className="rounded-xl border border-warm-200 bg-white p-4"><p className="font-bold text-warm-900">{review.rating}/5 · {review.customer_name}</p><p className="mt-1 text-sm text-warm-700">{review.body}</p>{review.provider_reply && <p className="mt-2 border-l-2 border-amber-400 pl-3 text-sm text-warm-600">Your reply: {review.provider_reply}</p>}{!review.provider_reply && <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => void sendReviewReply(review.id, event)}><input aria-label={`Reply to review ${review.id}`} value={reviewReply} onChange={(event) => setReviewReply(event.target.value)} required className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-warm-200 px-3 text-sm" placeholder="Write a professional response" /><Button type="submit"><Send className="h-4 w-4" aria-hidden="true" />Send reply</Button></form>}</div>)}{!reviews.length && <p className="rounded-xl border border-dashed border-warm-200 bg-warm-50 p-4 text-sm text-warm-600">No customer reviews yet.</p>}</div>
      </Card>
    </DashboardShell>
  );
}
