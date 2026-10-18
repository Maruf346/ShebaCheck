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
          <p className={`mt-2 text-2xl font-bold ${admin ? "text-slate-950" : "text-warm-900"}`}>{value}</p>
          <p className="mt-1 text-xs font-medium text-warm-500">{detail}</p>
        </div>
        <div className={`${admin ? "bg-slate-100 text-slate-700" : "bg-forest-50 text-forest-700"} rounded-xl p-2.5`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
