// src/lib/resend.ts
//
// Cliente Resend + funções de envio usadas pelos fluxos de:
// - RF-LEAD-05/06/07 (confirmação, material informativo, aviso ao representante)
// - RF-BLOG-04/05/06 (confirmação de inscrição, aviso de novo post, unsubscribe)
// - RF-DIAG-04/05 (reaproveita o fluxo de lead)
//
// Os templates React ficam em src/emails/ (react-email). Aqui só orquestramos
// o envio — a composição visual de cada e-mail é responsabilidade do template.

import { Resend } from "resend";
import LeadConfirmacao from "@/emails/LeadConfirmacao";
import MaterialInformativo from "@/emails/MaterialInformativo";
import AvisoRepresentante from "@/emails/AvisoRepresentante";
import NewsletterConfirmacao from "@/emails/NewsletterConfirmacao";
import NovoPost from "@/emails/NovoPost";
import type { Lead, Diagnostico, Post } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "PEIx <contato@peix.ia.br>";
const REPRESENTANTE_EMAIL = process.env.REPRESENTANTE_EMAIL;

/**
 * O SDK do Resend NÃO lança exceção em falhas da API (chave inválida,
 * domínio não verificado, etc.) — ele resolve normalmente com
 * `{ data: null, error: {...} }`. Sem checar isso explicitamente, uma falha
 * de envio fica invisível e o resto do fluxo (ex: resposta 201 ao visitante)
 * segue como se tivesse dado tudo certo. Este helper força o erro a virar
 * uma exceção de verdade, para aparecer nos logs do servidor.
 */
async function enviarOuFalhar(
  params: Parameters<typeof resend.emails.send>[0],
  contexto: string,
) {
  const { data, error } = await resend.emails.send(params);
  if (error) {
    throw new Error(`Falha ao enviar e-mail (${contexto}): ${error.message}`);
  }
  return data;
}

/**
 * Roda uma lista de envios de e-mail em paralelo sem deixar uma falha
 * derrubar a resposta da rota — e-mail é um efeito colateral (best-effort),
 * nunca deve impedir o visitante de ver o resultado do formulário/diagnóstico
 * que já foi calculado e gravado com sucesso. Falhas são só logadas.
 */
export async function enviarEmailsSemBloquear(envios: Array<() => Promise<unknown>>) {
  const resultados = await Promise.allSettled(envios.map((envio) => envio()));
  for (const resultado of resultados) {
    if (resultado.status === "rejected") {
      console.error("[resend] Falha ao enviar e-mail:", resultado.reason);
    }
  }
}

/**
 * RF-LEAD-05 — e-mail de confirmação de recebimento ao visitante.
 */
export async function enviarConfirmacaoLead(lead: Lead) {
  return enviarOuFalhar(
    {
      from: FROM,
      to: lead.email,
      subject: "Recebemos seu contato — PEIx",
      react: LeadConfirmacao({ nome: lead.nome }),
    },
    "confirmação de lead",
  );
}

/**
 * RF-LEAD-06 — material informativo (PDF/link) enviado logo em seguida.
 */
export async function enviarMaterialInformativo(lead: Lead) {
  return enviarOuFalhar(
    {
      from: FROM,
      to: lead.email,
      subject: "Seu material sobre o Decreto nº 12.773/2025",
      react: MaterialInformativo({ nome: lead.nome }),
    },
    "material informativo",
  );
}

/**
 * RF-LEAD-07 / RF-DIAG-05 — aviso interno ao representante comercial.
 * Inclui pontuação/categoria do diagnóstico quando o lead veio dessa origem.
 */
export async function enviarAvisoRepresentante(
  lead: Lead,
  diagnostico?: Pick<Diagnostico, "pontuacao" | "categoria"> | null,
) {
  if (!REPRESENTANTE_EMAIL) {
    throw new Error("REPRESENTANTE_EMAIL não configurado no ambiente.");
  }

  return enviarOuFalhar(
    {
      from: FROM,
      to: REPRESENTANTE_EMAIL,
      subject: `Novo lead: ${lead.instituicao ?? lead.nome}`,
      react: AvisoRepresentante({ lead, diagnostico: diagnostico ?? null }),
    },
    "aviso ao representante",
  );
}

/**
 * RF-BLOG-04 — confirmação de inscrição (double opt-in).
 */
export async function enviarConfirmacaoNewsletter(email: string, token: string) {
  return enviarOuFalhar(
    {
      from: FROM,
      to: email,
      subject: "Confirme sua inscrição no blog do PEIx",
      react: NewsletterConfirmacao({ token }),
    },
    "confirmação de newsletter",
  );
}

/**
 * RF-BLOG-05 — aviso de novo post para um assinante confirmado.
 * Chamado em lote pelo job de publicação (ver src/app/api/posts/[id]/route.ts).
 */
export async function enviarAvisoNovoPost(email: string, post: Post, unsubscribeToken: string) {
  return enviarOuFalhar(
    {
      from: FROM,
      to: email,
      subject: `Novo no blog PEIx: ${post.titulo}`,
      react: NovoPost({ post, unsubscribeToken }),
    },
    "aviso de novo post",
  );
}
