// src/emails/LeadConfirmacao.tsx
// RF-LEAD-05 — enviado imediatamente após o envio do formulário de Contato
// ou do Diagnóstico de Conformidade.

type Props = { nome: string };

export default function LeadConfirmacao({ nome }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Olá, {nome.split(" ")[0]},</p>
      <p>
        Recebemos seu contato. Nosso representante vai analisar as informações da sua
        escola e falar com você por e-mail ou WhatsApp para agendar uma conversa.
      </p>
      <p>Enquanto isso, já te enviamos um material sobre o Decreto nº 12.773/2025 em outro e-mail.</p>
      <p>— Equipe PEIx</p>
    </div>
  );
}
