"use client";

// src/components/admin/PostForm.tsx — RF-ADMIN-05, RF-ADMIN-09, RF-ADMIN-10,
// RF-ADMIN-11, RF-ADMIN-12
//
// Editor Markdown com preview em tempo real lado a lado. O HTML do preview
// vem sempre de /api/admin/posts/preview (sanitizado no backend — nunca
// renderizamos Markdown->HTML no cliente, ver src/lib/markdown.ts).
//
// Upload de capa (RF-ADMIN-10) e link de preview assinado (RF-ADMIN-11) só
// ficam disponíveis em modo "editar" — dependem de um postId já existente.

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { gerarSlug } from "@/lib/slug";
import { POST_CATEGORIA_LABELS } from "@/lib/labels";

const CATEGORIAS = Object.entries(POST_CATEGORIA_LABELS);

const STATUS_OPCOES = [
  { valor: "RASCUNHO", label: "Rascunho" },
  { valor: "AGENDADO", label: "Agendado" },
  { valor: "PUBLICADO", label: "Publicado" },
];

export type ValoresPost = {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  status: string;
  /** ISO string. Só relevante para status AGENDADO (data futura) ou já PUBLICADO (histórico). */
  publicadoEm?: string | null;
  imagemCapaUrl?: string | null;
};

const VAZIO: ValoresPost = {
  titulo: "",
  slug: "",
  resumo: "",
  conteudo: "",
  categoria: "INCLUSAO",
  status: "RASCUNHO",
  publicadoEm: null,
  imagemCapaUrl: null,
};

