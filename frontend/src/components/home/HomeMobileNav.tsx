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
    <nav className="home-bottom-nav" aria-label="Quick navigation">
      <button
        className="is-active"
        aria-current="page"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <Home size={21} />
        <span>Home</span>
      </button>
      <button onClick={onServices}>
        <Wrench size={21} />
        <span>Services</span>
      </button>
      <button className="home-bottom-book" onClick={onBook}>
        <span className="home-bottom-plus">
          <Plus size={24} />
        </span>
        <span>Book Pro</span>
      </button>
      <button onClick={() => setPage("customer-dashboard")}>
        <ReceiptText size={21} />
        <span>My Orders</span>
      </button>
      <button onClick={() => setPage("customer-dashboard")}>
        <CircleUserRound size={21} />
        <span>Account</span>
      </button>
    </nav>
  );
}
