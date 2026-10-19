import { Phone } from "lucide-react";
import type { HomeDialogKind } from "../../data/homeContent";
import { HomeBrand } from "./HomeBrand";

interface HomeFooterProps {
  onZone: (zone: string) => void;
  onService: (category: string) => void;
  onDialog: (kind: HomeDialogKind) => void;
}

export function HomeFooter({ onZone, onService, onDialog }: HomeFooterProps) {
  return (
    <footer className="relative z-10 mt-6 border-t border-amber-500/20 bg-brand-footer text-stone-400 md:mt-[38px] [&_h3]:mb-3 [&_h3]:text-[11px] [&_h3]:leading-4 [&_h3]:font-bold [&_h3]:uppercase [&_h3]:text-brand-yellow md:[&_h3]:text-xs [&_button:hover]:text-amber-300">
      <div className="mx-auto flex max-w-marketplace flex-col gap-8 px-6 pt-9 pb-12 md:gap-10 md:px-10 md:pt-12">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center [&>div>p]:mt-1.5 [&>div>p]:max-w-md [&>div>p]:text-xs [&>div>p]:leading-5 [&>div>p]:font-medium">
          <div>
            <HomeBrand footer />
            <p>
              Dhaka's verified home services infrastructure. Connecting honest
              citizens with authenticated skilled labor.
            </p>
          </div>
          <button
            className="flex items-center gap-4 rounded-2xl border border-brand-yellow/30 bg-white/[0.06] px-5 py-3 text-left [&_strong]:block [&_strong]:text-lg [&_strong]:leading-[27px] [&_strong]:font-extrabold [&_strong]:text-brand-yellow"
            onClick={() => onDialog("support")}
            aria-label="Safety hotline and dispatch"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-yellow text-stone-900">
              <Phone size={21} />
            </span>
            <span>
              <span className="block text-[11px] leading-[17px] font-bold uppercase text-[#b6a36e]">
                Safety Hotline &amp; Dispatch
              </span>
              <strong>16216</strong>
            </span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 md:gap-8 lg:grid-cols-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:text-[11px] [&_li]:leading-[18px] [&_li]:font-medium md:[&_li]:text-xs md:[&_li]:leading-4 [&_p]:text-[11px] [&_p]:leading-[18px] [&_p]:font-medium md:[&_p]:text-xs md:[&_p]:leading-5 [&_button]:text-left">
          <div>
            <h3>Dhaka Service Hubs</h3>
            <ul>
              {["Gulshan & Banani", "Dhanmondi", "Uttara Hub", "Mirpur 10"].map(
                (zone) => (
                  <li key={zone}>
                    <button onClick={() => onZone(zone)}>{zone}</button>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3>Consumer Protections</h3>
            <ul>
              <li>
                <button onClick={() => onDialog("verification")}>
                  Background Verification Policy
                </button>
              </li>
              <li>
                <button onClick={() => onDialog("warranty")}>
                  7-Day Service Warranty
                </button>
              </li>
              <li>
                <button onClick={() => onDialog("escrow")}>
                  Dispute Resolution &amp; Escrow
                </button>
              </li>
              <li>
                <button onClick={() => onDialog("support")}>
                  Safety Hotline: 16216
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              {[
                ["Emergency Electrical Wiring", "Electrical"],
                ["Inverter AC Jet Cleaning", "AC Repair"],
                ["Sanitary Leak Detection", "Plumbing"],
                ["Refrigerator Compressor Servicing", "Appliance Repair"],
              ].map(([label, category]) => (
                <li key={label}>
                  <button onClick={() => onService(category)}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Trust Partners</h3>
            <p>
              National ID verification and locked fee escrow payment protection across Dhaka.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 [&_span]:rounded-full [&_span]:border [&_span]:border-brand-yellow/30 [&_span]:bg-white/10 [&_span]:px-2.5 [&_span]:py-1 [&_span]:text-[11px] [&_span]:leading-[17px] [&_span]:font-bold [&_span]:text-amber-200">
              <span>NID Verified</span>
              <span>bKash Escrow</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[10px] leading-4 font-medium md:text-[11px] wide:flex-row wide:items-center [&>div]:flex [&>div]:flex-wrap [&>div]:items-center [&>div]:gap-2.5 md:[&>div]:gap-4">
          <p>
            &copy; 2025 ShebaCheck Bangladesh. All rights reserved. Trusted
            technician marketplace.
          </p>
          <div>
            <button onClick={() => onDialog("privacy")}>Privacy Policy</button>
            <span>&bull;</span>
            <button onClick={() => onDialog("terms")}>Terms of Service</button>
            <span>&bull;</span>
            <button onClick={() => onDialog("about")}>
              Dhaka Operational Status: Active
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
