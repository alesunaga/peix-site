# PEIx — Site Institucional

### Documento de Requisitos — v1.11 — Agosto 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Consolida o conteúdo já esboçado no mockup e nas Diretrizes de Prompting em requisitos formais, e incorpora as decisões desta sessão: hospedagem Railway, domínio peix.ia.br, fluxo de e-mails pós-formulário, e seção de Blog com inscrição para newsletter. |
| 1.1 | Julho 2026 | Adendo — **Diagnóstico de Conformidade guiado** (§4.4, RF-DIAG-01 a 06). |
| 1.2 | Julho 2026 | Adendo — consolida decisões tomadas durante a implementação (Home, Recursos, Contato e Diagnóstico). |
| 1.3 | Julho 2026 | Adendo — **detalhamento do Painel Administrativo** (§4.5, RF-ADMIN-05 a 12). |
| 1.4 | Julho 2026 | Adendo — decisão de **lançamento faseado** (Fase 1a / Fase 1b), novo RF-SITE-04 (Política de Privacidade), RF-SITE-02 revisado, novo §9 Checklist de Go-Live. |
| 1.5 | Julho 2026 | Adendo — execução do Go-Live: deploy, DNS, Google Workspace, domínio verificado no Resend. |
| 1.6 | Julho 2026 | Adendo — fecha os 3 itens de conteúdo pendentes da v1.5 (navbar "Blog: Em breve", material informativo em PDF, Política de Privacidade publicada) e corrige um gap (checkbox de consentimento LGPD faltando no Diagnóstico). |
| 1.7 | Julho 2026 | Adendo — **conteúdo aproveitado da Proposta Comercial para Escolas**: novo RF-SITE-05 (link "Acessar plataforma"), RF-HOME-01 (tabela comparativa) e RF-HOME-02 ("Como o PEIx chega até você"). |
| 1.8 | Julho 2026 | Adendo — **Termos de Uso do Site**: novo RF-SITE-06 (página `/termos-de-uso`) e RF-DIAG-07 (checkbox de aceite no Diagnóstico). **✅ Implementado e publicado.** |
| 1.9 | Julho 2026 | Adendo — **Modo de Alto Contraste + logo real da marca**: novo RF-SITE-07 (alternador de 3 estados, AAA) e RF-SITE-08 (logo branco/preto por tema). **✅ Implementado e publicado.** |
| 1.10 | Agosto 2026 | Adendo — **Analytics próprio (RF-ADMIN-04)**, que estava marcado desde a v1.0 como item de "Fase 2". Motivado por uma pergunta do fundador sobre como obter estatísticas de acesso do site (Google Analytics vs. ferramenta própria) e sobre tagear visitantes para retargeting de anúncios — a segunda ideia foi **avaliada e descartada na mesma sessão**: a Politica_Privacidade_PEIx §8 já promete publicamente que o site não usa cookies de rastreamento publicitário nem compartilha dados de navegação com redes de anúncios, e implementar retargeting quebraria esse compromisso sem revisão jurídica prévia do texto — ver nova **RN-SITE-06**. **RF-ADMIN-04 revisado e implementado:** analytics construído do zero (sem Google Analytics/Plausible/Matomo), sem cookies, sem IP/User-Agent persistidos (só um hash diário), com dashboard incorporado à página inicial do Painel Admin (`/admin`) — não como aba separada, decisão tomada em revisão durante a sessão porque o dashboard original era só uma grade estática sem muito propósito próprio. Detalhamento técnico completo em Arquitetura_Tecnica_Site_PEIx v1.8, §2/§3. **✅ Implementado, migration aplicada em desenvolvimento e produção, e publicado.** |
| 1.11 | Agosto 2026 | Adendo — **FAQ de Segurança e Privacidade (LGPD) na página Recursos (novo RF-SITE-09)**. Motivado por um documento de FAQ enviado pelo fundador para melhorar a transparência do site sobre como o produto PEIx trata dados de alunos — hoje o site só tinha uma frase sobre pseudoanonimização (Home FAQ + card de Segurança em Recursos), sem cobrir hospedagem, controlador/operador, uso de IA e treinamento de terceiros, retenção/exclusão, backup, RBAC, log de auditoria, consentimento para dados sensíveis, protocolo de incidente e o escopo de conformidade. **Dois itens do material recebido ficaram de fora por decisão explícita**, por dependerem de confirmação ainda pendente: (1) cláusula de transferência internacional de dados, em revisão jurídica; (2) prazo fixo de exclusão de dados após o fim do contrato — o contrato hoje só define "prazos técnicos aplicáveis", sem número fechado; a resposta publicada usa a redação genérica existente, sem citar um prazo específico. Conteúdo adaptado ao tom do site (frases curtas, traduzindo termos jurídicos) e implementado como um acordeão de 10 perguntas na seção Segurança de Recursos, no mesmo padrão visual do FaqSection.tsx da Home. O card de pseudoanonimização já existente também foi enriquecido com a informação de que a IA é opcional por escola (liga/desliga a qualquer momento). Puramente **client-side** — sem nova tabela, endpoint ou dependência de backend, ver Arquitetura_Tecnica_Site_PEIx v1.9. **✅ Implementado, validado com `tsc --noEmit`, testado no servidor local e publicado (commit `240166f`).** |

