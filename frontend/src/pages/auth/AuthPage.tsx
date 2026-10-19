import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthProvider";
import type { AppPage } from "../../types";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function AuthPage({ mode, defaultRole = "customer", setPage }: { mode: "login" | "register"; defaultRole?: "customer" | "provider"; setPage: (page: AppPage) => void }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialRole = params.get("role") === "provider" ? "provider" : defaultRole;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"customer" | "provider">(initialRole);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = isRegister
        ? await register({
            email,
            password,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            role,
          })
        : await login(email, password);
      const requestedNext = params.get("next");
      const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : user.role === "provider" ? "/provider-dashboard" : user.role === "admin" ? "/admin-dashboard" : "/customer-dashboard";
      navigate(safeNext, { replace: true });
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "We could not complete that request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] max-w-marketplace place-items-center px-4 py-8 sm:px-6">
      <Card className="w-full max-w-xl overflow-hidden p-0 shadow-[0_18px_60px_rgb(120_53_15/12%)]">
        <div className="bg-brand-ink px-6 py-7 text-white sm:px-9 sm:py-9">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-yellow text-white shadow-home-button"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></span>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">ShebaCheck account</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{isRegister ? "Join the trusted home services marketplace." : "Sign in to manage bookings and provider services."}</p>
        </div>

        <form className="grid gap-4 p-5 sm:gap-5 sm:p-9" onSubmit={submit}>
          {isRegister && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-bold text-warm-800">First name<input required autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="focus-ring min-h-12 rounded-xl border border-warm-200 px-3.5 text-sm font-medium" /></label>
                <label className="grid gap-1.5 text-sm font-bold text-warm-800">Last name<input autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="focus-ring min-h-12 rounded-xl border border-warm-200 px-3.5 text-sm font-medium" /></label>
              </div>
              <label className="grid gap-1.5 text-sm font-bold text-warm-800">Account type<select value={role} onChange={(event) => setRole(event.target.value as "customer" | "provider")} className="focus-ring min-h-12 rounded-xl border border-warm-200 bg-white px-3.5 text-sm font-medium"><option value="customer">Customer</option><option value="provider">Service provider</option></select></label>
            </>
          )}
          <label className="grid gap-1.5 text-sm font-bold text-warm-800">Email address<span className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" aria-hidden="true" /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring min-h-12 w-full rounded-xl border border-warm-200 pl-10 pr-3.5 text-sm font-medium" placeholder="you@example.com" /></span></label>
          {isRegister && <label className="grid gap-1.5 text-sm font-bold text-warm-800">Phone number<span className="relative"><UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" aria-hidden="true" /><input type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} className="focus-ring min-h-12 w-full rounded-xl border border-warm-200 pl-10 pr-3.5 text-sm font-medium" placeholder="01712345678" /></span></label>}
          <label className="grid gap-1.5 text-sm font-bold text-warm-800">Password<span className="relative"><KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" aria-hidden="true" /><input type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring min-h-12 w-full rounded-xl border border-warm-200 pl-10 pr-3.5 text-sm font-medium" placeholder={isRegister ? "At least 8 characters" : "Your password"} /></span></label>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-800">{error}</p>}
          <Button type="submit" disabled={submitting} className="mt-1 w-full">{submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          <p className="text-center text-sm text-warm-600">{isRegister ? "Already have an account?" : "New to ShebaCheck?"}{" "}<button type="button" className="font-bold text-amber-800 underline decoration-amber-300 underline-offset-4" onClick={() => setPage(isRegister ? "login" : "register")}>{isRegister ? "Sign in" : "Create an account"}</button></p>
          <p className="text-center text-xs leading-5 text-warm-500">Protected by ShebaCheck verified platform security.</p>
        </form>
      </Card>
    </main>
  );
}
