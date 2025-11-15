import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
type LoginBody = { identifier?: string; password?: string; asAdmin?: boolean };

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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const identifier = body.identifier;
    const password = body.password;
    const asAdmin = !!body.asAdmin;
    if (!identifier || !password) return NextResponse.json({ ok: false }, { status: 400 });

  const user = (await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } })) as unknown as UserWithRole | null;
    if (!user) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });

    // If the client requested admin access, ensure the user has ADMIN role
    if (asAdmin && user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "Not authorized as admin" }, { status: 403 });
    }

    const token = signToken({ userId: user.id });

  const res = NextResponse.json({ ok: true });
  // set httpOnly cookie with token
  const secure = process.env.NODE_ENV === "production";
  // Use stricter SameSite to reduce CSRF surface; keep Secure in production and httpOnly always
  res.cookies.set("vm_sid", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: 'strict', secure });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
