"use client";

// El amanecer en los Andes dibujado en la GPU con vgpu: una cordillera 3D (terreno.wgsl) y el sol
// (paisaje.wgsl). Ocupa la caja que le dan (`className`); el cielo es transparente y lo pone el CSS.
// Sin WebGPU queda un respaldo en CSS (el resplandor del sol y la bruma), sin imágenes.
//
// Carga suave: con `carga`, una pantalla de carga tapa todo hasta que la cordillera está dibujada (o 4 s
// como tope); recién ahí se desvanece y la página arranca su intro (`html[data-listo]`).
//
// Optimizado para no pesar:
// - las dos pipelines se precompilan antes del primer cuadro (sin tirón al aparecer);
// - la cordillera (raymarching, lo caro) se dibuja una vez en un target a 1x y otra sólo si cambia el tamaño;
// - cada cuadro sólo compone el sol y los rayos sobre ese target, a 30 cuadros por segundo;
// - fuera de pantalla no se dibuja; en celular todo va a 1x; con "reducir movimiento" queda quieto.
// ponytail: copia en apps/landing/src/Paisaje3D.tsx; si cambia una, cambia la otra.
import { useEffect, useRef, useState } from "react";
import { clock, effect, frameLoop, init, sampler, surface, target } from "vgpu";
import type { FrameLoopHandle } from "vgpu";
import terrenoShader from "./terreno.wgsl";
import paisajeShader from "./paisaje.wgsl";

const CUADRO_MS = 1000 / 30;
const TOPE_CARGA_MS = 4000;

/** Alto de la cordillera en px según el ancho: crece con la pantalla, entre 190 y 380. */
const altoPx = (ancho: number) => Math.min(380, Math.max(190, ancho * 0.26));

type Estado = "cargando" | "gpu" | "sin-gpu";

/** Pantalla de carga: el sol respirando sobre el marino, hasta que el paisaje está listo. */
function PantallaCarga({ visible }: { visible: boolean }) {
  const [montada, setMontada] = useState(true);
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => setMontada(false), 650);
    return () => clearTimeout(t);
  }, [visible]);
  if (!montada) return null;
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-navy-deep transition-opacity duration-500 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="size-24 rounded-full motion-safe:animate-pulse" style={{ background: "radial-gradient(circle, #FFF3D6 0 18%, #FFD98Acc 30%, #F2AE2E33 55%, #F2AE2E00 70%)" }} />
      <span className="text-[17px] font-bold tracking-[0.04em] text-white">Saltar</span>
    </div>
  );
}

/** `solX`: dónde sale el sol (uv). `alto`: multiplica el alto de la cordillera. `carga`: muestra la pantalla de carga. */
export function Paisaje3D({ className = "", solX = 0.5, alto: altoExtra = 1, carga = false }: { className?: string; solX?: number; alto?: number; carga?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [tope, setTope] = useState(false);

  // La pantalla de carga nunca se queda: a los 4 s se va igual.
  useEffect(() => {
    if (!carga) return;
    const t = setTimeout(() => setTope(true), TOPE_CARGA_MS);
    return () => clearTimeout(t);
  }, [carga]);

  const listo = estado !== "cargando" || tope;
  useEffect(() => {
    if (carga && listo) document.documentElement.dataset.listo = "1";
  }, [carga, listo]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const celular = window.matchMedia("(pointer: coarse)").matches;
    let cerrado = false;
    let visible = true;
    let avisado = false;
    let loop: FrameLoopHandle | undefined;
    let gpu: Awaited<ReturnType<typeof init>> | undefined;

    const observador = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    observador.observe(canvas);

    (async () => {
      try {
        gpu = await init();
        if (cerrado) return gpu.dispose();
        const lienzo = surface(gpu, canvas, { dpr: celular ? [1, 1] : [1, 1.5] });

        const medidas = () => {
          const w = Math.max(Math.round(canvas.clientWidth), 1);
          const h = Math.max(Math.round(canvas.clientHeight), 1);
          const px = altoPx(w) * altoExtra;
          const alto = Math.min(px / h, 0.9);
          const horiz = alto * 0.3;
          return {
            tam: [w, h] as const,
            aspect: w / h,
            alto,
            horiz,
            // El terreno base sube ~0.2 de tangente sobre el horizonte; se escala para llegar a `alto`.
            escala: ((alto - horiz) * 0.9) / 0.2,
            solY: alto * 0.62,
            solR: (px * 0.17) / h,
          };
        };

        let m = medidas();
        const cordillera = target(gpu, { size: m.tam });
        const terreno = effect(gpu, terrenoShader, { label: "terreno" });
        const paisaje = effect(gpu, paisajeShader, { label: "paisaje" });
        const filtro = sampler(gpu, { minFilter: "linear", magFilter: "linear" });
        // Precompilar antes del primer cuadro: el paisaje aparece entero, sin tirón.
        await Promise.all([terreno.compile(cordillera), paisaje.compile(lienzo)]);
        if (cerrado) return;
        const aplicar = () => {
          terreno.set({ params: { aspect: m.aspect, alto: m.alto, horiz: m.horiz, escala: m.escala, solX, solY: m.solY } });
          paisaje.set({ params: { time: 0, aspect: m.aspect, scroll: 0, solX, solY: m.solY, solR: m.solR }, src: cordillera, samp: filtro });
        };
        aplicar();
        let sucio = true; // la cordillera hay que (re)dibujarla
        lienzo.onResize(() => {
          m = medidas();
          cordillera.resize(m.tam);
          aplicar();
          sucio = true;
        });

        const reloj = clock(gpu);
        let ultimo = -Infinity;
        loop = frameLoop(gpu, (frame) => {
          const ahora = performance.now();
          if (!sucio && (!visible || ahora - ultimo < CUADRO_MS)) return;
          ultimo = ahora;
          if (sucio) {
            frame.pass(cordillera, terreno);
            sucio = false;
          }
          const r = canvas.getBoundingClientRect();
          const scroll = quieto ? 0 : Math.min(Math.max(-r.top / Math.max(r.height, 1), 0), 1);
          paisaje.set({ params: { time: quieto ? 0 : reloj.time, scroll } });
          frame.pass(lienzo, paisaje);
          if (!avisado) {
            avisado = true;
            // Un cuadro más para que el primero ya esté en pantalla antes de mostrarlo.
            requestAnimationFrame(() => !cerrado && setEstado("gpu"));
          }
        });
      } catch {
        if (!cerrado) setEstado("sin-gpu");
      }
    })();

    return () => {
      cerrado = true;
      observador.disconnect();
      loop?.stop();
      gpu?.dispose();
    };
  }, [solX, altoExtra]);

  return (
    <>
      {estado === "sin-gpu" && (
        // Respaldo sin WebGPU, todo en CSS: el resplandor del sol y la bruma del horizonte.
        <div aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${className}`}>
          <div
            className="absolute bottom-0 aspect-square w-[min(90vw,720px)] -translate-x-1/2 translate-y-1/3"
            style={{ left: `${solX * 100}%`, background: "radial-gradient(circle, #FFF3D6 0 9%, #FFD98Acc 13%, #F2AE2E40 30%, #F2AE2E00 60%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4" style={{ background: "linear-gradient(to top, #8C98C8cc, #8C98C800)" }} />
        </div>
      )}
      <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute block transition-opacity duration-700 ${estado === "gpu" ? "opacity-100" : "opacity-0"} ${className}`} />
      {carga && <PantallaCarga visible={!listo} />}
    </>
  );
}
