# PEIx — Site Institucional

### Analytics Próprio — Desenho Técnico — v1.0 — Agosto 2026

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Agosto 2026 | Versão inicial. Desenho de uma solução própria de estatísticas de acesso (pageviews, origem de tráfego, eventos de conversão), integrada ao Painel Administrativo já descrito em Arquitetura_Tecnica_Site_PEIx v1.3. Sem dependência de serviço terceiro (GA4, Plausible, Matomo). Decisão de sessão: sem tageamento para retargeting/publicidade — mantém a Politica_Privacidade_PEIx §8 inalterada. **Nota:** implementado na mesma sessão — ver Arquitetura_Tecnica_Site_PEIx v1.8 §2/§3 e Requisitos_Site_PEIx v1.10 (RF-ADMIN-04, RN-SITE-06) para o resultado final, incluindo uma mudança feita em revisão (dashboard incorporado a `/admin` em vez de uma aba `/admin/analytics` separada, como propunha a versão original deste desenho). |

---

## 1. Visão Geral

Reaproveita 100% do stack já existente do site (Next.js/App Router, Postgres via Prisma, área admin autenticada) — não é um serviço novo, é uma feature a mais dentro do mesmo deploy no Railway.

Princípio de design: medir eventos de negócio (conclusão do Diagnóstico, envio de formulário, inscrição em newsletter), não só pageview genérico — é o que importa para um site institucional B2B voltado a geração de lead.

Princípio de privacidade: nenhum identificador pessoal é armazenado. Sem cookies. Visitante único do dia é calculado a partir de um hash irreversível, não do IP bruto. Isso mantém total aderência à Politica_Privacidade_PEIx §8 ("cookies estritamente necessários... não utilizamos cookies de rastreamento") sem precisar alterar o texto nem adicionar banner de consentimento.

## 2. Modelo de Dados

Duas tabelas novas em `schema.prisma`, isoladas das tabelas de negócio (`leads`, `diagnosticos`, `posts`):

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `analytics_pageviews` | id, path, referrer (nullable), utm_source (nullable), utm_medium (nullable), utm_campaign (nullable), visitante_hash (string), pais (nullable, via header `CF-IPCountry` ou similar), dispositivo (enum: `desktop` / `mobile` / `tablet`), criado_em | `visitante_hash` = SHA-256(IP + User-Agent + data do dia + salt secreto). Sem salvar IP nem UA brutos. O hash muda todo dia — impede reidentificação ao longo do tempo, mas ainda permite contar "visitantes únicos por dia". |
| `analytics_eventos` | id, tipo (enum: `diagnostico_concluido` / `formulario_enviado` / `newsletter_inscrita` / `post_lido`), path, visitante_hash, metadata (jsonb, opcional — ex.: categoria do resultado do diagnóstico), criado_em | Eventos de conversão, disparados pelo próprio backend no momento em que a ação já acontece (não precisa de chamada extra do cliente) |

Retenção: `criado_em` mais antigo que 13 meses pode ser purgado por um job periódico (mesmo padrão de dado agregado que GA4 usa por padrão) — mantém a tabela pequena indefinidamente, dado o volume esperado.

## 3. Coleta de Dados

**Pageviews — via Next.js Middleware, não script client-side:**

1. `middleware.ts` intercepta requisições de página (exclui `/admin/*`, assets estáticos e API routes).
2. Calcula `visitante_hash` a partir do IP (do header `X-Forwarded-For` do Railway) + User-Agent + data — nunca persiste os valores brutos.
3. Grava de forma assíncrona/best-effort (mesmo padrão `enviarEmailsSemBloquear` já usado para e-mail em v1.2 — não pode atrasar nem quebrar a resposta da página se a escrita falhar).

> **Nota da implementação real (ver Arquitetura_Tecnica v1.8 §3):** essa parte do desenho original mudou — o `middleware.ts` roda em runtime Edge (necessário para o cookie de sessão do admin com Web Crypto) e o Prisma não funciona em Edge sem um driver adapter que o projeto não usa. A coleta foi implementada com um beacon client-side (`navigator.sendBeacon`) chamando `POST /api/track`, um Route Handler comum em runtime Node.js — mesma ideia de "sem cookie, sem script de terceiro", só que via chamada first-party em vez de middleware.

