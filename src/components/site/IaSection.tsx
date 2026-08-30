// src/components/site/IaSection.tsx
import { ListChecks, EyeOff, PowerOff } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const GARANTIAS = [
  {
    icon: ListChecks,
    titulo: "Quem decide são regras, não a IA",
    texto:
      "O que precisa de atenção é definido por regras claras e auditáveis — PEI sem revisão há seis meses, meta com prazo vencido, aluno sem atividade há quinze dias. A IA entra depois, só para escrever isso em linguagem humana.",
  },
  {
    icon: EyeOff,
    titulo: "A IA nunca sabe o nome da criança",
    texto:
      "Nomes e registros viram códigos antes de qualquer envio. Testamos pedindo à IA, de várias formas, que revelasse o nome real — ela não teve acesso a ele em momento nenhum.",
  },
  {
    icon: PowerOff,
    titulo: "A escola pode desligar a IA",
    texto:
      "O módulo é opcional por escola. Sem ele, o sistema continua funcionando normalmente e nenhum dado sai.",
  },
];

export function IaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <Eyebrow>Inteligência Artificial</Eyebrow>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          A IA do PEIx não decide nada sobre o seu aluno.
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {GARANTIAS.map(({ icon: Icon, titulo, texto }) => (
          <Card key={titulo} className="p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Icon size={20} aria-hidden />
            </span>
            <h3 className="mb-2 text-lg font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-8 text-center sm:p-10">
        <p className="text-xl font-semibold leading-snug text-white sm:text-2xl">
          A IA estrutura e acelera. A{" "}
          <span className="text-indigo-400">autoria pedagógica</span> continua com
          os profissionais que conhecem o aluno.
        </p>
      </Card>
    </section>
  );
}
