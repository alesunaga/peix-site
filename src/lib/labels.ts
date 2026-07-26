// src/lib/labels.ts
//
// Rótulos em pt-BR para os enums do schema — usados no Painel Admin (tabelas
// e exportação CSV). Os valores espelham os arrays já usados em
// src/components/site/ContatoForm.tsx, centralizados aqui para reuso.

export const CARGO_LABELS: Record<string, string> = {
  DIRETOR_PEDAGOGICO: "Diretor(a) pedagógico(a)",
  MANTENEDOR_DONO: "Mantenedor(a) / Dono(a)",
  COORDENADOR_INCLUSAO: "Coordenador(a) de inclusão",
  PROFESSOR_AEE: "Professor(a) de AEE",
  OUTRO: "Outro",
};

export const SEGMENTO_LABELS: Record<string, string> = {
  EDUCACAO_INFANTIL: "Educação Infantil",
  FUNDAMENTAL_1: "Ensino Fundamental 1",
  FUNDAMENTAL_2: "Ensino Fundamental 2",
  ENSINO_MEDIO: "Ensino Médio",
};

export const LEAD_ORIGEM_LABELS: Record<string, string> = {
  FORMULARIO: "Formulário de Contato",
  DIAGNOSTICO: "Diagnóstico de Conformidade",
};

export const NEWSLETTER_STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  DESCADASTRADO: "Descadastrado",
};

export const POST_CATEGORIA_LABELS: Record<string, string> = {
  INCLUSAO: "Inclusão",
  LEGISLACAO: "Legislação",
  IDEIAS_BOAS_PRATICAS: "Ideias e boas práticas",
  EXPERIENCIAS: "Experiências",
  ENTREVISTAS: "Entrevistas",
  EVENTOS: "Eventos",
};

export const POST_STATUS_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  AGENDADO: "Agendado",
  PUBLICADO: "Publicado",
};
