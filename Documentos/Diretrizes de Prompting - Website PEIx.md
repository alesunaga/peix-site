# Diretrizes de Prompting para Geração de Mockup e Estrutura do Website PEIx

Este documento serve como um guia de orientação detalhado focado em instruir modelos de Inteligência Artificial a criarem o mockup estrutural e visual do website institucional do PEIx (Sistema de Gestão do Núcleo de Práticas Inclusivas). O objetivo é gerar especificações de componentes e códigos (HTML/Tailwind CSS) prontos para serem implementados e refinados no ambiente VS Code.

## 1. Visão Geral do Produto e Objetivos de Marketing

O PEIx é um software como serviço (SaaS) voltado para a gestão da educação inclusiva nas escolas básicas brasileiras. Sua proposta de valor principal baseia-se no cumprimento rigoroso das exigências legais instituídas pelo Decreto Federal nº 12.773/2025 e pela Lei Brasileira de Inclusão (LBI - Lei nº 13.146/2015), que tornam obrigatória a elaboração, acompanhamento e revisão do Plano Educacional Individualizado (PEI) para alunos laudados.

O objetivo do website comercial é inverter a lógica tradicional de vendas de softwares de gestão escolar. Em vez de focar puramente em auditoria e cobrança, o site deve vender o alívio da sobrecarga da equipe pedagógica, demonstrando que a adoção docente é facilitada por ferramentas de inteligência artificial proativas que economizam tempo no planejamento diário dos professores.

## 2. Conceito Visual e Identidade de Interface (Diretrizes para a IA)

A IA responsável pela geração do mockup visual deve seguir estritamente o conceito estético "Aurora", já integrado à arquitetura técnica do sistema. O design deve se assemelhar a plataformas SaaS modernas de alta conversão (como Notion, Asana e Monday), priorizando espaços em branco, tipografia limpa e elementos visuais sofisticados.

- **Paleta de Cores Base:** Tons escuros de ardósia (slate), azul profundo e indigo vibrante para os acentos de conversão.

- **Efeitos Visuais:** Aplicação moderada de Glassmorphism (efeito de vidro fosco utilizando propriedades como backdrop-filter: blur) nos cards de recursos e seções flutuantes.

- **Fundo Geral:** Gradientes radiais profundos em tons de roxo e azul escuro na seção Hero, transitando para seções de conteúdo limpas e focadas em legibilidade com contraste WCAG AA.

## 3. Arquitetura de Informação e Conteúdo por Seção

O site deve ser estruturado em uma arquitetura de alta conversão dividida nas páginas detalhadas a seguir:

### 3.1 Página Inicial (Home)

A página principal deve estruturar a jornada do visitante vendendo primeiro o problema e a transformação antes de detalhar o software em si.

| **Seção da Home** | **Conteúdo e Elementos de Cópia (Copywriting)** | **Orientação para o Mockup Visual** |
| --- | --- | --- |
| 1. Hero Principal | **Título:** O PEI da sua escola organizado, colaborativo e em conformidade com a legislação. **Subtítulo:** O PEIx ajuda escolas a elaborar, acompanhar e revisar o Plano Educacional Individualizado, conectando gestores, professores de AEE, regentes por disciplina e famílias em uma única plataforma. **CTAs:** Botões para "Solicitar Demonstração" e "Falar com Especialista". | Fundo em gradiente Aurora. Disposição em duas colunas: texto de impacto à esquerda e uma representação em alta fidelidade do dashboard do sistema ocupando a metade direita. |
| 2. O Problema | **Título:** A inclusão escolar evoluiu. As ferramentas de gestão não. Exposição das dores comuns: PEIs fragmentados em Word, dados circulando por grupos de WhatsApp sem conformidade com a LGPD, acompanhantes trabalhando sem acesso às metas e sobrecarga administrativa crônica da equipe de inclusão. | Layout em cards assimétricos com ícones de alerta vermelhos e cinzas, transmitindo a sensação de desorganização que o cliente vive hoje. |
| 3. A Solução | Apresentação de 6 pilares estruturais da plataforma: 1. PEI Digital (7 seções legais) 2. Inteligência Artificial (sugestão de metas e adaptações customizadas por aluno) 3. Trabalho Colaborativo (4 perfis de acesso com RBAC rígido) 4. Dashboards Avançados 5. Alertas Automáticos de prazos e pendências 6. Segurança e Conformidade total à LGPD. | Grid limpo de 3 colunas. Cada pilar deve ser apresentado em um card com efeito glassmorphism suave e bordas arredondadas. |
| 4. Fluxo Operacional | Linha do tempo demonstrando a simplicidade do ciclo: 1. Diagnóstico e Laudos -> 2. Cadastro do Aluno -> 3. Elaboração Guiada do PEI -> 4. Execução em Sala -> 5. Acompanhamento Estatístico -> 6. Relatórios de Desenvolvimento Rápidos. | Layout de linha do tempo horizontal ou vertical responsiva com nós conectados por linhas indicadoras de progresso de cor índigo. |

