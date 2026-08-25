// src/components/admin/AnalyticsLineChart.tsx
//
// Gráfico de linha simples (SVG puro, sem dependência externa) para a série
// temporal de visitas do dashboard de analytics. O volume de um dashboard
// admin interno não justifica adicionar uma lib de gráficos ao projeto —
// ver Analytics_Proprio_Site_PEIx_v1.0, §6 (fora do escopo do MVP).

export function AnalyticsLineChart({ dados }: { dados: { dia: string; total: number }[] }) {
  const largura = 100;
  const altura = 32;
  const maximo = Math.max(1, ...dados.map((d) => d.total));

  const pontos = dados.map((d, i) => {
    const x = dados.length > 1 ? (i / (dados.length - 1)) * largura : 0;
    const y = altura - (d.total / maximo) * altura;
    return { x, y };
  });

  const linha = pontos.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${altura} ${linha} ${largura},${altura}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        preserveAspectRatio="none"
        className="h-32 w-full overflow-visible"
      >
        <polygon points={area} fill="rgba(99, 102, 241, 0.15)" />
        <polyline points={linha} fill="none" stroke="rgb(129, 140, 248)" strokeWidth="0.6" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>{dados[0]?.dia}</span>
        <span>{dados[dados.length - 1]?.dia}</span>
      </div>
    </div>
  );
}
