// API client for the CampusConnect Express backend.
// - Set VITE_API_URL in .env for production or a remote API.
// - In dev, empty base uses the Vite proxy (see vite.config.ts) from the browser; SSR calls localhost directly.

function resolveApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (typeof window === "undefined") return "http://localhost:5000";
  if (import.meta.env.DEV) return "";
  return "http://localhost:5000";
}

export const API_URL = resolveApiUrl();

const TOKEN_KEY = "cc_token";
const USER_KEY = "cc_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function setStoredUser(user: any | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  formData?: FormData;
  query?: Record<string, string | number | undefined | null>;
};

export async function api<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, formData, query } = opts;

  let url = `${API_URL}${path}`;
  if (query) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
    });
    const s = qs.toString();
    if (s) url += `?${s}`;
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(url, { method, headers, body: payload });
  } catch (e) {
    const msg =
      e instanceof Error && e.message.includes("fetch")
        ? "Cannot reach the API. Start the backend (port 5000) or check VITE_API_URL."
        : "Network error";
    throw new ApiError(msg, 0, e);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.error?.message || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.error?.details);
  }
  return data as T;
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function fileUrl(p?: string | null): string | undefined {
  if (!p) return undefined;
  if (p.startsWith("http")) return p;
  return `${API_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}
