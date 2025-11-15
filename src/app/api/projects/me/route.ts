/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/vm_sid=([^;]+)/);
    if (!match) return NextResponse.json({ ok: false }, { status: 401 });
    const token = match[1];
    // verify token
    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token) as any;
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const userId = payload.userId;
    const p: any = prisma;
    const projects = await p.project.findMany({ where: { clientId: userId }, include: { tasks: true } });
    const notifications = await p.notification.findMany({ where: { toUserId: userId }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ ok: true, projects, notifications });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
