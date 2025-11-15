/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, ctx: any) {
  try {
    const params = await (ctx.params as any);
    const id = Number(params.id);
    const p: any = prisma;
    const project = await p.project.findUnique({
      where: { id },
      include: { lead: true, tasks: true, comments: { include: { author: true } } },
    });
    if (!project) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
