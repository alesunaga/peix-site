// src/components/site/VozEstudanteHomeSection.tsx
//
// Seção da Home (RF-HOME-06). Não confundir com VozDoEstudanteSection.tsx, que
// é a versão de detalhamento técnico usada na página Recursos.
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PERGUNTAS = [
  "Como você acha que aprende melhor?",
  "O que te ajudaria na sala?",
  "O que você quer fazer quando crescer?",
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

        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {PERGUNTAS.map((pergunta) => (
            <li key={pergunta}>
              <Card className="h-full p-6">
                <p className="text-lg leading-snug text-white">{pergunta}</p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-white">
              A escuta fica registrada — e o modo dela também
            </h3>
            <p className="mt-3 text-slate-300">
              O PEIx registra a resposta do estudante e registra também como ela
              foi colhida. Ou que ainda não foi colhida, e por quê.
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
              Entra no que o sistema considera ao sugerir metas e atividades para
              ele. Uma criança que disse gostar de cavalos passa a receber
              atividades com cavalos — em aulas de professores com quem ela nunca
              conversou sobre isso.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-3xl border-y border-white/10 py-8 text-center text-2xl font-semibold text-white sm:text-3xl">
          Nada sobre ele, sem ele.
        </p>
      </div>
    </section>
  );
}
