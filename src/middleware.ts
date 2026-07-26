// src/middleware.ts
//
// Protege o Painel Admin (RF-ADMIN-01). Roda no runtime Edge — por isso a
// verificação de sessão usa Web Crypto (src/lib/admin-session.ts) em vez de
// bcrypt/node:crypto.
//
// - Páginas /admin/**  (exceto /admin/login): sem sessão válida -> redireciona
//   para /admin/login.
// - Rotas  /api/admin/** (exceto /api/admin/auth/**, usadas por login,
//   logout e os futuros fluxos de convite/reset de senha, que são
//   intencionalmente públicos): sem sessão válida -> 401 JSON.
// - RN-ADMIN-03: sessão desliza 7 dias de inatividade — toda requisição
//   autenticada reemite o cookie com a validade renovada.

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

// Páginas acessíveis sem sessão — quem chega aqui ainda não está autenticado
// por definição (login, ativação de convite, recuperação de senha).
const PAGINAS_PUBLICAS = new Set([
  LOGIN_PATH,
  "/admin/ativar",
  "/admin/esqueci-senha",
  "/admin/resetar-senha",
]);

function isRotaAuthPublica(pathname: string) {
  return pathname.startsWith("/api/admin/auth/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api/admin");
  const isPagina = pathname.startsWith("/admin") && !isApi;

  if (isApi && isRotaAuthPublica(pathname)) {
    return NextResponse.next();
  }

  if (isPagina && PAGINAS_PUBLICAS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessao = await verifySessionToken(token);

  if (!sessao) {
    if (isApi) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirecionarPara", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sessão válida — desliza a expiração (RN-ADMIN-03) e segue.
  const resposta = NextResponse.next();
  const novoToken = await createSessionToken(sessao.sub);
  resposta.cookies.set(ADMIN_SESSION_COOKIE, novoToken, sessionCookieOptions(ADMIN_SESSION_MAX_AGE_SECONDS));
  return resposta;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