---

## 1. Visão Geral

O site institucional do PEIx tem dois objetivos comerciais: (1) comunicar a proposta de valor "o professor ganha tempo primeiro, a conformidade legal acontece como efeito colateral" e converter visitantes em leads qualificados para demonstração; (2) sustentar um canal de conteúdo (blog) que gera tráfego orgânico e constrói autoridade no tema de educação inclusiva.

- **Domínio:** peix.ia.br (já adquirido) — URL oficial atual: `www.peix.ia.br` (ver v1.5, nota sobre redirecionamento de raiz)
- **Hospedagem:** Railway
- **Relação com o sistema PEIx (produto):** site e produto são **serviços e bancos de dados separados**. O site não tem acesso a dados de alunos, escolas ou PEIs — apenas a dados comerciais (leads, assinantes de newsletter, posts do blog, estatísticas de acesso próprias desde a v1.10).

## 2. Escopo — Páginas e Seções

| Página | Conteúdo | Origem |
| --- | --- | --- |
| Home | Hero, Problema, Solução (inversão), Tabela Comparativa de Diferenciais (v1.7), Fluxo, Implantação em 5 Etapas (v1.7), Diferencial/Adoção, FAQ, CTA final | Diretrizes de Prompting, mockup |
| Recursos | Detalhamento técnico: PEI em 7 seções, Hub M-07, Segurança/LGPD **com FAQ dedicado de 10 perguntas (v1.11, RF-SITE-09)** | Diretrizes de Prompting §3.2 |
| Blog | Listagem de posts por categoria + página individual de post + inscrição de newsletter | Absorve a antiga página "Legislação" |
| Contato | Formulário de qualificação de lead | Diretrizes de Prompting §3.4 |
| Painel Admin (`/admin`) | Login + CRUD de posts do blog + CRUD de usuários admin + lista de leads e assinantes + **estatísticas de acesso (v1.10)** | Detalhado em §4.5, analytics em §4.5 (RF-ADMIN-04) |
| Política de Privacidade (`/politica-de-privacidade`) | Texto legal de tratamento de dados (LGPD), exigido por RNF-05 | RF-SITE-04, construída e publicada na v1.6 |
| Termos de Uso (`/termos-de-uso`) | Texto legal de uso do Site | RF-SITE-06, construída e publicada na v1.8 |

> **Fases de lançamento (v1.4):** **Fase 1a — Site Informativo** = Home, Recursos, Contato, Diagnóstico, Política de Privacidade — já no ar. **Fase 1b — Blog + Painel Admin** = os dois nascem juntos e ficam para uma sessão futura. Termos de Uso (v1.8), Modo de Alto Contraste (v1.9) e Analytics próprio (v1.10) são adendos pontuais que não abrem fase nova.

## 3. Perfis de Usuário do Site

