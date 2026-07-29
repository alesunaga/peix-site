# Resumo da sessão — Painel Admin (Fase 1b), 26/07/2026

## O que foi construído

**1. Fundação (RF-ADMIN-01)** — schema Prisma, login com lockout (5 tentativas / 15 min), sessão em cookie assinado (Web Crypto, compatível com o middleware Edge), middleware protegendo `/admin/**`, shell autenticado com navegação.

**2. Leads e Assinantes (RF-ADMIN-02, 03)** — `/admin/leads` (busca, paginação, export CSV) e `/admin/assinantes` (filtro por status, paginação).

**3. Convite e gestão de usuários (RF-ADMIN-06, 07, 08)** — convite por token (48h, senha nunca definida por quem convida), reenvio, desativação sem exclusão física, recuperação de senha por token de uso único (1h).

**4. Correção de segurança (fora do escopo original dos RFs)** — resetar a senha agora invalida sessões antigas. Sem essa correção, uma sessão comprometida continuava válida mesmo após a troca de senha, o que esvaziava o propósito da funcionalidade. Mecanismo: campo `senhaAlteradaEm` comparado ao instante de emissão (`iat`) do cookie de sessão.

**5. CRUD de posts com Markdown (RF-ADMIN-05, 09)** — `/admin/posts` (listagem, busca, filtro, paginação) e editor com preview ao vivo sanitizado sempre no backend (`marked` + `sanitize-html`), slug automático com checagem de unicidade.

## Problemas encontrados e resolvidos

- **Build quebrando no Railway** (3 tentativas seguidas) — erro de tipagem `Uint8Array<ArrayBufferLike>` vs `BufferSource` em `admin-session.ts`. Corrigido com anotação de tipo explícita.
- **Vulnerabilidades de npm** — `npm audit` sugeria downgrade destrutivo do Next.js (recusado); investigação via changelog oficial mostrou que a maioria já estava corrigida na versão em uso. Uma dependência real (`sharp`, transitiva) foi fixada via `overrides`.
- **Login não funcionava em produção** — causa raiz: uma variável `DATABASE_URL` da sessão do PowerShell tinha precedência sobre o `.env` local, fazendo o script de seed rodar contra o banco errado silenciosamente (com mensagem de "sucesso"). Resolvido abrindo um terminal limpo e confirmando os dados direto pelo Console SQL do Railway.
- **Corrupção de `node_modules`** ao tentar instalar pacotes de dentro do ambiente de execução (que monta a pasta real do projeto sem suporte confiável a rename/unlink atômico). Regra adotada: instalação de pacotes sempre roda na máquina do usuário, nunca no ambiente de execução.

## Documentação atualizada

- `README.md` do repositório — status atual.
- `Requisitos_Site_PEIx_v1.8.md` — RF-ADMIN-01, 02, 03, 05, 06, 07, 08, 09 marcados como concluídos; nova regra **RN-ADMIN-05** (revogação de sessão).
- `Arquitetura_Tecnica_Site_PEIx_v1.6.md` — mecanismo de sessão (Web Crypto/Edge), revogação de sessão, sanitização de Markdown (`marked`+`sanitize-html`), migrations escritas manualmente, nota sobre variável de ambiente do PowerShell.

> Os dois arquivos de Requisitos/Arquitetura foram gerados aqui porque o ambiente de execução não tem acesso de escrita ao seu projeto de conhecimento — é preciso subir os dois arquivos manualmente lá para substituir as versões v1.7/v1.5.

## Fora do escopo desta sessão (ficam para a próxima)

- RF-ADMIN-10 — upload de capa de post para Cloudflare R2 (validação por magic bytes)
- RF-ADMIN-11 — link de preview assinado para posts não publicados
- RF-ADMIN-12 — agendamento de publicação (status `agendado` + job + disparo de newsletter)
- Blog público (RF-BLOG-01 a 08)
