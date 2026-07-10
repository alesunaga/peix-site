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
  },
  {
    id: "quantidade_alunos_laudados",
    texto: "Aproximadamente quantos alunos laudados a escola atende?",
    opcoes: [
      { valor: "ate_10", texto: "Até 10", pontos: 1 },
      { valor: "11_a_30", texto: "11 a 30", pontos: 2 },
      { valor: "mais_de_30", texto: "Mais de 30", pontos: 3 },
    ],
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
  },
];

export type DiagnosticoCategoriaResultado = "INICIANTE" | "EM_TRANSICAO" | "AVANCADA";

const PONTUACAO_MAXIMA = PERGUNTAS.reduce(
  (max, pergunta) => max + Math.max(...pergunta.opcoes.map((o) => o.pontos)),
  0,
);

/**
 * RF-DIAG-02 — calcula a pontuação a partir das respostas recebidas.
 * Sempre roda no servidor (nunca confiar em pontuação vinda do cliente —
 * ver Arquitetura_Tecnica_Site_PEIx_v1.1, §5, item 3).
 */
export function calcularDiagnostico(respostas: Record<string, string>): {
  pontuacao: number;
  pontuacaoMaxima: number;
  categoria: DiagnosticoCategoriaResultado;
} {
  let pontuacao = 0;

  for (const pergunta of PERGUNTAS) {
    const respostaId = respostas[pergunta.id];
    const opcao = pergunta.opcoes.find((o) => o.valor === respostaId);
    if (opcao) pontuacao += opcao.pontos;
  }

  const proporcao = pontuacao / PONTUACAO_MAXIMA;

  let categoria: DiagnosticoCategoriaResultado;
  if (proporcao < 0.4) categoria = "INICIANTE";
  else if (proporcao < 0.75) categoria = "EM_TRANSICAO";
  else categoria = "AVANCADA";

  return { pontuacao, pontuacaoMaxima: PONTUACAO_MAXIMA, categoria };
}
