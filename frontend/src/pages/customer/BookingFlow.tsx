import { CalendarDays, Check, ClipboardList, Home, ShieldAlert } from "lucide-react";
import { providers } from "../../data/mockData";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { SectionHeading } from "../../components/ui/SectionHeading";

const steps = ["Service", "Address", "Review", "Confirm"];

export function BookingFlow() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Booking flow"
          title="Request a service with clear terms"
          body="This frontend prototype demonstrates the intended step-by-step booking experience, validation states, and summary review."
        />
        <Badge tone="warning">Demo only, no request is sent</Badge>
      </div>

      <Card className="mt-7 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-xl border border-warm-200 bg-warm-50 p-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index < 2 ? "bg-forest-700 text-white" : "bg-white text-warm-600"}`}>
                {index < 2 ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className="font-semibold text-warm-800">{step}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-forest-700" aria-hidden="true" />
              <h2 className="text-xl font-bold text-warm-900">Service details</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Selected provider" options={providers.map((provider) => provider.name)} />
              <SelectField label="Service type" options={["Electrical inspection", "Switchboard repair", "Ceiling fan installation"]} />
              <InputField label="Problem description" placeholder="Example: breaker trips when AC starts" className="md:col-span-2" />
              <InputField label="Photo or video note" placeholder="Upload integration later" hint="Frontend only placeholder for later API upload." />
              <SelectField label="Urgency" options={["Flexible", "Same day", "Emergency"]} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Home className="h-6 w-6 text-forest-700" aria-hidden="true" />
              <h2 className="text-xl font-bold text-warm-900">Address and appointment</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="House and road" placeholder="House 12, Road 4" />
              <SelectField label="Area" options={["Mirpur 10", "Dhanmondi 27", "Uttara Sector 7", "Mohammadpur"]} />
              <InputField label="Appointment date" type="date" />
              <InputField label="Preferred time" type="time" />
              <InputField label="Phone number" placeholder="+8801XXXXXXXXX" error="Required for booking confirmation" />
              <InputField label="Access instructions" placeholder="Lift available, call on arrival" />
            </div>
          </Card>
        </section>

        <aside className="h-fit">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-forest-700" aria-hidden="true" />
              <h2 className="text-xl font-bold text-warm-900">Booking summary</h2>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <SummaryRow label="Provider" value="Md. Rafiq Hasan" />
              <SummaryRow label="Service" value="Electrical inspection" />
              <SummaryRow label="Estimated price" value="৳650 - ৳1,200" />
              <SummaryRow label="Platform fee" value="৳80 demo" />
              <SummaryRow label="Total estimate" value="৳730 - ৳1,280" strong />
            </div>
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amberTrust" aria-hidden="true" />
                <p className="text-sm leading-6 text-amber-900">
                  Cancellation is free until two hours before the appointment. Late cancellation may affect future booking priority in the demo policy.
                </p>
              </div>
            </div>
            <Button className="mt-5 w-full">Confirm booking request</Button>
            <Button className="mt-3 w-full" variant="secondary">
              Save and continue later
            </Button>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-warm-100 pb-3">
      <span className="text-warm-600">{label}</span>
      <span className={strong ? "font-bold text-forest-800" : "font-semibold text-warm-900"}>{value}</span>
    </div>
  );
}