| Perfil | Descrição | Autenticação |
| --- | --- | --- |
| Visitante anônimo | Navega no site, lê o blog | Nenhuma |
| Lead | Preencheu o formulário de Contato | Nenhuma (identificado por e-mail) |
| Assinante da newsletter | Inscreveu-se para receber aviso de novos posts | Nenhuma (token de e-mail para confirmar/descadastrar) |

## 4. Requisitos Funcionais

### 4.1 Páginas Institucionais

- **RF-SITE-01** — Home, Recursos e Contato devem seguir fielmente a estrutura, copy e conceito visual "Aurora" definidos nas Diretrizes de Prompting e validados no mockup.
- **RF-SITE-02** — Navegação fixa (navbar) com links para Início, Recursos, Blog, Contato e CTA "Agendar Demo". **✅ Implementado na v1.6** com o item "Blog" como "Em breve" até a Fase 1b.
- **RF-SITE-03** — Todas as páginas devem ser responsivas (mobile-first) e atender WCAG AA. Reforçado na v1.9 pelo Modo de Alto Contraste opcional (RF-SITE-07), que eleva o contraste a AAA.
- **RF-SITE-04** *(nova v1.4)* — Página de Política de Privacidade (`/politica-de-privacidade`). **✅ Implementado na v1.6.**
- **RF-SITE-05** *(nova v1.7)* — Navbar ganha CTA secundário "Acessar plataforma", apontando para `https://app.peix.ia.br`.
- **RF-SITE-06** *(nova v1.8)* — Página de Termos de Uso (`/termos-de-uso`). **✅ Implementado.**
- **RF-SITE-07** *(nova v1.9)* — Alternador de "Modo de Contraste" com três estados, AAA. **✅ Implementado.**
- **RF-SITE-08** *(nova v1.9)* — Logo em duas versões (branca/preta) trocadas por CSS puro conforme o tema. **✅ Implementado.**
- **RF-SITE-09** *(nova v1.11)* — Página Recursos, seção Segurança, ganha um FAQ em acordeão com 10 perguntas sobre segurança e privacidade de dados (LGPD) do produto PEIx: hospedagem, controlador/operador, uso de IA e treinamento de terceiros, retenção/exclusão, backup, controle de acesso (RBAC), log de auditoria, consentimento para dados sensíveis, protocolo de incidente e escopo de conformidade. **✅ Implementado.**

### 4.1.1 Conteúdo Comercial da Home *(v1.7)*

- **RF-HOME-01** — Seção "Por que o PEIx e não outra solução?", tabela comparativa de diferenciais.
- **RF-HOME-02** — Seção "Como o PEIx chega até você", 5 etapas de implantação.
- **RN-HOME-01** *(v1.7)* — Nenhuma seção da Home cita valores monetários.

### 4.2 Formulário de Contato / Captação de Leads

- **RF-LEAD-01** a **RF-LEAD-07** — Formulário, validação, consentimento LGPD, gravação com timestamp/origem, e-mails de confirmação/material/aviso ao representante. Sem alteração nesta versão — ver v1.6/v1.9 para o texto completo.
- **RN-LEAD-01** — Deduplicação por e-mail em 7 dias, sem reenviar aviso ao representante.

### 4.3 Blog

- **RF-BLOG-01** a **RF-BLOG-08** — Listagem por categoria, SEO, newsletter com double opt-in, disparo automático ao publicar, descadastro self-service, editor Markdown com preview, upload de capa. Sem alteração nesta versão. **v1.10:** a confirmação de double opt-in (RF-BLOG-04) passa a gravar um evento de conversão `NEWSLETTER_INSCRITA` para o Analytics (§4.5, RF-ADMIN-04) — sem mudança de comportamento visível para o assinante.

### 4.4 Diagnóstico de Conformidade Guiado

- **RF-DIAG-01** a **RF-DIAG-07** — Wizard de perguntas fechadas, pontuação determinística, gate de captura de lead, checkbox de LGPD e de Termos de Uso. Sem alteração nesta versão. **v1.10:** a conclusão do diagnóstico passa a gravar um evento de conversão `DIAGNOSTICO_CONCLUIDO` para o Analytics (§4.5, RF-ADMIN-04), com a categoria calculada como metadado — sem mudança de comportamento visível para o visitante.
- **RN-DIAG-01**, **RN-DIAG-02** — Sem alteração.

