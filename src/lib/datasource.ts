import { vehicles as fallbackVehicles, formatPriceUSD, type Vehicle, WHATSAPP_NUMBER_PLACEHOLDER } from "@/lib/vehicles";

export type Settings = {
  heroImageUrl: string;
  whatsappNumber?: string;
  siteTitle?: string;
  logoUrl?: string;
};

// Defaults: Google Drive direct view links
const DEFAULT_HERO =
  "https://drive.google.com/uc?export=view&id=1tDkxlL3zCe11IHC6bTpB1g6YT6YDRZYY";
const DEFAULT_LOGO =
  "https://drive.google.com/uc?export=view&id=1tVxlFdtyaG7bmju641X-FvN-_b46wJvm";

function getBaseUrl() {
  const envBase = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (envBase) return envBase;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://0.0.0.0:3000";
}

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(init?.headers || {}) },
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<Settings> {
  const s = await api<Settings>("/api/settings");
  if (!s) return { heroImageUrl: DEFAULT_HERO, whatsappNumber: WHATSAPP_NUMBER_PLACEHOLDER, siteTitle: "Clásicos Seleccionados", logoUrl: DEFAULT_LOGO };
  return {
    heroImageUrl: s.heroImageUrl || DEFAULT_HERO,
    whatsappNumber: s.whatsappNumber || WHATSAPP_NUMBER_PLACEHOLDER,
    siteTitle: s.siteTitle || "Clásicos Seleccionados",
    logoUrl: s.logoUrl || DEFAULT_LOGO,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  const list = await api<Vehicle[]>("/api/vehicles");
  if (!list || !Array.isArray(list) || list.length === 0) return fallbackVehicles;
  return list;
}

export async function getWhatsAppNumber(): Promise<string | undefined> {
  const s = await getSettings();
  return s.whatsappNumber?.trim() || WHATSAPP_NUMBER_PLACEHOLDER?.trim() || undefined;
}

export async function hasWhatsAppNumber(): Promise<boolean> {
  const num = await getWhatsAppNumber();
  return !!(num && num.trim());
}

export async function buildWhatsAppLink(v: Vehicle): Promise<string> {
  const base = "https://wa.me/";
  const num = (await getWhatsAppNumber()) || "";
  const text = encodeURIComponent(
    `Hola, estoy interesado en el ${v.brand} ${v.model} ${v.year} (${formatPriceUSD(v.priceUsd)}). ¿Sigue disponible?`
  );
  return num ? `${base}${num}?text=${text}` : "#";
}

export async function buildWhatsAppLinkText(message: string): Promise<string> {
  const base = "https://wa.me/";
  const num = (await getWhatsAppNumber()) || "";
  const text = encodeURIComponent(message);
  return num ? `${base}${num}?text=${text}` : "#";
}
