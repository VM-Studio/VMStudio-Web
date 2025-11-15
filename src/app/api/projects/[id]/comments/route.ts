/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, ctx: any) {
  try {
    const params = await (ctx.params as any);
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/vm_sid=([^;]+)/);
    if (!match) return NextResponse.json({ ok: false }, { status: 401 });
    const token = match[1];
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json();
    const content = String(body.content || "").trim();
    if (!content) return NextResponse.json({ ok: false, error: "Missing content" }, { status: 400 });


  const projectId = Number(params.id);
  const p: any = prisma;
  const comment = await p.comment.create({ data: { projectId, authorId: payload.userId, content } });

  // notify admins
  const admins = await p.user.findMany({ where: { role: 'ADMIN' } });
  const notifications = admins.map((a: any) => ({ toUserId: a.id, projectId, message: `Nuevo comentario en el proyecto #${projectId}` }));
  if (notifications.length) await p.notification.createMany({ data: notifications });

    return NextResponse.json({ ok: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
