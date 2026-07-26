// src/emails/ConviteAdmin.tsx
// RF-ADMIN-06 — convite de novo administrador. A senha nunca é definida nem
// transmitida por quem convida; o convidado a define ao clicar no link.

type Props = { token: string; convidadoPorEmail: string | null };

export default function ConviteAdmin({ token, convidadoPorEmail }: Props) {
  const linkAtivacao = `https://peix.ia.br/admin/ativar?token=${token}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Olá,</p>
      <p>
        {convidadoPorEmail ? `${convidadoPorEmail} convidou você` : "Você foi convidado(a)"} para ser
        administrador(a) do Painel Admin do PEIx.
      </p>
      <p>
        <a href={linkAtivacao}>Ativar minha conta</a>
      </p>
      <p>Ao clicar no link, você define sua própria senha de acesso. O convite expira em 48 horas.</p>
      <p>Se você não esperava este convite, pode ignorar este e-mail.</p>
      <p>— Equipe PEIx</p>
    </div>
  );
}
