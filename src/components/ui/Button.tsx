// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "accent";

const styles: Record<Variant, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/40",
  secondary:
    "bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10",
  accent:
    "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-purple-950/40",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

export function Button({
  variant = "primary",
  withArrow = false,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; withArrow?: boolean }) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {props.children}
      {withArrow && <ArrowRight size={16} aria-hidden />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  withArrow = false,
  className = "",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  withArrow?: boolean;
  href: string;
}) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
      {withArrow && <ArrowRight size={16} aria-hidden />}
    </Link>
  );
}
