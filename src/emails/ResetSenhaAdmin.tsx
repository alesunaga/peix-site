// src/emails/ResetSenhaAdmin.tsx
// RF-ADMIN-08 — recuperação de senha do Painel Admin.

import { SITE_URL } from "@/lib/site";

type Props = { token: string };

export default function ResetSenhaAdmin({ token }: Props) {
  const linkReset = `${SITE_URL}/admin/resetar-senha?token=${token}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Olá,</p>
      <p>Recebemos um pedido para redefinir a senha da sua conta no Painel Admin do PEIx.</p>
      <p>
        <a href={linkReset}>Redefinir minha senha</a>
      </p>
      <p>Este link é de uso único e expira em 1 hora.</p>
      <p>Se você não pediu essa redefinição, pode ignorar este e-mail — sua senha continua a mesma.</p>
      <p>— Equipe PEIx</p>
    </div>
  );
}
