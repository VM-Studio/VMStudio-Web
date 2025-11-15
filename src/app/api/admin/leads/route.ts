/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

  const leads = await p.lead.findMany({ where: { project: { is: null } }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ ok: true, leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
