"use client";

// src/components/site/AnalyticsBeacon.tsx
//
// Analytics próprio — Analytics_Proprio_Site_PEIx_v1.0
//
// Dispara um "beacon" de pageview para POST /api/track a cada navegação
// (primeira carga da página e trocas de rota client-side do App Router).
// Sem cookie, sem script de terceiro — é uma chamada de mesma origem
// (first-party), o que evita a maior parte dos bloqueadores de anúncio
// genéricos (que miram domínios conhecidos de rastreamento, não o próprio
// domínio do site).
//
// Usa navigator.sendBeacon quando disponível (não atrasa navegação, sobrevive
// mesmo se o usuário sair da página no mesmo instante); cai para fetch com
// keepalive como fallback (SSR/navegadores antigos).
//
// useSearchParams() exige um limite <Suspense> — por isso este componente é
// montado dentro de <Suspense> em src/app/layout.tsx, e por isso ele próprio
// não renderiza nada (retorna null): é só efeito colateral, não faz sentido
// caber no fallback de Suspense de outra árvore visível.

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function enviarBeacon(payload: Record<string, string | undefined>) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Best-effort — uma falha aqui nunca deve aparecer para o visitante.
  });
}

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ultimoPathEnviado = useRef<string | null>(null);

  useEffect(() => {
    // Não mede navegação dentro do Painel Admin — é tráfego da própria
    // equipe, não visitante do site.
    if (pathname.startsWith("/admin")) return;

    // Evita duplicar o mesmo pageview (ex.: efeito rodando duas vezes em
    // desenvolvimento por causa do StrictMode).
    const chave = `${pathname}?${searchParams.toString()}`;
    if (ultimoPathEnviado.current === chave) return;
    ultimoPathEnviado.current = chave;

    enviarBeacon({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
