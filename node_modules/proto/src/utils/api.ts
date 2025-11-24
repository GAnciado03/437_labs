type EnvImportMeta = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const rawBase = (((import.meta as EnvImportMeta).env?.VITE_API_BASE) ?? "").trim();
const normalizedBase = rawBase.replace(/\/+$/, "");

export function apiUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedBase ? `${normalizedBase}${cleanPath}` : cleanPath;
}

export const API_BASE = normalizedBase;
