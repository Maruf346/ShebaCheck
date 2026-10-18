import { CircleUserRound, Home, Plus, ReceiptText, Wrench } from "lucide-react";
import type { AppPage } from "../../types";

export function HomeMobileNav({
  onServices,
  onBook,
  setPage,
}: {
  onServices: () => void;
  onBook: () => void;
  setPage: (page: AppPage) => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid min-h-[72px] grid-cols-5 border-t border-stone-200 bg-white px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-3px_15px_rgb(0_0_0/4%)] md:hidden"
      aria-label="Quick navigation"
    >
      <button
        className="flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] leading-[15px] font-bold text-[#d88700]"
        aria-current="page"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <Home size={21} />
        <span>Home</span>
      </button>
      <button
        className="flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] leading-[15px] text-stone-500"
        onClick={onServices}
      >
        <Wrench size={21} />
        <span>Services</span>
      </button>
      <button
        className="flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] leading-[15px] font-bold text-stone-800"
        onClick={onBook}
      >
        <span className="-mt-6 grid size-11 place-items-center rounded-full bg-brand-yellow text-white shadow-[0_4px_12px_rgb(255_160_0/35%)]">
          <Plus size={24} />
        </span>
        <span>Book Pro</span>
      </button>
      <button
        className="flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] leading-[15px] text-stone-500"
        onClick={() => setPage("customer-dashboard")}
      >
        <ReceiptText size={21} />
        <span>My Orders</span>
      </button>
      <button
        className="flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] leading-[15px] text-stone-500"
        onClick={() => setPage("customer-dashboard")}
      >
        <CircleUserRound size={21} />
        <span>Account</span>
      </button>
    </nav>
  );
}
