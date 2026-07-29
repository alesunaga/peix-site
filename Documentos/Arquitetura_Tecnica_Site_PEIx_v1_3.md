# PEIx — Site Institucional

### Arquitetura Técnica e Operações — v1.3 — Julho 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Detalha a stack, o modelo de dados e os fluxos de e-mail que atendem o Requisitos_Site_PEIx_v1.0. Documento independente da Arquitetura_Tecnica do sistema PEIx (produto) — serviço, banco de dados e repositório próprios, conforme decisão desta sessão. |
| 1.1 | Julho 2026 | Adendo — arquitetura do **Diagnóstico de Conformidade guiado** (Requisitos_Site_PEIx v1.1, RF-DIAG-01 a 06): nova tabela `diagnosticos`, endpoint `POST /api/diagnostico`, cálculo de pontuação server-side (determinístico, sem chamada a IA) e reuso do fluxo de e-mails de RF-LEAD. |
| 1.2 | Julho 2026 | Adendo — consolida o que foi implementado e testado nesta sessão: (1) padrão **e-mail best-effort** (`enviarEmailsSemBloquear`, §6) — decisão de arquitetura formalizada depois de um erro real em produção de teste; (2) `DiagnosticoPergunta` ganhou os campos `importancia`/`risco`, usados para montar o resultado em texto corrido (§5); (3) enum `Cargo` ganhou o valor `OUTRO`; (4) nota sobre a organização de `prisma/migrations/` (§9) depois de um incidente de "drift" causado por migrations criadas fora do lugar padrão. |
| 1.3 | Julho 2026 | Adendo — arquitetura do **Painel Administrativo detalhado** (Requisitos_Site_PEIx v1.3, RF-ADMIN-05 a 12): (1) `admin_users` ganha campos de convite, reset de senha e lockout; (2) nova tabela `post_preview_tokens` para o link assinado de preview; (3) `posts.status` ganha o valor `agendado`, com job de publicação automática; (4) fluxo de convite de admin via token (sem senha transmitida por terceiros); (5) sanitização de Markdown no backend antes de renderização pública; (6) validação de upload de imagem por conteúdo real do arquivo (magic bytes), não extensão. |

---

## 1. Visão Geral da Stack

Decisão do fundador: o site é um **serviço separado**, sem compartilhar backend nem banco de dados com o sistema PEIx (produto). Isso mantém o site institucional simples e desacoplado do sistema multitenant em produção — mudanças no site não têm nenhum risco de impactar escolas reais, e vice-versa.

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Frontend + Backend | **Next.js** (App Router, TypeScript) | Framework full-stack único: SSR/SSG para SEO do blog e API Routes para o backend (formulário, blog, admin) no mesmo serviço — evita manter 2 serviços separados no Railway para um site desse porte |
| Estilo | Tailwind CSS | Mesma linguagem visual "Aurora" já validada no mockup e nas Diretrizes de Prompting |
| Banco de dados | PostgreSQL (plugin Railway, projeto próprio) | Gerenciado, mesma tecnologia já dominada pela equipe — porém instância **isolada** da do produto PEIx |
| ORM | Prisma | Migrations e type-safety integrados ao Next.js/TypeScript |
| Autenticação (Admin) | E-mail + senha (hash bcrypt) + sessão em cookie httpOnly | Múltiplos usuários administradores possíveis via convite (v1.3) — ainda sem RBAC granular, todos com o mesmo nível de acesso |
| Sanitização de Markdown | `rehype-sanitize` (ou equivalente) no pipeline de render do post | **Nova em v1.3** — RF-ADMIN-09: evita XSS em conteúdo Markdown convertido para HTML |
| E-mail transacional e newsletter | **Resend** | Ver §6 |
| Armazenamento de imagens (capas de post) | Cloudflare R2 | Mesma escolha já validada no sistema PEIx (Arquitetura_Tecnica v4.5 §13.1) — egress zero, reaproveita conhecimento e credenciais de infraestrutura já dominadas pela equipe |
| Job agendado (agendamento de posts) | Cron simples (Railway Cron ou rota protegida chamada por scheduler externo) | **Novo em v1.3** — RF-ADMIN-12: publica posts `agendado` cuja data chegou |
| Hospedagem | Railway | Domínio peix.ia.br, deploy automático via push na branch `main` |

