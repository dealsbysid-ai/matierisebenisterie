import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
function SocialIcons() {
    const wrapRef = useRef(null);
    useEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const items = Array.from(el.querySelectorAll(".wood-icon"));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting)
                    return;
                const target = entry.target;
                const idx = items.indexOf(target);
                const delay = Math.max(0, idx) * 140;
                window.setTimeout(() => {
                    target.classList.remove("is-hit");
                    // force reflow to restart animation
                    void target.offsetWidth;
                    target.classList.add("is-hit");
                }, delay);
                io.unobserve(target);
            });
        }, { threshold: 0.6 });
        items.forEach((i) => io.observe(i));
        return () => io.disconnect();
    }, []);
    const socials = [
        {
            href: "https://instagram.com",
            label: "Instagram",
            icon: <Instagram size={14} strokeWidth={1.75}/>,
        },
        {
            href: "https://linkedin.com",
            label: "LinkedIn",
            icon: <Linkedin size={14} strokeWidth={1.75}/>,
        },
        {
            href: "https://x.com",
            label: "X",
            icon: (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.31-6.94L4.8 22H1.54l8.02-9.17L1 2h6.91l4.8 6.34L18.244 2Zm-1.19 18h1.87L7.04 4H5.06l12 16Z"/>
        </svg>),
        },
    ];
    return (<div ref={wrapRef} className="mt-12 flex justify-center gap-3">
      {socials.map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="wood-icon">
          {s.icon}
        </a>))}
    </div>);
}
function Realisations3D({ items }) {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const [active, setActive] = useState(0);
    const [tilt, setTilt] = useState(0); // -1..1 scroll parallax
    const dragRef = useRef({
        x: 0, startActive: 0, active: false,
    });
    const n = items.length;
    // Scroll-driven tilt / entrance
    useEffect(() => {
        const el = sectionRef.current;
        if (!el)
            return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const centerDist = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
            setTilt(Math.max(-1, Math.min(1, centerDist)));
        };
        const onScroll = () => { if (!raf)
            raf = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf)
                cancelAnimationFrame(raf);
        };
    }, []);
    // Auto-advance (pauses on hover/drag)
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused)
            return;
        const id = window.setInterval(() => setActive((a) => (a + 1) % n), 4200);
        return () => window.clearInterval(id);
    }, [paused, n]);
    const go = (dir) => setActive((a) => (a + dir + n) % n);
    // Drag
    const onPointerDown = (e) => {
        dragRef.current = { x: e.clientX, startActive: active, active: true };
        e.currentTarget.setPointerCapture(e.pointerId);
        setPaused(true);
    };
    const onPointerMove = (e) => {
        if (!dragRef.current.active)
            return;
        const dx = e.clientX - dragRef.current.x;
        const step = Math.round(-dx / 90);
        const next = (dragRef.current.startActive + step + n * 10) % n;
        if (next !== active)
            setActive(next);
    };
    const onPointerUp = (e) => {
        dragRef.current.active = false;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        setTimeout(() => setPaused(false), 1500);
    };
    return (<section ref={sectionRef} id="realisations" className="relative overflow-hidden py-28 md:py-40" style={{
            background: "radial-gradient(ellipse at 50% 0%, oklch(0.28 0.05 45) 0%, oklch(0.14 0.02 40) 65%, oklch(0.10 0.015 40) 100%)",
        }}>
      {/* Wood plank floor */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[46%] pointer-events-none" style={{
            backgroundImage: `url(${walnut})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `perspective(900px) rotateX(62deg) translateY(${20 - tilt * 30}px)`,
            transformOrigin: "top center",
            filter: "brightness(0.55) saturate(1.1)",
            boxShadow: "0 -30px 60px -20px rgba(0,0,0,0.6) inset",
        }}/>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[46%] pointer-events-none" style={{
            background: "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, oklch(0.10 0.015 40) 60%, transparent) 55%, oklch(0.10 0.015 40) 100%)",
        }}/>

      {/* Grain glow line */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-1/2 h-[1px]" style={{
            background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--bronze) 60%, transparent) 40%, color-mix(in oklab, var(--bronze) 90%, white 15%) 50%, color-mix(in oklab, var(--bronze) 60%, transparent) 60%, transparent)",
            opacity: 0.35,
        }}/>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p className="eyebrow">06 · Réalisations</p>
            <h2 className="reveal-up mt-4 text-4xl md:text-6xl text-cream max-w-2xl leading-[1.05]">
              Pièces livrées, <em className="italic text-bronze">gestes gravés</em>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/60">
            Dix œuvres récentes, sorties de l'atelier ces trois dernières années —
            chacune posée sur son établi de présentation.
          </p>
        </div>

        {/* 3D Stage */}
        <div ref={stageRef} className="relative select-none touch-pan-y" style={{ perspective: "1600px", perspectiveOrigin: "50% 40%" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative mx-auto" style={{
            height: "clamp(360px, 60vh, 620px)",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt * -4}deg)`,
            transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
        }}>
            {items.map((it, i) => {
            let rel = i - active;
            if (rel > n / 2)
                rel -= n;
            if (rel < -n / 2)
                rel += n;
            const abs = Math.abs(rel);
            const visible = abs <= 3;
            const x = rel * 190; // px offset per step
            const rotY = rel * -26;
            const z = -abs * 180;
            const scale = abs === 0 ? 1 : Math.max(0.72, 1 - abs * 0.11);
            const opacity = visible ? Math.max(0.15, 1 - abs * 0.28) : 0;
            const zi = 100 - abs;
            const isActive = rel === 0;
            return (<button type="button" key={i} onClick={() => setActive(i)} aria-label={`Voir ${it.title}`} className="absolute left-1/2 top-1/2 rounded-[3px] focus:outline-none" style={{
                    width: "clamp(220px, 32vw, 380px)",
                    height: "clamp(310px, 46vw, 540px)",
                    marginLeft: "calc(-1 * clamp(220px, 32vw, 380px) / 2)",
                    marginTop: "calc(-1 * clamp(310px, 46vw, 540px) / 2)",
                    transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                    opacity,
                    zIndex: zi,
                    transition: "transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 500ms ease",
                    pointerEvents: visible ? "auto" : "none",
                    transformStyle: "preserve-3d",
                    cursor: isActive ? "grab" : "pointer",
                }}>
                  {/* Wood frame */}
                  <div className="relative h-full w-full" style={{
                    padding: "14px 14px 46px 14px",
                    backgroundImage: `url(${oak})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 4,
                    boxShadow: isActive
                        ? "0 40px 80px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 0 1px color-mix(in oklab, var(--bronze) 70%, transparent)"
                        : "0 24px 50px -18px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.35)",
                    filter: isActive ? "none" : "brightness(0.85) saturate(0.9)",
                }}>
                    <div className="relative h-full w-full overflow-hidden rounded-[2px]" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.35)" }}>
                      <img src={it.src} alt={it.title} loading="lazy" draggable={false} className="h-full w-full object-cover" style={{
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
                }}/>
                      {/* Vignette + bronze wash on non-active */}
                      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
                    background: isActive
                        ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.4) 100%)",
                }}/>
                    </div>
                    {/* Brass plaque */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1" style={{
                    background: "linear-gradient(180deg, color-mix(in oklab, var(--bronze) 90%, white 15%), color-mix(in oklab, var(--bronze) 80%, black 15%))",
                    borderRadius: 2,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.35)",
                    minWidth: "60%",
                }}>
                      <div className="text-center font-serif text-[0.75rem] md:text-sm text-ink whitespace-nowrap overflow-hidden text-ellipsis">
                        {it.title}
                      </div>
                    </div>
                  </div>

                  {/* Floor reflection */}
                  <div aria-hidden className="absolute left-0 right-0 top-full" style={{
                    height: "55%",
                    transform: "scaleY(-1)",
                    transformOrigin: "top",
                    backgroundImage: `url(${it.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.22,
                    filter: "blur(2px)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 75%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 75%)",
                    borderRadius: 4,
                }}/>
                </button>);
        })}
          </div>

          {/* Controls */}
          <div className="mt-8 md:mt-10 flex items-center justify-center gap-6">
            <button onClick={() => go(-1)} className="group flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream hover:border-bronze hover:text-bronze transition-colors" aria-label="Précédent">
              <span className="text-lg leading-none">←</span>
            </button>
            <div className="flex items-center gap-2">
              {items.map((_, i) => (<button key={i} onClick={() => setActive(i)} aria-label={`Aller à ${i + 1}`} className="h-[2px] transition-all" style={{
                width: i === active ? 28 : 12,
                background: i === active ? "var(--bronze)" : "color-mix(in oklab, var(--cream) 30%, transparent)",
            }}/>))}
            </div>
            <button onClick={() => go(1)} className="group flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream hover:border-bronze hover:text-bronze transition-colors" aria-label="Suivant">
              <span className="text-lg leading-none">→</span>
            </button>
          </div>

          {/* Active caption */}
          <div className="mt-6 text-center">
            <p className="eyebrow text-bronze">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
            <p className="mt-2 font-serif text-2xl md:text-3xl text-cream">{items[active].title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cream/50">{items[active].sub}</p>
          </div>
        </div>
      </div>
    </section>);
}
function NumbersSection() {
    const sectionRef = useRef(null);
    useEffect(() => {
        const section = sectionRef.current;
        if (!section)
            return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const centerDist = rect.top + rect.height / 2 - vh / 2;
            const range = vh / 2 + rect.height / 2;
            const p = Math.min(1, Math.max(0, 1 - centerDist / range));
            const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            section.style.setProperty("--line-p", String(eased));
        };
        const onScroll = () => { if (!raf)
            raf = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf)
                cancelAnimationFrame(raf);
        };
    }, []);
    return (<section ref={sectionRef} className="relative py-28 md:py-36 overflow-hidden" style={{ backgroundColor: "oklch(0.32 0.06 45)" }}>
      {/* Wood texture reveals left → right, tied to scroll. Its own grain lines
            act as the moving lines. Fully revealed when section hits mid-viewport. */}
      <div aria-hidden className="absolute inset-0" style={{
            clipPath: "inset(0 calc((1 - var(--line-p, 0)) * 100%) 0 0)",
            willChange: "clip-path",
        }}>
        <img src={walnut} alt="" className="h-full w-full object-cover" loading="lazy"/>
        <div className="absolute inset-0 bg-ink/45"/>
      </div>
      {/* Bright edge that rides along with the reveal front */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px]" style={{
            left: "calc(var(--line-p, 0) * 100%)",
            background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--bronze) 90%, white 20%), transparent)",
            boxShadow: "0 0 24px color-mix(in oklab, var(--bronze) 80%, transparent)",
            opacity: "calc(var(--line-p, 0) * (1 - var(--line-p, 0)) * 4)",
        }}/>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 grid gap-12 md:grid-cols-4 text-cream">

        {[
            ["1978", "Année de fondation"],
            ["3", "Générations d'ébénistes"],
            ["+400", "Pièces restaurées"],
            ["12", "Essences travaillées"],
        ].map(([n, l], i) => (<div key={l} className="reveal-up" style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="font-serif text-5xl md:text-6xl">{n}</div>
            <div className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">{l}</div>
          </div>))}
      </div>
    </section>);
}
function DraggableMarquee({ items, speed = 40 }) {
    const trackRef = useRef(null);
    const offsetRef = useRef(0);
    const halfWidthRef = useRef(0);
    const draggingRef = useRef(false);
    const lastXRef = useRef(0);
    const lastTsRef = useRef(0);
    const rafRef = useRef(null);
    useEffect(() => {
        const track = trackRef.current;
        if (!track)
            return;
        const measure = () => { halfWidthRef.current = track.scrollWidth / 2; };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(track);
        const apply = () => {
            const hw = halfWidthRef.current || 1;
            let x = offsetRef.current % hw;
            if (x > 0)
                x -= hw;
            track.style.transform = `translate3d(${x}px,0,0)`;
        };
        const tick = (ts) => {
            const last = lastTsRef.current || ts;
            const dt = (ts - last) / 1000;
            lastTsRef.current = ts;
            if (!draggingRef.current) {
                offsetRef.current -= speed * dt;
                apply();
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current)
                cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [speed]);
    const onPointerDown = (e) => {
        draggingRef.current = true;
        lastXRef.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        if (!draggingRef.current)
            return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        offsetRef.current += dx;
        const track = trackRef.current;
        if (track) {
            const hw = halfWidthRef.current || 1;
            let x = offsetRef.current % hw;
            if (x > 0)
                x -= hw;
            track.style.transform = `translate3d(${x}px,0,0)`;
        }
    };
    const endDrag = (e) => {
        draggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        catch { }
    };
    return (<div className="relative touch-pan-y select-none cursor-grab active:cursor-grabbing" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}>
      <div ref={trackRef} className="flex gap-6 w-max will-change-transform">
        {[...items, ...items].map((t, i) => (<figure key={i} className="relative w-[280px] md:w-[360px] h-[380px] md:h-[480px] shrink-0 overflow-hidden pointer-events-none">
            <img src={t.src} alt={t.label} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover"/>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5 text-cream">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-bronze">{t.latin}</p>
              <p className="mt-1 font-serif text-xl">{t.label}</p>
            </figcaption>
          </figure>))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent"/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent"/>
    </div>);
}
function useScrollReveal() {
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const targets = document.querySelectorAll(".reveal-up, .curtain, .reveal-wipe");
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting)
                    return;
                const el = e.target;
                if (el.classList.contains("curtain"))
                    el.classList.add("is-revealed");
                if (el.classList.contains("reveal-up"))
                    el.classList.add("is-visible");
                if (el.classList.contains("reveal-wipe"))
                    el.classList.add("is-wiped");
                io.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
        targets.forEach((t) => io.observe(t));
        return () => io.disconnect();
    }, []);
}
import hero from "@/assets/hero-hands.jpg";
import oak from "@/assets/wood-oak.jpg";
import walnut from "@/assets/wood-walnut.jpg";
import cherry from "@/assets/wood-cherry.jpg";
// Real workshop photography (user-uploaded reference set)
import barkRef from "@/assets/ref/c6427706.jpg.asset.json";
import tex1 from "@/assets/tex/0e5d21c5.jpg.asset.json";
import tex2 from "@/assets/tex/1a069f60.jpg.asset.json";
import tex3 from "@/assets/tex/55e96eeb.jpg.asset.json";
import tex4 from "@/assets/tex/6d598f71.jpg.asset.json";
import tex5 from "@/assets/tex/89300f67.jpg.asset.json";
import tex6 from "@/assets/tex/98e6269f.jpg.asset.json";
import tex7 from "@/assets/tex/9d92f1c8.jpg.asset.json";
import tex8 from "@/assets/tex/bab85f16.jpg.asset.json";
import tex9 from "@/assets/tex/e1445138.jpg.asset.json";
import tex10 from "@/assets/tex/e3670dcd.jpg.asset.json";
// Story photography — artisan portrait, macro details, workshop ambience
import artisanProfile from "@/assets/story/artisan-profile.jpg.asset.json";
import storyMalletChisel from "@/assets/story/mallet-chisel.jpg.asset.json";
import storyCarvingDetail from "@/assets/story/carving-detail.jpg.asset.json";
import storyPatternCarve from "@/assets/story/pattern-carve.jpg.asset.json";
import storyJoinery from "@/assets/story/joinery.jpg.asset.json";
import storyAxeShavings from "@/assets/story/axe-shavings.jpg.asset.json";
import storyMalletHands from "@/assets/story/mallet-hands.jpg.asset.json";
// Atelier slideshow — uploaded workshop photography
import slide1 from "@/assets/atelier-slide/937528cc.jpg.asset.json";
import slide2 from "@/assets/atelier-slide/880facfd.jpg.asset.json";
import slide3 from "@/assets/atelier-slide/69acfaf4.jpg.asset.json";
import slide4 from "@/assets/atelier-slide/b3e1d372.jpg.asset.json";
import slide5 from "@/assets/atelier-slide/9fa80fd6.jpg.asset.json";
import slide6 from "@/assets/atelier-slide/2c1bec21.jpg.asset.json";
// Réalisations — final work images (10 uploaded pieces)
import fw1 from "@/assets/final-work/22bb281c.jpg.asset.json";
import fw2 from "@/assets/final-work/a92b664f.jpg.asset.json";
import fw3 from "@/assets/final-work/ab697690.jpg.asset.json";
import fw4 from "@/assets/final-work/8f2f8266.jpg.asset.json";
import fw5 from "@/assets/final-work/2cec5f1d.jpg.asset.json";
import fw6 from "@/assets/final-work/07be0ecf.jpg.asset.json";
import fw7 from "@/assets/final-work/8a7e484b.jpg.asset.json";
import fw8 from "@/assets/final-work/dae7393c.jpg.asset.json";
import fw9 from "@/assets/final-work/c45fbe6a.jpg.asset.json";
import fw10 from "@/assets/final-work/c1e27364.jpg.asset.json";
const processShots = [
    { src: storyMalletChisel.url, label: "Ciseau & maillet", latin: "Gestes fondateurs", span: "md:row-span-2" },
    { src: storyCarvingDetail.url, label: "Rosace sculptée", latin: "Motif à la main", span: "" },
    { src: storyPatternCarve.url, label: "Damier sculpté", latin: "Trace du tracé", span: "" },
    { src: storyJoinery.url, label: "Assemblage à tenon", latin: "Précision millimétrique", span: "" },
    { src: storyAxeShavings.url, label: "Herminette", latin: "Copeaux vifs", span: "md:row-span-2" },
    { src: storyMalletHands.url, label: "Mains patinées", latin: "Trente ans de métier", span: "" },
];
const textures = [
    { src: tex1.url, label: "Chêne brûlé", latin: "Fibre serrée" },
    { src: tex2.url, label: "Cœur de tronc", latin: "Cernes centenaires" },
    { src: tex3.url, label: "Pin ancien", latin: "Écorce brute" },
    { src: tex4.url, label: "Bois flotté", latin: "Patine minérale" },
    { src: tex5.url, label: "Noyer veiné", latin: "Grain profond" },
    { src: tex6.url, label: "Séquoia", latin: "Corce rougeoyante" },
    { src: tex7.url, label: "Frêne rustique", latin: "Nervures verticales" },
    { src: tex8.url, label: "Écorce vive", latin: "Relief tectonique" },
    { src: tex9.url, label: "Pin sylvestre", latin: "Lichen & silice" },
    { src: tex10.url, label: "Chêne millénaire", latin: "Sillons du temps" },
];
export const Route = createFileRoute("/")({ component: Home });
const woods = {
    Chêne: { img: oak, latin: "Quercus robur", note: "Fermeté honorée, veinage franc. Le bois des cathédrales et des grands mobiliers de famille." },
    Noyer: { img: walnut, latin: "Juglans regia", note: "Profondeur chaleureuse, grain ondulant. Choix de prédilection pour les pièces d'apparat." },
    Merisier: { img: cherry, latin: "Prunus avium", note: "Rougeoiement doux qui se patine avec le temps. Le fruitier des ébénistes classiques français." },
};
function Nav({ scrolled }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (open)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);
    const menuItems = [
        { label: "Mobilier", href: "#mobilier", num: "01" },
        { label: "Restauration", href: "#restauration", num: "02" },
        { label: "L'Atelier", href: "#atelier", num: "03" },
        { label: "Matières", href: "#matieres", num: "04" },
    ];
    return (<>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${open
            ? "bg-transparent"
            : scrolled
                ? "bg-cream/90 backdrop-blur-md border-b border-border"
                : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a href="#top" className={`font-serif text-xl tracking-wide ${open ? "text-cream" : scrolled ? "text-ink" : "text-cream"}`}>
            Ébénisterie <span className="italic">Velut</span>
          </a>
          <nav className={`hidden gap-10 text-xs uppercase tracking-[0.25em] md:flex ${scrolled ? "text-ink" : "text-cream"}`}>
            <a href="#mobilier" className="hover:text-bronze transition">Mobilier</a>
            <a href="#restauration" className="hover:text-bronze transition">Restauration</a>
            <a href="#atelier" className="hover:text-bronze transition">L'Atelier</a>
            <a href="#matieres" className="hover:text-bronze transition">Matières</a>
          </nav>
          <a href="#devis" className="hidden md:inline-block border border-bronze bg-bronze px-6 py-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream hover:bg-transparent hover:text-bronze transition-colors">
            Demander un Devis
          </a>
          <button onClick={() => setOpen(!open)} className={`md:hidden relative z-50 text-xs uppercase tracking-widest transition-colors ${open ? "text-cream" : scrolled ? "text-ink" : "text-cream"}`} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}>
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>

      {/* Premium mobile menu — rendered as sibling so it is not clipped by the header */}
      <div className={`fixed inset-0 z-40 flex flex-col bg-ink md:hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!open}>
        {/* Animated top bronze line */}
        <div className={`h-[2px] bg-bronze transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "w-full" : "w-0"}`}/>

        <div className="flex-1 overflow-auto px-8 pt-28 pb-12">
          <nav className="flex flex-col">
            {menuItems.map((item, i) => (<a key={item.href} href={item.href} onClick={() => setOpen(false)} className={`group relative flex items-center justify-between border-b border-cream/10 py-6 text-cream transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:bg-cream/5 ${open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`} style={{ transitionDelay: open ? `${300 + i * 80}ms` : "0ms" }}>
                <span className="font-serif text-4xl group-hover:text-bronze group-active:text-bronze transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-bronze/60">
                  {item.num}
                </span>
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-bronze transition-all duration-500 group-hover:w-full group-active:w-full"/>
              </a>))}
          </nav>

          <a href="#devis" onClick={() => setOpen(false)} className={`mt-12 inline-flex items-center gap-3 border border-bronze bg-bronze px-8 py-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream hover:bg-transparent hover:text-bronze active:bg-transparent active:text-bronze transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: open ? "620ms" : "0ms" }}>
            Demander un Devis
            <span aria-hidden>→</span>
          </a>

          <div className={`mt-20 text-xs uppercase tracking-[0.25em] text-cream/50 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: open ? "720ms" : "0ms" }}>
            <p>Atelier — 12 rue des Tanneurs, 21200 Beaune</p>
            <p className="mt-2">
              <a href="tel:+33380000000" className="hover:text-bronze transition-colors">+33 (0)3 80 00 00 00</a>
            </p>
          </div>
        </div>

        <div className={`px-8 py-6 border-t border-cream/10 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: open ? "820ms" : "0ms" }}>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-cream/40">
            Maison fondée en 1978 · Bourgogne
          </p>
        </div>
      </div>
    </>);
}
function Home() {
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [wood, setWood] = useState("Chêne");
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const active = woods[wood];
    return (<div id="top" className="min-h-screen bg-background text-foreground">
      <Nav scrolled={scrolled}/>

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 animate-slow-zoom">
          <img src={hero} alt="Mains d'ébéniste sculptant le bois" className="h-full w-full object-cover" width={1920} height={1280}/>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"/>
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-24 md:pb-32 md:px-10">
          <p className="eyebrow text-cream/80 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Maison fondée en 1978 · Bourgogne
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl leading-[1.05] text-cream md:text-7xl lg:text-8xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
            L'Art du Geste,
            <br />
            <em className="font-light italic text-bronze">l'Âme du Bois.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base text-cream/80 md:text-lg animate-fade-up" style={{ animationDelay: "0.7s" }}>
            Ébénistes d'art au service du patrimoine et des belles demeures. Chaque pièce est
            l'aboutissement patient d'un dialogue entre la main, l'outil et la matière.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-up" style={{ animationDelay: "1s" }}>
            <a href="#devis" className="border border-cream bg-cream px-8 py-4 text-xs uppercase tracking-[0.3em] text-ink hover:bg-transparent hover:text-cream transition-colors">
              Demander un Devis
            </a>
            <a href="#mobilier" className="text-xs uppercase tracking-[0.3em] text-cream/80 border-b border-cream/40 pb-1 hover:text-bronze hover:border-bronze transition-colors">
              Découvrir l'atelier
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 text-[0.6rem] tracking-[0.4em] uppercase">
          Défiler
        </div>
      </section>

      {/* MANIFESTE — bark texture with glass card */}
      <section className="relative py-32 md:py-44">
        <div className="absolute inset-0">
          <img src={barkRef.url} alt="" className="h-full w-full object-cover" loading="lazy"/>
          <div className="absolute inset-0 bg-black/50"/>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <div className="glass-dark rounded-sm p-10 md:p-16">
            <p className="eyebrow text-bronze">Manifeste</p>
            <p className="mt-6 font-serif text-2xl leading-relaxed text-cream md:text-4xl">
              « Le bois se souvient de tout : de la forêt qui l'a vu grandir, de la main qui
              l'a taillé, du foyer qui l'a accueilli. Notre métier est de servir cette mémoire —
              silencieusement, patiemment, avec exigence. »
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cream/60">— Antoine Velut, Maître Ébéniste</p>
          </div>
        </div>
      </section>

      {/* À PROPOS — artisan portrait, fade-in on scroll */}
      <section id="apropos" className="bg-cream py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-14 md:grid-cols-[1.05fr_1fr] md:gap-20 items-center">
            <div className="reveal-up relative">
              <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth -mx-6 md:mx-0" style={{ scrollbarWidth: "none" }}>
                {[
            { src: artisanProfile.url, cap: "Antoine Velut · Atelier de Beaune" },
            { src: slide1.url, cap: "Ciseau & maillet · Le geste fondateur" },
            { src: slide2.url, cap: "Assemblage à tenon · Précision millimétrique" },
            { src: slide3.url, cap: "Herminette · Copeaux vifs" },
            { src: slide4.url, cap: "Mains patinées · Trente ans de métier" },
            { src: slide5.url, cap: "Rosace sculptée · Motif à la main" },
            { src: slide6.url, cap: "Damier sculpté · Trace du tracé" },
        ].map((s, i) => (<figure key={i} className="relative shrink-0 basis-full snap-center overflow-hidden px-6 md:px-0 md:pr-4">
                    <img src={s.src} alt={s.cap} loading={i === 0 ? "eager" : "lazy"} className="h-[520px] md:h-[680px] w-full object-cover"/>
                    <figcaption className="absolute bottom-5 left-11 md:left-5 bg-ink/70 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-cream">
                      {s.cap}
                    </figcaption>
                  </figure>))}
              </div>
              <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground md:text-left text-center">
                ← Faire glisser pour découvrir l'atelier →
              </p>
            </div>
            <div>
              <p className="eyebrow">À propos</p>
              <h2 className="reveal-up mt-5 text-4xl md:text-6xl leading-[1.05]">
                Trois générations, <em className="italic text-bronze">une même main</em>.
              </h2>
              <p className="reveal-up mt-8 text-base md:text-lg leading-relaxed text-muted-foreground">
                Antoine Velut a repris l'atelier familial en 2004, après quinze années passées
                auprès des Compagnons du Devoir. Il perpétue un métier lent, silencieux,
                exigeant — où la moindre entaille engage l'ensemble d'une pièce.
              </p>
              <p className="reveal-up mt-5 text-base md:text-lg leading-relaxed text-muted-foreground">
                Ici, aucune machine numérique. Rien que le maillet, le ciseau, le rabot —
                et l'œil patient qui décide quand le bois est enfin devenu meuble.
              </p>
              <div className="reveal-up mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <div><div className="font-serif text-3xl normal-case tracking-normal text-ink">2004</div>Reprise</div>
                <div><div className="font-serif text-3xl normal-case tracking-normal text-ink">15 ans</div>Compagnonnage</div>
                <div><div className="font-serif text-3xl normal-case tracking-normal text-ink">Beaune</div>Bourgogne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILIER + RESTAURATION services */}
      <section id="mobilier" className="py-28 md:py-40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <div>
              <p className="eyebrow">01 · Mobilier</p>
              <h2 className="reveal-up mt-5 text-4xl md:text-5xl">Sur-Mesure d'Exception</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Bibliothèques, tables de salle à manger, lits à baldaquin, dressings intégrés :
                chaque projet naît d'un dialogue avec le lieu. Nous concevons, dessinons et
                exécutons entièrement à la main, en essences nobles sélectionnées auprès de
                scieries françaises partenaires depuis trois générations.
              </p>
              <a href="#devis" className="mt-8 inline-block text-xs uppercase tracking-[0.3em] text-bronze border-b border-bronze pb-1">
                Concevoir une pièce
              </a>
            </div>
            <div id="restauration">
              <p className="eyebrow">02 · Restauration</p>
              <h2 className="reveal-up mt-5 text-4xl md:text-5xl">Patrimoine Retrouvé</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Meubles de famille, commodes Louis XV, secrétaires Empire, boiseries de château.
                Notre atelier redonne vie aux pièces d'histoire dans le strict respect des
                techniques d'origine — placage à la colle chaude, vernis au tampon, dorure à la
                feuille et marqueterie de reprise.
              </p>
              <a href="#devis" className="mt-8 inline-block text-xs uppercase tracking-[0.3em] text-bronze border-b border-bronze pb-1">
                Confier une restauration
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MATIERES — interactive material explorer */}
      <section id="matieres" className="relative overflow-hidden py-32 md:py-44 transition-all duration-700">
        <div className="absolute inset-0 transition-opacity duration-700">
          <img key={active.img} src={active.img} alt={wood} className="h-full w-full object-cover animate-fade-up" loading="lazy"/>
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/40"/>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          <p className="eyebrow text-cream drop-shadow-md">03 · Les Matières</p>
          <h2 className="reveal-up mt-4 max-w-3xl text-4xl text-cream drop-shadow-md md:text-6xl">
            Trois essences, trois <em>caractères</em>.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16 items-start">
            <div className="flex flex-col gap-3">
              {Object.keys(woods).map((k) => (<button key={k} onClick={() => setWood(k)} className={`group flex items-baseline justify-between border-b border-cream/30 py-5 text-left transition-all ${wood === k ? "text-cream" : "text-cream/50 hover:text-cream/80"}`}>
                  <span className="font-serif text-3xl md:text-4xl">{k}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em]">
                    {wood === k ? "Actif" : "Explorer"}
                  </span>
                </button>))}
            </div>

            <div className="glass-card rounded-sm p-8 md:p-12">
              <p className="eyebrow">{active.latin}</p>
              <h3 className="reveal-up mt-3 font-serif text-3xl md:text-4xl">{wood}</h3>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{active.note}</p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs uppercase tracking-widest text-muted-foreground">
                <div><div className="text-ink font-serif text-xl normal-case tracking-normal">FR</div>Origine</div>
                <div><div className="text-ink font-serif text-xl normal-case tracking-normal">A+</div>Sélection</div>
                <div><div className="text-ink font-serif text-xl normal-case tracking-normal">∞</div>Patine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATIÈRES — texture marquee */}
      <section className="bg-ink py-24 md:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow">05 · Échantillonnage</p>
            <h2 className="reveal-up mt-4 text-4xl md:text-6xl text-cream max-w-xl">
              La matière, <em>brute</em>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/60">
            Dix fragments d'écorce et de cœur — la mémoire du bois avant qu'il ne devienne meuble.
          </p>
        </div>

        <DraggableMarquee items={textures}/>

      </section>




      {/* RÉALISATIONS — premium 3D wood coverflow */}
      <Realisations3D items={[
            { src: fw1.url, title: "Pendule Rocaille", sub: "Bronze doré · Restauration complète" },
            { src: fw2.url, title: "Cabinet Henri II", sub: "Noyer sculpté · Marqueterie" },
            { src: fw3.url, title: "Escalier balustré", sub: "Chêne massif · Reprise à l'ancienne" },
            { src: fw4.url, title: "Départ d'escalier", sub: "Noyer patiné · Sur-mesure" },
            { src: fw5.url, title: "Porte à double vantail", sub: "Padouk · Ferronnerie forgée" },
            { src: fw6.url, title: "Salle à manger", sub: "Table & buffets · Restauration" },
            { src: fw7.url, title: "Secrétaire scandinave", sub: "Teck huilé · Restauration douce" },
            { src: fw8.url, title: "Coiffeuse Art Déco", sub: "Loupe d'orme · Miroir triptyque" },
            { src: fw9.url, title: "Chaise Louis-Philippe", sub: "Chêne · Réfection assise" },
            { src: fw10.url, title: "Cheminée monumentale", sub: "Marbre rouge · Boiseries sculptées" },
        ]}/>

      {/* NUMBERS */}
      <NumbersSection />


      {/* DEVIS CTA */}
      <section id="devis" className="relative overflow-hidden py-32 md:py-44 bg-cream">
        {/* Soft-focus workshop background */}
        <div aria-hidden className="absolute inset-0">
          <img src={storyJoinery.url} alt="" className="h-full w-full object-cover scale-105" style={{ filter: "blur(14px) saturate(0.85)" }} loading="lazy"/>
          <div className="absolute inset-0 bg-cream/85"/>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => {
            const left = (i * 53) % 100;
            const delay = (i * 1.37) % 14;
            const dur = 14 + ((i * 3) % 12);
            const scale = 0.6 + ((i * 7) % 10) / 10;
            const rot = (i * 47) % 360;
            const drift = ((i % 2 === 0 ? 1 : -1) * (30 + (i * 11) % 80));
            const op = 0.18 + ((i * 5) % 20) / 100;
            return (<span key={i} className="shaving" style={{
                    left: `${left}%`,
                    animationDelay: `-${delay}s`,
                    animationDuration: `${dur}s`,
                    transform: `scale(${scale})`,
                    ["--r"]: `${rot}deg`,
                    ["--x"]: `${drift}px`,
                    ["--o"]: op,
                }}/>);
        })}
        </div>
        <div className="relative mx-auto max-w-4xl px-6 md:px-10 text-center">
          <p className="eyebrow">Prendre contact</p>
          <h2 className="reveal-up mt-6 text-4xl md:text-6xl">
            Chaque belle demeure mérite son <em className="italic">pièce d'exception</em>.
          </h2>
          <p className="mt-8 mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            Nous étudions chaque projet avec la même exigence, qu'il s'agisse d'une commode
            de famille ou d'une bibliothèque intégrée de trente mètres. Écrivez-nous.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href="mailto:atelier@velut.fr" className="border border-bronze bg-bronze px-10 py-4 text-xs uppercase tracking-[0.3em] text-cream hover:bg-transparent hover:text-bronze transition-colors">
              atelier@velut.fr
            </a>
            <a href="tel:+33380000000" className="border border-ink px-10 py-4 text-xs uppercase tracking-[0.3em] text-ink hover:bg-ink hover:text-cream transition-colors">
              +33 (0)3 80 00 00 00
            </a>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Atelier — 12 rue des Tanneurs, 21200 Beaune
          </p>
          <SocialIcons />
        </div>
      </section>

      <footer className="border-t border-border bg-cream py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-10">
          <p className="font-serif text-lg">Ébénisterie <em>Velut</em></p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} — Savoir-Faire Français
          </p>
        </div>
      </footer>
    </div>);
}
