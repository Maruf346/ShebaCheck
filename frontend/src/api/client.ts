export interface ApiErrorBody {
  detail?: string;
  [field: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_ROOT = (import.meta.env.VITE_API_BASE_URL ?? "/api/v1").replace(/\/$/, "");
const ACCESS_KEY = "shebacheck:access";
const REFRESH_KEY = "shebacheck:refresh";

function readToken(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storeToken(key: string, value: string | null) {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    // The app remains usable when browser storage is disabled.
  }
}

export function getAccessToken() {
  return readToken(ACCESS_KEY);
}

export function hasRefreshToken() {
  return Boolean(readToken(REFRESH_KEY));
}

export function clearTokens() {
  storeToken(ACCESS_KEY, null);
  storeToken(REFRESH_KEY, null);
}

export function saveTokens(tokens: { access: string; refresh?: string }) {
  storeToken(ACCESS_KEY, tokens.access);
  if (tokens.refresh) storeToken(REFRESH_KEY, tokens.refresh);
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    const body = typeof payload === "object" && payload !== null ? payload as ApiErrorBody : undefined;
    const details = body
      ? Object.entries(body)
          .map(([key, value]) => `${key === "detail" ? "" : `${key}: `}${Array.isArray(value) ? value.join(", ") : String(value)}`)
          .join(" ")
      : String(payload || response.statusText);
    throw new ApiError(details || `Request failed (${response.status}).`, response.status, body);
  }
  return payload as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = readToken(REFRESH_KEY);
  if (!refresh) return false;
  try {
    const response = await fetch(`${API_ROOT}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) {
      clearTokens();
      return false;
    }
    const tokens = await response.json() as { access: string; refresh?: string };
    saveTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const access = getAccessToken();
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError("Cannot reach the ShebaCheck API. Check that the Django backend is running and the API URL is configured.", 0);
  }

  if (response.status === 401 && retry && hasRefreshToken() && !path.includes("/auth/token")) {
    if (await refreshAccessToken()) return apiRequest<T>(path, init, false);
    clearTokens();
  }
  return parseResponse<T>(response);
}

export interface JwtTokens {
  access: string;
  refresh: string;
}

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: "customer" | "provider" | "admin";
  date_joined: string;
}

export interface ApiProviderService {
  id: number;
  name: string;
  description: string;
  price: string;
  is_active: boolean;
  created_at: string;
}

export interface ApiPortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  completed_at: string | null;
  is_published: boolean;
  created_at: string;
}

export interface ApiProvider {
  id: number;
  name: string;
  category: string;
  area: string;
  rating: number;
  reviews: number;
  verified_identity: boolean;
  completed_jobs: number;
  cancellation_rate: string | number;
  response_time: string;
  starting_price: string | number;
  image: string;
  bio: string;
  tags: string[];
  years_experience: number;
  services: ApiProviderService[];
  portfolio: ApiPortfolioItem[];
  unavailable_dates: string[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiBooking {
  id: number;
  customer: number;
  customer_name: string;
  provider: number;
  provider_name: string;
  service: number | null;
  service_name: string;
  description: string;
  address: string;
  area: string;
  appointment_at: string;
  phone: string;
  access_instructions: string;
  price_estimate: string;
  status: "requested" | "confirmed" | "reschedule_requested" | "completed" | "cancelled" | "declined" | "dispute_open";
  created_at: string;
  updated_at: string;
}

export interface ApiReview {
  id: number;
  booking: number;
  customer: number;
  customer_name: string;
  provider: number;
  provider_name: string;
  rating: number;
  body: string;
  provider_reply: string;
  created_at: string;
  updated_at: string;
}

export interface ApiDispute {
  id: number;
  booking_id: number;
  provider_name: string;
  description: string;
  status: "open" | "in_review" | "resolved" | "rejected";
  resolution_note: string;
  created_at: string;
  updated_at: string;
}

export function registerAccount(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "customer" | "provider";
}) {
  return apiRequest<ApiUser>("/auth/register/", { method: "POST", body: JSON.stringify(payload) });
}

export function loginAccount(email: string, password: string) {
  return apiRequest<JwtTokens>("/auth/token/", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function getCurrentUser() {
  return apiRequest<ApiUser>("/auth/me/");
}

export function updateCurrentUser(payload: Partial<Pick<ApiUser, "first_name" | "last_name" | "phone">>) {
  return apiRequest<ApiUser>("/auth/me/", { method: "PATCH", body: JSON.stringify(payload) });
}

export interface ProviderSearchParams {
  category?: string;
  area?: string;
  identity_verified?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  available_on?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

export async function searchProviders(params: ProviderSearchParams = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiRequest<Paginated<ApiProvider>>(`/providers/${suffix}`);
}

export function getProvider(providerId: number) {
  return apiRequest<ApiProvider>(`/providers/${providerId}/`);
}

export function createBooking(payload: {
  provider_id: number;
  service_id?: number | null;
  service_name: string;
  description: string;
  address: string;
  area: string;
  appointment_at: string;
  phone: string;
  access_instructions?: string;
  price_estimate: string | number;
}) {
  return apiRequest<ApiBooking>("/bookings/", { method: "POST", body: JSON.stringify(payload) });
}

export function listBookings(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<Paginated<ApiBooking>>(`/bookings/${query}`);
}

export function getBookingSummary() {
  return apiRequest<Record<string, number>>("/bookings/summary/");
}

export function updateBookingStatus(id: number, status: ApiBooking["status"]) {
  return apiRequest<ApiBooking>(`/bookings/${id}/status/`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function listReviews(providerId?: number, mine = false) {
  const query = new URLSearchParams();
  if (providerId) query.set("provider", String(providerId));
  if (mine) query.set("mine", "true");
  return apiRequest<Paginated<ApiReview>>(`/reviews/${query.size ? `?${query.toString()}` : ""}`);
}

export function listProviderReviews() {
  return apiRequest<Paginated<ApiReview>>("/reviews/");
}

export function listReviewsForProvider(providerId: number) {
  return apiRequest<Paginated<ApiReview>>(`/reviews/?provider=${providerId}`);
}

export function createReview(payload: { booking: number; rating: number; body: string }) {
  return apiRequest<ApiReview>("/reviews/", { method: "POST", body: JSON.stringify(payload) });
}

export function replyToReview(id: number, provider_reply: string) {
  return apiRequest<ApiReview>(`/reviews/${id}/reply/`, { method: "PATCH", body: JSON.stringify({ provider_reply }) });
}

export function listDisputes() {
  return apiRequest<Paginated<ApiDispute>>("/support/disputes/");
}

export function createDispute(payload: { booking_id: number; description: string }) {
  return apiRequest<ApiDispute>("/support/disputes/", { method: "POST", body: JSON.stringify(payload) });
}

export function resolveDispute(id: number, payload: { status: ApiDispute["status"]; resolution_note?: string }) {
  return apiRequest<ApiDispute>(`/support/disputes/${id}/resolve/`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function updateProviderProfile(payload: Record<string, unknown>) {
  return apiRequest<ApiProvider>("/providers/me/", { method: "PATCH", body: JSON.stringify(payload) });
}

export function getMyProviderProfile() {
  return apiRequest<ApiProvider>("/providers/me/");
}

export function listProviderServices() {
  return apiRequest<Paginated<ApiProviderService>>("/providers/services/");
}

export function createProviderService(payload: { name: string; description?: string; price: string | number }) {
  return apiRequest<ApiProviderService>("/providers/services/", { method: "POST", body: JSON.stringify(payload) });
}

export function updateProviderService(id: number, payload: Partial<{ name: string; description: string; price: string | number }>) {
  return apiRequest<ApiProviderService>(`/providers/services/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteProviderService(id: number) {
  return apiRequest<void>(`/providers/services/${id}/`, { method: "DELETE" });
}

export function listAvailabilityBlocks() {
  return apiRequest<Paginated<{ id: number; date: string; reason: string }>>("/providers/availability/");
}

export function createAvailabilityBlock(payload: { date: string; reason?: string }) {
  return apiRequest<{ id: number; date: string; reason: string }>("/providers/availability/", { method: "POST", body: JSON.stringify(payload) });
}

export function deleteAvailabilityBlock(id: number) {
  return apiRequest<void>(`/providers/availability/${id}/`, { method: "DELETE" });
}

export function listPortfolioItems() {
  return apiRequest<Paginated<ApiPortfolioItem>>("/providers/portfolio/");
}

export function createPortfolioItem(payload: { title: string; description?: string; image_url?: string; completed_at?: string | null }) {
  return apiRequest<ApiPortfolioItem>("/providers/portfolio/", { method: "POST", body: JSON.stringify(payload) });
}

export function deletePortfolioItem(id: number) {
  return apiRequest<void>(`/providers/portfolio/${id}/`, { method: "DELETE" });
}

export interface ApiFavoriteProvider {
  id: number;
  provider: ApiProvider;
  created_at: string;
}

export function listFavoriteProviders() {
  return apiRequest<Paginated<ApiFavoriteProvider>>("/providers/favorites/");
}

export function saveFavoriteProvider(provider_id: number) {
  return apiRequest<ApiFavoriteProvider>("/providers/favorites/", { method: "POST", body: JSON.stringify({ provider_id }) });
}

export function removeFavoriteProvider(id: number) {
  return apiRequest<void>(`/providers/favorites/${id}/`, { method: "DELETE" });
}

export interface MatchedProvider {
  id: number;
  name: string;
  category: string;
  area: string;
  rating: number;
  review_count: number;
  starting_price: string | number;
  image_url: string;
  identity_verified: boolean;
  response_time: string;
  years_experience: number;
  match_score: number;
  service_id: number | null;
  service_name: string;
  service_price: string | number | null;
}

export interface JobEstimateResponse {
  query: string;
  predicted_category: string;
  confidence: number;
  category_probabilities: Record<string, number>;
  service_label: string;
  diagnostic_summary: string;
  price_estimate: number;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  complexity: string;
  recommended_parts: string[];
  similarity_score: number;
  matched_providers: MatchedProvider[];
}

export function estimateJobCost(payload: { problem_description: string; area?: string }) {
  return apiRequest<JobEstimateResponse>("/ml/estimate/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface NidVerificationResponse {
  is_verified: boolean;
  nid_number?: string;
  masked_nid?: string;
  holder_name?: string;
  dob?: string;
  card_type?: string;
  format_valid?: boolean;
  format_label?: string;
  name_match_score?: number;
  ocr_confidence?: number;
  verification_reason?: string;
  profile_verified?: boolean;
  error?: string;
}

export function verifyNidDocument(payload: { test_card?: string; nid_image?: string }) {
  return apiRequest<NidVerificationResponse>("/providers/verify-nid/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetNidVerification() {
  return apiRequest<{ status: string; identity_verified: boolean }>("/providers/reset-nid/", {
    method: "POST",
  });
}


