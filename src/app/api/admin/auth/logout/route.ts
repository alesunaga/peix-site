// src/app/api/admin/auth/logout/route.ts
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin-session";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(ADMIN_SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return resposta;
}
