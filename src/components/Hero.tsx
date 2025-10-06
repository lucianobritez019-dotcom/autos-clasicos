"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  logoUrl?: string;
  siteTitle?: string;
};

export default function Hero({ images, logoUrl, siteTitle }: Props) {
  const valid = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (valid.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % valid.length);
    }, 5000);
    return () => clearInterval(id);
  }, [valid.length]);

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Stack all images and fade */}
      {valid.map((src, i) => (
        <div key={src + i} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}>
          <Image src={src} alt={siteTitle || "Hero"} fill priority={i === 0} className="object-cover" sizes="100vw" />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-background/60" />

      {/* Bottom-centered circular logo holder */}
      <div className="absolute bottom-[-42px] left-1/2 -translate-x-1/2 z-10">
        <div className="size-24 md:size-28 rounded-full bg-white/95 shadow-xl ring-1 ring-black/10 grid place-items-center overflow-hidden">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteTitle || "Logo"} width={112} height={112} className="object-contain" />
          ) : (
            <span className="text-xs md:text-sm tracking-widest text-neutral-700">LOGO</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <a href="#disponibles" className="px-4 py-2 rounded-full bg-black/80 text-white text-sm hover:bg-black">
          Ver disponibles
        </a>
      </div>

      <div className="absolute bottom-0 w-full pb-16 md:pb-20" />
    </section>
  );
}
