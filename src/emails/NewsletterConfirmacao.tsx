// src/emails/NewsletterConfirmacao.tsx
// RF-BLOG-04 — double opt-in.

type Props = { token: string };

export default function NewsletterConfirmacao({ token }: Props) {
  const linkConfirmacao = `https://peix.ia.br/newsletter/confirmar?token=${token}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Quase lá!</p>
      <p>Confirme sua inscrição no blog do PEIx para receber avisos de novos posts:</p>
      <p>
        <a href={linkConfirmacao}>Confirmar inscrição</a>
      </p>
      <p>Se você não pediu essa inscrição, pode ignorar este e-mail.</p>
    </div>
  );
}