Abaixo da tabela de fluxo, adicione seções secundárias cobrindo diferenciais como "Adoção garantida pelos professores regentes devido ao ganho de tempo imediato", selos de conformidade com os Decretos Federais de 2025 e um bloco de perguntas frequentes (FAQ) focado em desarmar objeções técnicas e jurídicas.

### 3.2 Página de Recursos (Detalhamento Técnico)

Esta página deve aprofundar as capacidades operacionais do PEIx, servindo de checklist para coordenadoras técnicas:

- **PEI Estruturado em 7 Seções Legais:** Identificação com foto do aluno, perfil de aprendizagem, metas SMART, adaptações curriculares segmentadas por disciplina, recursos e apoios especializados, participação ativa da família e versionamento automático imutável.

- **Hub de Aplicativos de Inclusão (M-07):** Destaque para as ferramentas de IA que auxiliam a docência: Adaptador Automático de Provas por Questão (baseado no PEI individual do aluno e não em diagnósticos genéricos), Criador de Atividades Pedagógicas sob medida e Gerador de Protocolos de Conduta Comportamental.

- **Segurança em Dados Sensíveis:** Detalhamento do mecanismo de pseudoanonimização que remove nomes e RAs antes de processar informações em APIs de linguagem externa, em estrita conformidade com o Artigo 11 da LGPD.

### 3.3 Página de Legislação e Captação de Leads (Inbound Marketing)

Uma área estratégica desenhada para atrair tráfego orgânico via SEO de gestores preocupados com fiscalizações. Deve conter cards de artigos estruturados para tópicos como: "Impactos operacionais do Decreto nº 12.773/2025", "Como adequar os laudos da sua escola à LGPD" e "A obrigatoriedade do PEI em escolas particulares". Cada artigo deve possuir uma chamada lateral para download de um checklist em PDF, exigindo o preenchimento do formulário.

### 3.4 Página de Contato e Qualificação de Vendas

O formulário de contato deve coletar dados específicos para pré-qualificar as escolas antes da abordagem do representante comercial. A IA deve gerar um mockup estruturado com os seguintes campos:

- Nome completo e E-mail institucional.

- Telefone/WhatsApp corporativo.

- Nome da Instituição de Ensino e Cidade/UF.

- **Dropdown de Cargo:** Diretor Pedagógico, Mantenedor/Dono, Coordenador de Inclusão, Professor AEE.

- **Checkboxes de Segmentos Atendidos:** Educação Infantil, Ensino Fundamental 1, Ensino Fundamental 2, Ensino Médio.

- **Checkbox de Ação Direta:** "Quero agendar uma demonstração guiada com dados fictícios da Escola Demo".

## 4. Estrutura de Prompt Pronta para IA (Copiar e Colar)

Utilize o prompt estruturado abaixo na IA geradora de código para obter o esqueleto do site pronto para o VS Code:

"Atue como um Engenheiro Frontend especialista em UX/UI e Tailwind CSS. Com base das diretrizes do sistema PEIx, gere o código HTML completo de uma página index.html estruturada. O design deve seguir o conceito 'Aurora' usando um fundo com gradientes escuros e modernos (slate-900 para indigo-950), tipografia Arial, e cards com efeito glassmorphism (bg-white/5 backdrop-blur-md border border-white/10).

A página deve conter:
1. Navbar semitransparente fixada no topo com links para Home, Recursos, Legislação e botão de CTA 'Agendar Demo'.
2. Seção Hero em duas colunas (Texto comercial persuasivo à esquerda focado no Decreto 12.773/2025 e um esqueleto visual do dashboard à direita).
3. Seção 'O Problema' com 4 cards contrastantes expondo as dores de gerenciar PEIs em Word e WhatsApp.
4. Seção 'A Solução' com um grid de 3 colunas destacando o PEI Digital, o Hub de Apps de IA (M-07) com o Adaptador de Provas, e a conformidade robusta com a LGPD.
5. Rodapé completo institucional.

Forneça o código limpo, comentado, utilizando exclusivamente as classes nativas do Tailwind CSS via CDN para que eu possa abrir diretamente no VS Code e visualizar no navegador."

## 5. Recomendações de Implementação no VS Code

Ao exportar o código gerado pela IA para o ambiente de desenvolvimento local no VS Code, certifique-se de seguir as seguintes boas práticas de engenharia frontend:

- **Isolamento de Estilos com Tailwind:** Mantenha o uso de classes utilitárias diretamente nos elementos para acelerar o desenvolvimento do rascunho visual, mas extraia componentes repetitivos (como botões de CTA primários e cards do grid de soluções) caso decida modularizar a aplicação futuramente.

- **Otimização de Imagens e Layouts de Dashboard:** Para simular as telas do sistema real na metade direita do Hero e na seção de recursos, utilize SVGs inline ou componentes HTML puros estilizados com bordas sutis. Isso evita a lentidão de carregamento de arquivos pesados de imagem e garante responsividade perfeita em resoluções mobile e desktop.

- **Acessibilidade Semântica:** Garanta que as tags estruturais (header, main, section, footer) sejam empregadas corretamente em vez de encadear elementos div genericamente. Todos os botões e links devem possuir rótulos compreensíveis para leitores de tela, preservando o compromisso de acessibilidade intrínseco a uma plataforma de educação inclusiva.