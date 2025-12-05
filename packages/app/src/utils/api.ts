type EnvImportMeta = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const rawBase = (((import.meta as EnvImportMeta).env?.VITE_API_BASE) ?? "").trim();
const normalizedBase = rawBase.replace(/\/+$/, "");

export function apiUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedBase ? `${normalizedBase}${cleanPath}` : cleanPath;
}

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers = new Headers(extra || {});
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export function apiFetch(input: string, init: RequestInit = {}) {
  const headers = authHeaders(init.headers);
  return fetch(input, { ...init, headers });
}

export const API_BASE = normalizedBase;
