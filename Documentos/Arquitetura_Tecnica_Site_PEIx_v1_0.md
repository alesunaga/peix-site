# PEIx — Site Institucional

### Arquitetura Técnica e Operações — v1.0 — Julho 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Detalha a stack, o modelo de dados e os fluxos de e-mail que atendem o Requisitos_Site_PEIx_v1.0. Documento independente da Arquitetura_Tecnica do sistema PEIx (produto) — serviço, banco de dados e repositório próprios, conforme decisão desta sessão. |

---

## 1. Visão Geral da Stack

Decisão do fundador: o site é um **serviço separado**, sem compartilhar backend nem banco de dados com o sistema PEIx (produto). Isso mantém o site institucional simples e desacoplado do sistema multitenant em produção — mudanças no site não têm nenhum risco de impactar escolas reais, e vice-versa.

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Frontend + Backend | **Next.js** (App Router, TypeScript) | Framework full-stack único: SSR/SSG para SEO do blog e API Routes para o backend (formulário, blog, admin) no mesmo serviço — evita manter 2 serviços separados no Railway para um site desse porte |
| Estilo | Tailwind CSS | Mesma linguagem visual "Aurora" já validada no mockup e nas Diretrizes de Prompting |
| Banco de dados | PostgreSQL (plugin Railway, projeto próprio) | Gerenciado, mesma tecnologia já dominada pela equipe — porém instância **isolada** da do produto PEIx |
| ORM | Prisma | Migrations e type-safety integrados ao Next.js/TypeScript |
| Autenticação (Admin) | E-mail + senha (hash bcrypt) + sessão em cookie httpOnly | Poucos usuários administradores (fundador + eventuais autores) — não justifica RBAC complexo |
| E-mail transacional e newsletter | **Resend** | Ver §5 — recomendação desta sessão |
| Armazenamento de imagens (capas de post) | Cloudflare R2 | Mesma escolha já validada no sistema PEIx (Arquitetura_Tecnica v4.5 §13.1) — egress zero, reaproveita conhecimento e credenciais de infraestrutura já dominadas pela equipe |
| Hospedagem | Railway | Domínio peix.ia.br, deploy automático via push na branch `main` |

## 2. Modelo de Dados (visão inicial)

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `leads` | id, nome, email, telefone, instituicao, cidade, uf, cargo, segmentos (array), quer_demo (bool), utm_source, consentimento_lgpd_em, criado_em, atualizado_em | Chave de deduplicação: `email` (RN-SITE-01) |
| `newsletter_subscribers` | id, nome, email, status (pendente / confirmado / descadastrado), token_confirmacao, confirmado_em, descadastrado_em | Double opt-in — RF-BLOG-04 |
| `posts` | id, titulo, slug, resumo, conteudo (markdown), categoria, imagem_capa_url, autor, status (rascunho / publicado), publicado_em | `status = publicado` é o único filtro que expõe o post publicamente (RN-SITE-04) |
| `admin_users` | id, email, senha_hash, criado_em | Sem tabela de papéis nesta fase — login simples |
| `envios_newsletter` | id, post_id, disparado_em, total_destinatarios, total_sucesso, total_falha | Auditoria simples de cada disparo em lote (RF-BLOG-05) |

## 3. Fluxo do Formulário de Contato

1. Visitante preenche o formulário em `/contato` → `POST /api/leads`.
2. Backend valida os campos (server-side) e verifica se já existe lead com o mesmo e-mail nos últimos 7 dias (RN-SITE-01).
   - Se existir → atualiza o registro, **não** dispara e-mail ao representante.
   - Se não existir → cria o registro.
3. Backend dispara, via Resend:
   - E-mail de **confirmação** ao visitante (imediato).
   - E-mail com o **material informativo** (PDF ou link seguro de download) ao visitante — pode ser o mesmo e-mail da confirmação ou um segundo e-mail em sequência (decisão de copywriting, não técnica).
   - E-mail interno para o **representante comercial** (endereço configurado em variável de ambiente), com todos os dados do lead.
4. Frontend recebe confirmação de sucesso e exibe mensagem ao visitante.

> Os três envios de e-mail acontecem de forma assíncrona em relação à resposta da API (fila simples em memória ou `after()` do Next.js), para que uma eventual lentidão do Resend não trave a resposta ao visitante.

## 4. Fluxo do Blog e Newsletter

1. Visitante se inscreve (nome + e-mail) → `POST /api/newsletter/subscribe` → cria registro com `status = pendente` e `token_confirmacao`.
2. Resend envia e-mail de confirmação com link `/newsletter/confirmar?token=...`.
3. Visitante confirma → `status = confirmado`.
4. Administrador publica um post no painel (`status = publicado`).
5. Job disparado na publicação: busca todos os `newsletter_subscribers` com `status = confirmado`, envia e-mail em lote via Resend (respeitando rate limit da API), registra o resultado em `envios_newsletter`.
6. Todo e-mail de newsletter inclui link `/newsletter/descadastrar?token=...` (RF-BLOG-06).

## 5. Por que Resend

- API simples e nativa para TypeScript/Next.js, com templates em React (`react-email`) — mantém o design "Aurora" consistente entre e-mail e site.
- Free tier generoso (3.000 e-mails/mês, 100/dia), suficiente para o volume esperado do MVP (leads + newsletter).
- Suporta tanto **e-mails transacionais** (confirmação, material, aviso ao representante) quanto **disparo em lote** (newsletter), evitando contratar duas ferramentas diferentes.
- Fluxo de verificação de domínio (SPF/DKIM/DMARC) direto no painel, importante para a entregabilidade a partir de `@peix.ia.br`.

> Se o volume de assinantes da newsletter crescer para a casa de milhares, vale reavaliar (Resend Broadcasts tem limites de taxa que podem exigir throttling manual do job de disparo).

## 6. Segurança e LGPD

- O site **não** tem acesso a nenhum dado de aluno, escola ou PEI — só dados comerciais de leads e assinantes. Superfície de risco bem menor que o sistema PEIx (produto).
- Consentimento LGPD do formulário de Contato é registrado com timestamp (`consentimento_lgpd_em`).
- Todo e-mail de newsletter contém unsubscribe self-service (RN-SITE-03).
- Pedido de exclusão de dados: processo manual no MVP (endpoint interno para o administrador remover o registro), sem fluxo público automatizado nesta fase.

## 7. Deploy e Ambientes

- Ambiente único de produção no Railway nesta fase — o site tem risco operacional bem menor que o sistema PEIx (não há dado de aluno, não há multitenancy).
- Deploy automático via push na branch `main` do repositório do site (repositório próprio, separado do repositório do sistema PEIx).
- Variáveis de ambiente principais: `DATABASE_URL`, `RESEND_API_KEY`, `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET`, `ADMIN_SESSION_SECRET`, `REPRESENTANTE_EMAIL`.

## 8. Roadmap Técnico

| Fase | Escopo técnico |
| --- | --- |
| Fase 1 — MVP | Next.js + Postgres + Resend + R2, painel admin básico, fluxo completo de leads e newsletter |
| Fase 2 | Materiais gated por categoria, instrumentação de métricas (RF-ADMIN-04), exportação para CRM externo |
| Fase 3 | Automação de nutrição de leads (sequência de e-mails), testes A/B de CTA |
