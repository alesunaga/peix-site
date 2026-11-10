"use client";

// src/components/site/AlunoOrbita.tsx
//
// Modelo orbital 3D do Hero: o aluno no centro e, ao redor dele, quem conhece
// um pedaço dele. Ilustra a tese da Home ("Ninguém, sozinho, conhece esse
// aluno por inteiro") e o conceito de "modelo vivo do aluno".
//
// Dois anéis, em planos diferentes (explicados na legenda abaixo do modelo):
//   - interno (linha cheia): quem usa a plataforma — professora regente,
//     professor de AEE, acompanhante e família;
//   - externo (linha tracejada): profissionais de saúde e terapias, que NÃO têm
//     acesso à plataforma; os relatórios e laudos deles é que alimentam o
//     contexto do aluno.
//
// Só os ícones ficam visíveis; ao passar o mouse (ou focar com o teclado, ou
// tocar) aparece uma caixa com uma breve descrição. Arrastar gira o modelo;
// o zoom é feito pelos botões + e −, pela pinça ou por Ctrl + roda do mouse.
//
// A projeção 3D é feita à mão (sem biblioteca): a cada quadro calculamos a
// posição de cada ponto e escrevemos direto no DOM, sem re-renderizar o React.
// Cada ponto é um <button>, então teclado e leitor de tela funcionam; a
// descrição de cada um também existe em texto oculto (sr-only).
//
// Dados fictícios. Nenhum número de resultado é afirmado aqui (RN-HOME-02).
//
// Movimento: há botão de pausa (WCAG 2.2.2); o giro automático também para
// com o mouse sobre um ponto. Com prefers-reduced-motion o modelo começa
// parado (o usuário pode girar à mão ou apertar "Retomar"). Esc fecha a caixa
// de texto (WCAG 1.4.13).
// O estilo das linhas, da caixa e do alto contraste vive em globals.css, na
// seção "MODELO ORBITAL".
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Hand,
  HandHelping,
  Home,
  Mic,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Anel = "interno" | "externo";

type Pessoa = {
  id: string;
  label: string;
  icon: LucideIcon;
  anel: Anel;
  /** Ângulo inicial no anel, em graus. */
  angulo: number;
  tag: string;
  desc: string;
};

const TAG_INTERNO = "Usa a plataforma";
const TAG_EXTERNO = "Por relatórios e laudos";
const NOTA_EXTERNA = "Não acessa a plataforma.";

const CENTRO = {
  id: "centro",
  label: "O aluno",
  tag: "No centro",
  desc: "O que ele conta sobre si alimenta o plano e as sugestões que a equipe recebe. Nada sobre ele, sem ele.",
};

const PESSOAS: Pessoa[] = [
  {
    id: "regente",
    label: "Professora regente",
    icon: Users,
    anel: "interno",
    angulo: -90,
    tag: TAG_INTERNO,
    desc: "Atende a turma inteira, e o aluno dentro dela. Recebe sugestões que partem do que o próprio estudante declarou.",
  },
  {
    id: "aee",
    label: "Professor de AEE",
    icon: BookOpen,
    anel: "interno",
    angulo: 0,
    tag: TAG_INTERNO,
    desc: "Atende individualmente o aluno na sala de recursos. Reúne as visões de todos para elaborar e revisar o PEI e o PAEE.",
  },
  {
    id: "acompanhante",
    label: "Acompanhante",
    icon: Hand,
    anel: "interno",
    angulo: 90,
    tag: TAG_INTERNO,
    desc: "Vê o minuto a minuto que ninguém mais vê, e contribui com o que observa no dia a dia.",
  },
  {
    id: "familia",
    label: "Família",
    icon: Home,
    anel: "interno",
    angulo: 180,
    tag: TAG_INTERNO,
    desc: "Vê o sono, o que funcionou no ano passado, o interesse que ninguém na escola sabe que existe. Acompanha pelo portal.",
  },
  {
    id: "fono",
    label: "Fonoaudiologia",
    icon: Mic,
    anel: "externo",
    angulo: -45,
    tag: TAG_EXTERNO,
    desc: `Acompanha comunicação e linguagem nas sessões de terapia. ${NOTA_EXTERNA}`,
  },
  {
    id: "psicologia",
    label: "Psicologia",
    icon: Brain,
    anel: "externo",
    angulo: 45,
    tag: TAG_EXTERNO,
    desc: `Acompanha o desenvolvimento emocional e comportamental. ${NOTA_EXTERNA}`,
  },
  {
    id: "to",
    label: "Terapia ocupacional",
    icon: HandHelping,
    anel: "externo",
    angulo: 135,
    tag: TAG_EXTERNO,
    desc: `Acompanha autonomia, coordenação e integração sensorial no dia a dia. ${NOTA_EXTERNA}`,
  },
  {
    id: "medicos",
    label: "Médicos",
    icon: Stethoscope,
    anel: "externo",
    angulo: 225,
    tag: TAG_EXTERNO,
    desc: `Veem o quadro clínico e emitem diagnósticos e laudos. ${NOTA_EXTERNA}`,
  },
];

