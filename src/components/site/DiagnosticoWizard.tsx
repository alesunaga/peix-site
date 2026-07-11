"use client";

// src/components/site/DiagnosticoWizard.tsx
//
// RF-DIAG-01 a 04 — wizard de perguntas fechadas, gate de e-mail no final,
// resultado calculado no servidor (nunca confiar em pontuação do cliente).

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { PERGUNTAS, type DetalhePergunta } from "@/lib/diagnostico-config";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Etapa = "perguntas" | "contato" | "resultado";
type Status = "idle" | "enviando" | "erro";

type Resultado = {
  pontuacao: number;
  pontuacaoMaxima: number;
  categoria: "INICIANTE" | "EM_TRANSICAO" | "AVANCADA";
  detalhes: DetalhePergunta[];
};

const CATEGORIA_INFO: Record<Resultado["categoria"], { label: string; texto: string }> = {
  INICIANTE: {
    label: "Iniciante",
    texto:
      "Sua escola está no começo da jornada de estruturação do PEI. É um ótimo momento para organizar o processo antes que a fiscalização vire urgência.",
  },
  EM_TRANSICAO: {
    label: "Em transição",
    texto:
      "Sua escola já tem processos de inclusão em andamento, mas ainda depende de ferramentas manuais. Estruturar e automatizar reduz o risco e o tempo gasto pela equipe.",
  },
  AVANCADA: {
    label: "Avançada",
    texto:
      "Sua escola já está bem encaminhada. O PEIx pode ajudar a manter esse nível com menos esforço manual e mais tempo para os professores.",
  },
};

export function DiagnosticoWizard() {
  const [etapa, setEtapa] = useState<Etapa>("perguntas");
  const [passoAtual, setPassoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const pergunta = PERGUNTAS[passoAtual];
  const ultimaPergunta = passoAtual === PERGUNTAS.length - 1;

  function responder(valor: string) {
    setRespostas((atual) => ({ ...atual, [pergunta.id]: valor }));
    if (ultimaPergunta) {
      setEtapa("contato");
    } else {
      setPassoAtual((p) => p + 1);
    }
  }

  async function enviarDiagnostico() {
    setStatus("enviando");
    try {
      const resposta = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, respostas }),
      });
      if (!resposta.ok) throw new Error("Falha no envio.");
      const dados: Resultado = await resposta.json();
      setResultado(dados);
      setEtapa("resultado");
    } catch {
      setStatus("erro");
    }
  }

  if (etapa === "resultado" && resultado) {
    const info = CATEGORIA_INFO[resultado.categoria];
    const proporcao = Math.round((resultado.pontuacao / resultado.pontuacaoMaxima) * 100);
    const pontosFortes = resultado.detalhes.filter((d) => d.forte);
    const riscos = resultado.detalhes.filter((d) => !d.forte);

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={36} aria-hidden />
          <p className="text-sm uppercase tracking-wide text-indigo-400">Resultado</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{info.label}</h2>

          <div className="mx-auto mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${proporcao}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {resultado.pontuacao} de {resultado.pontuacaoMaxima} pontos
          </p>

          <p className="mt-6 text-slate-300">{info.texto}</p>
        </Card>

        {pontosFortes.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <CheckCircle2 size={18} className="text-emerald-400" aria-hidden />
              O que já está a seu favor
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {pontosFortes.map((d) => d.importancia).join(" ")}
            </p>
          </Card>
        )}

        {riscos.length > 0 && (
          <Card className="border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <AlertTriangle size={18} className="text-amber-400" aria-hidden />
              Pontos de atenção e risco
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {riscos.map((d) => d.risco).join(" ")}
            </p>
          </Card>
        )}

        <Card className="p-6 text-center">
          <p className="text-slate-300">
            {riscos.length > 0
              ? "Os pontos de atenção acima são exatamente onde uma conversa com nosso time faz diferença — cada risco listado tem uma solução prática que podemos mostrar na prática, sem compromisso."
              : "Sua escola já está bem estruturada — uma conversa rápida ajuda a confirmar que tudo está registrado da forma mais segura possível para uma fiscalização."}
          </p>
          <ButtonLink href="/contato" withArrow className="mt-6 w-full sm:w-auto">
            Agendar demonstração
          </ButtonLink>
        </Card>
      </div>
    );
  }

  if (etapa === "contato") {
    return (
      <Card className="mx-auto max-w-xl p-8">
        <p className="text-sm uppercase tracking-wide text-indigo-400">Quase lá</p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Informe seu e-mail para ver o resultado
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Vamos te enviar a pontuação completa e um material com recomendações.
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="input"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="input"
            type="email"
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {status === "erro" && (
          <p className="mt-3 text-sm text-red-400">Não foi possível calcular. Tente novamente.</p>
        )}

        <Button
          onClick={enviarDiagnostico}
          disabled={!nome || !email || status === "enviando"}
          withArrow
          className="mt-6 w-full sm:w-auto"
        >
          {status === "enviando" ? "Calculando..." : "Ver meu resultado"}
        </Button>
      </Card>
    );
  }

  // Etapa "perguntas"
  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
        <span>
          Pergunta {passoAtual + 1} de {PERGUNTAS.length}
        </span>
        {passoAtual > 0 && (
          <button
            type="button"
            onClick={() => setPassoAtual((p) => p - 1)}
            className="flex items-center gap-1 hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden /> voltar
          </button>
        )}
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${((passoAtual + 1) / PERGUNTAS.length) * 100}%` }}
        />
      </div>

      <h2 className="mb-6 text-xl font-semibold text-white">{pergunta.texto}</h2>

      <div className="space-y-2">
        {pergunta.opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => responder(opcao.valor)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:border-indigo-400 hover:bg-indigo-500/10"
          >
            {opcao.texto}
            <ArrowRight size={16} className="text-slate-500" aria-hidden />
          </button>
        ))}
      </div>
    </Card>
  );
}
