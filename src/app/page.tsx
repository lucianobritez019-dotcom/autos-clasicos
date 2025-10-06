import Image from "next/image";
import Link from "next/link";
import { formatPriceUSD } from "@/lib/vehicles";
import { getVehicles, getSettings, hasWhatsAppNumber as hasWhatsAppNumberAsync } from "@/lib/datasource";
import Hero from "@/components/Hero";

function curatedClassicImages(fallback: string) {
  return [
    fallback,
    "https://images.unsplash.com/photo-1453856908826-6bbeda0f8490?auto=format&fit=crop&q=80&w=2400",
    "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&q=80&w=2400",
    "https://images.unsplash.com/photo-1595784777383-7e427035a15d?auto=format&fit=crop&q=80&w=2400",
  ];
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function Home() {
  const [settings, all, hasWA] = await Promise.all([
    getSettings(),
    getVehicles(),
    hasWhatsAppNumberAsync(),
  ]);
  const available = all.filter((v) => !v.sold);
  const sold = all.filter((v) => v.sold);

  const heroImages = curatedClassicImages(settings.heroImageUrl);

  return (
    <div className="min-h-screen">
      <Hero images={heroImages} logoUrl={settings.logoUrl} siteTitle={settings.siteTitle} />

      {!hasWA && (
        <div className="container mt-6">
          <div className="rounded-md border bg-amber-50 text-amber-900 p-3 text-sm">
            Consejo: configura tu número de WhatsApp para recibir consultas. Puedes hacerlo en src/lib/vehicles.ts o desde el Google Sheets de ajustes (whatsapp_number).
          </div>
        </div>
      )}

      {/* Available vehicles */}
      <section id="disponibles" className="container mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Disponibles</h2>

        {/* Mobile: horizontal slides of 3 cards */}
        <div className="mt-6 md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4">
            {chunk(available, 3).map((group, gi) => (
              <div key={gi} className="w-[85vw] shrink-0 snap-center flex flex-col gap-4">
                {group.map((v) => (
                  <Link key={v.slug} href={`/vehiculo/${v.slug}`} className="group">
                    <div className="rounded-lg overflow-hidden border bg-card hover:shadow-xl transition-shadow">
                      <div className="relative aspect-[4/3]">
                        <Image src={v.thumbnail} alt={`${v.brand} ${v.model}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{v.brand}</p>
                          <p className="font-medium">{v.model} · {v.year}</p>
                        </div>
                        <p className="font-semibold">{formatPriceUSD(v.priceUsd)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="mt-6 hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((v) => (
            <Link key={v.slug} href={`/vehiculo/${v.slug}`} className="group">
              <div className="rounded-lg overflow-hidden border bg-card hover:shadow-xl transition-shadow">
                <div className="relative aspect-[4/3]">
                  <Image src={v.thumbnail} alt={`${v.brand} ${v.model}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="">
                    <p className="text-sm text-muted-foreground">{v.brand}</p>
                    <p className="font-medium">{v.model} · {v.year}</p>
                  </div>
                  <p className="font-semibold">{formatPriceUSD(v.priceUsd)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sold vehicles */}
      <section id="vendidos" className="container mt-16 mb-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Vendidos</h2>

        {/* Mobile: horizontal slides of 3 cards */}
        <div className="mt-6 md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4">
            {chunk(sold, 3).map((group, gi) => (
              <div key={gi} className="w-[85vw] shrink-0 snap-center flex flex-col gap-4">
                {group.map((v) => (
                  <div key={v.slug} className="group">
                    <div className="rounded-lg overflow-hidden border bg-card opacity-90">
                      <div className="relative aspect-[4/3]">
                        <Image src={v.thumbnail} alt={`${v.brand} ${v.model}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 grid place-items-center">
                          <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-white text-black rounded">Sold</span>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{v.brand}</p>
                          <p className="font-medium">{v.model} · {v.year}</p>
                        </div>
                        <p className="font-semibold">{formatPriceUSD(v.priceUsd)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="mt-6 hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {sold.map((v) => (
            <div key={v.slug} className="group">
              <div className="rounded-lg overflow-hidden border bg-card opacity-90">
                <div className="relative aspect-[4/3]">
                  <Image src={v.thumbnail} alt={`${v.brand} ${v.model}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 grid place-items-center">
                    <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-white text-black rounded">Sold</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{v.brand}</p>
                    <p className="font-medium">{v.model} · {v.year}</p>
                  </div>
                  <p className="font-semibold">{formatPriceUSD(v.priceUsd)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
