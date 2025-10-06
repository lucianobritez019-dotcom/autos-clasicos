import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      brand,
      model,
      year,
      priceUsd,
      thumbnail,
      images = [],
      videos = [],
      description = "",
      sold = false,
      mediaOrdered = null,
    } = body;

    if (!slug || !brand || !model || !year || !priceUsd || !thumbnail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = {
      slug,
      brand,
      model,
      year: Number(year),
      priceUsd: Number(priceUsd),
      thumbnail,
      images,
      videos,
      description,
      sold: Boolean(sold),
      mediaOrdered,
    };

    const upserted = await prisma.vehicle.upsert({
      where: { slug },
      update: data,
      create: data,
    });

    return NextResponse.json(upserted);
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
