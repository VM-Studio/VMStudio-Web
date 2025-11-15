/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Try to send email using nodemailer if SMTP env vars are present
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      // dynamic import so local dev without nodemailer still works
  // dynamic import - nodemailer may not be installed in all environments
  // @ts-expect-error: optional dependency may not be installed in all environments
  const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? parseInt(SMTP_PORT) : 587,
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailBody = `Nuevo lead\n\n${JSON.stringify(body, null, 2)}`;

      await transporter.sendMail({
        from: SMTP_USER,
        to: process.env.LEADS_TO || SMTP_USER,
        subject: `Nuevo lead - VM Studio`,
        text: mailBody,
      });

      // send confirmation to client if contact/email provided
      try{
        const clientEmail = body.contact || body.email;
        if (clientEmail) {
          await transporter.sendMail({
            from: SMTP_USER,
            to: clientEmail,
            subject: `Gracias por contactarnos - VM Studio`,
            text: `Gracias por contactarnos. Hemos recibido tu solicitud y en menos de 24 horas nos pondremos en contacto.\n\nResumen:\n${JSON.stringify(body, null, 2)}`,
          });
        }
      }catch(e){ console.error('confirm email error', e); }

      // persist lead even if email sent
      try{
        const maybeToken = (req.headers.get('cookie')||'').match(/vm_sid=([^;]+)/);
        let userId: number | undefined;
        if (maybeToken) {
          const payload = verifyToken(maybeToken[1]);
          if (payload) userId = payload.userId;
        }
        const p: any = prisma;
        await p.lead.create({ data: { name: body.name || body.business || null, email: body.contact || body.email || '', phone: body.phone || null, business: body.business || null, details: body.description || body.details || null, raw: body, userId } });
      }catch(e){ console.error('persist lead error', e); }

      return NextResponse.json({ ok: true });
    }

    // Fallback: log to server console (useful for dev)
    // persist lead to DB when SMTP not configured
    try{
      const maybeToken = (req.headers.get('cookie')||'').match(/vm_sid=([^;]+)/);
      let userId: number | undefined;
      if (maybeToken) {
        const payload = verifyToken(maybeToken[1]);
        if (payload) userId = payload.userId;
      }
      const p: any = prisma;
      await p.lead.create({ data: { name: body.name || body.business || null, email: body.contact || body.email || '', phone: body.phone || null, business: body.business || null, details: body.description || body.details || null, raw: body, userId } });
    }catch(e){ console.error('persist lead error', e); }
    return NextResponse.json({ ok: true, fallback: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
