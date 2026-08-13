import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ---------- Smooth scroll (Lenis <-> GSAP ticker) ---------- */
if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* Lazy images and web-font swaps can shift layout after ScrollTrigger's
   initial measurements — refresh once everything has actually settled. */
window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());

/* ---------- Nav: shrink on scroll + fullscreen overlay ---------- */
const nav = document.querySelector<HTMLElement>("[data-nav]");
const navToggle = document.querySelector<HTMLElement>("[data-nav-toggle]");
const navOverlay = document.querySelector<HTMLElement>("[data-nav-overlay]");

ScrollTrigger.create({
  start: 60,
  onEnter: () => nav?.classList.add("is-scrolled"),
  onLeaveBack: () => nav?.classList.remove("is-scrolled"),
});

let navOpen = false;
navToggle?.addEventListener("click", () => {
  navOpen = !navOpen;
  navToggle.setAttribute("aria-expanded", String(navOpen));
  navOverlay?.classList.toggle("is-open", navOpen);
  document.body.style.overflow = navOpen ? "hidden" : "";
  navToggle.classList.toggle("is-open", navOpen);
});

document.querySelectorAll<HTMLElement>("[data-nav-overlay] a").forEach((a) => {
  a.addEventListener("click", () => {
    navOpen = false;
    navToggle?.setAttribute("aria-expanded", "false");
    navOverlay?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    document.body.style.overflow = "";
  });
});

/* ---------- Custom cursor ---------- */
const cursorDot = document.getElementById("cursor-dot");
if (cursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
  });
  document.querySelectorAll<HTMLElement>("[data-cursor-grow]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorDot.classList.add("is-active"));
    el.addEventListener("mouseleave", () => cursorDot.classList.remove("is-active"));
  });
}

/* ---------- Magnetic buttons ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ---------- Scroll reveals ---------- */
document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
  if (prefersReducedMotion) {
    el.classList.remove("reveal-up");
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: 48 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    },
  );
});

document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
  const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.remove("reveal-up"));
    return;
  }
  gsap.fromTo(
    items,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: group,
        start: "top 80%",
      },
    },
  );
});

/* ---------- Hero parallax + intro ---------- */
const heroImg = document.querySelector<HTMLElement>("[data-hero-img]");
if (heroImg && !prefersReducedMotion) {
  gsap.to(heroImg, {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: heroImg.closest("section"),
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

gsap.timeline({ delay: 0.15 })
  .from("[data-hero-line]", {
    yPercent: 110,
    duration: 1.1,
    stagger: 0.1,
    ease: "power4.out",
  })
  .from(
    "[data-hero-fade]",
    { opacity: 0, y: 16, duration: 0.8, ease: "power2.out", stagger: 0.08 },
    "-=0.6",
  );

/* ---------- Split-flap board ---------- */
const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .,'-".split("");

function randomChar() {
  return FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
}

function flapTo(el: HTMLElement, finalText: string, delayBase = 0) {
  const duration = 480;
  const steps = 9;
  const start = performance.now() + delayBase;

  function tick(now: number) {
    const elapsed = now - start;
    if (elapsed < 0) {
      requestAnimationFrame(tick);
      return;
    }
    const progress = Math.min(1, elapsed / duration);
    const stepIndex = Math.floor(progress * steps);
    if (progress < 1) {
      el.textContent = stepIndex % 2 === 0 ? randomChar() : finalText;
      requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
    }
  }
  requestAnimationFrame(tick);
}

function buildFlapBoard(el: HTMLElement, text: string) {
  el.innerHTML = "";
  const chars = text.split("");
  chars.forEach((c) => {
    const span = document.createElement("span");
    span.className = "flap-char";
    span.textContent = c === " " ? " " : c;
    el.appendChild(span);
  });
  return el.querySelectorAll<HTMLElement>(".flap-char");
}

document.querySelectorAll<HTMLElement>("[data-flap-words]").forEach((board) => {
  const words = (board.dataset.flapWords ?? "").split("|").filter(Boolean);
  if (!words.length) return;
  const width = Math.max(...words.map((w) => w.length));
  let wordIndex = 0;

  function render(word: string) {
    const padded = word.padEnd(width, " ");
    const spans = buildFlapBoard(board, padded);
    spans.forEach((span, i) => {
      flapTo(span, padded[i] === " " ? " " : padded[i], i * 35);
    });
  }

  render(words[0]);

  if (!prefersReducedMotion) {
    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      render(words[wordIndex]);
    }, 3200);
  }
});

/* Trigger board flip when it scrolls into view (hours / status boards) */
document.querySelectorAll<HTMLElement>("[data-flap-once]").forEach((board) => {
  const text = board.dataset.flapOnce ?? "";
  const spans = buildFlapBoard(board, text);
  spans.forEach((span) => (span.textContent = " "));

  ScrollTrigger.create({
    trigger: board,
    start: "top 90%",
    once: true,
    onEnter: () => {
      spans.forEach((span, i) => {
        flapTo(span, text[i] === " " ? " " : text[i], i * 30);
      });
    },
  });
});

/* ---------- Horizontal gallery scroll ---------- */
const track = document.querySelector<HTMLElement>("[data-h-track]");
if (track && !prefersReducedMotion) {
  const getMax = () => track.scrollWidth - track.parentElement!.clientWidth;
  gsap.to(track, {
    x: () => -getMax(),
    ease: "none",
    scrollTrigger: {
      trigger: track.closest("[data-h-section]"),
      start: "top top",
      end: () => `+=${getMax()}`,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
    },
  });
}

/* ---------- Marquee (CSS driven, JS just clones content) ---------- */
document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((el) => {
  const inner = el.firstElementChild;
  if (inner) {
    el.appendChild(inner.cloneNode(true));
  }
});

/* ---------- Tour request form (front-end only demo) ---------- */
const tourForm = document.querySelector<HTMLFormElement>("[data-tour-form]");
tourForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const note = tourForm.querySelector<HTMLElement>("[data-tour-note]");
  const nameInput = tourForm.querySelector<HTMLInputElement>("#name");
  if (note) {
    note.textContent = `Thanks${nameInput?.value ? ", " + nameInput.value.split(" ")[0] : ""} — we'll be in touch within a day to set a time.`;
  }
  tourForm.reset();
});

/* ---------- Footer year ---------- */
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
