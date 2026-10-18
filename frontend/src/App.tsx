import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { BookingFlow } from "./pages/customer/BookingFlow";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerHome } from "./pages/customer/CustomerHome";
import { ProviderProfile } from "./pages/customer/ProviderProfile";
import { SearchResults } from "./pages/customer/SearchResults";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import type { AppPage } from "./types";

export default function App() {
  const [page, setPage] = useState<AppPage>("home");

  const renderPage = () => {
    switch (page) {
      case "search":
        return <SearchResults setPage={setPage} />;
      case "profile":
        return <ProviderProfile setPage={setPage} />;
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
        return <CustomerHome setPage={setPage} />;
    }
  };

  return (
    <AppShell page={page} setPage={setPage}>
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
