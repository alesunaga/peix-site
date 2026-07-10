// src/components/ui/Eyebrow.tsx
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
      {children}
    </p>
  );
}
