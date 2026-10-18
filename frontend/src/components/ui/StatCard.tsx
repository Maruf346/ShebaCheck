import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  admin = false
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  admin?: boolean;
}) {
  return (
    <div className={admin ? "admin-surface p-4" : "surface p-5"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-warm-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-warm-900">{value}</p>
          <p className="mt-1 text-xs font-medium text-warm-500">{detail}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-800">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
