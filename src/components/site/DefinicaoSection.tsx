// src/components/site/DefinicaoSection.tsx
//
// Responde "o que é o PEIx?" logo depois da dobra, antes do problema.
// A manchete do Hero é conceitual e não carrega termo de busca; esta seção
// ancora a página em "Gestão da Inclusão Pedagógica", "PEI" e "PAEE".
import { Eyebrow } from "@/components/ui/Eyebrow";

const O_QUE_FAZ = [
  "PEI e PAEE digitais, com histórico de cada revisão",
  "Metas, atividades adaptadas e registro de progresso",
  "Escuta registrada do próprio estudante",
  "Portal para a família acompanhar",
  "Relatórios prontos para a fiscalização",
];

export function DefinicaoSection() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start">
          <div>
            <Eyebrow>PEIx — Gestão da Inclusão Pedagógica</Eyebrow>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Um modelo vivo do aluno.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              O sistema em que a sua escola elabora, acompanha e revisa o plano
              individual de cada estudante público-alvo da educação especial —
              com a equipe inteira, a família e o próprio aluno contribuindo, o
              ano todo.
            </p>
          </div>

          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 md:mt-2">
            {O_QUE_FAZ.map((item) => (
              <li key={item} className="flex gap-3 text-slate-300">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span className="text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
