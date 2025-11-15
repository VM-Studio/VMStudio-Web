/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/vm_sid=([^;]+)/);
    if (!m) return NextResponse.json({ ok: false }, { status: 401 });
    const payload = verifyToken(m[1]);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
    const p: any = prisma;
    const user = await p.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 403 });
    const projects = await p.project.findMany({
      include: { lead: true, tasks: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, projects });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/vm_sid=([^;]+)/);
    if (!m) return NextResponse.json({ ok: false }, { status: 401 });
    const payload = verifyToken(m[1]);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
    const p: any = prisma;
    const user = await p.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 403 });
    const body = await req.json();
    const { title, description, clientId, leadId } = body;
    if (!title) return NextResponse.json({ ok: false, error: "Missing title" }, { status: 400 });

    const project = await p.project.create({
      data: { title, description, clientId: clientId || undefined, leadId: leadId || undefined },
    });

    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
