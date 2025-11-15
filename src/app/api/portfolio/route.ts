/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try{
    const p: any = prisma;
    const projects = await p.project.findMany({ where: { status: 'active' }, select: { id: true, title: true, description: true, createdAt: true } , orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ ok: true, projects });
  }catch(e){
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