// ---------------------------------------------------------------------------
// Geometria 3D
// ---------------------------------------------------------------------------

type V3 = [number, number, number];

const rad = (g: number) => (g * Math.PI) / 180;

function rotX(v: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}
function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}
function rotZ(v: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}

/** Cada anel mora num plano próprio (efeito de giroscópio). */
const ANEIS: Record<
  Anel,
  { raio: number; velocidade: number; rx: number; ry: number; rz: number }
> = {
  interno: { raio: 0.56, velocidade: 0.16, rx: rad(42), ry: 0, rz: rad(18) },
  externo: { raio: 1, velocidade: -0.1, rx: rad(12), ry: rad(40), rz: rad(-14) },
};

function pontoNoAnel(anel: Anel, graus: number, fase: number): V3 {
  const a = ANEIS[anel];
  const t = rad(graus) + fase;
  let p: V3 = [a.raio * Math.cos(t), a.raio * Math.sin(t), 0];
  p = rotX(p, a.rx);
  p = rotY(p, a.ry);
  p = rotZ(p, a.rz);
  return p;
}

const DIST = 4.2; // distância da câmera (perspectiva)
const ESCALA = 0.66; // fração do meio-palco ocupada pelo raio 1
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.2;
const POSE_INICIAL = { yaw: -0.35, pitch: 0.3 };
const SEGMENTOS = 72;
const OSC_AMPLITUDE = 0.45; // rad (≈ 26°)
const OSC_VELOCIDADE = 0.35; // rad/s (um ciclo ≈ 18 s)

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const INTERNOS = PESSOAS.filter((p) => p.anel === "interno");
const EXTERNOS = PESSOAS.filter((p) => p.anel === "externo");

