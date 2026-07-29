# PEIx — Site Institucional

### Arquitetura Técnica e Operações — v1.6 — Julho 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho 2026 | Versão inicial. Detalha a stack, o modelo de dados e os fluxos de e-mail que atendem o Requisitos_Site_PEIx_v1.0. Documento independente da Arquitetura_Tecnica do sistema PEIx (produto) — serviço, banco de dados e repositório próprios. |
| 1.1 | Julho 2026 | Adendo — arquitetura do **Diagnóstico de Conformidade guiado**: nova tabela `diagnosticos`, endpoint `POST /api/diagnostico`, cálculo de pontuação server-side. |
| 1.2 | Julho 2026 | Adendo — padrão **e-mail best-effort** (`enviarEmailsSemBloquear`, §8); `DiagnosticoPergunta` ganhou `importancia`/`risco`; `Cargo` ganhou `OUTRO`; nota sobre organização de `prisma/migrations/`. |
| 1.3 | Julho 2026 | Adendo — arquitetura do **Painel Administrativo detalhado**: `admin_users` ganha campos de convite/reset/lockout; nova tabela `post_preview_tokens`; `posts.status` ganha `agendado`; fluxo de convite via token; sanitização de Markdown no backend; validação de upload por magic bytes. |
| 1.4 | Julho 2026 | Adendo — lançamento faseado: arquitetura do Painel Admin da v1.3 **não entra** nesta rodada de deploy, só quando a Fase 1b for retomada. |
| 1.5 | Julho 2026 | Adendo — incidente real de deploy: `prisma/migrations/` nunca tinha sido commitada; migrations geradas contra o banco de produção por falta de ambiente de dev separado; criado ambiente `development` isolado no Railway (§11). |
| 1.6 | Julho 2026 | Adendo — **implementação real do Painel Admin — fundação, leads/assinantes, usuários e CRUD de posts** (retoma a Fase 1b adiada na v1.4), com quatro decisões de arquitetura que não estavam previstas na v1.3 e um incidente de infraestrutura relevante para sessões futuras: **(1) sessão via cookie assinado com Web Crypto, não `node:crypto`** — o middleware que protege `/admin/**` roda no **Edge runtime** do Next.js, incompatível com o engine nativo do Prisma e com o módulo `node:crypto`; o token de sessão usa HMAC-SHA256 via `crypto.subtle` (Web Crypto API, disponível tanto em Edge quanto em Node), formato `<payload-base64url>.<assinatura-base64url>` (§3); **(2) modelo de autenticação em duas camadas** — o middleware (Edge) só valida assinatura/expiração do cookie e redireciona anônimos; a checagem autoritativa (`status = ativo` e a regra de revogação de sessão abaixo) roda em `getAdminAtual()` (Node.js), chamada por toda rota e página protegida, nunca só pelo middleware (§3, §10); **(3) revogação de sessão ao trocar de senha** — campo `senhaAlteradaEm` em `admin_users` comparado ao instante de emissão (`iat`) gravado no próprio cookie de sessão; resetar a senha ou ativar um convite agora invalida sessões abertas com a senha antiga no próximo request, o que não estava especificado na v1.3 e foi corrigido depois de identificado como uma lacuna real de segurança nesta sessão (RN-ADMIN-05 no Requisitos_Site_PEIx v1.8); **(4) sanitização de Markdown** — a v1.3 previa "`rehype-sanitize` (ou equivalente)"; a implementação real usa **`marked`** (parser Markdown→HTML) + **`sanitize-html`** (allowlist de tags/atributos), combinados em `src/lib/markdown.ts`, reaproveitados tanto no preview do admin quanto (futuramente) na renderização pública do blog. **Migrations desta sessão foram escritas manualmente** (`20260726114400_admin_panel_foundation`, `20260726122442_admin_session_revogacao`) — o ambiente onde foram geradas não tinha acesso de rede ao Postgres do Railway nem ao engine Linux do Prisma; escritas para corresponder exatamente ao SQL que o Prisma geraria, com base na convenção dos arquivos de migration já existentes, e só confirmadas como corretas pelo log de deploy em produção (ver §11 para o processo recomendado). CRUD de posts, gestão de usuários, leads e assinantes detalhados em §3/§4; status por RF em Requisitos_Site_PEIx v1.8 §8. |

