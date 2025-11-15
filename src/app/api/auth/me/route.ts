import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UserWithRole = {
  id: number;
  email: string;
  phone?: string | null;
  password: string;
  firstName: string;
  lastName: string;
  dni?: string | null;
  createdAt: Date;
  role: "USER" | "ADMIN";
};

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/vm_sid=([^;]+)/);
    if (!match) return NextResponse.json({ ok: false }, { status: 401 });
    const token = match[1];
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const user = (await prisma.user.findUnique({ where: { id: payload.userId } })) as unknown as UserWithRole | null;
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
