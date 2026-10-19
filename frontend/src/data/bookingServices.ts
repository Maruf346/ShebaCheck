import type { Provider } from "../types";

const serviceNames: Record<string, string[]> = {
  Electrical: [
    "Electrical inspection",
    "Switchboard repair",
    "Ceiling fan installation",
  ],
  "AC Repair": ["AC Master Service", "AC jet cleaning", "Cooling diagnostics"],
  Plumbing: ["Leakage Diagnostic", "Pipe repair", "Basin installation"],
  "Appliance Repair": [
    "Full Inspection",
    "Refrigerator service",
    "Washing machine service",
  ],
  Cleaning: ["Home cleaning", "Kitchen deep clean", "Move-in cleaning"],
};

export function getBookingServices(provider: Provider): { id?: number; name: string; price: number }[] {
  const names = [...(serviceNames[provider.category] ?? ["Diagnostic Visit"])];
  if ("serviceLabel" in provider && typeof provider.serviceLabel === "string")
    names[0] = provider.serviceLabel;
  if (provider.services?.length) {
    return provider.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
    }));
  }
  return names.map((name, index) => ({
    name,
    price: provider.startingPrice + index * 200,
  }));
}
