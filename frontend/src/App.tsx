import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiError, getProvider } from "./api/client";
import { adaptProvider } from "./api/adapters";
import { useAuth } from "./auth/AuthProvider";
import { AppShell } from "./components/AppShell";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { BookingFlow } from "./pages/customer/BookingFlow";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerHome } from "./pages/customer/CustomerHome";
import { ProviderProfile } from "./pages/customer/ProviderProfile";
import { SearchResults } from "./pages/customer/SearchResults";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import { AuthPage } from "./pages/auth/AuthPage";
import type { AppPage, Provider } from "./types";
import { providers } from "./data/mockData";
import { featuredTechnician, homeTechnicians } from "./data/homeContent";

const pagePaths: Record<AppPage, string> = {
  home: "/",
  login: "/login",
  register: "/register",
  "provider-register": "/register/provider",
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
  const auth = useAuth();
  const page = getPageFromPath(location.pathname);
  const requestedProviderId = new URLSearchParams(location.search).get("provider");
  const [remoteProvider, setRemoteProvider] = useState<Provider | null>(null);
  const [providerLoadFailed, setProviderLoadFailed] = useState(false);
  const demoProvider = getProviderFromId(requestedProviderId);
  const selectedProvider = remoteProvider?.id === Number(requestedProviderId) ? remoteProvider : demoProvider;

  useEffect(() => {
    if ((page !== "profile" && page !== "booking") || !requestedProviderId) {
      setRemoteProvider(null);
      setProviderLoadFailed(false);
      return;
    }
    const id = Number(requestedProviderId);
    if (!Number.isInteger(id) || id <= 0) {
      setProviderLoadFailed(true);
      return;
    }
    let active = true;
    getProvider(id).then((provider) => {
      if (active) {
        setRemoteProvider(adaptProvider(provider));
        setProviderLoadFailed(false);
      }
    }).catch((error: unknown) => {
      if (active && error instanceof ApiError && error.status !== 0 && error.status !== 404) {
        setProviderLoadFailed(true);
      }
    });
    return () => { active = false; };
  }, [page, requestedProviderId]);

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
      case "login":
        return <AuthPage mode="login" setPage={navigate} />;
      case "register":
        return <AuthPage mode="register" defaultRole="customer" setPage={navigate} />;
      case "provider-register":
        return <AuthPage mode="register" defaultRole="provider" setPage={navigate} />;
      case "search":
        return <SearchResults onSelectProvider={selectProvider} />;
      case "profile":
        if (providerLoadFailed) return <ProviderLoadError />;
        return (
          <ProviderProfile setPage={navigate} provider={selectedProvider} />
        );
      case "booking":
        if (providerLoadFailed) return <ProviderLoadError />;
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

  const protectedPages: AppPage[] = ["booking", "customer-dashboard", "provider-dashboard", "admin-dashboard"];
  if (protectedPages.includes(page) && auth.isLoading) {
    return <main className="grid min-h-screen place-items-center bg-home-canvas p-6"><p className="rounded-2xl bg-white px-6 py-4 font-semibold text-warm-800 shadow-home-panel" role="status">Checking your session…</p></main>;
  }
  if (protectedPages.includes(page) && !auth.user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  if (page === "customer-dashboard" && auth.user?.role !== "customer") {
    return <Navigate to={auth.user?.role === "admin" ? "/admin-dashboard" : "/provider-dashboard"} replace />;
  }
  if (page === "provider-dashboard" && auth.user?.role !== "provider" && auth.user?.role !== "admin") {
    return <Navigate to="/customer-dashboard" replace />;
  }
  if (page === "admin-dashboard" && auth.user?.role !== "admin") {
    return <Navigate to={auth.user?.role === "provider" ? "/provider-dashboard" : "/customer-dashboard"} replace />;
  }
  if ((page === "login" || page === "register" || page === "provider-register") && auth.user) {
    return <Navigate to={auth.user.role === "admin" ? "/admin-dashboard" : auth.user.role === "provider" ? "/provider-dashboard" : "/customer-dashboard"} replace />;
  }

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

function ProviderLoadError() {
  return <main className="relative z-10 mx-auto max-w-3xl px-4 py-12"><div className="rounded-3xl border border-white bg-white p-6 shadow-home-panel sm:p-9"><h1 className="text-2xl font-extrabold text-warm-900">Provider unavailable</h1><p className="mt-3 leading-6 text-warm-600">We couldn’t load this provider profile from the API. Try returning to search and selecting another provider.</p></div></main>;
}
