import { useRef, useEffect } from 'react';
import Hotspot from '../Hotspot';
import '../../styles/sections/journey.css';

/* ───────────────────────────────────────────────────────────────
   JourneySection — "What happens after you adopt"
   - Honeycomb background reusing the caretaker-card comb pattern
   - Centre-spine timeline, cards alternating left / right
   - Inline SVG icons (meaningful per step), cards tilt in 3D on hover
   - Tall plant-image placeholders pinned to the left & right edges
   - Scroll reveal via IntersectionObserver (no dependencies)
   - Respects prefers-reduced-motion
   ─────────────────────────────────────────────────────────────── */

/* Inline icon set — each icon reads as the step's actual meaning.
   strokeWidth/currentColor so they inherit the gold glyph colour. */
const Icon = {
  certificate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M7 9h10M7 12.5h6" />
      <circle cx="12" cy="19.5" r="2.4" />
      <path d="M10.4 21.2 9.4 24l2.6-1.4L14.6 24l-1-2.8" />
    </svg>
  ),
  bee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="4.2" ry="6" />
      <path d="M7.8 11.5h8.4M7.8 15h8.4" />
      <path d="M12 8V5.5" />
      <path d="M10 5.2A2 2 0 1 1 12 8a2 2 0 1 1 2-2.8" />
      <path d="M7.5 11C4.5 9 3 11 4 13c.8 1.6 3 1.2 3.8.2" />
      <path d="M16.5 11c3-2 4.5 0 3.5 2-.8 1.6-3 1.2-3.8.2" />
    </svg>
  ),
  updates: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8.5A6 6 0 0 0 6 8.5c0 5-2.2 6.5-2.2 6.5h16.4S18 13.5 18 8.5Z" />
      <path d="M10.2 19a2 2 0 0 0 3.6 0" />
      <circle cx="18" cy="5.5" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  jar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8v2.2c0 .6.3 1 .8 1.5C18 8 18.5 9 18.5 11v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-7c0-2 .5-3 1.7-4.3.5-.5.8-.9.8-1.5V3Z" />
      <path d="M5.5 13h13" />
      <path d="M9.5 16.2h5" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 13 2-2 4 3.5a1.6 1.6 0 0 1-2.2 2.3L12 14" />
      <path d="m12.5 11.5 1.8-1.8a2 2 0 0 1 2.8 0L21 13" />
      <path d="M3 13l3.5-3.5a2 2 0 0 1 2.8 0L12 11" />
      <path d="M3 9l3 3M21 9l-1 1" />
      <path d="m7.5 14.5 2 2M10 13l2 2" />
    </svg>
  ),
  loop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9a8 8 0 0 1 13.7-3.2L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 15a8 8 0 0 1-13.7 3.2L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  ),
};

const TIMELINE = [
  {
    when: 'First',
    label: 'Welcome aboard.',
    body: 'Your hive gets your name. Your adoption certificate is sent. The relationship begins.',
    speech: 'It begins with a welcome — your hive is named, and your adoption certificate is sent to you.',
    icon: 'certificate',
  },
  {
    when: 'Then',
    label: 'Your hive lives.',
    body: 'Built and tended on the farm by trained beekeepers. Yours, but in their care.',
    speech: 'Your hive is built and looked after on the farm by the trained beekeepers.',
    icon: 'bee',
  },
  {
    when: 'Throughout',
    label: 'Updates land.',
    body: 'Seasonal updates come through. You see your hive working. You see what your money is doing.',
    speech: 'Seasonal updates from your hive are sent through over the year.',
    icon: 'updates',
  },
  {
    when: 'Eventually',
    label: 'Your honey arrives.',
    body: 'Six jars of raw honey, harvested from the hives on the farm. Pure, local, traceable.',
    speech: 'Six jars of raw honey from the harvest arrive — pure, local, and traceable.',
    icon: 'jar',
  },
  {
    when: 'Then',
    label: 'You meet your bees.',
    body: 'Your complimentary Bee Experience for two — you and a guest, on the farm, hands-on.',
    speech: 'You and a guest are invited to the farm for a Bee Experience — meet the bees, meet the team.',
    icon: 'handshake',
  },
  {
    when: 'And then',
    label: 'It keeps going.',
    body: 'The hive keeps producing. You can renew, gift, or simply enjoy what you have started.',
    speech: 'The story does not end — the hive keeps producing, and you can renew, gift, or share the experience.',
    icon: 'loop',
  },
];

