# PEIx — Site Institucional

### Documento de Requisitos — v1.3 — Julho 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Consolida o conteúdo já esboçado no mockup e nas Diretrizes de Prompting em requisitos formais, e incorpora as decisões desta sessão: hospedagem Railway, domínio peix.ia.br, fluxo de e-mails pós-formulário (confirmação + material informativo + aviso ao representante), e seção de Blog com inscrição para newsletter. Documento independente do Requisitos_Consolidado do sistema PEIx (produto) — trata apenas do site de marketing/institucional. |
| 1.1 | Julho 2026 | Adendo — **Diagnóstico de Conformidade guiado** (§4.4, RF-DIAG-01 a 06): substitui a ideia de um chatbot de IA aberto por um wizard de perguntas fechadas com lógica determinística, que gera uma pontuação/categoria de conformidade e funciona como gate de captura de lead. Reutiliza o fluxo de e-mails já definido em RF-LEAD (§4.2). Chatbot de IA aberto fica registrado no Roadmap (§7) como possível Fase 2, condicionado a dados de conversão pós-lançamento. |
| 1.2 | Julho 2026 | Adendo — consolida decisões tomadas durante a implementação (Home, Recursos, Contato e Diagnóstico já construídos e testados de ponta a ponta): (1) RF-LEAD-03 (consentimento LGPD) implementado como checkbox obrigatório, não estava no mockup original; (2) campo "Cidade/UF" do mockup foi dividido em dois campos (Cidade + UF) para bater com o modelo de dados; (3) RF-LEAD-01 ganhou a opção de cargo "Outro"; (4) RF-DIAG-02 foi refinado — o resultado não mostra só a pontuação agregada, mas um detalhamento em texto corrido do que pesou a favor e do que ficou como risco, pergunta a pergunta (ver §4.4); (5) nova regra RN-EMAIL-01 (§6) formaliza que falha no envio de e-mail nunca deve bloquear a resposta ao visitante. |
| 1.3 | Julho 2026 | Adendo — **detalhamento do Painel Administrativo** (§4.5, RF-ADMIN-05 a 12), preparando a base para o Blog: (1) CRUD de posts formalizado como RF próprio (antes só implícito no escopo); (2) gestão de múltiplos usuários admin via **convite por token** (o admin nunca define nem transmite a senha de outro usuário), com CRUD de usuários e desativação (sem exclusão física, preserva autoria); (3) recuperação de senha via token de uso único; (4) editor de posts definido como **Markdown com preview e sanitização server-side** (decisão de segurança — evita XSS de um editor WYSIWYG que salva HTML bruto); (5) upload de imagem de capa com validação de tipo por conteúdo real do arquivo, não só extensão; (6) preview de post não publicado via link assinado com expiração, sem exigir login de quem recebe o link; (7) **agendamento de publicação** (novo status `agendado`), com job que publica automaticamente e dispara a newsletter; (8) novas regras de segurança de sessão — expiração por inatividade e lockout após tentativas malsucedidas — relevantes agora que há múltiplos usuários administradores. |

---

## 1. Visão Geral

O site institucional do PEIx tem dois objetivos comerciais: (1) comunicar a proposta de valor "o professor ganha tempo primeiro, a conformidade legal acontece como efeito colateral" (ver Diretrizes de Prompting — Website PEIx) e converter visitantes em leads qualificados para demonstração; (2) sustentar um canal de conteúdo (blog) que gera tráfego orgânico e constrói autoridade no tema de educação inclusiva.

- **Domínio:** peix.ia.br (já adquirido)
- **Hospedagem:** Railway
- **Relação com o sistema PEIx (produto):** site e produto são **serviços e bancos de dados separados**. O site não tem acesso a dados de alunos, escolas ou PEIs — apenas a dados comerciais (leads, assinantes de newsletter, posts do blog).

## 2. Escopo — Páginas e Seções

| Página | Conteúdo | Origem |
| --- | --- | --- |
| Home | Hero, Problema, Solução (inversão), Fluxo, Diferencial/Adoção, FAQ, CTA final | Já especificado nas Diretrizes de Prompting, validado no mockup |
| Recursos | Detalhamento técnico: PEI em 7 seções, Hub M-07, Segurança/LGPD | Diretrizes de Prompting §3.2 |
| Blog | Listagem de posts por categoria + página individual de post + inscrição de newsletter | Novo na v1.0 — substitui/absorve a antiga página "Legislação" (SEO), que passa a ser uma categoria dentro do Blog em vez de página isolada |
| Contato | Formulário de qualificação de lead | Diretrizes de Prompting §3.4 |
| Painel Admin (`/admin`) | Login + CRUD de posts do blog + CRUD de usuários admin + lista de leads e assinantes | Novo na v1.0, **detalhado na v1.3** (§4.5) |

