// src/app/admin/(painel)/analytics/page.tsx
//
// Dashboard de Analytics próprio — Analytics_Proprio_Site_PEIx_v1.0.
// Consulta o Prisma direto via src/lib/analytics-queries.ts, mesmo padrão de
// src/app/admin/(painel)/leads/page.tsx (server component, sem rota REST
// intermediária).

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnalyticsLineChart } from "@/components/admin/AnalyticsLineChart";
import {
  funilConversao,
  origensTrafego,
  paginasMaisVistas,
  resumoPeriodo,
  serieTemporal,
  type PeriodoDias,
} from "@/lib/analytics-queries";

const PERIODOS: { valor: PeriodoDias; label: string }[] = [
  { valor: 7, label: "7 dias" },
  { valor: 30, label: "30 dias" },
  { valor: 90, label: "90 dias" },
];

function periodoValido(valor: string | undefined): PeriodoDias {
  const numero = Number(valor);
  return numero === 7 || numero === 30 || numero === 90 ? (numero as PeriodoDias) : 30;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const sp = await searchParams;
  const periodo = periodoValido(sp.periodo);

  const [resumo, serie, paginas, origens, funil] = await Promise.all([
    resumoPeriodo(periodo),
    serieTemporal(periodo),
    paginasMaisVistas(periodo),
    origensTrafego(periodo),
    funilConversao(periodo),
  ]);

  const taxaConclusaoDiagnostico =
    funil.totalVisitas > 0
      ? ((funil.diagnosticoConcluido / funil.totalVisitas) * 100).toFixed(1)
      : "0.0";

  return (
    <div>
      <Eyebrow>Painel Admin</Eyebrow>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-white">Analytics</h1>
          <p className="text-sm text-slate-400">
            Estatísticas de acesso próprias — sem cookies, sem dado pessoal armazenado.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {PERIODOS.map((p) => (
            <Link
              key={p.valor}
              href={`/admin/analytics?periodo=${p.valor}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                periodo === p.valor
                  ? "bg-indigo-600/30 text-indigo-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResumoCard titulo="Visitas" valor={resumo.totalVisitas} variacao={resumo.variacaoVisitas} />
        <ResumoCard titulo="Visitantes únicos" valor={resumo.visitantesUnicos} />
        <ResumoCard
          titulo="Diagnósticos concluídos"
          valor={funil.diagnosticoConcluido}
          descricao={`${taxaConclusaoDiagnostico}% das visitas`}
        />
        <ResumoCard titulo="Leads capturados" valor={funil.leadCapturado} />
      </div>

      <Card className="mb-4 p-5">
        <p className="mb-4 text-sm font-medium text-white">Visitas por dia</p>
        <AnalyticsLineChart dados={serie} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <p className="border-b border-white/10 px-5 py-4 text-sm font-medium text-white">
            Páginas mais vistas
          </p>
          <table className="w-full text-left text-sm">
            <tbody>
              {paginas.map((p) => (
                <tr key={p.path} className="border-b border-white/5 text-slate-300 last:border-0">
                  <td className="px-5 py-2.5 font-mono text-xs text-slate-300">{p.path}</td>
                  <td className="px-5 py-2.5 text-right text-slate-400">{p.total}</td>
                </tr>
              ))}
              {paginas.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-center text-slate-500">Sem dados no período.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-hidden p-0">
          <p className="border-b border-white/10 px-5 py-4 text-sm font-medium text-white">
            Origem de tráfego
          </p>
          <table className="w-full text-left text-sm">
            <tbody>
              {origens.map((o) => (
                <tr key={o.origem} className="border-b border-white/5 text-slate-300 last:border-0">
                  <td className="px-5 py-2.5">{o.origem}</td>
                  <td className="px-5 py-2.5 text-right text-slate-400">{o.total}</td>
                </tr>
              ))}
              {origens.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-center text-slate-500">Sem dados no período.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <p className="mb-4 text-sm font-medium text-white">Funil de conversão</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <FunilEtapa titulo="Visitas" valor={funil.totalVisitas} />
          <FunilSeta />
          <FunilEtapa titulo="Diagnóstico concluído" valor={funil.diagnosticoConcluido} />
          <FunilSeta />
          <FunilEtapa titulo="Lead capturado" valor={funil.leadCapturado} />
        </div>
      </Card>
    </div>
  );
}

function ResumoCard({
  titulo,
  valor,
  variacao,
  descricao,
}: {
  titulo: string;
  valor: number;
  variacao?: number | null;
  descricao?: string;
}) {
  return (
    <Card className="p-5">
      <p className="mb-1 text-xs text-slate-400">{titulo}</p>
      <p className="text-2xl font-semibold text-white">{valor.toLocaleString("pt-BR")}</p>
      {typeof variacao === "number" && (
        <p className={`mt-1 text-xs ${variacao >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {variacao >= 0 ? "+" : ""}
          {variacao}% vs. período anterior
        </p>
      )}
      {descricao && <p className="mt-1 text-xs text-slate-500">{descricao}</p>}
    </Card>
  );
}

function FunilEtapa({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
      <p className="text-lg font-semibold text-white">{valor.toLocaleString("pt-BR")}</p>
      <p className="text-xs text-slate-400">{titulo}</p>
    </div>
  );
}

function FunilSeta() {
  return <span className="hidden text-slate-600 sm:block">→</span>;
}
