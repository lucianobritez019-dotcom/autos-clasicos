"use client";

import { useEffect, useState } from "react";

type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  thumbnail: string;
  images: string[];
  videos?: string[];
  description: string;
  sold: boolean;
  mediaOrdered?: string[];
};

type Settings = {
  heroImageUrl: string;
  whatsappNumber?: string;
  siteTitle?: string;
  logoUrl?: string;
};

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || "";

async function uploadFilesToCloudinary(files: File[], folder?: string): Promise<string[]> {
  if (!cloudName || !uploadPreset) throw new Error("Cloudinary no está configurado");
  const urls: string[] = [];
  for (const file of files) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    if (folder) form.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Falló la subida a Cloudinary");
    const json = await res.json();
    urls.push(json.secure_url as string);
  }
  return urls;
}

export default function AdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [sForm, setSForm] = useState<Settings>({ heroImageUrl: "", whatsappNumber: "", siteTitle: "", logoUrl: "" });
  const [vForm, setVForm] = useState<Vehicle>({ slug: "", brand: "", model: "", year: 1970, priceUsd: 0, thumbnail: "", images: [], videos: [], description: "", sold: false, mediaOrdered: [] });
  const [uploading, setUploading] = useState<string | null>(null);

  async function load() {
    const sres = await fetch("/api/settings");
    const sjson = await sres.json();
    setSettings(sjson);
    setSForm({
      heroImageUrl: sjson?.heroImageUrl || "",
      whatsappNumber: sjson?.whatsappNumber || "",
      siteTitle: sjson?.siteTitle || "",
      logoUrl: sjson?.logoUrl || "",
    });

    const vres = await fetch("/api/vehicles");
    const vjson = await vres.json();
    setVehicles(vjson);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSettings() {
    await fetch("/api/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sForm) });
    load();
  }

  async function saveVehicle() {
    const payload = { ...vForm, year: Number(vForm.year), priceUsd: Number(vForm.priceUsd) };
    await fetch("/api/vehicles", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setVForm({ slug: "", brand: "", model: "", year: 1970, priceUsd: 0, thumbnail: "", images: [], videos: [], description: "", sold: false, mediaOrdered: [] });
    load();
  }

  async function handleUploadSingle(kind: "hero" | "logo" | "thumb") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = kind === "logo" || kind === "thumb" ? "image/*" : "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        setUploading(`Subiendo ${kind}...`);
        const [url] = await uploadFilesToCloudinary([file], "autos-clasicos");
        if (kind === "hero") setSForm((f) => ({ ...f, heroImageUrl: url }));
        if (kind === "logo") setSForm((f) => ({ ...f, logoUrl: url }));
        if (kind === "thumb") setVForm((v) => ({ ...v, thumbnail: url }));
      } catch (e) {
        alert("No se pudo subir el archivo a Cloudinary");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  async function handleUploadMultiple(kind: "images" | "videos") {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = kind === "images" ? "image/*" : "video/*";
    input.onchange = async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (!files.length) return;
      try {
        setUploading(`Subiendo ${kind}...`);
        const urls = await uploadFilesToCloudinary(files, "autos-clasicos");
        if (kind === "images") setVForm((v) => ({ ...v, images: [...v.images, ...urls] }));
        if (kind === "videos") setVForm((v) => ({ ...v, videos: [...(v.videos || []), ...urls] }));
      } catch (e) {
        alert("No se pudo subir a Cloudinary");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  const cloudNotConfigured = !cloudName || !uploadPreset;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold">Admin</h1>

      {cloudNotConfigured && (
        <div className="mt-4 rounded-md border bg-amber-50 text-amber-900 p-3 text-sm">
          Cloudinary no está configurado. Crea una cuenta gratuita en cloudinary.com, luego en Netlify agrega variables de entorno:
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET. Después, vuelve a esta página.
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-medium">Ajustes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Hero Image URL</span>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={sForm.heroImageUrl} onChange={(e) => setSForm({ ...sForm, heroImageUrl: e.target.value })} />
              <button disabled={cloudNotConfigured} onClick={() => handleUploadSingle("hero")} className="px-2 py-1 rounded bg-black text-white disabled:opacity-50">Subir</button>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Logo URL</span>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={sForm.logoUrl || ""} onChange={(e) => setSForm({ ...sForm, logoUrl: e.target.value })} />
              <button disabled={cloudNotConfigured} onClick={() => handleUploadSingle("logo")} className="px-2 py-1 rounded bg-black text-white disabled:opacity-50">Subir</button>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Título del sitio</span>
            <input className="border rounded px-2 py-1" value={sForm.siteTitle || ""} onChange={(e) => setSForm({ ...sForm, siteTitle: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">WhatsApp (sin +)</span>
            <input className="border rounded px-2 py-1" value={sForm.whatsappNumber || ""} onChange={(e) => setSForm({ ...sForm, whatsappNumber: e.target.value })} />
          </label>
        </div>
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          {uploading ? <span>{uploading}</span> : null}
        </div>
        <button onClick={saveSettings} className="mt-4 px-3 py-2 rounded bg-black text-white">Guardar ajustes</button>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Vehículo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Slug (único)</span>
            <input className="border rounded px-2 py-1" value={vForm.slug} onChange={(e) => setVForm({ ...vForm, slug: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Marca</span>
            <input className="border rounded px-2 py-1" value={vForm.brand} onChange={(e) => setVForm({ ...vForm, brand: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Modelo</span>
            <input className="border rounded px-2 py-1" value={vForm.model} onChange={(e) => setVForm({ ...vForm, model: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Año</span>
            <input type="number" className="border rounded px-2 py-1" value={vForm.year} onChange={(e) => setVForm({ ...vForm, year: Number(e.target.value) })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Precio USD</span>
            <input type="number" className="border rounded px-2 py-1" value={vForm.priceUsd} onChange={(e) => setVForm({ ...vForm, priceUsd: Number(e.target.value) })} />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Thumbnail URL</span>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={vForm.thumbnail} onChange={(e) => setVForm({ ...vForm, thumbnail: e.target.value })} />
              <button disabled={cloudNotConfigured} onClick={() => handleUploadSingle("thumb")} className="px-2 py-1 rounded bg-black text-white disabled:opacity-50">Subir</button>
            </div>
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Imágenes (separadas por |)</span>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={vForm.images.join("|")} onChange={(e) => setVForm({ ...vForm, images: e.target.value.split("|").filter(Boolean) })} />
              <button disabled={cloudNotConfigured} onClick={() => handleUploadMultiple("images")} className="px-2 py-1 rounded bg-black text-white disabled:opacity-50">Agregar</button>
            </div>
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Videos (YouTube o MP4, separados por |)</span>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={(vForm.videos || []).join("|")} onChange={(e) => setVForm({ ...vForm, videos: e.target.value.split("|").filter(Boolean) })} />
              <button disabled={cloudNotConfigured} onClick={() => handleUploadMultiple("videos")} className="px-2 py-1 rounded bg-black text-white disabled:opacity-50">Agregar</button>
            </div>
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Orden de media (mezcla de imágenes y videos, separados por |)</span>
            <input className="border rounded px-2 py-1" value={(vForm.mediaOrdered || []).join("|")} onChange={(e) => setVForm({ ...vForm, mediaOrdered: e.target.value.split("|").filter(Boolean) })} />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm">Descripción</span>
            <textarea className="border rounded px-2 py-1" value={vForm.description} onChange={(e) => setVForm({ ...vForm, description: e.target.value })} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={vForm.sold} onChange={(e) => setVForm({ ...vForm, sold: e.target.checked })} />
            <span>Vendido</span>
          </label>
        </div>
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          {uploading ? <span>{uploading}</span> : null}
        </div>
        <button onClick={saveVehicle} className="mt-4 px-3 py-2 rounded bg-black text-white">Guardar vehículo</button>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Lista</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {vehicles.map((v) => (
            <div key={v.slug} className="border rounded p-3">
              <div className="text-sm text-muted-foreground">{v.brand}</div>
              <div className="font-medium">{v.model} · {v.year}</div>
              <div className="text-sm">Slug: {v.slug}</div>
              <div className="text-sm">Vendido: {v.sold ? "Sí" : "No"}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