---

## 1. Visão Geral da Stack

Decisão do fundador: o site é um **serviço separado**, sem compartilhar backend nem banco de dados com o sistema PEIx (produto).

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Frontend + Backend | **Next.js** (App Router, TypeScript) | Framework full-stack único: SSR/SSG para SEO do blog e API Routes para o backend no mesmo serviço |
| Estilo | Tailwind CSS | Mesma linguagem visual "Aurora" já validada no mockup |
| Banco de dados | PostgreSQL (plugin Railway, projeto próprio) | Instância isolada da do produto PEIx |
| ORM | Prisma | Migrations e type-safety integrados ao Next.js/TypeScript |
| Autenticação (Admin) | E-mail + senha (hash bcrypt) + sessão em cookie httpOnly assinada com **Web Crypto (HMAC-SHA256)** | **Atualizado v1.6:** o token de sessão precisa ser verificável tanto no middleware (Edge runtime) quanto nas rotas (Node runtime) — `node:crypto` não está disponível no Edge, por isso a assinatura usa `crypto.subtle`, compatível com os dois. Múltiplos usuários administradores via convite (v1.3), ainda sem RBAC granular. |
| Sanitização de Markdown | **`marked` (parser) + `sanitize-html` (sanitizador)**, combinados em `src/lib/markdown.ts` | **Atualizado v1.6** (substitui a previsão genérica "`rehype-sanitize` ou equivalente" da v1.3) — RF-ADMIN-09: evita XSS em conteúdo Markdown convertido para HTML. Sanitização sempre server-side, nunca no cliente; mesma função reaproveitada pelo preview do admin e (futuramente) pelo blog público. |
| E-mail transacional e newsletter | **Resend** | Ver §8 |
| Armazenamento de imagens (capas de post) | Cloudflare R2 | **Ainda não integrado** — entra com RF-ADMIN-10, próxima sessão |
| Job agendado (agendamento de posts) | Cron simples (Railway Cron ou rota protegida) | **Ainda não integrado** — entra com RF-ADMIN-12, próxima sessão |
| Hospedagem | Railway | Domínio peix.ia.br, deploy automático via push na branch `main` |

## 2. Modelo de Dados

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `leads` | id, nome, email, telefone, instituicao, cidade, uf, cargo, segmentos, quer_demo, utm_source, consentimento_lgpd_em, criado_em, atualizado_em | Chave de deduplicação: `email` |
| `newsletter_subscribers` | id, nome, email, status, token_confirmacao, confirmado_em, descadastrado_em | Double opt-in |
| `posts` | id, titulo, slug, resumo, conteudo (markdown), categoria, imagem_capa_url (ainda não usado — RF-ADMIN-10), autor_id (FK → `admin_users`), status (`rascunho`/`agendado`/`publicado`), publicado_em, criado_em, atualizado_em | **✅ Implementado na v1.6.** `publicado_em` gravado automaticamente na primeira transição para `publicado`. `agendado` existe no enum mas ainda não tem fluxo de job (RF-ADMIN-12). |
| `admin_users` | id, email, senha_hash (nullable até ativação), status (`convidado`/`ativo`/`desativado`), token_convite, convite_expira_em, convidado_por (FK → `admin_users`, nullable), token_reset_senha, reset_expira_em, tentativas_login, bloqueado_ate, **senha_alterada_em** (nova v1.6), criado_em | **✅ Implementado na v1.6.** `senha_alterada_em` é o campo-chave da revogação de sessão (§3, §10) — gravado toda vez que a senha muda (reset ou primeira ativação de convite), nunca lido/comparado pelo middleware Edge (que não tem acesso ao Postgres), só por `getAdminAtual()` em Node. |
| `post_preview_tokens` | id, post_id (FK), token, expira_em, criado_em | Tabela criada no schema desta sessão (migration já aplicada) — **fluxo de geração/consumo do token ainda não implementado**, entra com RF-ADMIN-11 |
| `envios_newsletter` | id, post_id, disparado_em, total_destinatarios, total_sucesso, total_falha | Ainda não implementado — depende do Blog público |
| `diagnosticos` | id, lead_id (FK), respostas (jsonb), pontuacao, categoria, criado_em | Sem alteração |

