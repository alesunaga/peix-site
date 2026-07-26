// src/lib/tokens.ts
//
// Token de alta entropia para convite de admin (RF-ADMIN-06) e recuperação
// de senha (RF-ADMIN-08) — uso único, gerado com Web Crypto (256 bits).

export function gerarTokenSeguro(bytes: number = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);

  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
