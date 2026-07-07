import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
import bark from "@/assets/bark.jpg";
import w1 from "@/assets/w1.jpg";
import w2 from "@/assets/w2.jpg";
import w3 from "@/assets/w3.jpg";
import w4 from "@/assets/w4.jpg";
import w5 from "@/assets/w5.jpg";
import w6 from "@/assets/w6.jpg";
import w7 from "@/assets/w7.jpg";
import w8 from "@/assets/w8.jpg";

export const Route = createFileRoute("/")({ component: Home });

const gallery = [
  { src: w1, note: "Chêne Massif", h: "row-span-2" },
  { src: w2, note: "Restauration d'Époque", h: "" },
  { src: w3, note: "Outillage Ancestral", h: "" },
  { src: w4, note: "Mobilier Sur-Mesure", h: "row-span-2" },
  { src: w5, note: "Copeaux & Matière", h: "" },
  { src: w6, note: "L'Atelier, Bourgogne", h: "row-span-2" },
  { src: w7, note: "Assemblage à Queue d'Aronde", h: "" },
  { src: w8, note: "Finition à la Cire", h: "" },
  { src: w1, note: "Savoir-Faire Traditionnel", h: "" },
  { src: w2, note: "Patrimoine Retrouvé", h: "" },
  { src: w5, note: "Geste Précis", h: "row-span-2" },
  { src: w3, note: "Fer & Bois", h: "" },
];

const woods = {
  Chêne:    { img: oak,    latin: "Quercus robur",   note: "Fermeté honorée, veinage franc. Le bois des cathédrales et des grands mobiliers de famille." },
  Noyer:    { img: walnut, latin: "Juglans regia",   note: "Profondeur chaleureuse, grain ondulant. Choix de prédilection pour les pièces d'apparat." },
  Merisier: { img: cherry, latin: "Prunus avium",    note: "Rougeoiement doux qui se patine avec le temps. Le fruitier des ébénistes classiques français." },
} as const;

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className={`font-serif text-xl tracking-wide ${scrolled ? "text-ink" : "text-cream"}`}>
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
          className={`md:hidden text-xs uppercase tracking-widest ${scrolled ? "text-ink" : "text-cream"}`}
          aria-label="Menu"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-cream border-t border-border px-6 py-6 flex flex-col gap-5 text-sm uppercase tracking-[0.25em] text-ink">
          <a href="#mobilier" onClick={() => setOpen(false)}>Mobilier</a>
          <a href="#restauration" onClick={() => setOpen(false)}>Restauration</a>
          <a href="#atelier" onClick={() => setOpen(false)}>L'Atelier</a>
          <a href="#matieres" onClick={() => setOpen(false)}>Matières</a>
          <a href="#devis" onClick={() => setOpen(false)} className="text-bronze">Demander un Devis →</a>
        </div>
      )}
    </header>
  );
}

function Home() {
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
          <img src={bark} alt="" className="h-full w-full object-cover" loading="lazy" />
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
              <h2 className="mt-5 text-4xl md:text-5xl">Sur-Mesure d'Exception</h2>
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
              <h2 className="mt-5 text-4xl md:text-5xl">Patrimoine Retrouvé</h2>
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
          <h2 className="mt-4 max-w-3xl text-4xl text-cream drop-shadow-md md:text-6xl">
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
              <h3 className="mt-3 font-serif text-3xl md:text-4xl">{wood}</h3>
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

      {/* PROCESS GALLERY — masonry */}
      <section id="atelier" className="py-28 md:py-40 bg-cream">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow">04 · L'Atelier</p>
              <h2 className="mt-4 text-4xl md:text-6xl max-w-xl">Le geste, capturé.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Fragments d'un quotidien fait de copeaux, de lumière rasante et de patience.
              Une chronique visuelle du savoir-faire.
            </p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
            {gallery.map((g, i) => (
              <figure key={i} className="group relative mb-4 overflow-hidden break-inside-avoid">
                <img
                  src={g.src}
                  alt={g.note}
                  loading="lazy"
                  className="w-full transition-all duration-700 grayscale-[35%] contrast-95 group-hover:grayscale-0 group-hover:contrast-105 group-hover:scale-[1.02]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/95 via-ink/70 to-transparent p-5 text-cream transition-transform duration-500 group-hover:translate-y-0">
                  <p className="text-[0.6rem] uppercase tracking-[0.35em] text-bronze">Note d'atelier</p>
                  <p className="mt-1 font-serif text-lg">{g.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
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
          <h2 className="mt-6 text-4xl md:text-6xl">
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