> **Decisão de escopo:** a página "Legislação" descrita originalmente nas diretrizes (cards de artigos + checklist em PDF) é absorvida pelo Blog como a categoria **Legislação**, evitando duplicar a lógica de listagem de conteúdo em duas páginas diferentes. O mecanismo de "baixar checklist mediante e-mail" descrito nas diretrizes se torna um caso particular do fluxo de newsletter (RF-BLOG-03).

## 3. Perfis de Usuário do Site

| Perfil | Descrição | Autenticação |
| --- | --- | --- |
| Visitante anônimo | Navega no site, lê o blog | Nenhuma |
| Lead | Preencheu o formulário de Contato | Nenhuma (identificado por e-mail) |
| Assinante da newsletter | Inscreveu-se para receber aviso de novos posts | Nenhuma (token de e-mail para confirmar/descadastrar) |
| Administrador de conteúdo | Escreve e publica posts, consulta leads/assinantes/métricas, pode convidar outros administradores | Login (e-mail + senha) |
| Representante comercial | Recebe notificação por e-mail a cada novo lead — não acessa o site | Não se aplica |

> **Nota v1.3:** todo administrador ativo tem o mesmo nível de acesso (ver RN-ADMIN-01) — não há hierarquia entre "fundador" e demais autores nesta fase, apesar de o fundador tipicamente ser quem envia os primeiros convites.

## 4. Requisitos Funcionais

### 4.1 Páginas Institucionais

- **RF-SITE-01** — Home, Recursos e Contato devem seguir fielmente a estrutura, copy e conceito visual "Aurora" definidos nas Diretrizes de Prompting e validados no mockup.
- **RF-SITE-02** — Navegação fixa (navbar) com links para Início, Recursos, Blog, Contato e CTA "Agendar Demo" — substituindo o antigo item "Legislação" pelo item "Blog".
- **RF-SITE-03** — Todas as páginas devem ser responsivas (mobile-first) e atender WCAG AA (contraste, rótulos em botões/links, tags semânticas).

### 4.2 Formulário de Contato / Captação de Leads

- **RF-LEAD-01** — Formulário com os campos definidos nas Diretrizes §3.4: nome completo, e-mail institucional, telefone/WhatsApp, nome da instituição, cidade e UF (dois campos separados, não um único "Cidade/UF" como no mockup original — necessário para bater com o modelo de dados), cargo (dropdown, incluindo a opção "Outro"), segmentos atendidos (checkboxes), checkbox "Quero agendar uma demonstração guiada".
- **RF-LEAD-02** — Validação client-side e server-side de e-mail e telefone.
- **RF-LEAD-03** — Checkbox de consentimento LGPD obrigatório antes do envio, com link para a Política de Privacidade.
- **RF-LEAD-04** — Ao submeter, o sistema grava o lead com timestamp, IP (opcional) e origem (UTM, se presente na URL).
- **RF-LEAD-05** — Imediatamente após o envio, o visitante recebe por e-mail uma **confirmação de recebimento**, com resumo do que esperar (contato do representante por e-mail ou WhatsApp).
- **RF-LEAD-06** — No mesmo fluxo (mesmo e-mail ou e-mail separado enviado em sequência), o visitante recebe o **material informativo** — inicialmente um PDF institucional sobre o Decreto nº 12.773/2025 e a proposta do PEIx. Conteúdo do material a definir em sessão futura.
- **RF-LEAD-07** — Imediatamente após o envio, o **representante comercial** recebe um e-mail interno com todos os dados do lead, para follow-up manual por e-mail ou WhatsApp e agendamento posterior da conversa.
- **RN-LEAD-01** — Se o mesmo e-mail enviar o formulário novamente em menos de 7 dias, o sistema atualiza o registro existente (não cria duplicado) e **não** dispara novo aviso ao representante, para evitar ruído — mas o visitante recebe novamente a confirmação e o material.

### 4.3 Blog

