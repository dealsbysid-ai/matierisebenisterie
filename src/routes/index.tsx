import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

function DraggableMarquee({ items, speed = 40 }: { items: { src: string; label: string; latin: string }[]; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => { halfWidthRef.current = track.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const apply = () => {
      const hw = halfWidthRef.current || 1;
      let x = offsetRef.current % hw;
      if (x > 0) x -= hw;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const tick = (ts: number) => {
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [speed]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current += dx;
    const track = trackRef.current;
    if (track) {
      const hw = halfWidthRef.current || 1;
      let x = offsetRef.current % hw;
      if (x > 0) x -= hw;
      track.style.transform = `translate3d(${x}px,0,0)`;
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    draggingRef.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      className="relative touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <div ref={trackRef} className="flex gap-6 w-max will-change-transform">
        {[...items, ...items].map((t, i) => (
          <figure key={i} className="relative w-[280px] md:w-[360px] h-[380px] md:h-[480px] shrink-0 overflow-hidden pointer-events-none">
            <img
              src={t.src}
              alt={t.label}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5 text-cream">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-bronze">{t.latin}</p>
              <p className="mt-1 font-serif text-xl">{t.label}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}


function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = document.querySelectorAll<HTMLElement>(".reveal-up, .curtain");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (el.classList.contains("curtain")) el.classList.add("is-revealed");
          if (el.classList.contains("reveal-up")) el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
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

import chiselHammer from "@/assets/ref/df4bc026.jpg.asset.json";
import joinery from "@/assets/ref/990fc6f1.jpg.asset.json";
import axeShavings from "@/assets/ref/581d3633.jpg.asset.json";
import maulHands from "@/assets/ref/0e15b12b.jpg.asset.json";
import ornament from "@/assets/ref/3195b0d2.jpg.asset.json";
import patternCarve from "@/assets/ref/b9906c53.jpg.asset.json";
import roseCarve from "@/assets/ref/529235b2.jpg.asset.json";
import maitreAtelier from "@/assets/ref/af729c0c.jpg.asset.json";

import tex1  from "@/assets/tex/0e5d21c5.jpg.asset.json";
import tex2  from "@/assets/tex/1a069f60.jpg.asset.json";
import tex3  from "@/assets/tex/55e96eeb.jpg.asset.json";
import tex4  from "@/assets/tex/6d598f71.jpg.asset.json";
import tex5  from "@/assets/tex/89300f67.jpg.asset.json";
import tex6  from "@/assets/tex/98e6269f.jpg.asset.json";
import tex7  from "@/assets/tex/9d92f1c8.jpg.asset.json";
import tex8  from "@/assets/tex/bab85f16.jpg.asset.json";
import tex9  from "@/assets/tex/e1445138.jpg.asset.json";
import tex10 from "@/assets/tex/e3670dcd.jpg.asset.json";

const textures = [
  { src: tex1.url,  label: "Chêne brûlé",     latin: "Fibre serrée" },
  { src: tex2.url,  label: "Cœur de tronc",   latin: "Cernes centenaires" },
  { src: tex3.url,  label: "Pin ancien",      latin: "Écorce brute" },
  { src: tex4.url,  label: "Bois flotté",     latin: "Patine minérale" },
  { src: tex5.url,  label: "Noyer veiné",     latin: "Grain profond" },
  { src: tex6.url,  label: "Séquoia",         latin: "Corce rougeoyante" },
  { src: tex7.url,  label: "Frêne rustique",  latin: "Nervures verticales" },
  { src: tex8.url,  label: "Écorce vive",     latin: "Relief tectonique" },
  { src: tex9.url,  label: "Pin sylvestre",   latin: "Lichen & silice" },
  { src: tex10.url, label: "Chêne millénaire",latin: "Sillons du temps" },
];

export const Route = createFileRoute("/")({ component: Home });



const woods = {
  Chêne:    { img: oak,    latin: "Quercus robur",   note: "Fermeté honorée, veinage franc. Le bois des cathédrales et des grands mobiliers de famille." },
  Noyer:    { img: walnut, latin: "Juglans regia",   note: "Profondeur chaleureuse, grain ondulant. Choix de prédilection pour les pièces d'apparat." },
  Merisier: { img: cherry, latin: "Prunus avium",    note: "Rougeoiement doux qui se patine avec le temps. Le fruitier des ébénistes classiques français." },
} as const;

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const menuItems = [
    { label: "Mobilier", href: "#mobilier", num: "01" },
    { label: "Restauration", href: "#restauration", num: "02" },
    { label: "L'Atelier", href: "#atelier", num: "03" },
    { label: "Matières", href: "#matieres", num: "04" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          open
            ? "bg-transparent"
            : scrolled
              ? "bg-cream/90 backdrop-blur-md border-b border-border"
              : "bg-transparent"
        }`}
      >
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
          <a
            href="#devis"
            className="hidden md:inline-block border border-bronze bg-bronze px-6 py-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream hover:bg-transparent hover:text-bronze transition-colors"
          >
            Demander un Devis
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden relative z-50 text-xs uppercase tracking-widest transition-colors ${open ? "text-cream" : scrolled ? "text-ink" : "text-cream"}`}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>

      {/* Premium mobile menu — rendered as sibling so it is not clipped by the header */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink md:hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* Animated top bronze line */}
        <div
          className={`h-[2px] bg-bronze transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "w-full" : "w-0"
          }`}
        />

        <div className="flex-1 overflow-auto px-8 pt-28 pb-12">
          <nav className="flex flex-col">
            {menuItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center justify-between border-b border-cream/10 py-6 text-cream transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${300 + i * 80}ms` : "0ms" }}
              >
                <span className="font-serif text-4xl group-hover:text-bronze transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-bronze/60">
                  {item.num}
                </span>
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            href="#devis"
            onClick={() => setOpen(false)}
            className={`mt-12 inline-flex items-center gap-3 border border-bronze bg-bronze px-8 py-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream hover:bg-transparent hover:text-bronze transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: open ? "620ms" : "0ms" }}
          >
            Demander un Devis
            <span aria-hidden>→</span>
          </a>

          <div
            className={`mt-20 text-xs uppercase tracking-[0.25em] text-cream/50 transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: open ? "720ms" : "0ms" }}
          >
            <p>Atelier — 12 rue des Tanneurs, 21200 Beaune</p>
            <p className="mt-2">
              <a href="tel:+33380000000" className="hover:text-bronze transition-colors">+33 (0)3 80 00 00 00</a>
            </p>
          </div>
        </div>

        <div
          className={`px-8 py-6 border-t border-cream/10 transition-all duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: open ? "820ms" : "0ms" }}
        >
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-cream/40">
            Maison fondée en 1978 · Bourgogne
          </p>
        </div>
      </div>
    </>
  );
}

function Home() {
  useScrollReveal();
  const [scrolled, setScrolled] = useState(false);
  const [wood, setWood] = useState<keyof typeof woods>("Chêne");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = woods[wood];


  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav scrolled={scrolled} />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 animate-slow-zoom">
          <img src={hero} alt="Mains d'ébéniste sculptant le bois" className="h-full w-full object-cover" width={1920} height={1280} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-24 md:pb-32 md:px-10">
          <p className="eyebrow text-cream/80 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Maison fondée en 1978 · Bourgogne
          </p>
          <h1
            className="mt-6 max-w-5xl text-5xl leading-[1.05] text-cream md:text-7xl lg:text-8xl animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
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
          <img src={barkRef.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/50" />
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
          <img key={active.img} src={active.img} alt={wood} className="h-full w-full object-cover animate-fade-up" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          <p className="eyebrow text-cream drop-shadow-md">03 · Les Matières</p>
          <h2 className="reveal-up mt-4 max-w-3xl text-4xl text-cream drop-shadow-md md:text-6xl">
            Trois essences, trois <em>caractères</em>.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16 items-start">
            <div className="flex flex-col gap-3">
              {(Object.keys(woods) as (keyof typeof woods)[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setWood(k)}
                  className={`group flex items-baseline justify-between border-b border-cream/30 py-5 text-left transition-all ${
                    wood === k ? "text-cream" : "text-cream/50 hover:text-cream/80"
                  }`}
                >
                  <span className="font-serif text-3xl md:text-4xl">{k}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em]">
                    {wood === k ? "Actif" : "Explorer"}
                  </span>
                </button>
              ))}
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

        <DraggableMarquee items={textures} />

      </section>



      {/* PROCESS GALLERY — masonry */}
      <section id="atelier" className="py-28 md:py-40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow">04 · L'Atelier</p>
              <h2 className="reveal-up mt-4 text-4xl md:text-6xl max-w-xl">Le geste, capturé.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Fragments d'un quotidien fait de copeaux, de lumière rasante et de patience.
              Une chronique visuelle du savoir-faire.
            </p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className={`curtain group relative mb-4 break-inside-avoid cursor-pointer overflow-hidden ${ratioClass[g.ratio] ?? "aspect-[3/4]"}`}
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={g.src}
                  alt={g.note}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 grayscale-[20%] contrast-95 group-hover:grayscale-0 group-hover:contrast-105 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/95 via-ink/70 to-transparent p-5 text-cream transition-transform duration-500 group-hover:translate-y-0">
                  <p className="text-[0.6rem] uppercase tracking-[0.35em] text-bronze">Note d'atelier</p>
                  <p className="mt-1 font-serif text-lg">{g.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>


          <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none bg-black/95 flex items-center justify-center">
              <DialogTitle className="sr-only">{activeImage?.note ?? "Image atelier"}</DialogTitle>
              {activeImage && (
                <div className="relative flex flex-col items-center w-full h-full justify-center p-4 md:p-8">
                  <img
                    src={activeImage.src}
                    alt={activeImage.note}
                    className="max-h-[85vh] max-w-full object-contain shadow-2xl"
                  />
                  <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream/70">
                    {activeImage.note}
                  </p>
                  <button
                    onClick={() => setLightboxIndex((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length)}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors p-2"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
                  </button>
                  <button
                    onClick={() => setLightboxIndex((i) => ((i ?? 0) + 1) % gallery.length)}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors p-2"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0">
          <img src={walnut} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-ink/75" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 md:px-10 grid gap-12 md:grid-cols-4 text-cream">
          {[
            ["1978", "Année de fondation"],
            ["3", "Générations d'ébénistes"],
            ["+400", "Pièces restaurées"],
            ["12", "Essences travaillées"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-5xl md:text-6xl">{n}</div>
              <div className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEVIS CTA */}
      <section id="devis" className="relative overflow-hidden py-32 md:py-44 bg-cream">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => {
            const left = (i * 53) % 100;
            const delay = (i * 1.37) % 14;
            const dur = 14 + ((i * 3) % 12);
            const scale = 0.6 + ((i * 7) % 10) / 10;
            const rot = (i * 47) % 360;
            const drift = ((i % 2 === 0 ? 1 : -1) * (30 + (i * 11) % 80));
            const op = 0.18 + ((i * 5) % 20) / 100;
            return (
              <span
                key={i}
                className="shaving"
                style={{
                  left: `${left}%`,
                  animationDelay: `-${delay}s`,
                  animationDuration: `${dur}s`,
                  transform: `scale(${scale})`,
                  ["--r" as string]: `${rot}deg`,
                  ["--x" as string]: `${drift}px`,
                  ["--o" as string]: op,
                }}
              />
            );
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
    </div>
  );
}