Vantagem sobre script client-side: não é bloqueado por ad blockers/extensões de privacidade (que descartariam boa parte dos dados do GA4), não exige nenhum JS extra carregado no navegador do visitante, e não deixa rastro nenhum no lado do cliente.

**Eventos de conversão — direto do backend, no momento em que já acontecem:**

- `POST /api/diagnostico` (RF-DIAG) → ao salvar o diagnóstico, grava também `analytics_eventos` tipo `diagnostico_concluido`.
- `POST /api/leads` (formulário) → grava `formulario_enviado`.
- Confirmação de double opt-in da newsletter → grava `newsletter_inscrita`.

Não precisa de rota de tracking separada nem de chamada adicional do frontend — o evento nasce onde a ação de negócio já é processada.

## 4. Agregação e Consulta

Sem necessidade de camada de agregação prévia (cron de rollup) no volume esperado de um site institucional — queries diretas em `analytics_pageviews`/`analytics_eventos` com `GROUP BY` respondem em tempo aceitável no Postgres do Railway. Se o volume crescer muito, uma tabela de rollup diário (`analytics_diario`) pode ser adicionada depois sem mudar o restante do desenho.

> **Nota da implementação real:** a agregação foi feita em memória (JS), não em SQL bruto — nenhuma outra parte do código usa `$queryRaw`, e evita depender de convenção de nome de coluna. Ver `src/lib/analytics-queries.ts`.

## 5. Dashboard no Painel Admin

> **Nota da implementação real:** o dashboard **não** ficou numa página `/admin/analytics` separada como descrito abaixo — foi incorporado ao dashboard raiz (`/admin`) numa revisão durante a mesma sessão, porque a página inicial do admin era só uma grade estática de contadores sem muito propósito próprio. Ver Requisitos_Site_PEIx v1.10, RF-ADMIN-04.

Componentes do MVP:

1. Cartões de resumo — visitas, visitantes únicos, taxa de conclusão do diagnóstico, no período selecionado.
2. Gráfico de linha — visitas por dia (SVG próprio na implementação final, sem lib externa).
3. Tabela — páginas mais vistas.
4. Tabela — origem de tráfego (referrer/UTM), útil para saber se uma campanha específica está trazendo lead.
5. Funil simples — visita → diagnóstico concluído → lead capturado.

Seletor de período (7/30/90 dias) reaproveitado nos quatro componentes.

## 6. Escopo Explicitamente Fora do MVP

Para não repetir o erro de tentar reconstruir o GA4 inteiro:

- Sem "tempo real" (visitantes agora navegando) — não é útil para o perfil de uso (admin olha 1x por semana, não fica monitorando ao vivo).
- Sem detecção sofisticada de bot/spam — filtro simples por User-Agent (excluir bots conhecidos: Googlebot, bingbot, etc.) resolve a maior parte do ruído sem virar projeto à parte.
- Sem segmentação avançada nem A/B testing — fora do escopo de um site institucional deste porte.
- Sem exportação/API pública dos dados nesta fase.

## 7. Esforço Estimado

| Etapa | Estimativa |
| --- | --- |
| Schema Prisma + migration | 0,5 dia |
| Middleware/rota de coleta de pageview + hash de visitante | 0,5 dia |
| Instrumentação dos 3 eventos de conversão nas rotas já existentes | 0,5 dia |
| Rotas/queries de agregação | 0,5 dia |
| Dashboard (5 componentes) | 1 dia |
| **Total MVP** | **~3 dias** |

## 8. Conformidade com a Politica_Privacidade_PEIx

Nenhuma alteração de texto necessária na política atual. Ponto de atenção único: se no futuro o time quiser guardar o IP bruto (não o hash) para qualquer finalidade, aí sim a seção 8 precisaria ser revista antes — o desenho acima evita essa necessidade desde o início.