/** Formata uma data para o formato aceito por <input type="datetime-local">. */
function paraDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  const offset = data.getTimezoneOffset();
  const local = new Date(data.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function PostForm({
  modo,
  postId,
  valoresIniciais,
}: {
  modo: "criar" | "editar";
  postId?: string;
  valoresIniciais?: ValoresPost;
}) {
  const router = useRouter();
  const [valores, setValores] = useState<ValoresPost>(valoresIniciais ?? VAZIO);
  const [slugManual, setSlugManual] = useState(modo === "editar");
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState<"idle" | "salvando" | "erro">("idle");
  const [erro, setErro] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RF-ADMIN-12 — agendamento: <input type="datetime-local"> trabalha com
  // string local, não ISO — convertido só na hora de enviar (ver handleSubmit).
  const [dataAgendamento, setDataAgendamento] = useState(paraDatetimeLocal(valoresIniciais?.publicadoEm));

  // RF-ADMIN-10 — upload de capa.
  const [capaUrl, setCapaUrl] = useState<string | null>(valoresIniciais?.imagemCapaUrl ?? null);
  const [enviandoCapa, setEnviandoCapa] = useState(false);
  const [erroCapa, setErroCapa] = useState<string | null>(null);

  // RF-ADMIN-11 — link de preview assinado.
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
  const [gerandoLink, setGerandoLink] = useState(false);
  const [erroLink, setErroLink] = useState<string | null>(null);

  // Preview com debounce — evita bater na rota a cada tecla digitada.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const resposta = await fetch("/api/admin/posts/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conteudo: valores.conteudo }),
        });
        const corpo = await resposta.json().catch(() => null);
        setPreviewHtml(corpo?.html ?? "");
      } catch {
        // Preview é cosmético — uma falha aqui não deve travar a edição.
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [valores.conteudo]);

  function handleTituloChange(titulo: string) {
    setValores((atual) => ({
      ...atual,
      titulo,
      slug: slugManual ? atual.slug : gerarSlug(titulo),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("salvando");
    setErro(null);

    if (valores.status === "AGENDADO") {
      if (!dataAgendamento) {
        setStatus("erro");
        setErro("Informe a data/hora do agendamento.");
        return;
      }
      if (new Date(dataAgendamento) <= new Date()) {
        setStatus("erro");
        setErro("A data de agendamento precisa ser no futuro.");
        return;
      }
    }

    const payload = {
      titulo: valores.titulo,
      slug: valores.slug || undefined,
      resumo: valores.resumo,
      conteudo: valores.conteudo,
      categoria: valores.categoria,
      status: valores.status,
      publicadoEm:
        valores.status === "AGENDADO" ? new Date(dataAgendamento).toISOString() : undefined,
    };

    try {
      const resposta = await fetch(
        modo === "criar" ? "/api/admin/posts" : `/api/admin/posts/${postId}`,
        {
          method: modo === "criar" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(
          typeof corpo?.erro === "string" ? corpo.erro : "Confira os campos obrigatórios.",
        );
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (e) {
      setStatus("erro");
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o post.");
    }
  }

  async function handleUploadCapa(arquivo: File) {
    if (!postId) return;
    setEnviandoCapa(true);
    setErroCapa(null);

    try {
      const formData = new FormData();
      formData.set("arquivo", arquivo);

      const resposta = await fetch(`/api/admin/posts/${postId}/capa`, {
        method: "POST",
        body: formData,
      });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(typeof corpo?.erro === "string" ? corpo.erro : "Não foi possível enviar a imagem.");
      }

      setCapaUrl(corpo.url);
    } catch (e) {
      setErroCapa(e instanceof Error ? e.message : "Não foi possível enviar a imagem.");
    } finally {
      setEnviandoCapa(false);
    }
  }

  async function handleGerarLinkPreview() {
    if (!postId) return;
    setGerandoLink(true);
    setErroLink(null);
    setLinkPreview(null);

    try {
      const resposta = await fetch(`/api/admin/posts/${postId}/preview-link`, { method: "POST" });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(typeof corpo?.erro === "string" ? corpo.erro : "Não foi possível gerar o link.");
      }

      setLinkPreview(`${window.location.origin}${corpo.caminho}`);
    } catch (e) {
      setErroLink(e instanceof Error ? e.message : "Não foi possível gerar o link.");
    } finally {
      setGerandoLink(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Field label="Título" required>
            <input
              value={valores.titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              required
              className="input"
            />
          </Field>

          <Field label="Slug" required>
            <input
              value={valores.slug}
              onChange={(e) => {
                setSlugManual(true);
                setValores((atual) => ({ ...atual, slug: e.target.value }));
              }}
              required
              className="input"
            />
          </Field>

          <Field label="Resumo" required>
            <textarea
              value={valores.resumo}
              onChange={(e) => setValores((atual) => ({ ...atual, resumo: e.target.value }))}
              required
              rows={3}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria" required>
              <select
                value={valores.categoria}
                onChange={(e) => setValores((atual) => ({ ...atual, categoria: e.target.value }))}
                className="input"
              >
                {CATEGORIAS.map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" required>
              <select
                value={valores.status}
                onChange={(e) => setValores((atual) => ({ ...atual, status: e.target.value }))}
                className="input"
              >
                {STATUS_OPCOES.map(({ valor, label }) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {valores.status === "AGENDADO" && (
            <Field label="Publicar em" required>
              <input
                type="datetime-local"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
                min={paraDatetimeLocal(new Date(Date.now() + 60_000).toISOString())}
                required
                className="input"
              />
              <span className="mt-1 block text-xs text-slate-500">
                Um job periódico publica o post automaticamente nessa data/hora e dispara a
                newsletter (RF-ADMIN-12).
              </span>
            </Field>
          )}

          <Field label="Imagem de capa">
            {modo === "criar" || !postId ? (
              <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-500">
                Salve o post primeiro para poder enviar a imagem de capa.
              </p>
            ) : (
              <div className="space-y-2">
                {capaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={capaUrl}
                    alt="Capa do post"
                    className="h-32 w-full rounded-lg border border-white/10 object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={enviandoCapa}
                  onChange={(e) => {
                    const arquivo = e.target.files?.[0];
                    if (arquivo) handleUploadCapa(arquivo);
                    e.target.value = "";
                  }}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-slate-100 hover:file:bg-white/20"
                />
                <span className="block text-xs text-slate-500">
                  JPEG, PNG ou WebP, até 5MB. {enviandoCapa && "Enviando..."}
                </span>
                {erroCapa && <span className="block text-xs text-red-400">{erroCapa}</span>}
              </div>
            )}
          </Field>

          {modo === "editar" && postId && valores.status !== "PUBLICADO" && (
            <Field label="Link de preview">
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGerarLinkPreview}
                  disabled={gerandoLink}
                  className="!px-4 !py-2 text-xs"
                >
                  {gerandoLink ? "Gerando..." : "Gerar link de preview (válido por 7 dias)"}
                </Button>
                {linkPreview && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-indigo-300">
                    <a href={linkPreview} target="_blank" rel="noopener noreferrer" className="truncate underline">
                      {linkPreview}
                    </a>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(linkPreview)}
                      className="shrink-0 text-slate-400 hover:text-slate-200"
                    >
                      Copiar
                    </button>
                  </div>
                )}
                {erroLink && <span className="block text-xs text-red-400">{erroLink}</span>}
              </div>
            </Field>
          )}

          <Field label="Conteúdo (Markdown)" required>
            <textarea
              value={valores.conteudo}
              onChange={(e) => setValores((atual) => ({ ...atual, conteudo: e.target.value }))}
              required
              rows={18}
              className="input font-mono text-xs"
            />
          </Field>
        </div>

        <div>
          <p className="mb-1.5 text-sm text-slate-300">Preview</p>
          <div
            className="post-preview min-h-[420px] rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
            dangerouslySetInnerHTML={{
              __html:
                previewHtml ||
                '<p class="text-slate-500">O preview aparece aqui conforme você digita.</p>',
            }}
          />
        </div>
      </div>

      {status === "erro" && <p className="mt-4 text-sm text-red-400">{erro}</p>}

      <Button type="submit" disabled={status === "salvando"} className="mt-6">
        {status === "salvando" ? "Salvando..." : modo === "criar" ? "Criar post" : "Salvar alterações"}
      </Button>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1.5 block">
        {label} {required && <span className="text-indigo-400">*</span>}
      </span>
      {children}
    </label>
  );
}
