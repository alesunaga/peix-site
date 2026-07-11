// src/components/site/PoliticaPrivacidadeContent.tsx
//
// RF-SITE-04 — conteúdo integral de Politica_Privacidade_PEIx.md, adaptado
// para o layout do site (Aurora). Cobre apenas o site institucional
// (peix.ia.br); o produto PEIx tem política própria.

import { Card } from "@/components/ui/Card";

const DADOS_COLETADOS = [
  {
    onde: "Formulário de Contato",
    dados:
      "Nome completo, e-mail, telefone/WhatsApp, nome da instituição, cidade, UF, cargo, segmentos atendidos pela escola, se deseja agendar demonstração, e a origem da visita (UTM, quando presente na URL)",
  },
  {
    onde: "Diagnóstico de Conformidade",
    dados:
      "E-mail e, opcionalmente, nome (para liberar o resultado); as respostas do questionário sobre o processo de PEI da sua escola",
  },
  {
    onde: "Inscrição na Newsletter",
    dados: "Nome e e-mail",
  },
];

const FINALIDADES = [
  {
    finalidade: "Responder ao seu contato e enviar o material informativo solicitado",
    base: "Consentimento (art. 7º, I)",
  },
  {
    finalidade: "Encaminhar seus dados ao nosso representante comercial para follow-up",
    base: "Consentimento / legítimo interesse em atender sua solicitação",
  },
  {
    finalidade: "Calcular e apresentar o resultado do Diagnóstico de Conformidade",
    base: "Consentimento",
  },
  {
    finalidade: "Enviar e-mails de novidades do blog, caso você se inscreva na newsletter",
    base: "Consentimento (confirmado por double opt-in)",
  },
  {
    finalidade: "Manter registro de segurança e auditoria (ex.: data e origem do envio)",
    base: "Legítimo interesse, cumprimento de obrigação legal",
  },
];

const DIREITOS = [
  "Confirmar a existência de tratamento dos seus dados",
  "Acessar os dados que temos sobre você",
  "Corrigir dados incompletos, inexatos ou desatualizados",
  "Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei",
  "Solicitar a portabilidade dos seus dados",
  "Revogar o consentimento a qualquer momento",
  "Solicitar a exclusão dos dados tratados com base no seu consentimento",
  "Obter informações sobre com quem compartilhamos seus dados",
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-12 text-xl font-bold text-white sm:text-2xl">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-300 leading-relaxed">{children}</p>;
}

export function PoliticaPrivacidadeContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24">
      <p className="text-sm text-slate-500">Última atualização: julho de 2026</p>

      <P>
        Esta Política de Privacidade explica como o <strong className="text-white">PEIx</strong>{" "}
        (&ldquo;nós&rdquo;) coleta, usa, armazena e protege os dados pessoais de quem visita o
        site institucional peix.ia.br, preenche o formulário de Contato, realiza o Diagnóstico
        de Conformidade ou se inscreve na newsletter.
      </P>

      <Card className="mt-6 border-indigo-500/30 bg-indigo-500/5 p-5">
        <p className="text-sm leading-relaxed text-slate-300">
          <strong className="text-white">Importante:</strong> esta política cobre apenas o site
          institucional (peix.ia.br) — dados comerciais de visitantes, leads e assinantes. Ela{" "}
          <strong className="text-white">não</strong> cobre o sistema PEIx (produto), que trata
          dados de alunos, escolas e responsáveis sob regras próprias e infraestrutura separada.
          Se você é gestor ou profissional de uma escola cliente do PEIx (produto), consulte a
          política de privacidade específica da plataforma do sistema.
        </p>
      </Card>

      <H2>1. Quem é o controlador dos seus dados</H2>
      <P>
        <strong className="text-white">
          Alexsandro Issao Sunaga Tecnologia da Informação LTDA
        </strong>
        <br />
        CNPJ: 67.819.135/0001-54
      </P>
      <p className="mt-3 text-slate-300">
        Para qualquer dúvida ou solicitação relacionada aos seus dados pessoais, entre em
        contato pelo e-mail:{" "}
        <a href="mailto:contato@peix.ia.br" className="text-indigo-400 underline hover:text-indigo-300">
          contato@peix.ia.br
        </a>
      </p>

      <H2>2. Quais dados coletamos</H2>
      <P>Coletamos apenas os dados que você mesmo nos fornece, nos seguintes pontos do site:</P>

      <Card className="mt-4 overflow-hidden p-0">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-indigo-600/20 text-white">
              <th className="px-4 py-3 font-semibold">Onde</th>
              <th className="px-4 py-3 font-semibold">Dados coletados</th>
            </tr>
          </thead>
          <tbody>
            {DADOS_COLETADOS.map((row, i) => (
              <tr key={row.onde} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                <td className="border-t border-white/10 px-4 py-3 align-top font-medium text-white">
                  {row.onde}
                </td>
                <td className="border-t border-white/10 px-4 py-3 align-top text-slate-300">
                  {row.dados}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-slate-300">
        Não coletamos dados sensíveis (como dados de saúde, biometria ou origem étnica) neste
        site. Não coletamos dados de alunos, laudos ou informações escolares — isso só ocorre
        dentro do sistema PEIx (produto), sob regras próprias.
      </p>

      <H2>3. Para que usamos seus dados</H2>

      <Card className="mt-4 overflow-hidden p-0">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-indigo-600/20 text-white">
              <th className="px-4 py-3 font-semibold">Finalidade</th>
              <th className="px-4 py-3 font-semibold">Base legal (LGPD)</th>
            </tr>
          </thead>
          <tbody>
            {FINALIDADES.map((row, i) => (
              <tr key={row.finalidade} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                <td className="border-t border-white/10 px-4 py-3 align-top text-slate-300">
                  {row.finalidade}
                </td>
                <td className="border-t border-white/10 px-4 py-3 align-top text-slate-300">
                  {row.base}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-slate-300">
        Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins de
        marketing de terceiros.
      </p>

      <H2>4. Com quem compartilhamos seus dados</H2>
      <P>
        Usamos fornecedores que processam dados em nosso nome, sempre limitados ao necessário
        para operar o site:
      </P>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        <li>
          <strong className="text-white">Resend</strong> — envio dos e-mails transacionais
          (confirmação, material informativo, newsletter) e do e-mail interno ao representante
          comercial.
        </li>
        <li>
          <strong className="text-white">Railway</strong> — hospedagem da aplicação e do banco
          de dados.
        </li>
      </ul>
      <p className="mt-3 text-slate-300">
        Esses fornecedores têm acesso aos dados estritamente necessários para prestar o serviço
        contratado e não os utilizam para finalidades próprias.
      </p>

      <H2>5. Por quanto tempo guardamos seus dados</H2>
      <ul className="list-disc space-y-2 pl-5 text-slate-300">
        <li>
          <strong className="text-white">Leads e diagnósticos:</strong> mantidos por até{" "}
          <strong className="text-white">24 meses</strong> a partir do último contato,
          permitindo follow-up comercial dentro de um prazo razoável. Após esse período, os
          dados são anonimizados ou excluídos, salvo obrigação legal de retenção.
        </li>
        <li>
          <strong className="text-white">Assinantes da newsletter:</strong> mantidos enquanto a
          inscrição estiver ativa; removidos imediatamente após o descadastro.
        </li>
        <li>Você pode solicitar a exclusão dos seus dados a qualquer momento — ver seção 7.</li>
      </ul>
      <p className="mt-3 text-sm italic text-slate-500">
        Nota: o prazo de 24 meses acima é um padrão inicial definido para o lançamento do site;
        pode ser revisado conforme a operação comercial evoluir.
      </p>

      <H2>6. Como protegemos seus dados</H2>
      <ul className="list-disc space-y-2 pl-5 text-slate-300">
        <li>Conexão criptografada (HTTPS) em todo o site.</li>
        <li>Consentimento explícito registrado com data e hora a cada envio de formulário.</li>
        <li>Acesso aos dados restrito à equipe autorizada do PEIx.</li>
        <li>
          Links de descadastro da newsletter e de confirmação de e-mail (double opt-in) sempre
          disponíveis, sem exigir login.
        </li>
      </ul>

      <H2>7. Seus direitos como titular dos dados</H2>
      <P>
        De acordo com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem
        direito a:
      </P>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        {DIREITOS.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="mt-4 text-slate-300">
        <strong className="text-white">Para exercer qualquer um desses direitos</strong>, envie
        um e-mail para{" "}
        <a href="mailto:contato@peix.ia.br" className="text-indigo-400 underline hover:text-indigo-300">
          contato@peix.ia.br
        </a>{" "}
        com sua solicitação. Nesta fase inicial, o atendimento é feito manualmente e a
        confirmação da exclusão ou correção é enviada por e-mail em até 15 dias úteis.
      </p>
      <p className="mt-3 text-slate-300">
        Você também pode se descadastrar da newsletter a qualquer momento pelo link presente em
        todo e-mail enviado, sem necessidade de contato adicional.
      </p>

      <H2>8. Cookies</H2>
      <P>
        O site utiliza apenas cookies estritamente necessários ao seu funcionamento (ex.: manter
        o preenchimento do formulário durante a navegação). Não utilizamos cookies de
        rastreamento publicitário nem compartilhamos dados de navegação com redes de anúncios.
      </P>

      <H2>9. Alterações a esta política</H2>
      <P>
        Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças no
        site ou na legislação. A data da última atualização está sempre indicada no topo desta
        página. Mudanças relevantes serão comunicadas de forma visível no site.
      </P>

      <H2>10. Contato</H2>
      <P>Dúvidas, solicitações ou reclamações sobre o tratamento dos seus dados pessoais:</P>
      <p className="mt-3 text-slate-300">
        <strong className="text-white">E-mail:</strong>{" "}
        <a href="mailto:contato@peix.ia.br" className="text-indigo-400 underline hover:text-indigo-300">
          contato@peix.ia.br
        </a>
        <br />
        <strong className="text-white">Controlador:</strong> Alexsandro Issao Sunaga Tecnologia
        da Informação LTDA — CNPJ 67.819.135/0001-54
      </p>
    </div>
  );
}