## 3. Fluxo de Sessão, Convite e Autenticação de Administrador *(atualizado v1.6)*

**Token de sessão (`src/lib/admin-session.ts`):**

- Formato: `<payload-base64url>.<assinatura-base64url>`, onde `payload = { sub, iat, exp }` (`sub` = id do admin, `iat`/`exp` = emissão/expiração em segundos).
- Assinatura HMAC-SHA256 via `crypto.subtle` (Web Crypto API) — **não** `node:crypto` — porque o middleware que valida o cookie em toda request roda no **Edge runtime** do Next.js, que não expõe `node:crypto` nem o engine nativo do Prisma.
- Cookie: httpOnly, `secure` em produção, `sameSite=lax`, renovado a cada request (expiração deslizante de 7 dias) — mas o `iat` original é **preservado** entre renovações, nunca atualizado, porque é ele que é comparado contra `senha_alterada_em` na regra de revogação abaixo.

**Duas camadas de verificação (defesa em profundidade):**

1. **`middleware.ts` (Edge runtime)** — só verifica se o cookie existe, se a assinatura é válida e se não expirou. Redireciona para `/admin/login` (páginas) ou responde 401 (rotas de API) se a sessão for inválida. **Não consulta o banco** — não tem acesso ao Prisma nesse runtime.
2. **`getAdminAtual()` em `src/lib/admin-current.ts` (Node runtime) — checagem autoritativa.** Busca o admin no Postgres e valida: `status === 'ATIVO'` **e** `senha_alterada_em` (se existir) é anterior ou igual ao `iat` da sessão. Se qualquer uma falhar, retorna `null` mesmo com o cookie "válido" pelo middleware. **Toda rota de API e toda página protegida chama `getAdminAtual()` diretamente — nunca confia apenas no fato de o middleware ter deixado a request passar.**

**Convite (RF-ADMIN-06):** sem alteração de fluxo em relação à v1.3 (token 48h, e-mail via Resend, senha definida só pelo convidado em `/admin/ativar`). **Novo:** ativar o convite grava `senha_alterada_em = now()`, o que automaticamente cobre o caso de "primeira sessão criada não deve ser invalidável por uma senha anterior inexistente".

**Login (RF-ADMIN-01) com lockout (RN-ADMIN-04):** sem alteração — 5 tentativas em 15 minutos por e-mail, erro genérico durante o bloqueio.

**Recuperação de senha (RF-ADMIN-08) — revogação de sessão (nova v1.6, RN-ADMIN-05):**

1. `POST /api/admin/esqueci-senha` sempre responde de forma genérica, exista ou não o e-mail (evita enumeração de contas) — gera token de reset (1h) e envia e-mail só se o e-mail existir.
2. `POST /api/admin/resetar-senha` com token válido → atualiza `senha_hash` **e grava `senha_alterada_em = now()`**. Esse segundo passo é o que faltava na v1.3: sem ele, uma sessão aberta antes da troca de senha continuava autenticada normalmente (o cookie em si não muda), o que esvaziava o propósito de "trocar a senha por segurança" — por exemplo, depois de suspeitar que a senha vazou. Com `senha_alterada_em`, qualquer sessão cujo `iat` seja anterior ao momento da troca passa a ser rejeitada por `getAdminAtual()` no request seguinte, forçando novo login.

