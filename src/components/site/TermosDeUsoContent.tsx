// src/components/site/TermosDeUsoContent.tsx
//
// RF-SITE-06 — conteúdo integral de Termos_de_Uso_PEIx.md, adaptado para o
// layout do site (Aurora). Mesmo padrão de PoliticaPrivacidadeContent.tsx.

import { Card } from "@/components/ui/Card";

const FUNCIONALIDADES = [
  {
    funcionalidade: "Conteúdo institucional",
    descricao:
      "Páginas com informações sobre o produto, módulos, base legal, diferencial competitivo e contato",
  },
  {
    funcionalidade: "Formulário de contato",
    descricao:
      "Envio de mensagem/solicitação de reunião comercial; dados tratados conforme a Política de Privacidade do Site",
  },
  {
    funcionalidade: "Diagnóstico de conformidade",
    descricao:
      "Questionário informativo sobre a situação da escola frente à legislação de educação inclusiva (Decreto nº 12.773/2025 e correlatas), que gera um resultado e uma orientação de reunião",
  },
  {
    funcionalidade: "Newsletter",
    descricao:
      "Inscrição voluntária (opt-in) para receber conteúdo sobre educação inclusiva e novidades do produto; cancelável a qualquer momento",
  },
  {
    funcionalidade: "Botão de acesso à Plataforma",
    descricao:
      "Redireciona para app.peix.ia.br — o uso da Plataforma em si é regido pelo Contrato de Prestação de Serviços e pela Política de Privacidade da Plataforma, documentos próprios e distintos destes Termos",
  },
];

const USO_INACEITAVEL = [
  "Utilizar o formulário de contato, o diagnóstico de conformidade ou a newsletter para envio de spam, conteúdo ofensivo, ilegal ou fraudulento",
  "Tentar acessar áreas restritas do Site ou da Plataforma sem autorização",
  "Realizar engenharia reversa, cópia, raspagem de dados (scraping) ou qualquer forma de extração automatizada de conteúdo do Site sem autorização prévia",
  "Utilizar o Site de forma que comprometa sua segurança, disponibilidade ou integridade",
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-12 text-xl font-bold text-white sm:text-2xl">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-300 leading-relaxed">{children}</p>;
}

