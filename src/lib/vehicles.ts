export type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  thumbnail: string;
  images: string[];
  videos?: string[]; // YouTube embed URLs or MP4
  description: string;
  sold: boolean;
  mediaOrdered?: string[]; // optional combined list of media (images/videos) to preserve order
};

export const vehicles: Vehicle[] = [
  {
    slug: "porsche-911-1978",
    brand: "Porsche",
    model: "911",
    year: 1978,
    priceUsd: 125000,
    thumbnail:
      "https://images.unsplash.com/photo-1595784777383-7e427035a15d?auto=format&fit=crop&q=80&w=1600",
    images: [
      "https://images.unsplash.com/photo-1595784777383-7e427035a15d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1553032674-e1cd6fb0fe18?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1690306657598-4892ed679499?auto=format&fit=crop&q=80&w=2000",
    ],
    videos: [],
    description:
      "Porsche 911 clásico en excelente estado. Motor y caja originales, interior en cuero, mantenimientos al día.",
    sold: false,
  },
  {
    slug: "ford-mustang-1967",
    brand: "Ford",
    model: "Mustang Fastback",
    year: 1967,
    priceUsd: 98000,
    thumbnail:
      "https://images.unsplash.com/photo-1591293836027-e05b48473b67?auto=format&fit=crop&q=80&w=1600",
    images: [
      "https://images.unsplash.com/photo-1591293836027-e05b48473b67?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1442188950719-e8a67aea613a?auto=format&fit=crop&q=80&w=2000",
    ],
    videos: [],
    description:
      "Mustang Fastback del 67 restaurado con detalles de época. Pintura impecable y sonido clásico.",
    sold: false,
  },
  {
    slug: "mercedes-300sl-1956",
    brand: "Mercedes-Benz",
    model: "300SL Gullwing",
    year: 1956,
    priceUsd: 1350000,
    thumbnail:
      "https://images.unsplash.com/photo-1670420210528-f2430bfb441a?auto=format&fit=crop&q=80&w=1600",
    images: [
      "https://images.unsplash.com/photo-1670420210528-f2430bfb441a?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1685856518933-2c6ac723541a?auto=format&fit=crop&q=80&w=2000",
    ],
    videos: [],
    description:
      "Ejemplar icónico con puertas tipo gaviota. Unidad de colección, historial documentado.",
    sold: true,
  },
  {
    slug: "chevrolet-camaro-1969",
    brand: "Chevrolet",
    model: "Camaro",
    year: 1969,
    priceUsd: 78000,
    thumbnail:
      "https://images.unsplash.com/photo-1453856908826-6bbeda0f8490?auto=format&fit=crop&q=80&w=1600",
    images: [
      "https://images.unsplash.com/photo-1453856908826-6bbeda0f8490?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&q=80&w=2000",
    ],
    videos: [],
    description:
      "Camaro del 69 con estética muscle car. Motor V8, marcha fuerte y estética cuidada.",
    sold: true,
  },
];

export function formatPriceUSD(amount: number) {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

// Provide your WhatsApp number in international format, e.g. 595XXXXXXXX
export const WHATSAPP_NUMBER_PLACEHOLDER = "595981446666";

export function buildWhatsAppLink(v: Vehicle) {
  const base = "https://wa.me/";
  const number = WHATSAPP_NUMBER_PLACEHOLDER?.trim();
  const text = encodeURIComponent(
    `Hola, estoy interesado en el ${v.brand} ${v.model} ${v.year} ` +
      `(${formatPriceUSD(v.priceUsd)}). ¿Sigue disponible?`
  );
  return number ? `${base}${number}?text=${text}` : "#";
}

export function buildWhatsAppLinkText(message: string) {
  const base = "https://wa.me/";
  const number = WHATSAPP_NUMBER_PLACEHOLDER?.trim();
  const text = encodeURIComponent(message);
  return number ? `${base}${number}?text=${text}` : "#";
}

export const hasWhatsAppNumber = () => !!WHATSAPP_NUMBER_PLACEHOLDER?.trim();