export default function JourneySection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  /* ── Scroll reveal via IntersectionObserver (no dependencies) ── */
  useEffect(() => {
    const cards = cardsRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      cards.forEach((c) => c.classList.add('is-visible'));
      sectionRef.current?.classList.add('spine-drawn');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    cards.forEach((c) => io.observe(c));

    let spineObserver;
    if (sectionRef.current) {
      spineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('spine-drawn');
              spineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      spineObserver.observe(sectionRef.current);
    }

    return () => {
      io.disconnect();
      spineObserver?.disconnect();
    };
  }, []);

  /* ── Pointer-driven 3D tilt ── */
  const handleTilt = (e) => {
    const cardEl = e.currentTarget.querySelector('.journey-card');
    if (!cardEl) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cardEl.style.setProperty('--ry', `${px * 12}deg`);
    cardEl.style.setProperty('--rx', `${-py * 12}deg`);
    cardEl.style.setProperty('--mx', `${px * 10}px`);
    cardEl.style.setProperty('--my', `${py * 10}px`);
  };

  const resetTilt = (e) => {
    const cardEl = e.currentTarget.querySelector('.journey-card');
    if (!cardEl) return;
    cardEl.style.setProperty('--ry', '0deg');
    cardEl.style.setProperty('--rx', '0deg');
    cardEl.style.setProperty('--mx', '0px');
    cardEl.style.setProperty('--my', '0px');
  };

return (
  <section className="section journey-section" id="journey" ref={sectionRef}>

  <div className="journey-bg" aria-hidden="true">
  <div className="journey-yellow-layer" />

  <div className="journey-image-layer">
    <img
      className="journey-side-img journey-side-img-left"
      src="/images/Leftside2.png"
      alt=""
    />
    <img
      className="journey-side-img journey-side-img-right"
      src="/images/Rightside.png"
      alt=""
    />
  </div>
</div>

    <div className="journey-header">
        <h2>What happens<br />after you <em>adopt.</em></h2>
        <p className="journey-lead">
          Adopting a hive is not a one-off donation. It is the start of a relationship that
          plays out across the year — drawn straight from what every package includes.
        </p>
      </div>

      <ol className="journey-track">
        <span className="journey-spine" aria-hidden="true">
          <span className="journey-spine-line" />
        </span>

        {TIMELINE.map((step, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          const isFinal = i === TIMELINE.length - 1;
          return (
            <li
              key={step.label}
              ref={addCard}
              className={`journey-cell journey-cell-${side} ${isFinal ? 'final' : ''}`}
              style={{ '--reveal-delay': `${(i % 2) * 0.08}s` }}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <span className="journey-spine-dot" aria-hidden="true">
                <span className="journey-spine-dot-core" />
              </span>

              <Hotspot as="article" className="journey-card hotspot" speech={step.speech}>
                <span className="journey-card-tag" aria-hidden="true">0{i + 1}</span>
                <span className="journey-hexcard" aria-hidden="true">
                  <span className="journey-hexcard-face">
                    <span className="journey-card-glyph">{Icon[step.icon]}</span>
                  </span>
                </span>
                <div className="journey-card-body">
                  <span className="journey-when">{step.when}</span>
                  <h3>{step.label}</h3>
                  <p>{step.body}</p>
                </div>
              </Hotspot>
            </li>
          );
        })}
      </ol>
    </section>
  );
}