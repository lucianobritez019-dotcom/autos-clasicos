import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings ?? {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { heroImageUrl, whatsappNumber, siteTitle, logoUrl } = body;
    if (!heroImageUrl) {
      return NextResponse.json({ error: "heroImageUrl is required" }, { status: 400 });
    }

    const updated = await prisma.settings.upsert({
      where: { id: 1 },
      update: { heroImageUrl, whatsappNumber, siteTitle, logoUrl },
      create: { id: 1, heroImageUrl, whatsappNumber, siteTitle, logoUrl },
    });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
