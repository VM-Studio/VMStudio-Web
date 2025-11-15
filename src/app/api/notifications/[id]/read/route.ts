/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, ctx: any) {
  try {
    const params = await (ctx.params as any);
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/vm_sid=([^;]+)/);
    if (!match) return NextResponse.json({ ok: false }, { status: 401 });
    const token = match[1];
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const id = Number(params.id);
    const p: any = prisma;
    const notif = await p.notification.findUnique({ where: { id } });
    if (!notif) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    if (notif.toUserId !== payload.userId) return NextResponse.json({ ok: false, error: 'Not authorized' }, { status: 403 });

    await p.notification.update({ where: { id }, data: { read: true } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
