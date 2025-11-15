import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type SignupBody = {
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
  const body = (await req.json()) as SignupBody;
  const { firstName, lastName, dni, phone, email, password } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ ok: false, error: "Email already in use" }, { status: 409 });

  // For security: signup always creates regular USER accounts.
  // Admin accounts must be provisioned separately (e.g. via scripts or DB admin).

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashed,
        firstName,
        lastName,
        dni,
      },
    });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