## 2. Modelo de Dados

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `leads` | id, nome, email, telefone, instituicao, cidade, uf, cargo (enum: `DIRETOR_PEDAGOGICO`, `MANTENEDOR_DONO`, `COORDENADOR_INCLUSAO`, `PROFESSOR_AEE`, `OUTRO`), segmentos (array), quer_demo (bool), utm_source, consentimento_lgpd_em, criado_em, atualizado_em | Chave de deduplicação: `email` (RN-SITE-01) |
| `newsletter_subscribers` | id, nome, email, status (pendente / confirmado / descadastrado), token_confirmacao, confirmado_em, descadastrado_em | Double opt-in — RF-BLOG-04 |
| `posts` | id, titulo, slug, resumo, conteudo (markdown), categoria, imagem_capa_url, autor_id (FK → `admin_users`), status (`rascunho` / `agendado` / `publicado`), publicado_em | `status = publicado` **e** `publicado_em <= now()` é o único filtro que expõe o post publicamente (RN-SITE-04). **v1.3:** `autor` (texto livre) virou `autor_id` (FK), já que agora há múltiplos admins reais; `status` ganhou `agendado`. |
| `admin_users` | id, email, senha_hash (nullable até ativação), status (`convidado` / `ativo` / `desativado`), token_convite, convite_expira_em, convidado_por (FK → `admin_users`, nullable), token_reset_senha, reset_expira_em, tentativas_login, bloqueado_ate, criado_em | **v1.3:** ganhou todos os campos de convite, reset de senha e lockout (RF-ADMIN-06/07/08, RN-ADMIN-03/04). Sem tabela de papéis — todo `ativo` tem o mesmo acesso (RN-ADMIN-01). |
| `post_preview_tokens` | id, post_id (FK), token, expira_em, criado_em | **Nova em v1.3** — RF-ADMIN-11: token assinado de acesso a post não publicado, sem exigir login de quem visualiza |
| `envios_newsletter` | id, post_id, disparado_em, total_destinatarios, total_sucesso, total_falha | Auditoria simples de cada disparo em lote (RF-BLOG-05) |
| `diagnosticos` | id, lead_id (FK), respostas (jsonb), pontuacao, categoria, criado_em | Vinculado ao lead criado no momento do gate de e-mail (RF-DIAG-03/04) |

> **Migration de dados (v1.2 → v1.3):** como o Painel Admin ainda não tinha sido implementado (status "Não iniciado" na v1.2), não há dados reais de `posts.autor` (texto) para migrar — a troca para `autor_id` (FK) pode ser feita diretamente no schema, sem script de backfill.

## 3. Fluxo de Convite e Autenticação de Administrador *(novo em v1.3)*

**Convite (RF-ADMIN-06):**

1. Admin autenticado preenche o e-mail do novo usuário em `/admin/usuarios` → `POST /api/admin/usuarios/convidar`.
2. Backend cria (ou reutiliza, se `desativado`) o registro em `admin_users` com `status = convidado`, gera `token_convite` (aleatório, alta entropia) e `convite_expira_em` (agora + 48h).
3. Resend envia e-mail com link `/admin/ativar?token=...`.
4. Novo usuário acessa o link, define a própria senha (validação de força mínima) → `POST /api/admin/ativar` grava `senha_hash` (bcrypt, mesmo custo do produto PEIx — rounds=12) e muda `status` para `ativo`.
5. Token expirado → tela informa e oferece reenvio (admin original ou o próprio convidado solicitam reenvio, que gera novo token).

**Login (RF-ADMIN-01) com lockout (RN-ADMIN-04):**

1. `POST /api/admin/login` valida e-mail + senha.
2. Falha → incrementa `tentativas_login`; ao atingir 5 em 15 minutos, grava `bloqueado_ate` (now + 15min) e todas as tentativas seguintes retornam erro genérico até esse horário, mesmo com senha correta (evita enumeração de conta bloqueada vs. senha errada).
3. Sucesso → zera `tentativas_login`, cria sessão (cookie httpOnly + secure + sameSite=lax, expiração de 7 dias por inatividade — RN-ADMIN-03).

**Recuperação de senha (RF-ADMIN-08):**

1. `POST /api/admin/esqueci-senha` → gera `token_reset_senha` + `reset_expira_em` (now + 1h), envia e-mail via Resend.
2. `POST /api/admin/resetar-senha` com token válido e não expirado → atualiza `senha_hash`, invalida o token (uso único) e encerra sessões ativas desse usuário.

**Desativação (RF-ADMIN-07):** `status → desativado`. Login passa a ser recusado; posts de autoria desse usuário permanecem intactos (FK preservada, sem exclusão física).

## 4. Fluxo de CRUD e Publicação de Posts *(novo em v1.3)*