**Desativação (RF-ADMIN-07):** sem alteração — `status → desativado`, sem exclusão física, FK de autoria preservada.

## 4. Fluxo de CRUD de Posts *(atualizado v1.6 — o que foi implementado nesta rodada)*

1. Admin cria/edita post em `/admin/posts/novo` ou `/admin/posts/{id}` — formulário único (`PostForm.tsx`) compartilhado entre criação e edição.
2. **Slug:** gerado automaticamente a partir do título (função pura `gerarSlug`, sem acentos/caracteres especiais) enquanto o campo não for editado manualmente pelo usuário; checagem de unicidade no backend (sufixo numérico se já existir).
3. **Preview em tempo real:** o textarea de conteúdo Markdown dispara (debounced, 400ms) `POST /api/admin/posts/preview`, que roda o mesmo `markdownParaHtmlSeguro()` usado na gravação — o HTML exibido no preview é sempre o resultado sanitizado do backend, nunca uma conversão feita no navegador.
4. **Salvar:** `POST /api/admin/posts` (criar) ou `PATCH /api/admin/posts/{id}` (editar). Status possíveis nesta rodada: `rascunho` ou `publicado` (`agendado` existe no schema mas sem fluxo de UI/job ainda). Primeira transição para `publicado` grava `publicado_em = now()` automaticamente.
5. **Excluir:** `DELETE /api/admin/posts/{id}`, com tratamento explícito dos códigos de erro do Prisma (violação de FK, registro não encontrado) em vez de deixar vazar erro 500 genérico.
6. **Sanitização (RF-ADMIN-09):** `src/lib/markdown.ts` — `marked` converte Markdown → HTML bruto, `sanitize-html` filtra por allowlist de tags (`h1`–`h6`, `p`, listas, `blockquote`, `code`/`pre`, `a`, `img`, tabelas) e atributos (`href`/`title` em links, `src`/`alt`/`title` em imagens), força `rel="noopener noreferrer"` e `target="_blank"` em links. Roda tanto na rota de preview do admin quanto (already reaproveitável) na futura renderização pública do blog — nunca há uma segunda implementação de sanitização em outro lugar.

**Ainda não implementado (próxima sessão):** upload de capa para R2 (RF-ADMIN-10), geração/consumo de link de preview assinado (RF-ADMIN-11), status `agendado` com job de publicação automática + disparo de newsletter (RF-ADMIN-12).

## 5. Fluxo do Formulário de Contato

Sem alteração — ver v1.0/v1.2.

## 6. Fluxo do Blog e Newsletter

Sem alteração de arquitetura — **ainda não implementado** (Blog público continua fora do escopo até o Painel Admin estar fechado).

## 7. Fluxo do Diagnóstico de Conformidade

Sem alteração — ver v1.1/v1.2.

## 8. Padrão de E-mail Best-Effort

Sem alteração — ver v1.2. O mesmo padrão (`Promise.allSettled`, nunca propagar exceção da rota) se aplica aos e-mails de convite de admin e reset de senha implementados nesta sessão.

## 9. Por que Resend

Sem alteração — ver v1.0.

## 10. Segurança e LGPD

Itens da v1.0–v1.3 sem alteração. **Atualizado v1.6 — modelo de sessão do Painel Admin:**

