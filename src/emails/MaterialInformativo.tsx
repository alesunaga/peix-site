// src/emails/MaterialInformativo.tsx
// RF-LEAD-06 — material definido: "Material_Informativo_PEIx_Decreto_12773.pdf",
// servido estaticamente em public/materiais/decreto-12773.pdf.

type Props = { nome: string };

const LINK_MATERIAL = process.env.MATERIAL_INFORMATIVO_URL ?? "https://peix.ia.br/materiais/decreto-12773.pdf";

export default function MaterialInformativo({ nome }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1e1b3a", maxWidth: 560 }}>
      <p>Olá, {nome.split(" ")[0]},</p>
      <p>Como prometido, segue o material sobre o Decreto nº 12.773/2025 e os impactos práticos para escolas:</p>
      <p>
        <a href={LINK_MATERIAL}>Baixar material (PDF)</a>
      </p>
      <p>— Equipe PEIx</p>
    </div>
  );
}
