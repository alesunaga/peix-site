// src/emails/AvisoRepresentante.tsx
// RF-LEAD-07 / RF-DIAG-05 — aviso interno, inclui o resultado do diagnóstico
// quando aplicável, para dar contexto extra ao follow-up comercial.

import type { Lead, Diagnostico } from "@prisma/client";

type Props = {
  lead: Lead;
  diagnostico: Pick<Diagnostico, "pontuacao" | "categoria"> | null;
};

export default function AvisoRepresentante({ lead, diagnostico }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Novo lead recebido pelo site:</p>
      <ul>
        <li><strong>Nome:</strong> {lead.nome}</li>
        <li><strong>E-mail:</strong> {lead.email}</li>
        {lead.telefone && <li><strong>Telefone/WhatsApp:</strong> {lead.telefone}</li>}
        {lead.instituicao && <li><strong>Instituição:</strong> {lead.instituicao}</li>}
        {(lead.cidade || lead.uf) && <li><strong>Local:</strong> {lead.cidade}/{lead.uf}</li>}
        {lead.cargo && <li><strong>Cargo:</strong> {lead.cargo}</li>}
        {lead.segmentos.length > 0 && <li><strong>Segmentos:</strong> {lead.segmentos.join(", ")}</li>}
        <li><strong>Origem:</strong> {lead.origem}</li>
      </ul>
      {diagnostico && (
        <p>
          <strong>Diagnóstico de Conformidade:</strong> {diagnostico.pontuacao} pontos —
          categoria {diagnostico.categoria}
        </p>
      )}
    </div>
  );
}
