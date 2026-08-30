// src/components/site/ProblemSection.tsx
import { Users, BookOpen, Hand, Home, MessageCircle } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const OLHARES = [
  {
    icon: Users,
    quem: "A professora regente",
    texto: "Vê ele numa sala com mais vinte e nove.",
  },
  {
    icon: BookOpen,
    quem: "O professor de AEE",
    texto: "Vê ele sozinho, na sala de recursos.",
  },
  {
    icon: Hand,
    quem: "O acompanhante",
    texto: "Vê o minuto a minuto que ninguém mais vê.",
  },
  {
    icon: Home,
    quem: "A família",
    texto:
      "Vê o sono, o que funcionou no ano passado, o interesse que ninguém na escola sabe que existe.",
  },
  {
    icon: MessageCircle,
    quem: "O próprio estudante",
    texto: "Sabe como aprende melhor — e quase nunca é perguntado.",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>O Problema</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Cinco pessoas conhecem esse aluno. Elas quase nunca se falam.
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Cada uma enxerga um pedaço verdadeiro da mesma criança. Hoje, esses
          pedaços se encontram uma vez por ano, numa reunião de quarenta minutos.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {OLHARES.map(({ icon: Icon, quem, texto }) => (
          <li key={quem}>
            <Card className="h-full p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="mb-2 font-semibold text-white">{quem}</h3>
              <p className="text-sm text-slate-400">{texto}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="mt-6 p-8 sm:p-10">
        <p className="text-xl font-semibold leading-snug text-white sm:text-2xl">
          O que não couber na reunião se perde. E o PEI acaba escrito por uma
          pessoa só, a partir de um pedaço da informação.
        </p>
        <p className="mt-4 text-slate-300">
          Isso não é falta de compromisso da escola. É falta de{" "}
          <strong className="font-semibold text-white">
            um lugar onde essas visões possam se encontrar
          </strong>
          .
        </p>
      </Card>
    </section>
  );
}
