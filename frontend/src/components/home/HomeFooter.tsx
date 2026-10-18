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
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-top">
          <div>
            <HomeBrand footer />
            <p>
              Dhaka's verified home services infrastructure. Connecting honest
              citizens with authenticated skilled labor.
            </p>
          </div>
          <button
            className="home-hotline"
            onClick={() => onDialog("support")}
            aria-label="About the demo safety hotline"
          >
            <span className="home-hotline-icon">
              <Phone size={21} />
            </span>
            <span>
              <span className="home-hotline-label">
                Safety Hotline &amp; Dispatch
              </span>
              <strong>16216</strong>
            </span>
          </button>
        </div>
        <div className="home-footer-columns">
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
              Proposed National ID verification and payment integrations. No
              partner services are connected in this demo.
            </p>
            <div className="home-partner-badges">
              <span>NID Verified</span>
              <span>bKash Escrow</span>
            </div>
          </div>
        </div>
        <div className="home-footer-bottom">
          <p>
            &copy; 2025 ShebaCheck Bangladesh. All rights reserved. Demo
            technician marketplace.
          </p>
          <div>
            <button onClick={() => onDialog("privacy")}>Privacy Policy</button>
            <span>&bull;</span>
            <button onClick={() => onDialog("terms")}>Terms of Service</button>
            <span>&bull;</span>
            <button onClick={() => onDialog("demo")}>
              Dhaka Operational Status: Demo
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
