// src/lib/analytics.ts
//
// Analytics próprio — Analytics_Proprio_Site_PEIx_v1.0
//
// Sem cookies. Sem IP/User-Agent brutos persistidos (só o hash). O hash de
// visitante muda todo dia (inclui a data), então não é possível reidentificar
// o mesmo visitante em dias diferentes — só contar "visitantes únicos por
// dia". Mantém a Politica_Privacidade_PEIx §8 inalterada.
//
// Toda gravação aqui é best-effort (mesmo espírito de enviarEmailsSemBloquear
// em src/lib/resend.ts): uma falha ao gravar analytics NUNCA pode quebrar o
// fluxo principal (servir a página, salvar um lead, etc.).

import { prisma } from "@/lib/prisma";
import { AnalyticsDispositivo, AnalyticsEventoTipo } from "@prisma/client";

// Precisa de um salt fixo (não versionado) para o hash não ser trivialmente
// recalculável por quem só tem acesso ao banco. Ver .env.example.
const SALT = process.env.ANALYTICS_SALT ?? "peix-analytics-dev-salt";

/**
 * SHA-256(IP + User-Agent + data do dia + salt) — nunca persiste IP/UA
 * brutos, só o resultado deste hash.
 */
export async function calcularVisitanteHash(ip: string, userAgent: string): Promise<string> {
  const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const entrada = `${ip}|${userAgent}|${hoje}|${SALT}`;
  const bytes = new TextEncoder().encode(entrada);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Extrai o IP do visitante dos headers de proxy do Railway. Só é usado para
 * calcular o hash acima — nunca é persistido.
 */
export function obterIpDaRequisicao(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "desconhecido";
}

export function classificarDispositivo(userAgent: string): AnalyticsDispositivo {
  const ua = userAgent.toLowerCase();
  if (!ua) return AnalyticsDispositivo.DESCONHECIDO;
  if (/ipad|tablet/.test(ua)) return AnalyticsDispositivo.TABLET;
  if (/mobi|iphone|android/.test(ua)) return AnalyticsDispositivo.MOBILE;
  return AnalyticsDispositivo.DESKTOP;
}

// Bots conhecidos (crawlers de busca, monitoramento de uptime, preview de
// link) — excluídos na coleta para não inflar as métricas de visita real.
// Filtro simples por User-Agent, suficiente para o volume de um site
// institucional (ver Analytics_Proprio_Site_PEIx_v1.0, §6 — sem detecção
// sofisticada de bot no MVP).
const BOT_UA_PATTERN =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|linkedinbot|uptimerobot|pingdom|ahrefs|semrush/i;

export function pareceBot(userAgent: string): boolean {
  return BOT_UA_PATTERN.test(userAgent);
}

export async function registrarPageview(params: {
  path: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  ip: string;
  userAgent: string;
}) {
  if (pareceBot(params.userAgent)) return;

  try {
    const visitanteHash = await calcularVisitanteHash(params.ip, params.userAgent);
    await prisma.analyticsPageview.create({
      data: {
        path: params.path,
        referrer: params.referrer || null,
        utmSource: params.utmSource || null,
        utmMedium: params.utmMedium || null,
        utmCampaign: params.utmCampaign || null,
        visitanteHash,
        dispositivo: classificarDispositivo(params.userAgent),
      },
    });
  } catch (erro) {
    console.error("[analytics] Falha ao gravar pageview:", erro);
  }
}

/**
 * Grava um evento de conversão (diagnóstico concluído, formulário enviado,
 * newsletter inscrita...). Best-effort — chamar sem `await` bloquear a
 * resposta principal da rota, e nunca deixar propagar erro.
 */
export async function registrarEvento(params: {
  tipo: AnalyticsEventoTipo;
  path?: string;
  visitanteHash?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  try {
    await prisma.analyticsEvento.create({
      data: {
        tipo: params.tipo,
        path: params.path,
        visitanteHash: params.visitanteHash,
        metadata: params.metadata,
      },
    });
  } catch (erro) {
    console.error("[analytics] Falha ao gravar evento:", erro);
  }
}
