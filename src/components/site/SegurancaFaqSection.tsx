"use client";

// src/components/site/SegurancaFaqSection.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PERGUNTAS = [
  {
    pergunta: "Onde os dados da escola ficam hospedados?",
    resposta:
      "Os dados ficam no Railway, um provedor de nuvem com infraestrutura própria de aplicação e banco de dados. Os backups são guardados de forma criptografada em um provedor separado (Cloudflare R2), fora do ambiente de produção — assim, mesmo em um problema com o sistema principal, o backup não é afetado.",
  },
  {
    pergunta: "Quem é responsável pelos dados: a escola ou o PEIx?",
    resposta:
      "A escola é a Controladora — é ela quem decide o que fazer com os dados dos seus alunos e responsáveis. O PEIx é o Operador: só trata os dados seguindo as instruções da escola, para o que está previsto em contrato (gestão do PEI, PAEE, relatórios e os recursos de IA). Essa relação fica formalizada em um anexo específico, assinado junto com o contrato.",
  },
  {
    pergunta: "A IA usada pelo PEIx é treinada com os dados da minha escola?",
    resposta:
      "Não. O PEIx usa a IA da Anthropic, e existe um contrato de proteção de dados com esse fornecedor que garante que o conteúdo enviado não é usado para treinar modelos. Os dados pedagógicos que geram as sugestões da IA não viram material de treinamento.",
  },
  {
    pergunta: "Por quanto tempo os dados são mantidos, e como funciona a exclusão?",
    resposta:
      "Os dados são mantidos durante toda a vigência do contrato. Ao término do contrato, por qualquer motivo, a escola pode pedir a exportação dos dados em formato estruturado, e os dados são eliminados dos ambientes de produção e de backup do PEIx, respeitadas eventuais obrigações legais de guarda de determinados registros.",
  },
  {
    pergunta: "Existe backup? Por quanto tempo fica guardado?",
    resposta:
      "Sim — o PEIx faz backup diário e criptografado, com um processo de restauração testado e documentado internamente. Os backups ficam guardados separados da infraestrutura de produção.",
  },
  {
    pergunta:
      "Como funciona o controle de acesso entre professores, gestores e outros profissionais?",
    resposta:
      "Cada perfil (Gestor, Professor Regente, Professor de AEE, entre outros) só enxerga e edita o que faz sentido pro seu papel. Além disso, os dados de cada escola ficam isolados dos dados de outras escolas na plataforma — uma escola nunca tem acesso aos dados de outra.",
  },
  {
    pergunta: "Existe registro de quem acessou o quê no sistema?",
    resposta:
      "Sim. Toda ação relevante fica registrada em um log de auditoria — incluindo o uso da IA (quem usou, quando, que tipo de sugestão), sem guardar o conteúdo da conversa em separado. Uma vez por ano contratual, a escola pode pedir evidências de conformidade sobre os próprios dados.",
  },
  {
    pergunta: "Como são tratados os dados sensíveis (saúde, condição do aluno)?",
    resposta:
      "Esse tipo de dado só é tratado com o consentimento específico dos responsáveis legais, coletado pela escola por meio de um Termo de Consentimento próprio. A escola também indica formalmente um Encarregado de Dados (DPO) — a pessoa responsável por atender pedidos dos titulares e falar com a ANPD quando necessário.",
  },
  {
    pergunta: "E se acontecer algum incidente de segurança?",
    resposta:
      "O PEIx se compromete a avisar a escola em até 48 horas depois de tomar conhecimento de qualquer incidente que possa gerar risco relevante aos dados, explicando o que foi afetado, quem foi impactado, o que já foi feito para conter o problema e o que a escola deve fazer a seguir.",
  },
  {
    pergunta: 'Usar o PEIx já deixa minha escola "em conformidade" com a lei?',
    resposta:
      "O PEIx organiza a documentação exigida pela legislação de educação inclusiva (Decreto Federal nº 12.773/2025 — PEI e PAEE), mas a qualidade do estudo de caso, das metas e da prática pedagógica continua sendo responsabilidade da escola e da equipe. O sistema dá organização, centralização e rastreabilidade — não substitui a decisão pedagógica.",
  },
];

export function SegurancaFaqSection() {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <Eyebrow>Segurança e Privacidade</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Perguntas frequentes sobre proteção de dados
        </h2>
      </div>

      <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
        {PERGUNTAS.map(({ pergunta, resposta }, index) => {
          const aberto = abertoIndex === index;
          return (
            <div key={pergunta}>
              <button
                type="button"
                onClick={() => setAbertoIndex(aberto ? null : index)}
                aria-expanded={aberto}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-white">{pergunta}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-slate-400 transition-transform ${
                    aberto ? "rotate-180" : ""
                  }`}
                />
              </button>
              {aberto && (
                <p className="px-6 pb-5 text-sm text-slate-400">{resposta}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