- **RF-BLOG-01** — Listagem pública de posts, com filtro por categoria: **Inclusão, Legislação, Ideias e Boas Práticas, Experiências, Entrevistas, Eventos**.
- **RF-BLOG-02** — Página individual do post, com metadados de SEO (title, description, Open Graph) e marcação estruturada (schema.org/Article) para indexação.
- **RF-BLOG-03** — Formulário de inscrição na newsletter (nome + e-mail) visível na listagem do blog e ao final de cada post.
- **RF-BLOG-04** — **Double opt-in**: após se inscrever, o visitante recebe um e-mail de confirmação com link; só passa a receber avisos de novos posts após confirmar. Protege a qualidade da lista e a reputação de envio do domínio.
- **RF-BLOG-05** — Ao publicar um novo post, o sistema dispara automaticamente um e-mail para todos os assinantes confirmados, com título, resumo e link do post.
- **RF-BLOG-06** — Todo e-mail de newsletter contém link de descadastro (unsubscribe) self-service, sem exigir login.
- **RF-BLOG-07** — Painel administrativo com editor para criar, editar, publicar/despublicar e agendar posts: título, conteúdo (Markdown — ver RF-ADMIN-09), imagem de capa, categoria, resumo (excerpt) e autor. *(Redação ajustada na v1.3: "rich text ou Markdown" tornou-se apenas "Markdown", decisão registrada em RF-ADMIN-09.)*
- **RF-BLOG-08** — Upload de imagem de capa com redimensionamento/otimização automática antes de salvar. Validação de tipo e tamanho detalhada em RF-ADMIN-10.

### 4.4 Diagnóstico de Conformidade Guiado

> Substitui a proposta de um chatbot de IA aberto (avaliado e descartado nesta fase — ver justificativa no roadmap §7). Em vez de uma conversa livre, que carrega risco de resposta incorreta sobre um tema jurídico sensível, o diagnóstico usa perguntas fechadas e lógica determinística.

- **RF-DIAG-01** — Wizard de perguntas fechadas (múltipla escolha) sobre a maturidade do processo de PEI da escola: se já existe PEI estruturado, como as adaptações são registradas hoje, quantidade aproximada de alunos laudados, ferramentas atualmente usadas (planilha, Word, WhatsApp, sistema próprio).
- **RF-DIAG-02** — Cada resposta tem peso pré-definido; ao final, o sistema calcula uma pontuação e classifica a escola em uma categoria (ex.: Iniciante / Em transição / Avançada). Cálculo 100% determinístico — sem uso de IA generativa nesta funcionalidade. **Refinamento v1.2:** além da pontuação agregada, cada pergunta carrega um texto de "importância" (por que essa dimensão pesa a favor quando pontua bem) e um texto de "risco" (a consequência concreta quando não pontua no máximo); o resultado apresenta esses textos agrupados em dois parágrafos corridos — "o que já está a seu favor" e "pontos de atenção e risco" — em vez de listar pergunta por pergunta, para ler como uma avaliação e não como um questionário respondido.
- **RF-DIAG-03** — O resultado completo (pontuação, categoria, os dois parágrafos de força/risco e recomendações) só é exibido depois que o visitante informa e-mail (e opcionalmente nome) — funciona como gate de captura de lead, reforçando a promessa já presente no mockup da página Contato ("Diagnóstico gratuito do nível de conformidade da sua escola"). Acessível também por um botão de destaque na Home (mesmo peso visual do CTA principal, cor distinta para não se confundir com ele).
- **RF-DIAG-04** — Ao informar o e-mail, o sistema cria ou atualiza o lead (mesma tabela e mesma regra de deduplicação de RF-LEAD-04/RN-LEAD-01), marcando a origem como `diagnostico`, e dispara o mesmo fluxo de e-mails de confirmação e material informativo definido em RF-LEAD-05/06.
- **RF-DIAG-05** — O e-mail de notificação ao representante comercial (RF-LEAD-07) inclui, quando o lead veio do diagnóstico, a pontuação e a categoria de conformidade — contexto extra para qualificar o follow-up.
- **RF-DIAG-06** — O diagnóstico é acessível por CTA na Home e na página de Contato, sem exigir login, e pode ser refeito livremente pelo mesmo visitante.
- **RN-DIAG-01** — As perguntas, pesos e faixas de pontuação do diagnóstico são configuráveis apenas via código/seed nesta fase — não há painel de edição no MVP (ver RF-ADMIN, §4.5).

### 4.5 Painel Administrativo

**Autenticação e acesso**

