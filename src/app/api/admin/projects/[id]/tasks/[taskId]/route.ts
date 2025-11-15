/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, ctx: any) {
  try {
    const params = await (ctx.params as any);
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/vm_sid=([^;]+)/);
    if (!m) return NextResponse.json({ ok: false }, { status: 401 });
    const payload = verifyToken(m[1]);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const p: any = prisma;
    const user = await p.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 403 });

  const projectId = Number(params.id);
  const taskId = Number(params.taskId);
    const task = await p.projectTask.findUnique({ where: { id: taskId } });
    if (!task || task.projectId !== projectId) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const updated = await p.projectTask.update({ where: { id: taskId }, data: { done: !task.done } });

    // create notification for project client
    const project = await p.project.findUnique({ where: { id: projectId } });
    if (project && project.clientId) {
      await p.notification.create({ data: { toUserId: project.clientId, projectId, message: `Tarea '${updated.title}' marcada como ${updated.done ? 'hecha' : 'pendiente'}` } });
    }

    return NextResponse.json({ ok: true, task: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