- **Verificação em duas camadas (§3):** o middleware (Edge) garante que ninguém sem cookie válido alcance uma página ou rota de `/admin/**`; a checagem de negócio (conta ativa, sessão não revogada por troca de senha) é sempre feita de novo em Node por `getAdminAtual()`, nunca assumida a partir do middleware ter deixado a request passar. Essa redundância é intencional: o Edge runtime não tem acesso ao Postgres, então ele fisicamente não consegue aplicar a regra de revogação sozinho.
- **Revogação de sessão ao trocar de senha (RN-ADMIN-05):** ver §3. Fecha uma lacuna real — sem essa regra, comprometer uma sessão ativa não era mitigado por uma troca de senha subsequente, contrariando a expectativa normal de que "trocar a senha desloga os outros".
- **Sanitização de Markdown:** allowlist estrita de tags/atributos (§4), aplicada sempre no backend. Como o blog público ainda não existe, hoje o único consumidor dessa sanitização é o preview do próprio admin — mas a função já foi desenhada para ser a mesma usada na renderização pública futura, evitando divergência entre as duas superfícies.
- **Gestão de dependências:** um `npm audit` nesta sessão apontou vulnerabilidades em dependências transitivas; a maioria já estava corrigida na versão do Next.js em uso (confirmado via changelog de segurança oficial, não só pelo texto do `npm audit`, que pode reportar uma faixa de versões afetadas maior do que a realmente vulnerável). Uma dependência transitiva real (`sharp`, empacotada dentro do `next`) foi fixada numa versão patchada via `overrides` no `package.json`.

## 11. Deploy e Ambientes

Modelo de dois ambientes (`production`/`development`) sem alteração em relação à v1.5. **Notas operacionais desta sessão, relevantes para o processo de trabalho, não para a arquitetura em produção:**

- **Migrations escritas manualmente:** o ambiente de desenvolvimento usado nesta sessão não tinha acesso de rede ao Postgres do Railway nem ao endpoint de download do engine Linux do Prisma (`binaries.prisma.sh`), o que impede rodar `prisma migrate dev`/`generate` diretamente. As duas migrations desta sessão (`20260726114400_admin_panel_foundation`, `20260726122442_admin_session_revogacao`) foram escritas à mão, replicando exatamente o SQL que o Prisma geraria (baseado na convenção das migrations já existentes no repositório), e só confirmadas como corretas depois de aplicadas com sucesso em produção (log de deploy do Railway). **Processo recomendado para sessões futuras que sigam nesse ambiente:** escrever a migration manualmente com o mesmo cuidado, e pedir para alguém com acesso normal ao ambiente `development` rodar `npx prisma generate` e validar o `schema.prisma` localmente antes do deploy, em vez de confiar apenas na leitura do SQL.
- **Variável de ambiente de sessão pode mascarar `.env`:** identificado durante um debug de login que não funcionava — uma variável `DATABASE_URL` definida na sessão do PowerShell (`$env:DATABASE_URL`) tem precedência sobre o `--env-file=.env` do Node, porque o Node/dotenv não sobrescreve uma variável já presente em `process.env`. Isso fez um script de seed rodar silenciosamente contra o banco de desenvolvimento antigo enquanto a aplicação em produção apontava para outro banco (vazio), com a mensagem de sucesso do script mascarando o problema. **Verificação recomendada quando um comportamento parecer "banco errado":** `echo $env:DATABASE_URL` (PowerShell) antes de assumir que o `.env` está sendo respeitado, e conferir os dados diretamente pela aba de Console/Query do Postgres no Railway, não só pela resposta de sucesso do script.

## 12. Roadmap Técnico

| Fase | Escopo técnico |
| --- | --- |
| Fase 1a — MVP informativo | Next.js + Postgres + Resend, fluxo completo de leads, newsletter (parcial — sem Blog) e Diagnóstico. **✅ Concluído.** |
| Fase 1b — Painel Admin + Blog | **✅ Concluído nesta sessão:** fundação (sessão/login/lockout), leads, assinantes, CRUD de usuários (convite/reset/desativação), CRUD de posts com Markdown sanitizado. **Pendente:** upload de capa (R2), preview assinado, agendamento (job periódico), e o Blog público (listagem, post individual, newsletter, disparo em lote). |
| Fase 2 | Materiais gated por categoria, instrumentação de métricas (RF-ADMIN-04), exportação para CRM externo |
| Fase 3 | Automação de nutrição de leads, testes A/B de CTA |
