import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { BookingFlow } from "./pages/customer/BookingFlow";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerHome } from "./pages/customer/CustomerHome";
import { ProviderProfile } from "./pages/customer/ProviderProfile";
import { SearchResults } from "./pages/customer/SearchResults";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import type { AppPage, Provider } from "./types";
import { providers } from "./data/mockData";
import { featuredTechnician, homeTechnicians } from "./data/homeContent";

const pages: AppPage[] = [
  "home",
  "search",
  "profile",
  "booking",
  "customer-dashboard",
  "provider-dashboard",
  "admin-dashboard",
];

function getPageFromHash(): AppPage {
  const hash = window.location.hash.slice(1).split("?")[0] as AppPage;
  return pages.includes(hash) ? hash : "home";
}

function getProviderFromHash(): Provider {
  const params = new URLSearchParams(window.location.hash.split("?")[1]);
  const id = Number(params.get("provider"));
  return (
    [...providers, ...homeTechnicians, featuredTechnician].find(
      (provider) => provider.id === id,
    ) ?? providers[0]
  );
}

export default function App() {
  const [page, setPage] = useState<AppPage>(() => getPageFromHash());
  const [selectedProvider, setSelectedProvider] =
    useState<Provider>(getProviderFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash());
      setSelectedProvider(getProviderFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigate = (nextPage: AppPage, providerId = selectedProvider.id) => {
    setPage(nextPage);
    const nextHash = `#${nextPage}${nextPage === "profile" || nextPage === "booking" ? `?provider=${providerId}` : ""}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const selectProvider = (
    provider: Provider,
    nextPage: "profile" | "booking",
  ) => {
    setSelectedProvider(provider);
    navigate(nextPage, provider.id);
  };

  const renderPage = () => {
    switch (page) {
      case "search":
        return <SearchResults onSelectProvider={selectProvider} />;
      case "profile":
        return (
          <ProviderProfile setPage={navigate} provider={selectedProvider} />
        );
      case "booking":
        return (
          <BookingFlow key={selectedProvider.id} provider={selectedProvider} />
        );
      case "customer-dashboard":
        return <CustomerDashboard />;
      case "provider-dashboard":
        return <ProviderDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "home":
      default:
        return (
          <CustomerHome setPage={navigate} onSelectProvider={selectProvider} />
        );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AppShell page={page} setPage={navigate}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </MotionConfig>
  );
}
