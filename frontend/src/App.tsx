import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { BookingFlow } from "./pages/customer/BookingFlow";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerHome } from "./pages/customer/CustomerHome";
import { ProviderProfile } from "./pages/customer/ProviderProfile";
import { SearchResults } from "./pages/customer/SearchResults";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import type { AppPage } from "./types";

const pages: AppPage[] = [
  "home",
  "search",
  "profile",
  "booking",
  "customer-dashboard",
  "provider-dashboard",
  "admin-dashboard"
];

function getPageFromHash(): AppPage {
  const hash = window.location.hash.replace("#", "") as AppPage;
  return pages.includes(hash) ? hash : "home";
}

export default function App() {
  const [page, setPage] = useState<AppPage>(() => getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigate = (nextPage: AppPage) => {
    setPage(nextPage);
    const nextHash = `#${nextPage}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "search":
        return <SearchResults setPage={navigate} />;
      case "profile":
        return <ProviderProfile setPage={navigate} />;
      case "booking":
        return <BookingFlow />;
      case "customer-dashboard":
        return <CustomerDashboard />;
      case "provider-dashboard":
        return <ProviderDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "home":
      default:
        return <CustomerHome setPage={navigate} />;
    }
  };

  return (
    <AppShell page={page} setPage={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