1. Admin cria/edita post em `/admin/posts` — editor Markdown com preview (RF-ADMIN-09). Autosave de rascunho opcional (implementação livre).
2. Upload de capa (RF-ADMIN-10): `POST /api/admin/posts/{id}/capa` → backend valida tipo por magic bytes (não apenas `Content-Type` do header, que pode ser forjado) e tamanho (≤5MB), envia para R2, grava `imagem_capa_url`.
3. Ao salvar, `status` pode ser `rascunho`, `agendado` (com `publicado_em` futuro) ou `publicado` (com `publicado_em = now()` se não informado).
4. **Publicação imediata:** dispara o mesmo job de newsletter já existente (RF-BLOG-05), síncrono ao salvar ou via fila leve.
5. **Publicação agendada (RF-ADMIN-12):** job periódico (cron a cada 5–15 min, ajustável) roda `SELECT * FROM posts WHERE status = 'agendado' AND publicado_em <= now()`, muda `status` para `publicado` e dispara o mesmo fluxo de newsletter do item 4.
6. **Preview de não publicado (RF-ADMIN-11):** `POST /api/admin/posts/{id}/preview-link` gera registro em `post_preview_tokens` (expira em 7 dias); a URL pública `/blog/preview/{token}` renderiza o post independente do `status`, sem exigir login — usada para compartilhar com terceiros para revisão.
7. **Sanitização:** o Markdown é convertido para HTML e sanitizado no servidor (allowlist de tags/atributos) tanto na rota de preview quanto na rota pública — nunca confiar em sanitização client-side.

> Isso reaproveita a mesma disciplina de "backend nunca confia no cliente" já adotada no Diagnóstico de Conformidade (§5, v1.1): a pontuação lá é recalculada no servidor; aqui, o HTML final do post também é sempre gerado e sanitizado no servidor, nunca aceito pronto do editor.

## 5. Fluxo do Formulário de Contato

1. Visitante preenche o formulário em `/contato` → `POST /api/leads`.
2. Backend valida os campos (server-side) e verifica se já existe lead com o mesmo e-mail nos últimos 7 dias (RN-SITE-01).
   - Se existir → atualiza o registro, **não** dispara e-mail ao representante.
   - Se não existir → cria o registro.
3. Backend dispara, via Resend:
   - E-mail de **confirmação** ao visitante (imediato).
   - E-mail com o **material informativo** (PDF ou link seguro de download) ao visitante.
   - E-mail interno para o **representante comercial**, com todos os dados do lead.
4. Frontend recebe confirmação de sucesso e exibe mensagem ao visitante.

> Os três envios de e-mail acontecem de forma assíncrona em relação à resposta da API (fila simples em memória ou `after()` do Next.js), para que uma eventual lentidão do Resend não trave a resposta ao visitante.

## 6. Fluxo do Blog e Newsletter

1. Visitante se inscreve (nome + e-mail) → `POST /api/newsletter/subscribe` → cria registro com `status = pendente` e `token_confirmacao`.
2. Resend envia e-mail de confirmação com link `/newsletter/confirmar?token=...`.
3. Visitante confirma → `status = confirmado`.
4. Post é publicado (imediatamente ou via job de agendamento — §4).
5. Job busca todos os `newsletter_subscribers` com `status = confirmado`, envia e-mail em lote via Resend (respeitando rate limit da API), registra o resultado em `envios_newsletter`.
6. Todo e-mail de newsletter inclui link `/newsletter/descadastrar?token=...` (RF-BLOG-06).

## 7. Fluxo do Diagnóstico de Conformidade

1. Visitante responde ao wizard de perguntas fechadas no frontend (estado local, nada é gravado ainda).
2. Ao final, o frontend pede e-mail (e opcionalmente nome) para "ver o resultado completo" → `POST /api/diagnostico` com as respostas + e-mail.
3. Backend **recalcula a pontuação a partir das respostas recebidas** (nunca confia num resultado calculado no cliente), classifica a categoria e monta o detalhamento por pergunta (`importancia`/`risco`, ver `DiagnosticoPergunta` em `diagnostico-config.ts`), e:
   - Cria ou atualiza o lead correspondente (mesma regra de dedup de RN-LEAD-01), com `origem = 'diagnostico'`.
   - Grava o registro em `diagnosticos`, vinculado ao `lead_id`.
   - Dispara o mesmo fluxo de e-mails de RF-LEAD-05/06 — de forma best-effort (ver §8).
   - Inclui pontuação e categoria no e-mail de notificação ao representante (RF-LEAD-07 / RF-DIAG-05).
4. Backend retorna a pontuação, categoria, o detalhamento por pergunta e recomendações associadas para o frontend montar os parágrafos de força/risco e exibir imediatamente ao visitante.

> As perguntas, pesos e faixas de pontuação ficam num arquivo de configuração (seed) versionado no repositório — não há tabela nem painel para editá-los no MVP (RN-DIAG-01).

## 8. Padrão de E-mail Best-Effort