- **RF-ADMIN-01** — Login por e-mail e senha para os administradores de conteúdo. Sem RBAC granular nesta fase — todo admin ativo tem o mesmo nível de acesso (RN-ADMIN-01).
- **RF-ADMIN-06** *(nova v1.3)* — Um administrador existente pode convidar um novo administrador informando apenas o e-mail. O sistema envia, via Resend, um link de ativação com token único e expiração (48h). O novo usuário define a própria senha ao clicar no link — **a senha nunca é definida nem transmitida pelo administrador que convida**, evitando senha em texto claro trafegando por e-mail.
- **RF-ADMIN-07** *(nova v1.3)* — Área de gestão de usuários administradores (CRUD): listar admins com status (`convidado` / `ativo` / `desativado`), reenviar convite expirado, desativar acesso de um usuário. **Sem exclusão física de registro** — desativar preserva o histórico de autoria dos posts para fins de auditoria.
- **RF-ADMIN-08** *(nova v1.3)* — Fluxo de recuperação de senha ("esqueci minha senha"): e-mail com link de reset contendo token de uso único e expiração curta (1h), mesmo padrão do double opt-in da newsletter.

**Leads, assinantes e métricas**

- **RF-ADMIN-02** — Listagem dos leads recebidos pelo formulário de Contato, com exportação em CSV (uso como CRM provisório até integração futura).
- **RF-ADMIN-03** — Listagem dos assinantes confirmados da newsletter.
- **RF-ADMIN-04** *(Fase 2)* — Métricas simples de visitas e conversão do formulário. *(Nota v1.3: o pedido do fundador de que "o admin pode ver métricas de conversão" já estava coberto por este RF; nenhuma mudança de conteúdo, apenas confirmação de escopo.)*

**Gestão de posts**

- **RF-ADMIN-05** *(nova v1.3 — formaliza o que já estava implícito no escopo §2 e em RF-BLOG-07)* — CRUD completo de posts pelo painel: criar, editar, listar com filtro por status, e arquivar/excluir. Status possíveis: `rascunho`, `agendado`, `publicado`.
- **RF-ADMIN-09** *(nova v1.3)* — Editor de post em **Markdown** com preview em tempo real (lado a lado ou alternável). Conteúdo é sanitizado no backend antes de ser renderizado publicamente — decisão de segurança: um editor WYSIWYG que salva HTML bruto abre superfície de XSS caso um post seja comprometido ou um segundo admin cole conteúdo malicioso.
- **RF-ADMIN-10** *(nova v1.3)* — Upload de imagem de capa direto do painel para o Cloudflare R2. Validação server-side: apenas JPEG/PNG/WebP, tamanho máximo de 5MB, com verificação pelo **conteúdo real do arquivo** (magic bytes), não apenas pela extensão — mitiga upload de arquivo malicioso disfarçado de imagem.
- **RF-ADMIN-11** *(nova v1.3)* — Preview de post não publicado (`rascunho` ou `agendado`) via link com token assinado e expiração (7 dias), acessível sem exigir login — permite compartilhar o rascunho com terceiros para revisão sem expor a área administrativa. Posts nesse estado só são visíveis por esse link, nunca pela URL pública normal (mantém RN-SITE-04).
- **RF-ADMIN-12** *(nova v1.3)* — Agendamento de publicação: o admin define uma data/hora futura; o post recebe status `agendado`. Um job periódico verifica posts agendados cuja data já chegou, muda o status para `publicado` e dispara automaticamente o fluxo de newsletter (RF-BLOG-05).

## 5. Requisitos Não Funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Hospedagem no Railway, domínio peix.ia.br com SSL automático |
| RNF-02 | Performance: Core Web Vitals dentro da faixa "Good" (LCP < 2.5s), imagens otimizadas |
| RNF-03 | SEO técnico: sitemap.xml, robots.txt, meta tags dinâmicas por página e por post |
| RNF-04 | Acessibilidade WCAG AA, herdada das Diretrizes de Prompting |
| RNF-05 | LGPD: consentimento explícito registrado com timestamp; Política de Privacidade acessível; processo (mesmo que manual no MVP) para atender pedido de exclusão de dados |
| RNF-06 | Responsividade mobile-first em todas as páginas |
| RNF-07 | Domínio de e-mail autenticado (SPF, DKIM, DMARC) para boa entregabilidade via serviço transacional |

## 6. Regras de Negócio

