# Status de Implementação — Proposta de Modo de Alto Contraste

Este arquivo existe porque o documento original `Proposta_Modo_Alto_Contraste_Site_PEIx.md` é mantido **inalterado** como registro histórico da proposta (mesmo padrão de versionamento por adendo já usado nos demais documentos do projeto — nunca se edita uma versão anterior, só se acrescenta uma nova). O status abaixo é o adendo equivalente.

## Resumo

**✅ Aceita e implementada.** Formalizada em `Requisitos_Site_PEIx_v1_9.md` como:

- **RF-SITE-07** — o alternador de "Modo de Contraste" com três estados (`default`, `high-contrast-dark`, `high-contrast-light`), exatamente como especificado nas §2–§4 da proposta original.
- **RF-SITE-08** *(decisão nova, fora do escopo original da proposta)* — troca do **logotipo da marca** por tema, necessária porque os três estados de contraste alternam entre fundo escuro e fundo branco:
  - `default` e `high-contrast-dark` (fundo escuro) → logo **branco**.
  - `high-contrast-light` (fundo branco) → logo **preto**.
  - Troca por CSS puro (`[data-theme="high-contrast-light"]` em `globals.css`), sem JavaScript — mesma filosofia "zero mudança de markup, só CSS" já usada na proposta original para os demais componentes.
- **RN-SITE-05** — uma terceira versão do logo (gradiente branco→índigo, cogitada para a seção Hero) foi descartada do site em produção, em qualquer tema, para manter uma única identidade de marca e não conflitar com a exigência de formas sólidas (sem gradiente/blur) do modo de alto contraste.

## Arquivos entregues

- `src/app/globals.css` — tokens e overrides de `[data-theme]` (seção "MODO DE ALTO CONTRASTE"), exatamente como no §3–§4 da proposta original.
- `src/app/layout.tsx` — script anti-flash `beforeInteractive`.
- `src/components/ui/ThemeToggle.tsx` — alternador dos 3 estados.
- `src/components/site/Logo.tsx` — troca de logo por tema (novo, fora do escopo original).
- `public/logo/peix-mark-white.png`, `public/logo/peix-mark-black.png` — assets do logo (novo, fora do escopo original).

## Build e deploy

`npm run build` validado em produção (compilou, lint e typecheck ok, 38 páginas geradas sem erro). Commit realizado e enviado para `origin/main`.

Ver `Requisitos_Site_PEIx_v1_9.md` (linha da versão 1.9 na tabela de versões, §4.1 RF-SITE-07/08, §6 RN-SITE-05, §8 Status de Implementação) para o registro completo e definitivo.