> **RN-EMAIL-01:** o envio de e-mail nunca deve bloquear a resposta ao visitante quando o lead/diagnóstico já foi gravado com sucesso. O helper `enviarEmailsSemBloquear()` (`src/lib/resend.ts`) roda os envios com `Promise.allSettled` e só loga falhas (`console.error`) — nunca propaga a exceção para a rota. Isso foi corrigido depois de um bug real em teste: uma restrição de sandbox do Resend (só permite enviar para o e-mail do dono da conta) fazia a rota inteira responder `500`, mesmo com o diagnóstico calculado e salvo corretamente no banco.
>
> **Nota v1.3:** o mesmo padrão se aplica aos e-mails de convite de admin, reset de senha e newsletter de novo post — nenhum deles deve bloquear a ação principal (convite gravado, senha resetada, post publicado) em caso de falha do provedor.

## 9. Por que Resend

- API simples e nativa para TypeScript/Next.js, com templates em React (`react-email`) — mantém o design "Aurora" consistente entre e-mail e site.
- Free tier generoso (3.000 e-mails/mês, 100/dia), suficiente para o volume esperado do MVP (leads + newsletter).
- Suporta tanto **e-mails transacionais** (confirmação, material, aviso ao representante, convite de admin, reset de senha) quanto **disparo em lote** (newsletter), evitando contratar duas ferramentas diferentes.
- Fluxo de verificação de domínio (SPF/DKIM/DMARC) direto no painel, importante para a entregabilidade a partir de `@peix.ia.br`.

> Se o volume de assinantes da newsletter crescer para a casa de milhares, vale reavaliar (Resend Broadcasts tem limites de taxa que podem exigir throttling manual do job de disparo).

## 10. Segurança e LGPD

- O site **não** tem acesso a nenhum dado de aluno, escola ou PEI — só dados comerciais de leads e assinantes. Superfície de risco bem menor que o sistema PEIx (produto).
- Consentimento LGPD do formulário de Contato é registrado com timestamp (`consentimento_lgpd_em`).
- Todo e-mail de newsletter contém unsubscribe self-service (RN-SITE-03).
- Pedido de exclusão de dados: processo manual no MVP (endpoint interno para o administrador remover o registro), sem fluxo público automatizado nesta fase.
- **Novo em v1.3 — superfície de administração:** com múltiplos admins via convite, os pontos de atenção adicionais são: (1) token de convite e de reset de senha devem ser de alta entropia e uso único; (2) lockout por tentativas (RN-ADMIN-04) mitiga força bruta; (3) link de preview de post (RF-ADMIN-11) expõe conteúdo não publicado a quem tiver a URL — por isso tem expiração e não deve ser indexável (`noindex` na rota de preview); (4) sanitização de Markdown no servidor evita que conteúdo de post publicado sirva de vetor de XSS contra visitantes do blog.

## 11. Deploy e Ambientes

- Ambiente único de produção no Railway nesta fase — o site tem risco operacional bem menor que o sistema PEIx (não há dado de aluno, não há multitenancy).
- Deploy automático via push na branch `main` do repositório do site (repositório próprio, separado do repositório do sistema PEIx).
- Variáveis de ambiente principais: `DATABASE_URL`, `RESEND_API_KEY`, `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET`, `ADMIN_SESSION_SECRET`, `REPRESENTANTE_EMAIL`.
- **Novo em v1.3:** variável adicional para o job de agendamento, se implementado como scheduler externo chamando uma rota protegida (ex.: `CRON_SECRET`, usado para autenticar a chamada do scheduler à rota `POST /api/admin/posts/publicar-agendados`).

> **Atenção com a localização de `prisma/migrations/` (aprendido em v1.2):** o Prisma sempre procura o histórico de migrations ao lado do `schema.prisma` — ou seja, em `prisma/migrations/`, nunca numa pasta `migrations/` solta na raiz do projeto. Rodar `prisma migrate dev` com a pasta no lugar errado faz o Prisma interpretar todo o banco já existente como "drift", o que pode levar a sugerir um `prisma migrate reset` — **que apagaria todos os dados**. Sempre confirmar que `prisma/migrations/` existe e contém as migrations aplicadas antes de aceitar qualquer prompt do Prisma que mencione reset ou perda de dados. Válido também para a migration que introduz os novos campos de `admin_users` e a tabela `post_preview_tokens` nesta versão.

## 12. Roadmap Técnico

| Fase | Escopo técnico |
| --- | --- |
| Fase 1 — MVP | Next.js + Postgres + Resend + R2, **Painel Admin completo** (convite/CRUD de usuários, CRUD de posts com agendamento e preview, sanitização de Markdown), fluxo completo de leads, newsletter e Diagnóstico de Conformidade |
| Fase 2 | Materiais gated por categoria, instrumentação de métricas (RF-ADMIN-04), exportação para CRM externo |
| Fase 3 | Automação de nutrição de leads (sequência de e-mails), testes A/B de CTA |
