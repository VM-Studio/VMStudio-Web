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

    // ensure admin
    const p: any = prisma;
    const admin = await p.user.findUnique({ where: { id: payload.userId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 403 });

  const projectId = Number(params.id);
    const body = await req.json();
    const { content } = body;
    if (!content) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });

    const comment = await p.comment.create({ data: { projectId, authorId: payload.userId, content } });

    const project = await p.project.findUnique({ where: { id: projectId } });
    if (project && project.clientId) {
      await p.notification.create({ data: { toUserId: project.clientId, projectId, message: `Comentario del admin: ${content}` } });
    }

    return NextResponse.json({ ok: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
