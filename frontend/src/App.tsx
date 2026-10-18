import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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

const pagePaths: Record<AppPage, string> = {
  home: "/",
  search: "/search",
  profile: "/profile",
  booking: "/booking",
  "customer-dashboard": "/customer-dashboard",
  "provider-dashboard": "/provider-dashboard",
  "admin-dashboard": "/admin-dashboard",
};

function getPageFromPath(pathname: string): AppPage | null {
  const page = (Object.entries(pagePaths) as [AppPage, string][]).find(
    ([, path]) => path === pathname,
  );
  return page?.[0] ?? null;
}

function getProviderFromId(providerId: string | null): Provider {
  const id = Number(providerId);
  return (
    [...providers, ...homeTechnicians, featuredTechnician].find(
      (provider) => provider.id === id,
    ) ?? providers[0]
  );
}

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const page = getPageFromPath(location.pathname);
  const selectedProvider = getProviderFromId(
    new URLSearchParams(location.search).get("provider"),
  );

  const navigate = (nextPage: AppPage, providerId = selectedProvider.id) => {
    const path = pagePaths[nextPage];
    const search =
      nextPage === "profile" || nextPage === "booking"
        ? `?provider=${providerId}`
        : "";
    routerNavigate(`${path}${search}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const selectProvider = (
    provider: Provider,
    nextPage: "profile" | "booking",
  ) => {
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
        return <CustomerDashboard onSelectProvider={selectProvider} />;
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

  if (!page) return <Navigate to="/" replace />;

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
