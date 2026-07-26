"use client";

// src/components/admin/PostForm.tsx — RF-ADMIN-05, RF-ADMIN-09
//
// Editor Markdown com preview em tempo real lado a lado. O HTML do preview
// vem sempre de /api/admin/posts/preview (sanitizado no backend — nunca
// renderizamos Markdown->HTML no cliente, ver src/lib/markdown.ts).

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { gerarSlug } from "@/lib/slug";
import { POST_CATEGORIA_LABELS } from "@/lib/labels";

const CATEGORIAS = Object.entries(POST_CATEGORIA_LABELS);

const STATUS_OPCOES = [
  { valor: "RASCUNHO", label: "Rascunho" },
  { valor: "PUBLICADO", label: "Publicado" },
];

export type ValoresPost = {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  status: string;
};

const VAZIO: ValoresPost = {
  titulo: "",
  slug: "",
  resumo: "",
  conteudo: "",
  categoria: "INCLUSAO",
  status: "RASCUNHO",
};

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

    const payload = {
      titulo: valores.titulo,
      slug: valores.slug || undefined,
      resumo: valores.resumo,
      conteudo: valores.conteudo,
      categoria: valores.categoria,
      status: valores.status,
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
