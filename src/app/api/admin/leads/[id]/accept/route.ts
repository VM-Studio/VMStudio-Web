/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request, ctx: any) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/vm_sid=([^;]+)/);
    if (!m) return NextResponse.json({ ok: false }, { status: 401 });
    const payload = verifyToken(m[1]);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
    const p: any = prisma;
    const user = await p.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 403 });

  const params = await ctx.params;
  const id = parseInt(params.id, 10);
  const lead = await p.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    // create project from lead
    const title = lead.business || `Proyecto - ${lead.name || lead.email}`;
    const project = await p.project.create({ data: { title, description: lead.details || undefined, leadId: lead.id, status: 'active' } });

    // create notification to admin user
    await p.notification.create({ data: { toUserId: payload.userId, projectId: project.id, message: `Solicitud aceptada: ${title}` } });

    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
