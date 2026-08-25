// src/app/api/track/route.ts
//
// Analytics próprio — Analytics_Proprio_Site_PEIx_v1.0
//
// Recebe o "beacon" de pageview disparado pelo componente client
// (src/components/site/AnalyticsBeacon.tsx) a cada navegação. Roda no
// runtime Node.js padrão dos Route Handlers (não Edge), por isso pode usar
// o Prisma Client normalmente — mesmo motivo pelo qual esta coleta NÃO foi
// feita no middleware (que roda em Edge e não tem acesso direto ao Postgres
// sem um driver adapter específico).
//
// Público (fora do matcher /api/admin de src/middleware.ts) — não exige
// sessão, é chamado pelo próprio visitante do site.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { obterIpDaRequisicao, registrarPageview } from "@/lib/analytics";

const trackSchema = z.object({
  path: z.string().min(1).max(500),
  referrer: z.string().max(1000).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  // sendBeacon envia um Blob — não garante Content-Type application/json
  // em todos os navegadores, então parseia o texto manualmente em vez de
  // depender de request.json().
  const raw = await request.text();
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ erro: "Corpo inválido." }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Payload inválido." }, { status: 400 });
  }

  const ip = obterIpDaRequisicao(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";

  // Best-effort (registrarPageview nunca lança) — mesmo assim aguardamos
  // aqui, e não com "void", para não deixar a escrita pendurada caso o
  // processo/request seja encerrado logo após a resposta (mesmo cuidado de
  // enviarEmailsSemBloquear em src/lib/resend.ts).
  await registrarPageview({
    path: parsed.data.path,
    referrer: parsed.data.referrer,
    utmSource: parsed.data.utmSource,
    utmMedium: parsed.data.utmMedium,
    utmCampaign: parsed.data.utmCampaign,
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true });
}
