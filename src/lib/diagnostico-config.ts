// src/lib/diagnostico-config.ts
//
// RN-DIAG-01: perguntas, pesos e faixas de pontuação do Diagnóstico de
// Conformidade são configuráveis apenas via código nesta fase — não há
// painel de edição no MVP. Qualquer ajuste de peso/pergunta passa por aqui
// e por revisão de código, o que é intencional (evita decisões de
// classificação "silenciosas" feitas fora do repositório).
//
// A pontuação é 100% determinística — nenhuma chamada a IA generativa
// acontece nesta funcionalidade (RF-DIAG-02).

export type DiagnosticoOpcao = {
  valor: string;
  texto: string;
  pontos: number;
};

export type DiagnosticoPergunta = {
  id: string;
  texto: string;
  opcoes: DiagnosticoOpcao[];
  // Usado no resultado: por que essa dimensão importa quando a escola vai bem,
  // e o risco concreto quando a resposta não pontua no máximo.
  importancia: string;
  risco: string;
};

export const PERGUNTAS: DiagnosticoPergunta[] = [
  {
    id: "pei_estruturado",
    texto: "Sua escola já elabora o PEI de forma estruturada?",
    opcoes: [
      { valor: "nao_elabora", texto: "Ainda não elaboramos PEI formalmente", pontos: 0 },
      { valor: "informal", texto: "Fazemos, mas de forma informal (Word/papel)", pontos: 1 },
      { valor: "estruturado", texto: "Sim, com seções e metas definidas", pontos: 3 },
    ],
    importancia:
      "Um PEI estruturado, com metas e seções definidas, é a base para comprovar conformidade com o Decreto nº 12.773/2025 em qualquer fiscalização.",
    risco:
      "Sem um PEI formal, a escola não tem como comprovar que atende cada aluno de forma individualizada — exigência direta da LBI e do Decreto.",
  },
  {
    id: "registro_adaptacoes",
    texto: "Como vocês registram as adaptações curriculares hoje?",
    opcoes: [
      { valor: "nao_registra", texto: "Não há registro formal", pontos: 0 },
      { valor: "whatsapp_email", texto: "Combinamos por WhatsApp ou e-mail", pontos: 1 },
      { valor: "planilha", texto: "Em planilhas ou documentos compartilhados", pontos: 2 },
      { valor: "sistema", texto: "Em um sistema com histórico e versionamento", pontos: 3 },
    ],
    importancia:
      "Registrar adaptações com histórico e versionamento cria uma trilha de auditoria confiável e protege a escola juridicamente.",
    risco:
      "Registros informais (WhatsApp, e-mail, planilhas soltas) se perdem com o tempo e não servem como prova formal caso a escola seja questionada.",
  },
  {
    id: "quantidade_alunos_laudados",
    texto: "Aproximadamente quantos alunos laudados a escola atende?",
    opcoes: [
      { valor: "ate_10", texto: "Até 10", pontos: 1 },
      { valor: "11_a_30", texto: "11 a 30", pontos: 2 },
      { valor: "mais_de_30", texto: "Mais de 30", pontos: 3 },
    ],
    importancia:
      "Quanto maior o número de alunos, maior a necessidade de um processo escalável — o volume por si só já justifica uma ferramenta dedicada.",
    risco:
      "Com muitos alunos e processo manual, a equipe corre risco real de sobrecarga e de deixar PEIs desatualizados — motivo comum de autuação em fiscalizações.",
  },
  {
    id: "ferramenta_atual",
    texto: "Qual ferramenta a equipe de inclusão usa principalmente hoje?",
    opcoes: [
      { valor: "nenhuma", texto: "Nenhuma — é tudo manual", pontos: 0 },
      { valor: "word_papel", texto: "Word ou papel", pontos: 1 },
      { valor: "planilha", texto: "Planilhas (Excel/Sheets)", pontos: 2 },
      { valor: "sistema_proprio", texto: "Sistema de gestão próprio ou de terceiros", pontos: 3 },
    ],
    importancia:
      "Uma ferramenta com histórico e versionamento automático é o que garante conformidade sem esforço manual extra da equipe.",
    risco:
      "Ferramentas genéricas (Word, planilhas) não geram histórico auditável nem escalam — cada revisão vira um arquivo solto, sem rastreabilidade.",
  },
];

export type DiagnosticoCategoriaResultado = "INICIANTE" | "EM_TRANSICAO" | "AVANCADA";

export type DetalhePergunta = {
  perguntaId: string;
  perguntaTexto: string;
  pontosObtidos: number;
  pontosMaximo: number;
  // true = a resposta escolhida é a melhor opção possível para essa pergunta
  forte: boolean;
  importancia: string;
  risco: string;
};

const PONTUACAO_MAXIMA = PERGUNTAS.reduce(
  (max, pergunta) => max + Math.max(...pergunta.opcoes.map((o) => o.pontos)),
  0,
);

/**
 * RF-DIAG-02 — calcula a pontuação a partir das respostas recebidas, e monta
 * o detalhamento por pergunta usado no resultado (o que pesou a favor e o
 * que ficou como risco — pedido explícito de negócio, não só a nota geral).
 * Sempre roda no servidor (nunca confiar em pontuação vinda do cliente —
 * ver Arquitetura_Tecnica_Site_PEIx_v1.1, §5, item 3).
 */
export function calcularDiagnostico(respostas: Record<string, string>): {
  pontuacao: number;
  pontuacaoMaxima: number;
  categoria: DiagnosticoCategoriaResultado;
  detalhes: DetalhePergunta[];
} {
  let pontuacao = 0;
  const detalhes: DetalhePergunta[] = [];

  for (const pergunta of PERGUNTAS) {
    const respostaId = respostas[pergunta.id];
    const opcao = pergunta.opcoes.find((o) => o.valor === respostaId);
    const pontosObtidos = opcao?.pontos ?? 0;
    const pontosMaximo = Math.max(...pergunta.opcoes.map((o) => o.pontos));

    pontuacao += pontosObtidos;

    detalhes.push({
      perguntaId: pergunta.id,
      perguntaTexto: pergunta.texto,
      pontosObtidos,
      pontosMaximo,
      forte: pontosObtidos === pontosMaximo,
      importancia: pergunta.importancia,
      risco: pergunta.risco,
    });
  }

  const proporcao = pontuacao / PONTUACAO_MAXIMA;

  let categoria: DiagnosticoCategoriaResultado;
  if (proporcao < 0.4) categoria = "INICIANTE";
  else if (proporcao < 0.75) categoria = "EM_TRANSICAO";
  else categoria = "AVANCADA";

  return { pontuacao, pontuacaoMaxima: PONTUACAO_MAXIMA, categoria, detalhes };
}