### 4.5 Painel Administrativo

**Autenticação e acesso**

- **RF-ADMIN-01**, **RF-ADMIN-06**, **RF-ADMIN-07**, **RF-ADMIN-08** — Login, convite por token, gestão de usuários, recuperação de senha. Sem alteração — ver v1.3/v1.6.

**Leads, assinantes e métricas**

- **RF-ADMIN-02** — Listagem de leads com exportação em CSV.
- **RF-ADMIN-03** — Listagem de assinantes confirmados da newsletter.
- **RF-ADMIN-04** *(revisado v1.10 — antes "Fase 2", agora implementado)* — O Painel Admin exibe estatísticas de acesso do site e de conversão dos formulários, **sem depender de nenhum serviço de analytics externo**: visitas e visitantes únicos por período (7/30/90 dias, com variação percentual sobre o período anterior), série temporal de visitas por dia, páginas mais vistas, origem de tráfego (UTM ou referrer, agrupado por domínio) e um funil simples (visitas → Diagnóstico concluído → lead capturado). Visitante identificado por um hash diário (IP + User-Agent + data + salt) — nunca por cookie, nunca por IP ou User-Agent brutos persistidos (ver RN-SITE-06 e Arquitetura_Tecnica v1.8 §2/§3). **Decisão de UX tomada em revisão:** o conteúdo foi movido de uma aba própria (`/admin/analytics`) para dentro do dashboard inicial do Painel Admin (`/admin`), substituindo o que antes era só uma grade estática de contadores. **✅ Implementado, testado de ponta a ponta em desenvolvimento e produção, e publicado nesta sessão.**

**Gestão de posts**

- **RF-ADMIN-05**, **RF-ADMIN-09**, **RF-ADMIN-10**, **RF-ADMIN-11**, **RF-ADMIN-12** — CRUD de posts, editor Markdown sanitizado, upload de capa, preview assinado, agendamento. Sem alteração — ver v1.3/v1.6.

## 5. Requisitos Não Funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Hospedagem no Railway, domínio peix.ia.br com SSL automático |
| RNF-02 | Performance: Core Web Vitals dentro da faixa "Good" (LCP < 2.5s), imagens otimizadas |
| RNF-03 | SEO técnico: sitemap.xml, robots.txt, meta tags dinâmicas por página e por post |
| RNF-04 | Acessibilidade WCAG AA. Reforçado na v1.9 pelo Modo de Alto Contraste opcional (RF-SITE-07). |
| RNF-05 | LGPD: consentimento explícito registrado com timestamp; Política de Privacidade acessível; processo (mesmo que manual no MVP) para atender pedido de exclusão de dados |
| RNF-06 | Responsividade mobile-first em todas as páginas |
| RNF-07 | Domínio de e-mail autenticado (SPF, DKIM, DMARC) para boa entregabilidade via serviço transacional |

## 6. Regras de Negócio

- **RN-SITE-01** a **RN-SITE-05** — Sem alteração nesta versão — ver v1.3/v1.9 para o texto completo (deduplicação de lead, double opt-in, descadastro self-service, visibilidade de posts, logo sem gradiente).
- **RN-SITE-06** *(nova v1.10)* — O site **não** usa dado de navegação (pageview, evento de conversão, hash de visitante) para retargeting, publicidade direcionada de terceiros ou qualquer finalidade de marketing além das estatísticas agregadas exibidas no Painel Admin (RF-ADMIN-04). Decisão explícita do fundador nesta sessão, depois de avaliar e descartar a ideia de tagear visitantes para anúncios — mantém a Politica_Privacidade_PEIx §8 ("não utilizamos cookies de rastreamento publicitário nem compartilhamos dados de navegação com redes de anúncios") inalterada, sem exigir revisão jurídica do texto nem banner de consentimento novo.
- **RN-EMAIL-01**, **RN-ADMIN-01** a **RN-ADMIN-04** — Sem alteração — ver v1.2/v1.3.

## 7. Roadmap

