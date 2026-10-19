import { useState, type FormEvent } from "react";
import { ApiError, createBooking, type ApiBooking } from "../../api/client";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import type { Provider } from "../../types";
import { getBookingServices } from "../../data/bookingServices";
import { homeLocations } from "../../data/homeContent";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";

const steps = ["Service", "Address", "Review", "Confirm"];

export function BookingFlow({ provider }: { provider: Provider }) {
  const services = getBookingServices(provider);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    service: services[0].name,
    description: "",
    address: "",
    area: homeLocations[0],
    date: "",
    time: "10:00",
    phone: "",
    access: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [dateError, setDateError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [savingBooking, setSavingBooking] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<ApiBooking | null>(null);
  const selectedService =
    services.find((service) => service.name === details.service) ?? services[0];
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  function update(name: keyof typeof details, value: string) {
    setDetails((current) => ({ ...current, [name]: value }));
    if (name === "date" || name === "time") setDateError("");
  }

  async function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError("");
    if (
      step === 1 &&
      new Date(`${details.date}T${details.time}:00+06:00`).getTime() <=
        Date.now()
    ) {
      setDateError("Choose an appointment in the future (Dhaka time).");
      return;
    }
    if (step === 2) {
      if (!selectedService.id) {
        setBookingError("Please select an active service offered by this provider.");
        return;
      }
      setSavingBooking(true);
      try {
        const appointmentAt = new Date(`${details.date}T${details.time}:00+06:00`).toISOString();
        const booking = await createBooking({
          provider_id: provider.id,
          service_id: selectedService.id,
          service_name: selectedService.name,
          description: details.description,
          address: details.address,
          area: details.area,
          appointment_at: appointmentAt,
          phone: details.phone,
          access_instructions: details.access,
          price_estimate: selectedService.price,
        });
        setCreatedBooking(booking);
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : "The booking request could not be submitted.");
        setSavingBooking(false);
        return;
      }
      setSavingBooking(false);
    }
    setStep((current) => current + 1);
  }

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-amber-700">
            Book a professional
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-warm-900 sm:text-3xl">
            Request a service with clear terms
          </h1>
          <p className="mt-3 text-warm-700">
            Choose your service, appointment, and review the estimate.
          </p>
        </div>
        <Badge tone={step === 3 ? "success" : "info"}>
          {step === 3 ? "Booking request submitted" : "Verified booking request"}
        </Badge>
      </div>
      <ol
        className="my-7 grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Booking progress"
      >
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={`flex items-center gap-2 rounded-2xl border p-3 sm:gap-3 sm:p-4 ${index === step ? "border-amber-300 bg-amber-50 shadow-home-panel" : "border-white bg-white"}`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${index <= step ? "bg-brand-amber text-white shadow-home-button" : "bg-warm-100 text-warm-700"}`}
            >
              {index < step ? <Check size={16} /> : index + 1}
            </span>
            <span className="text-sm font-semibold">{label}</span>
          </li>
        ))}
      </ol>

      {step === 3 ? (
        <Card className="mx-auto max-w-2xl p-8 text-center" role="status">
          <CheckCircle2 className="mx-auto h-12 w-12 text-brand-amber" />
          <h2 className="mt-4 text-2xl font-bold">Booking request submitted</h2>
          <p className="mt-3 leading-7 text-warm-700">
            Your request for {selectedService.name} with {provider.name} has been successfully submitted{createdBooking ? ` as booking #${createdBooking.id}` : ""}. The technician has been notified and will contact you directly to confirm arrival.
          </p>
          <p className="mt-4 font-semibold">
            {details.date} at {details.time}, Dhaka time
          </p>
          <p className="mt-1 text-sm text-warm-700">
            {details.address}, {details.area}
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setStep(0);
              setAgreed(false);
              setCreatedBooking(null);
            }}
          >
            Make another booking request
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form onSubmit={advance}>
            <Card className="p-4 sm:p-6">
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-warm-900">{provider.name}</p>
                  <p className="mt-1 text-sm text-warm-700">
                    {provider.category} &middot; {provider.area}
                  </p>
                </div>
              </div>
              {step === 0 && (
                <div className="grid gap-5">
                  <h2 className="text-xl font-bold">Service details</h2>
                  {!services.some((service) => service.id) && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">This provider currently has no active service in the API, so a booking cannot yet be submitted.</p>}
                  <SelectField
                    label="Service type"
                    options={services.map((service) => service.name)}
                    value={details.service}
                    onChange={(event) => update("service", event.target.value)}
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Problem description
                    </span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={1500}
                      rows={4}
                      value={details.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                      className="focus-ring w-full rounded-xl border border-warm-200 p-3 text-sm"
                      placeholder="Describe the issue, including when it started."
                    />
                  </label>
                  <p className="text-sm text-warm-700">
                    Use sample information. Parts or additional work would
                    require a separate quote.
                  </p>
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-5">
                  <h2 className="text-xl font-bold">Address and appointment</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="House and road"
                      required
                      value={details.address}
                      onChange={(event) =>
                        update("address", event.target.value)
                      }
                      placeholder="House 12, Road 4"
                    />
                    <SelectField
                      label="Area"
                      options={homeLocations}
                      value={details.area}
                      onChange={(event) => update("area", event.target.value)}
                    />
                    <InputField
                      label="Appointment date"
                      type="date"
                      required
                      min={localDate}
                      value={details.date}
                      onChange={(event) => update("date", event.target.value)}
                    />
                    <SelectField
                      label="Preferred time (Dhaka)"
                      options={[
                        "08:00",
                        "10:00",
                        "12:00",
                        "14:00",
                        "16:00",
                        "18:00",
                      ]}
                      value={details.time}
                      onChange={(event) => update("time", event.target.value)}
                    />
                    <InputField
                      label="Phone number"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      pattern="(\+?88)?01[3-9][0-9]{8}"
                      title="Use a Bangladeshi mobile number, for example 01712345678 or +8801712345678."
                      value={details.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="01712345678"
                    />
                    <InputField
                      label="Access instructions (optional)"
                      value={details.access}
                      onChange={(event) => update("access", event.target.value)}
                      placeholder="Lift available, call on arrival"
                    />
                  </div>
                  {dateError && (
                    <p className="text-sm text-red-700" role="alert">
                      {dateError}
                    </p>
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-5">
                  <h2 className="text-xl font-bold">Review your request</h2>
                  <dl className="grid gap-3 text-sm">
                    <SummaryRow label="Service" value={selectedService.name} />
                    <SummaryRow label="Problem" value={details.description} />
                    <SummaryRow
                      label="Address"
                      value={`${details.address}, ${details.area}`}
                    />
                    <SummaryRow
                      label="Appointment"
                      value={`${details.date}, ${details.time} (Dhaka)`}
                    />
                    <SummaryRow label="Phone" value={details.phone} />
                    {details.access && (
                      <SummaryRow label="Access" value={details.access} />
                    )}
                  </dl>
                  <label className="flex items-start gap-3 rounded-lg border border-warm-200 p-4 text-sm leading-6">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-brand-amber"
                    />
                    <span>
                      I accept the cancellation terms and confirm the booking details above are correct.
                    </span>
                  </label>
                </div>
              )}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    icon={<ArrowLeft size={16} />}
                    onClick={() => setStep((current) => current - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  type="submit"
                  disabled={savingBooking || (step === 0 && Boolean(provider.services && !services.some((service) => service.id)))}
                  icon={
                    step === 2 ? <Check size={16} /> : <ArrowRight size={16} />
                  }
                >
                  {savingBooking ? "Submitting…" : step === 2 ? "Confirm booking request" : "Continue"}
                </Button>
                {bookingError && <p className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-800" role="alert">{bookingError}</p>}
              </div>
            </Card>
          </form>
          <aside className="h-fit">
            <Card className="p-4 sm:p-6">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <CalendarDays className="text-amber-700" size={24} />
                Booking summary
              </h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <SummaryRow label="Provider" value={provider.name} />
                <SummaryRow label="Service" value={selectedService.name} />
                <SummaryRow
                  label="Service estimate"
                  value={`\u09f3${selectedService.price}`}
                />
                <SummaryRow label="Advance payment" value="\u09f30" />
                <SummaryRow
                  label="Total estimate"
                  value={`\u09f3${selectedService.price}`}
                  strong
                />
              </dl>
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  Cancellation is free up to two hours before the appointment.
                  Late cancellations may be subject to a call-out fee as agreed
                  with the provider.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-warm-100 pb-3">
      <dt className="shrink-0 text-warm-700">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right ${strong ? "font-bold text-amber-900" : "font-semibold text-warm-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}
