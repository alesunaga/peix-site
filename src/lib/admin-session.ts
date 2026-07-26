// src/lib/admin-session.ts
//
// RF-ADMIN-01 / RN-ADMIN-03 — sessão do Painel Admin.
//
// Cookie httpOnly + secure + sameSite=lax, assinado com HMAC-SHA256 via Web
// Crypto (não `node:crypto`) para funcionar tanto em API routes (runtime
// Node.js) quanto no middleware (runtime Edge) sem duplicar implementação.
//
// Formato do token: "<payload-base64url>.<assinatura-base64url>"
// payload = { sub: adminId, iat: epochSeconds, exp: epochSeconds }
//
// RN-ADMIN-03: expiração por inatividade (7 dias) — o middleware reemite o
// cookie a cada requisição autenticada, deslizando a expiração (ver
// src/middleware.ts). Nessa renovação o `iat` é preservado (não vira
// "agora") — é ele que permite revogar sessões antigas quando a senha muda:
// getAdminAtual() (src/lib/admin-current.ts) rejeita qualquer sessão cujo
// `iat` seja anterior a AdminUser.senhaAlteradaEm. Esse cookie é stateless
// (sem tabela de sessões), então essa checagem por data é o único jeito de
// revogar — só roda em runtime Node.js (onde dá pra consultar o banco), não
// no middleware Edge, que só valida assinatura/expiração.

export const ADMIN_SESSION_COOKIE = "peix_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 dias

type SessionPayload = {
  sub: string; // AdminUser.id
  iat: number; // epoch seconds — quando a sessão foi autenticada de verdade (não muda em renovações)
  exp: number; // epoch seconds
};

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET não configurada.");
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/**
 * Cria um token de sessão assinado para o AdminUser informado.
 *
 * `iat` só deve ser passado explicitamente ao renovar uma sessão existente
 * (middleware) — para preservá-lo. Numa autenticação nova (login, ativação
 * de convite), omita para usar o instante atual.
 */
export async function createSessionToken(
  adminId: string,
  maxAgeSeconds: number = ADMIN_SESSION_MAX_AGE_SECONDS,
  iat: number = Math.floor(Date.now() / 1000),
): Promise<string> {
  const payload: SessionPayload = {
    sub: adminId,
    iat,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));

  return `${payloadB64}.${toBase64Url(signature)}`;
}

/** Verifica um token de sessão. Retorna o payload se válido e não expirado, senão `null`. */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;

  const partes = token.split(".");
  if (partes.length !== 2) return null;
  const [payloadB64, signatureB64] = partes;

  try {
    const key = await getHmacKey();
    const valido = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signatureB64),
      new TextEncoder().encode(payloadB64),
    );
    if (!valido) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (typeof payload.iat !== "number") return null;
    if (typeof payload.sub !== "string" || !payload.sub) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Opções padrão do cookie de sessão — usadas tanto no login quanto no middleware. */
export function sessionCookieOptions(maxAgeSeconds: number = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
