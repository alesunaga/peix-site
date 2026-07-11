// src/components/site/PeiSectionsGrid.tsx
import { User, Brain, Target, BookOpen, LifeBuoy, Users, History } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const SECOES = [
  {
    icon: User,
    titulo: "Identificação com foto",
    texto: "Perfil completo do aluno com foto, dados e laudo vinculado.",
  },
  {
    icon: Brain,
    titulo: "Perfil de aprendizagem",
    texto: "Potencialidades, barreiras e estilo de aprendizagem mapeados.",
  },
  {
    icon: Target,
    titulo: "Metas SMART",
    texto: "Objetivos específicos, mensuráveis e acompanháveis ao longo do ano.",
  },
  {
    icon: BookOpen,
    titulo: "Adaptações curriculares",
    texto: "Segmentadas por disciplina, alinhadas às metas do aluno.",
  },
  {
    icon: LifeBuoy,
    titulo: "Recursos e apoios",
    texto: "Registro de recursos especializados e apoios necessários.",
  },
  {
    icon: Users,
    titulo: "Participação da família",
    texto: "Espaço formal para a participação ativa dos responsáveis.",
  },
  {
    icon: History,
    titulo: "Versionamento imutável",
    texto: "Cada revisão gera versão automática e inalterável para auditoria.",
  },
];

export function PeiSectionsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>PEI Estruturado</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">
        O Plano Educacional Individualizado em 7 seções legais
      </h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECOES.map(({ icon: Icon, titulo, texto }) => (
          <Card key={titulo} className="p-6">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Icon size={20} aria-hidden />
            </span>
            <h3 className="mb-2 font-semibold text-white">{titulo}</h3>
            <p className="text-sm text-slate-400">{texto}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