export function TermosDeUsoContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24">
      <p className="text-sm text-slate-500">Versão 1.0 — Julho de 2026</p>

      <P>
        Estes Termos de Uso regulam a navegação e a utilização do site institucional
        peix.ia.br (&ldquo;Site&rdquo;). Ao acessar o Site, o visitante concorda com estes
        Termos. Este documento não se confunde com a{" "}
        <a
          href="/politica-de-privacidade"
          className="text-indigo-400 underline hover:text-indigo-300"
        >
          Política de Privacidade do Site
        </a>
        , que trata especificamente da coleta e do tratamento de dados pessoais, nem com os
        termos de uso da plataforma app.peix.ia.br, que serão regidos pelo Contrato de
        Prestação de Serviços firmado entre o PEIx e cada escola-cliente.
      </P>

      <H2>1. Quem somos</H2>
      <P>
        O Site é mantido por{" "}
        <strong className="text-white">
          Alexsandro Issao Sunaga Tecnologia da Informação LTDA
        </strong>
        , inscrita no CNPJ nº 67.819.135/0001-54, com sede na Rua Pais Leme, 215, Conj. 1713,
        Pinheiros, São Paulo/SP (&ldquo;PEIx&rdquo;, &ldquo;nós&rdquo;), titular do sistema de
        gestão do Núcleo de Práticas Inclusivas (Plano Educacional Individualizado — PEI)
        oferecido às escolas por meio da plataforma app.peix.ia.br.
      </P>

      <H2>2. Objeto do Site</H2>
      <P>
        O Site tem finalidade institucional e comercial: apresentar o produto PEIx, seus
        módulos e diferenciais, oferecer um formulário de contato e um diagnóstico de
        conformidade com a legislação de educação inclusiva, permitir inscrição em
        newsletter, e dar acesso à plataforma do produto (app.peix.ia.br) a usuários já
        cadastrados. O Site não presta, por si só, o serviço de gestão do PEI — esse serviço
        é prestado exclusivamente através da plataforma, mediante contrato próprio com a
        escola.
      </P>

      <H2>3. Funcionalidades do Site</H2>
      <Card className="mt-4 overflow-hidden p-0">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-indigo-600/20 text-white">
              <th className="px-4 py-3 font-semibold">Funcionalidade</th>
              <th className="px-4 py-3 font-semibold">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {FUNCIONALIDADES.map((row, i) => (
              <tr key={row.funcionalidade} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                <td className="border-t border-white/10 px-4 py-3 align-top font-medium text-white">
                  {row.funcionalidade}
                </td>
                <td className="border-t border-white/10 px-4 py-3 align-top text-slate-300">
                  {row.descricao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <H2>4. Diagnóstico de conformidade — natureza e limites</H2>
      <P>
        O diagnóstico de conformidade disponibilizado no Site tem caráter exclusivamente
        informativo e educacional. Ele não constitui consultoria jurídica, parecer técnico ou
        substituto de assessoria jurídica especializada, e seu resultado não deve ser
        interpretado como garantia de conformidade legal da escola. Decisões sobre adequação
        à legislação de educação inclusiva e à LGPD devem ser tomadas com apoio de
        profissionais habilitados.
      </P>

      <H2>5. Dados pessoais</H2>
      <P>
        A coleta e o tratamento de dados pessoais realizados através do Site (formulário de
        contato, diagnóstico de conformidade e newsletter) são regidos pela{" "}
        <a
          href="/politica-de-privacidade"
          className="text-indigo-400 underline hover:text-indigo-300"
        >
          Política de Privacidade do Site
        </a>
        , parte integrante destes Termos.
      </P>

      <H2>6. Propriedade intelectual</H2>
      <P>
        Os textos, layout, marca &ldquo;PEIx&rdquo;, logotipo e demais conteúdos do Site são
        de titularidade do PEIx ou usados sob licença, sendo vedada sua reprodução,
        distribuição ou uso comercial sem autorização prévia e expressa.
      </P>

      <H2>7. Uso aceitável</H2>
      <P>Ao usar o Site, o visitante compromete-se a não:</P>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        {USO_INACEITAVEL.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <H2>8. Links para sites de terceiros</H2>
      <P>
        O Site pode conter links para sites de terceiros (ex.: redes sociais, referências
        legislativas). O PEIx não se responsabiliza pelo conteúdo, práticas de privacidade ou
        disponibilidade desses sites externos.
      </P>

      <H2>9. Disponibilidade do Site</H2>
      <P>
        O PEIx envida esforços razoáveis para manter o Site disponível, mas não garante
        disponibilidade ininterrupta, podendo realizar manutenções programadas ou emergenciais
        que resultem em indisponibilidade temporária.
      </P>

      <H2>10. Limitação de responsabilidade</H2>
      <P>
        O uso do Site é por conta e risco do visitante. O PEIx não se responsabiliza por: (i)
        resultados do diagnóstico de conformidade, que tem caráter meramente informativo,
        conforme Seção 4; (ii) danos decorrentes de uso indevido do Site por terceiros; (iii)
        indisponibilidade temporária do Site por motivos técnicos ou de força maior. Esta
        limitação não afasta as responsabilidades legalmente inafastáveis, nem se aplica aos
        serviços prestados através da Plataforma (app.peix.ia.br), regidos por contrato
        próprio com condições e garantias específicas.
      </P>

      <H2>11. Alterações destes Termos</H2>
      <P>
        Estes Termos podem ser atualizados a qualquer momento, para refletir mudanças no Site
        ou na legislação aplicável. A versão vigente estará sempre disponível em peix.ia.br.
      </P>

      <H2>12. Legislação aplicável e foro</H2>
      <P>
        Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
        São Paulo/SP para dirimir eventuais controvérsias, com renúncia a qualquer outro, por
        mais privilegiado que seja.
      </P>

      <H2>13. Contato</H2>
      <p className="mt-3 text-slate-300">
        Dúvidas sobre estes Termos podem ser enviadas para{" "}
        <a
          href="mailto:contato@peix.ia.br"
          className="text-indigo-400 underline hover:text-indigo-300"
        >
          contato@peix.ia.br
        </a>
        .
      </p>
    </div>
  );
}
