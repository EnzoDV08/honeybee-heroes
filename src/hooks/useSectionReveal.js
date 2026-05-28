import { useEffect } from 'react';

const SECTION_SELECTOR = [
  '#hero',
  '#importance',
  '#bee-inspect',
  '#caretakers',
  '#journey',
  '#adoption',
  '#cta',
  '.site-footer',
].join(', ');

const REVEAL_ITEM_SELECTOR = [
  '.hero-copy',
  '.stories-heading',
  '.hero-stories-strip',

  '.importance-header',
  '.importance-content',
  '.importance-visual',
  '.bio-stage',
  '.bio-copy',
  '.bio-visual',
  '.scene-copy',
  '.scene-visual',

  '.bee-inspect-left',
  '.bee-inspect-panel-wrapper',

  '.caretakers-content',
  '.caretakers-visual-stack',
  '.caretakers-pillar',

  '.journey-heading',

  '.adoption-header',
  '.package-gallery',

  '.cta-box',

  '.footer-left',
  '.footer-column',
  '.footer-note-card',
].join(', ');

export function useSectionReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));

    if (!sections.length) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    root.classList.add('reveal-ready');

    sections.forEach((section) => {
      section.classList.add('section-reveal');

      const revealItems = Array.from(
        section.querySelectorAll(REVEAL_ITEM_SELECTOR)
      );

      revealItems.forEach((item, index) => {
        item.classList.add('section-reveal-item');

        const delay = Math.min(index * 90, 450);
        item.style.setProperty('--reveal-delay', `${delay}ms`);
      });
    });

    if (prefersReducedMotion) {
      sections.forEach((section) => {
        section.classList.add('is-visible');
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          // Keeps it smooth: reveal once, then stop watching.
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    sections.forEach((section) => {
      if (section.id === 'hero') {
        section.classList.add('is-visible');
      } else {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}