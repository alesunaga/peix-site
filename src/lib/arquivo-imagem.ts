// src/lib/arquivo-imagem.ts — RF-ADMIN-10
//
// Detecta o tipo real de uma imagem pelos magic bytes (assinatura binária do
// arquivo), não pela extensão do nome nem pelo `Content-Type` enviado pelo
// cliente — ambos podem ser forjados. Mitiga upload de arquivo malicioso
// disfarçado de imagem (ver Arquitetura_Tecnica_Site_PEIx v1.3, §4/§10).

export type TipoImagemReal = "image/jpeg" | "image/png" | "image/webp";

const EXTENSAO_POR_TIPO: Record<TipoImagemReal, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Confere os primeiros bytes do arquivo contra as assinaturas conhecidas de
 * JPEG, PNG e WebP. Retorna `null` se não bater com nenhuma — o chamador deve
 * rejeitar o upload nesse caso, independentemente do nome/extensão/mimetype
 * declarados.
 */
export function detectarTipoImagemReal(buffer: Buffer): TipoImagemReal | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

export function extensaoParaTipo(tipo: TipoImagemReal): string {
  return EXTENSAO_POR_TIPO[tipo];
}
