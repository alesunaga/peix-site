// src/lib/r2.ts — RF-ADMIN-10
//
// Upload de imagens de capa de post para o Cloudflare R2 (compatível com a
// API S3). Mesma escolha de infraestrutura já validada no sistema PEIx
// (produto) — ver Arquitetura_Tecnica_Site_PEIx v1.0, §1.
//
// Variáveis de ambiente exigidas: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET, R2_ENDPOINT, R2_PUBLIC_URL (base pública para servir o objeto —
// domínio customizado ou URL pública `*.r2.dev` do bucket).

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

function clienteR2() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error("Credenciais do R2 não configuradas no ambiente.");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

/**
 * Envia o buffer da imagem de capa para o R2 sob a chave
 * `capas/{postId}/{uuid}.{extensao}` e retorna a URL pública final.
 * O nome do objeto nunca reaproveita o nome original do arquivo enviado
 * pelo cliente (evita path traversal e colisão entre posts).
 */
export async function enviarImagemCapaParaR2(params: {
  postId: string;
  buffer: Buffer;
  extensao: string;
  contentType: string;
}): Promise<string> {
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!bucket || !publicUrl) {
    throw new Error("R2_BUCKET / R2_PUBLIC_URL não configurados no ambiente.");
  }

  const chave = `capas/${params.postId}/${randomUUID()}.${params.extensao}`;

  const client = clienteR2();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: chave,
      Body: params.buffer,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicUrl.replace(/\/+$/, "")}/${chave}`;
}
