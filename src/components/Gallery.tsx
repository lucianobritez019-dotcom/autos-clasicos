"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  images: string[];
  videos?: string[];
  alt: string;
  ordered?: string[];
};

type Item = { type: "image" | "video"; src: string };

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    // ignore
  }
  return url;
}

export default function Gallery({ images, videos = [], ordered, alt }: Props) {
  const items: Item[] = useMemo(() => {
    if (ordered && ordered.length) {
      return ordered.map((src) => ({ type: src.match(/\.mp4($|\?)/i) ? ("video" as const) : (src.includes("youtube") || src.includes("youtu.be") ? ("video" as const) : ("image" as const)), src }));
    }
    const imgs = images.map((src) => ({ type: "image" as const, src }));
    const vids = videos.map((src) => ({ type: "video" as const, src }));
    return [...imgs, ...vids];
  }, [images, videos, ordered]);

  const [current, setCurrent] = useState(0);

  if (items.length === 0) return null;

  const active = items[current];

  return (
    <div>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
        {active.type === "image" ? (
          <Image src={active.src} alt={alt} fill className="object-cover" />
        ) : active.src.includes("youtube") || active.src.includes("youtu.be") ? (
          <iframe
            src={toYouTubeEmbed(active.src)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video src={active.src} className="w-full h-full object-cover" controls />
        )}
      </div>

      <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative aspect-square rounded-md overflow-hidden border ${
              i === current ? "ring-2 ring-black/70" : "hover:opacity-80"
            }`}
            aria-label={`Ver media ${i + 1}`}
          >
            {it.type === "image" ? (
              <Image src={it.src} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            ) : it.src.includes("youtube") || it.src.includes("youtu.be") ? (
              <div className="grid place-items-center bg-black/80 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path d="M10 8l6 4-6 4V8z" />
                </svg>
              </div>
            ) : (
              <div className="grid place-items-center bg-black/80 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path d="M10 8l6 4-6 4V8z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
