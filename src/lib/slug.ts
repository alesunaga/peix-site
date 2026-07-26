// src/lib/slug.ts — RF-ADMIN-05

// Marcas diacriticas combinantes (acentos) apos normalize("NFD").
const MARCAS_DIACRITICAS = /[̀-ͯ]/g;

export function gerarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(MARCAS_DIACRITICAS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
