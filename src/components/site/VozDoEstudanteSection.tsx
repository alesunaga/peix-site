// src/components/site/VozDoEstudanteSection.tsx
//
// Versão de detalhamento técnico da Voz do Estudante, usada na página
// Recursos. Não confundir com VozEstudanteHomeSection.tsx (Home, RF-HOME-06).
//
// Atualizada para acompanhar o instrumento VE-2026 (Requisitos §17.2.1):
// forças e meta pessoal entraram, o campo de estilo de aprendizagem saiu, e
// o ponto da devolutiva fecha o ciclo de escuta.
import { Mic, Ear, Sparkles, RefreshCw } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const PONTOS = [
  {
    icon: Mic,
    titulo: "Um espaço só do aluno",
    texto:
      "Forças, interesses, o que ajuda a entender, dificuldades na escola e a meta que ele tem para o ano — registrados na voz do próprio estudante, não só sobre ele.",
  },
  {
    icon: Ear,
    titulo: "Escuta em qualquer formato",
    texto:
      "Entrevista direta, com intérprete, por prancha de comunicação para estudantes não-verbais, ou pela família — sempre registrada e auditável, mesmo quando ainda não foi possível realizá-la.",
  },
  {
    icon: Sparkles,
    titulo: "Alimenta o PEI, o PAEE e a IA",
    texto:
      "O mesmo relato orienta as metas e atividades sugeridas por IA — citando a frase do aluno, sem nunca inventar interesses que ele não declarou.",
  },
  {
    icon: RefreshCw,
    titulo: "O ciclo se fecha com uma devolutiva",
    texto:
      "O sistema registra o que mudou no plano por causa da escuta, e devolve ao estudante o que aconteceu com o que ele disse. Nada sobre ele, sem ele.",
  },
];

export function VozDoEstudanteSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Eyebrow>Voz do Estudante</Eyebrow>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            O aluno também tem voz no próprio plano pedagógico
          </h2>
          <p className="mt-4 text-slate-300">
            A maioria dos planos de inclusão é escrita sobre o estudante —
            raramente com ele. O PEIx reserva um espaço dedicado para
            registrar, nas palavras do próprio aluno, o que ele faz bem, do
            que gosta, o que o ajuda a entender, o que é difícil na escola e o
            que ele quer conseguir este ano.
          </p>
          <p className="mt-4">
            <a
              href="/contato"
              className="text-sm font-medium text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
            >
              Peça uma demonstração e veja a Voz do Estudante no sistema →
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {PONTOS.map(({ icon: Icon, titulo, texto }) => (
            <Card key={titulo} className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-white">{titulo}</p>
                <p className="text-sm text-slate-400">{texto}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