export function AlunoOrbita() {
  const uid = useId();
  const [pausado, setPausado] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);

  const palcoRef = useRef<HTMLDivElement>(null);
  const caixaRef = useRef<HTMLDivElement>(null);
  const nosRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const aneisSvgRef = useRef<Record<Anel, SVGPathElement | null>>({
    interno: null,
    externo: null,
  });
  const raiosRef = useRef<Record<string, SVGLineElement | null>>({});
  const cordasRef = useRef<(SVGLineElement | null)[]>([]);
  const desenharRef = useRef<() => void>(() => {});
  const ultimoToque = useRef<string>("mouse");
  const ativoAoPressionar = useRef<string | null>(null);

  const estado = useRef({
    yaw: POSE_INICIAL.yaw,
    pitch: POSE_INICIAL.pitch,
    vyaw: 0,
    vpitch: 0,
    zoom: 1,
    zoomAlvo: 1,
    fase: { interno: 0, externo: 0 },
    osc: 0,
    arrastando: false,
    pausado: false,
    ativo: null as string | null,
    pos: {} as Record<string, { x: number; y: number }>,
  });

  // Espelha o estado do React no estado "quente" lido pelo laço de animação.
  estado.current.pausado = pausado;
  estado.current.ativo = ativo;

  const aproximar = useCallback((delta: number) => {
    const s = estado.current;
    s.zoomAlvo = clamp(s.zoomAlvo + delta, ZOOM_MIN, ZOOM_MAX);
  }, []);

  const restaurar = useCallback(() => {
    const s = estado.current;
    s.zoomAlvo = 1;
    s.yaw = POSE_INICIAL.yaw;
    s.pitch = POSE_INICIAL.pitch;
    s.vyaw = 0;
    s.vpitch = 0;
  }, []);

  // Laço de animação + interação (arrastar, pinça, Ctrl + roda, Esc).
  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    const s = estado.current;

    // Com prefers-reduced-motion o modelo começa parado; o botão "Retomar"
    // continua disponível para quem quiser ligar o movimento.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPausado(true);
    }

    const desenhar = () => {
      const W = palco.clientWidth;
      if (!W) return;
      const base = (W / 2) * ESCALA * s.zoom;
      const pct = (px: number) => 50 + (px / W) * 100;

      const projetar = (p: V3) => {
        // O giro automático é uma oscilação suave em torno da pose escolhida
        // (nunca deixa os anéis de perfil sozinho); arrastar muda a pose.
        const yaw = s.yaw + OSC_AMPLITUDE * Math.sin(s.osc * OSC_VELOCIDADE);
        const q = rotX(rotY(p, yaw), s.pitch);
        const k = DIST / (DIST - q[2]);
        return { x: q[0] * k * base, y: q[1] * k * base, z: q[2] };
      };

      const proj: Record<string, { x: number; y: number; z: number }> = {};

      for (const p of PESSOAS) {
        const q = projetar(pontoNoAnel(p.anel, p.angulo, s.fase[p.anel]));
        proj[p.id] = q;
        s.pos[p.id] = { x: q.x, y: q.y };
        const t = (clamp(q.z, -1, 1) + 1) / 2; // 0 = atrás, 1 = na frente
        const el = nosRef.current[p.id];
        if (el) {
          const k = (0.8 + 0.4 * t) * Math.sqrt(s.zoom);
          el.style.transform = `translate(calc(-50% + ${q.x.toFixed(2)}px), calc(-50% + ${q.y.toFixed(2)}px)) scale(${k.toFixed(3)})`;
          el.style.opacity = String(0.55 + 0.45 * t);
          el.style.zIndex = s.ativo === p.id ? "900" : String(10 + Math.round(t * 100));
        }
        const raio = raiosRef.current[p.id];
        if (raio) {
          raio.setAttribute("x2", pct(q.x).toFixed(2));
          raio.setAttribute("y2", pct(q.y).toFixed(2));
        }
      }
      s.pos[CENTRO.id] = { x: 0, y: 0 };

      // Cordas entre os pontos do anel interno
      INTERNOS.forEach((p, i) => {
        const a = proj[p.id];
        const b = proj[INTERNOS[(i + 1) % INTERNOS.length].id];
        const el = cordasRef.current[i];
        if (el) {
          el.setAttribute("x1", pct(a.x).toFixed(2));
          el.setAttribute("y1", pct(a.y).toFixed(2));
          el.setAttribute("x2", pct(b.x).toFixed(2));
          el.setAttribute("y2", pct(b.y).toFixed(2));
        }
      });

      // Circunferência de cada anel
      (Object.keys(ANEIS) as Anel[]).forEach((anel) => {
        const el = aneisSvgRef.current[anel];
        if (!el) return;
        let d = "";
        for (let i = 0; i <= SEGMENTOS; i++) {
          const q = projetar(pontoNoAnel(anel, (i / SEGMENTOS) * 360, 0));
          d += `${i === 0 ? "M" : "L"}${pct(q.x).toFixed(2)} ${pct(q.y).toFixed(2)} `;
        }
        el.setAttribute("d", d);
      });

      // Caixa de texto, junto do ponto ativo
      const caixa = caixaRef.current;
      if (caixa && s.ativo && s.pos[s.ativo]) {
        const { x, y } = s.pos[s.ativo];
        const cx = W / 2 + x;
        const cy = W / 2 + y;
        const w = caixa.offsetWidth;
        const h = caixa.offsetHeight;
        const folga = 36;
        let top = y < 0 ? cy + folga : cy - folga - h;
        top = clamp(top, 4, Math.max(4, W - h - 4));
        const left = clamp(cx - w / 2, 4, Math.max(4, W - w - 4));
        caixa.style.left = `${left}px`;
        caixa.style.top = `${top}px`;
      }
    };
    desenharRef.current = desenhar;

    let raf = 0;
    let anterior = performance.now();
    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - anterior) / 1000);
      anterior = agora;

      const automatico = !s.pausado && !s.arrastando && !s.ativo;
      if (automatico) {
        s.fase.interno += ANEIS.interno.velocidade * dt;
        s.fase.externo += ANEIS.externo.velocidade * dt;
        s.osc += dt;
      }
      if (!s.arrastando) {
        s.yaw += s.vyaw * dt;
        s.pitch = clamp(s.pitch + s.vpitch * dt, -1.3, 1.3);
        const amortecer = Math.exp(-dt * 3);
        s.vyaw *= amortecer;
        s.vpitch *= amortecer;
        if (Math.abs(s.vyaw) < 0.001) s.vyaw = 0;
        if (Math.abs(s.vpitch) < 0.001) s.vpitch = 0;
      }
      s.zoom += (s.zoomAlvo - s.zoom) * Math.min(1, dt * 10);

      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    desenhar();
    raf = requestAnimationFrame(quadro);

    // --- arrastar (1 dedo/mouse) e pinça (2 dedos) --------------------------
    const ponteiros = new Map<number, { x: number; y: number }>();
    let distPinca = 0;
    let zoomPinca = 1;
    let ultimoMovimento = 0;

    const dist = () => {
      const [a, b] = [...ponteiros.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const aoPressionar = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ponteiros.size === 1) {
        s.arrastando = true;
        s.vyaw = 0;
        s.vpitch = 0;
      } else if (ponteiros.size === 2) {
        s.arrastando = false;
        distPinca = dist() || 1;
        zoomPinca = s.zoomAlvo;
      }
    };
    const aoMover = (e: PointerEvent) => {
      const anterior = ponteiros.get(e.pointerId);
      if (!anterior) return;
      const atual = { x: e.clientX, y: e.clientY };
      ponteiros.set(e.pointerId, atual);
      if (ponteiros.size === 1) {
        const dx = atual.x - anterior.x;
        const dy = atual.y - anterior.y;
        s.yaw += dx * 0.008;
        s.pitch = clamp(s.pitch + dy * 0.008, -1.3, 1.3);
        s.vyaw = dx * 0.008 * 60;
        s.vpitch = dy * 0.008 * 60;
        ultimoMovimento = e.timeStamp;
      } else if (ponteiros.size === 2) {
        const alvo = clamp((zoomPinca * dist()) / distPinca, ZOOM_MIN, ZOOM_MAX);
        s.zoomAlvo = alvo;
        s.zoom = alvo;
      }
    };
    const aoSoltar = (e: PointerEvent) => {
      if (!ponteiros.delete(e.pointerId)) return;
      if (ponteiros.size === 0) {
        s.arrastando = false;
        // Parou antes de soltar: sem inércia.
        if (e.timeStamp - ultimoMovimento > 80) {
          s.vyaw = 0;
          s.vpitch = 0;
        }
      } else if (ponteiros.size === 1) {
        s.arrastando = true;
      }
    };
    const aoRoda = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // roda sozinha continua rolando a página
      e.preventDefault();
      aproximar(-e.deltaY * 0.004);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAtivo(null);
    };
    const aoClicar = (e: MouseEvent) => {
      // Toque no fundo do palco fecha a caixa (celular).
      if (!(e.target as HTMLElement).closest("button")) setAtivo(null);
    };

    palco.addEventListener("pointerdown", aoPressionar);
    palco.addEventListener("click", aoClicar);
    palco.addEventListener("wheel", aoRoda, { passive: false });
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);
    window.addEventListener("keydown", aoTeclar);
    const ro = new ResizeObserver(desenhar);
    ro.observe(palco);

    return () => {
      cancelAnimationFrame(raf);
      palco.removeEventListener("pointerdown", aoPressionar);
      palco.removeEventListener("click", aoClicar);
      palco.removeEventListener("wheel", aoRoda);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoSoltar);
      window.removeEventListener("keydown", aoTeclar);
      ro.disconnect();
    };
  }, [aproximar]);

  // Reposiciona a caixa assim que o ponto ativo muda (sem esperar o quadro).
  useEffect(() => {
    desenharRef.current();
  }, [ativo]);

  const selecionado =
    ativo === CENTRO.id
      ? CENTRO
      : (PESSOAS.find((p) => p.id === ativo) ?? null);

  const eventosDoPonto = (id: string) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setAtivo(id);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setAtivo((a) => (a === id ? null : a));
    },
    onPointerDown: (e: React.PointerEvent) => {
      ultimoToque.current = e.pointerType;
      ativoAoPressionar.current = estado.current.ativo;
    },
    onFocus: () => setAtivo(id),
    onBlur: () => setAtivo((a) => (a === id ? null : a)),
    onClick: (e: React.MouseEvent) => {
      // Mouse e teclado só abrem. No toque, o foco já abriu a caixa; tocar de
      // novo no mesmo ponto (que já estava aberto antes do toque) a fecha.
      const toque = ultimoToque.current !== "mouse" && e.detail !== 0;
      if (toque && ativoAoPressionar.current === id) setAtivo(null);
      else setAtivo(id);
    },
  });

  const botaoControle =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[520px]">
        <div
          ref={palcoRef}
          role="group"
          aria-label="O aluno no centro e, ao redor dele, as pessoas que conhecem um pedaço dele. Arraste para girar."
          className="orbit-stage relative aspect-square w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        >
          {/* Brilho de fundo atrás do aluno */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(34% 34% at 50% 50%, rgba(99,102,241,0.28), transparent 70%)",
            }}
          />

          {/* Linhas (anéis, raios e cordas) */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path
              ref={(el) => {
                aneisSvgRef.current.interno = el;
              }}
              className="orbit-line"
            />
            <path
              ref={(el) => {
                aneisSvgRef.current.externo = el;
              }}
              className="orbit-line orbit-line-dashed"
            />
            {INTERNOS.map((p, i) => (
              <line
                key={`corda-${p.id}`}
                ref={(el) => {
                  cordasRef.current[i] = el;
                }}
                className="orbit-line orbit-line-faint"
              />
            ))}
            {PESSOAS.map((p) => (
              <line
                key={`raio-${p.id}`}
                ref={(el) => {
                  raiosRef.current[p.id] = el;
                }}
                x1="50"
                y1="50"
                x2="50"
                y2="50"
                className={`orbit-line ${p.anel === "externo" ? "orbit-line-dashed" : ""}`}
              />
            ))}
          </svg>

          {/* O aluno, no centro */}
          <button
            type="button"
            aria-label={CENTRO.label}
            aria-describedby={`${uid}-centro`}
            {...eventosDoPonto(CENTRO.id)}
            className={`orbit-center absolute left-1/2 top-1/2 z-50 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-2xl shadow-indigo-950/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:h-16 sm:w-16 ${
              ativo === CENTRO.id ? "ring-2 ring-white/80" : ""
            }`}
          >
            <GraduationCap size={28} aria-hidden />
          </button>

          {/* Os pontos em órbita (posição escrita pelo laço de animação) */}
          {PESSOAS.map((p) => {
            const Icon = p.icon;
            const externo = p.anel === "externo";
            return (
              <button
                key={p.id}
                ref={(el) => {
                  nosRef.current[p.id] = el;
                }}
                type="button"
                aria-label={p.label}
                aria-describedby={`${uid}-${p.id}`}
                {...eventosDoPonto(p.id)}
                className={`absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border bg-[#0b0a1f]/90 opacity-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                  externo
                    ? "h-11 w-11 border-dashed border-white/25 text-slate-300"
                    : "h-12 w-12 border-white/15 text-indigo-300 sm:h-14 sm:w-14"
                } ${
                  ativo === p.id
                    ? "border-indigo-400 ring-2 ring-indigo-400"
                    : "hover:border-indigo-400/60"
                }`}
              >
                <Icon size={externo ? 18 : 22} aria-hidden />
              </button>
            );
          })}
        </div>

        {/* Caixa de texto: fora do palco, que corta o conteúdo no zoom */}
        <div
          ref={caixaRef}
          aria-hidden
          className={`orbit-tip pointer-events-none absolute z-[1000] w-60 max-w-[calc(100%-8px)] rounded-xl border p-3 shadow-2xl shadow-indigo-950/60 ${
            selecionado ? "" : "invisible"
          }`}
          style={{ left: 0, top: 0 }}
        >
          {selecionado && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">
                {selecionado.tag}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {selecionado.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {selecionado.desc}
              </p>
            </>
          )}
        </div>

        {/* Descrições em texto oculto, para leitor de tela */}
        {[CENTRO, ...PESSOAS].map((p) => (
          <span key={p.id} id={`${uid}-${p.id}`} className="sr-only">
            {p.tag}. {p.desc}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-1">
        <ul className="flex flex-col gap-1 text-xs text-slate-400">
          <li className="flex items-center gap-2">
            <svg aria-hidden width="24" height="4" viewBox="0 0 24 4">
              <line x1="0" y1="2" x2="24" y2="2" className="orbit-line" />
            </svg>
            Usam a plataforma
          </li>
          <li className="flex items-center gap-2">
            <svg aria-hidden width="24" height="4" viewBox="0 0 24 4">
              <line
                x1="0"
                y1="2"
                x2="24"
                y2="2"
                className="orbit-line orbit-line-dashed"
              />
            </svg>
            Contribuem por relatórios e laudos, sem acessar a plataforma
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Afastar"
            onClick={() => aproximar(-0.3)}
            className={botaoControle}
          >
            <Minus size={14} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Aproximar"
            onClick={() => aproximar(0.3)}
            className={botaoControle}
          >
            <Plus size={14} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Restaurar posição e zoom"
            onClick={restaurar}
            className={botaoControle}
          >
            <RotateCcw size={14} aria-hidden />
          </button>
          <button
            type="button"
            aria-pressed={pausado}
            aria-label={pausado ? "Retomar movimento" : "Pausar movimento"}
            onClick={() => setPausado((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {pausado ? (
              <Play size={12} aria-hidden />
            ) : (
              <Pause size={12} aria-hidden />
            )}
            {pausado ? "Retomar" : "Pausar"}
          </button>
        </div>
      </div>

      <p className="mt-2 px-1 text-xs text-slate-500">
        Arraste para girar. Passe o mouse ou toque num ícone para ver quem é.
      </p>
    </div>
  );
}