- **RN-SITE-01** — Um lead identificado pelo mesmo e-mail em menos de 7 dias atualiza o registro existente, sem duplicar nem reacionar o representante (ver RN-LEAD-01).
- **RN-SITE-02** — Assinante de newsletter só recebe e-mails de novo post após confirmar o double opt-in.
- **RN-SITE-03** — Descadastro da newsletter é self-service via token de e-mail, sem exigir login.
- **RN-SITE-04** — Posts em `rascunho` ou `agendado` não ficam acessíveis por URL pública nem indexáveis; só posts com status `publicado` aparecem no blog e nos e-mails de novo conteúdo. *(Atualizado v1.3: passou a cobrir também o novo status `agendado`.)*
- **RN-EMAIL-01** — Falha no envio de qualquer e-mail (confirmação, material, aviso ao representante, newsletter) nunca deve impedir a resposta de sucesso ao visitante quando a ação principal (lead gravado, diagnóstico calculado) já foi concluída. E-mail é um efeito colateral best-effort; falhas são registradas em log para o time técnico investigar, não expostas como erro para quem está usando o site.
- **RN-ADMIN-01** *(nova v1.3)* — Todo `admin_user` com status `ativo` tem o mesmo nível de acesso (posts, leads, assinantes, métricas, convite de novos admins) — sem RBAC granular nesta fase. Regra documentada explicitamente para evitar ambiguidade agora que há múltiplos usuários.
- **RN-ADMIN-02** *(nova v1.3)* — Um post `agendado` segue a mesma regra de visibilidade de um `rascunho`: não aparece na listagem pública, não é indexável, só acessível pelo link de preview assinado (RF-ADMIN-11).
- **RN-ADMIN-03** *(nova v1.3)* — Sessão de administrador expira por inatividade (7 dias); cookie de sessão configurado como httpOnly + secure + sameSite.
- **RN-ADMIN-04** *(nova v1.3)* — Lockout temporário após 5 tentativas de login malsucedidas em 15 minutos, por e-mail — mesmo padrão simplificado já usado no sistema PEIx (produto), campo `tentativas_login`. Necessário agora que a superfície de contas administrativas cresce (mais de um usuário, convites).

## 7. Roadmap

| Fase | Escopo |
| --- | --- |
| Fase 1 — MVP | Home, Recursos, Contato, Blog básico + newsletter (double opt-in) + Diagnóstico de Conformidade guiado + painel admin completo (posts, usuários, leads, assinantes) + e-mails transacionais via Resend |
| Fase 2 | Materiais adicionais gated por categoria (ex: checklist em PDF específico por artigo de Legislação), métricas de conversão (RF-ADMIN-04), exportação/integração com CRM |
| Fase 3 | Automação de nutrição de leads (sequência de e-mails pós-formulário), testes A/B de CTA |

> **Nota sobre chatbot de IA:** avaliado nesta sessão e descartado para o MVP — o público-alvo (diretores e coordenadores de inclusão) tende a preferir informação estruturada a conversa livre numa decisão institucional, o FAQ da Home já cobre as objeções recorrentes, e uma resposta aberta sobre tema jurídico (Decreto 12.773, LGPD) carrega risco reputacional caso a IA erre. Um chatbot com escopo restrito ao FAQ (sempre escalando para o representante em caso de dúvida jurídica) pode ser reconsiderado em Fase 2 ou além, à luz dos dados reais de conversão do site após o lançamento.

## 8. Status de Implementação (ao final desta sessão)

| Item | Status |
| --- | --- |
| Home (Hero, Problema, Inversão, Solução, Fluxo, Diferencial, FAQ, CTA final) | ✅ Construído e testado visualmente |
| Recursos (7 seções do PEI, Hub M-07, Segurança) | ✅ Construído |
| Contato (formulário + fluxo de e-mails) | ✅ Construído e testado de ponta a ponta (lead gravado + e-mails enviados) |
| Diagnóstico de Conformidade | ✅ Construído e testado de ponta a ponta (wizard, cálculo no servidor, resultado com parágrafos de força/risco, lead + diagnóstico gravados) |
| Blog (listagem, post individual, newsletter) | ⬜ Não iniciado |
| Painel Admin (login + CRUD de posts + CRUD de usuários + listagem de leads/assinantes) | ⬜ Não iniciado — **requisitos detalhados nesta sessão (v1.3)**, pronto para especificação técnica/implementação |
| Rotas de API de newsletter e posts | ⬜ Não iniciado (pastas criadas, sem código) |
| Domínio peix.ia.br em produção | ⬜ Ainda não resolve (DNS não configurado) |
| Verificação do domínio no Resend | ⬜ Pendente — envios em modo sandbox, só chegam ao e-mail do próprio dono da conta |

Próxima sessão: especificação técnica e/ou implementação do Painel Admin com base nos RF-ADMIN-01 a 12 desta versão.
