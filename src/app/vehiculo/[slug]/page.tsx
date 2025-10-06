export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { formatPriceUSD } from "@/lib/vehicles";
import { getVehicles, buildWhatsAppLink } from "@/lib/datasource";
import Gallery from "@/components/Gallery";

export default async function VehiclePage({ params }: any) {
  const list = await getVehicles();
  const v = list.find((x) => x.slug === params.slug);
  if (!v) return notFound();

  const waLink = await buildWhatsAppLink(v);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Gallery
          images={[v.images[0] ?? v.thumbnail, ...v.images.slice(1)]}
          videos={v.videos}
          ordered={v.mediaOrdered}
          alt={`${v.brand} ${v.model}`}
        />

        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {v.brand} {v.model} <span className="text-muted-foreground">{v.year}</span>
          </h1>
          <p className="text-xl font-bold">{formatPriceUSD(v.priceUsd)}</p>
          {v.sold && (
            <p className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded bg-black text-white w-fit">Sold</p>
          )}
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground">{v.description}</p>

          <div className="h-px bg-border" />

          <div className="flex flex-wrap gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.51-5.9C.234 5.318 5.552 0 12.094 0c3.182 0 6.167 1.24 8.413 3.488a11.83 11.83 0 013.488 8.41c-.003 6.545-5.322 11.862-11.867 11.862a11.9 11.9 0 01-5.903-1.508L.057 24zm6.597-3.807c1.736.995 3.276 1.591 5.35 1.594 5.448 0 9.887-4.434 9.889-9.882.002-5.462-4.415-9.894-9.881-9.896-5.449 0-9.887 4.434-9.889 9.882 0 2.225.651 3.891 1.746 5.555l-.999 3.648 3.784-1.001zm11.387-5.464c-.074-.124-.272-.198-.568-.348-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.668.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.607.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.568-.01c-.198 0-.521.074-.794.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.263.489 1.694.627.712.226 1.361.194 1.876.118.571-.085 1.758-.718 2.006-1.411.248-.694.248-1.289.173-1.412z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
