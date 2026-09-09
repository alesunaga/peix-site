// src/components/site/VozEstudanteHomeSection.tsx
//
// Seção da Home (RF-HOME-06). Não confundir com VozDoEstudanteSection.tsx, que
// é a versão de detalhamento técnico usada na página Recursos.
//
// Atualizada em v1.12.1 para acompanhar o instrumento VE-2026 (Requisitos
// §17.2.1): saiu a pergunta sobre estilo de aprendizagem (sem sustentação
// empírica), entraram forças e meta pessoal, e o parágrafo de devolutiva
// fecha o ciclo de escuta. O fechamento "Nada sobre ele, sem ele" foi mantido
// por decisão do fundador — é o mais forte da seção.
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PERGUNTAS = [
  "O que você faz bem?",
  "Do que você gosta?",
  "O que te ajuda a entender?",
  "O que é difícil pra você na escola?",
  "O que você quer conseguir este ano?",
];

const MEIOS = [
  "Entrevista direta",
  "Com apoio de intérprete",
  "Com prancha de comunicação",
  "Pela família",
];

export function VozEstudanteHomeSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 0%, rgba(168,85,247,0.14), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Voz do Estudante</Eyebrow>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            A primeira pergunta do PEI deveria ser feita ao aluno.
          </h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PERGUNTAS.map((pergunta) => (
            <li key={pergunta}>
              <Card className="h-full p-4">
                <p className="text-sm leading-snug text-white sm:text-base">
                  {pergunta}
                </p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-white">
              A escuta fica registrada — e o modo como ela foi feita, também
            </h3>
            <p className="mt-3 text-slate-300">
              O PEIx registra a resposta do estudante e também como ela foi
              colhida — ou que ainda não foi colhida, e por quê: a justificativa
              é obrigatória, a escuta nunca pula a etapa em silêncio.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {MEIOS.map((meio) => (
                <li
                  key={meio}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
                >
                  {meio}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              O que o aluno diz não fica guardado num campo
            </h3>
            <p className="mt-3 text-slate-300">
              Entra no que o sistema considera ao sugerir metas e atividades
              para ele — citando a frase do próprio aluno, nunca um interesse
              que ele não declarou. Uma criança que disse gostar de cavalos
              passa a receber atividades com cavalos — em aulas de professores
              com quem ela nunca conversou sobre isso.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-slate-300">
          E o ciclo se fecha: o sistema registra o que mudou no plano por
          causa dessa escuta — e devolve ao estudante o que aconteceu com o
          que ele disse.
        </p>

        <p className="mx-auto mt-8 max-w-3xl border-y border-white/10 py-8 text-center text-2xl font-semibold text-white sm:text-3xl">
          Nada sobre ele, sem ele.
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/contato"
            className="text-sm font-medium text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
          >
            Ver a Voz do Estudante funcionando na Escola Demo →
          </Link>
        </p>
      </div>
    </section>
  );
}