| Fase | Escopo |
| --- | --- |
| **Fase 1a — Site Informativo** *(v1.4, conteúdo fechado na v1.6)* | Home, Recursos, Contato, Diagnóstico de Conformidade guiado, Política de Privacidade, e-mails transacionais via Resend. |
| **Fase 1b — Blog + Painel Admin** *(fundação concluída na v1.6; Blog público ainda pendente)* | Blog completo + newsletter (double opt-in) + Painel Admin completo — RF-BLOG-01 a 08, RF-ADMIN-01 a 12 |
| Fase 2 | Materiais adicionais gated por categoria, exportação/integração com CRM |
| Fase 3 | Automação de nutrição de leads, testes A/B de CTA |

> **Nota v1.10:** o Analytics próprio (RF-ADMIN-04) saiu do item genérico "métricas de conversão" que estava listado em Fase 2 desde a v1.0 — foi implementado nesta sessão, adendo pontual à Fase 1b já em produção, sem abrir fase nova.

> **Nota v1.8/v1.9:** Termos de Uso e Modo de Alto Contraste são, da mesma forma, adendos pontuais à Fase 1a já publicada.

## 8. Status de Implementação (ao final desta sessão)

| Item | Status |
| --- | --- |
| Home, Recursos, Contato, Diagnóstico | ✅ Construído e testado de ponta a ponta |
| Política de Privacidade (RF-SITE-04) | ✅ Publicada na v1.6 |
| Termos de Uso (RF-SITE-06) + checkbox no Diagnóstico (RF-DIAG-07) | ✅ Publicado na v1.8 |
| Modo de Alto Contraste (RF-SITE-07) + logo por tema (RF-SITE-08) | ✅ Publicado na v1.9 |
| **Analytics próprio — visitas, eventos de conversão, dashboard (RF-ADMIN-04)** | ✅ **Novo na v1.10 — implementado, migration aplicada em produção, publicado.** `analytics_pageviews`/`analytics_eventos`, `POST /api/track`, `AnalyticsBeacon.tsx`, dashboard em `/admin` |
| Navbar "Blog: Em breve" (RF-SITE-02) | ✅ Implementado na v1.6 |
| Material informativo em PDF (RF-LEAD-06) | ✅ Publicado na v1.6 |
| Banco de dados PostgreSQL (Railway) | ✅ Ambientes `production` (porta 29855) e `development` (porta 15371) confirmados nesta sessão — ver Arquitetura_Tecnica v1.8 §13 |
| Deploy do código do site no Railway | ✅ Publicado em produção |
| **FAQ de Segurança e Privacidade na página Recursos (RF-SITE-09)** | ✅ **Novo na v1.11 — implementado e publicado.** `SegurancaFaqSection.tsx`, acordeão de 10 perguntas |
| Blog público (listagem, post individual, newsletter) | ⬜ Não iniciado — fica para a Fase 1b |

## 9. Checklist de Lançamento (Go-Live) — Fase 1a *(v1.4, fechado na v1.6)*

Sem alteração — ver v1.9 §9 para o checklist completo (todos os bloqueantes fechados; único item recomendado ainda aberto: acesso delegado da Alessandra à caixa `contato@peix.ia.br`).

**Novos itens (v1.10 — adendo pontual, não reabre o checklist de Go-Live):**
- [x] Desenhar o schema de analytics (`analytics_pageviews`, `analytics_eventos`) e a decisão de não usar cookie/IP bruto. **Concluído.**
- [x] Implementar coleta de pageview (`AnalyticsBeacon.tsx` + `POST /api/track`) e instrumentar os 3 eventos de conversão. **Concluído nesta sessão.**
- [x] Implementar as queries de agregação e o dashboard, incorporado a `/admin`. **Concluído nesta sessão.**
- [x] Confirmar qual ambiente do Railway é `production` e qual é `development` antes de aplicar a migration. **Concluído nesta sessão.**
- [x] Aplicar a migration `20260824213532_add_analytics` em desenvolvimento (testada de ponta a ponta) e depois em produção. **Concluído nesta sessão.**
- [x] Commit e push para `origin/main`. **Concluído nesta sessão.**
