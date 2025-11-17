type EnvImportMeta = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const rawBase = (((import.meta as EnvImportMeta).env?.VITE_API_BASE) ?? "").trim();
const normalizedBase = rawBase.replace(/\/+$/, "");

/**
 * Build a fully-qualified API URL that points at the Node backend.
 * Falls back to the current origin when VITE_API_BASE is not defined.
 */
export function apiUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedBase ? `${normalizedBase}${cleanPath}` : cleanPath;
}

export const API_BASE = normalizedBase;
