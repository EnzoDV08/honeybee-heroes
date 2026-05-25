import { useEffect, useRef, useState } from 'react';
import Hotspot from '../Hotspot';
import '../../styles/sections/importance.css';

const SCENES = [
  {
    id: 'flower',
    chapter: '01',
    eyebrow: 'Where it begins',
    headline: ['It begins', 'with a single', 'landing.'],
    body: 'One bee. One flower. Pollen moves between stamens, and a chain reaction begins that ends on your plate. The smallest gesture in the food system — and the most consequential.',
    stat: '1',
    statLabel: 'flower at a time',
    image: '/images/biodiversity/01-flower.png',
    imageFocus: '50% 50%',
    speech: 'This is where it all begins. One bee, one flower, one tiny exchange that the entire food system is built on.',
  },
  {
    id: 'field',
    chapter: '02',
    eyebrow: 'It multiplies',
    headline: ['Five kilometres.', 'Every day.', 'All year.'],
    body: 'A single hive will pollinate a five-kilometre radius around the farm. Multiply that by every flower, every blossom, every dawn. This is how a field becomes a harvest.',
    stat: '5km',
    statLabel: 'pollinated, daily',
    image: '/images/biodiversity/02-field.png',
    imageFocus: '50% 60%',
    speech: 'Multiply that one moment by thousands a day, across kilometres. That is how a field turns into a harvest.',
  },
  {
    id: 'farm',
    chapter: '03',
    eyebrow: 'It feeds an industry',
    headline: ['Farmers', 'depend', 'on us.'],
    body: 'South African agriculture is built on pollinators. When bee numbers drop, yields drop. When yields drop, farms struggle. When farms struggle, food prices climb — and someone, somewhere, eats less.',
    stat: '75%',
    statLabel: 'of crops need pollinators',
    image: '/images/biodiversity/03-farm.png',
    imageFocus: '50% 45%',
    speech: 'Whole farms run on what we do. Without us, harvests shrink and food becomes a luxury.',
  },
  {
    id: 'table',
    chapter: '04',
    eyebrow: 'It reaches you',
    headline: ['A third of', 'every plate.'],
    body: 'Coffee. Almonds. Apples. Blueberries. Melons. Oils. Herbs. A third of what you eat exists because a bee did her work. Take her out of the chain and the grocery aisle thins out — fast.',
    stat: '1/3',
    statLabel: 'of every meal',
    image: '/images/biodiversity/04-table.png',
    imageFocus: '50% 55%',
    speech: 'A third of everything on your plate passed through a bee somewhere down the line. That is the impact your hive supports.',
  },
];

export default function ImportanceSection() {
  const sectionRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState('down');

  const activeScene = SCENES[activeIdx];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = null;
    let transitionTimer = null;
    let previousIdx = 0;

    const updateSlide = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = section.offsetHeight - vh;

      if (totalScrollable <= 0) {
        setActiveIdx(0);
        rafId = requestAnimationFrame(updateSlide);
        return;
      }

      const progress = Math.max(
        0,
        Math.min(0.999, -rect.top / totalScrollable)
      );

      const nextIdx = Math.min(
        SCENES.length - 1,
        Math.floor(progress * SCENES.length)
      );

      if (nextIdx !== previousIdx) {
        setDirection(nextIdx > previousIdx ? 'down' : 'up');
        previousIdx = nextIdx;

        setActiveIdx(nextIdx);

        clearTimeout(transitionTimer);
        setTransitioning(true);

        transitionTimer = setTimeout(() => {
          setTransitioning(false);
        }, 650);
      }

      rafId = requestAnimationFrame(updateSlide);
    };

    rafId = requestAnimationFrame(updateSlide);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bio-section" id="importance">
      <div className="bio-stage" data-scene={activeScene.id}>
        {/* 
          IMPORTANT:
          No key here. 
          This wrapper must stay alive so the right box does not disappear.
        */}
        <Hotspot
          as="div"
          className="bio-scene"
          speech={activeScene.speech}
        >
          {/* LEFT CONTENT: this is the only left part that swaps */}
          <div className="bio-scene-content-shell">
            <div
              key={activeScene.id}
              className="bio-scene-content"
              data-dir={direction}
            >
              <div className="bio-scene-meta">
                <span className="bio-scene-chapter">{activeScene.chapter}</span>
                <span className="bio-scene-divider" aria-hidden="true" />
                <span className="bio-scene-eyebrow">{activeScene.eyebrow}</span>
              </div>

              <h2 className="bio-scene-headline">
                {activeScene.headline.map((line, j) => (
                  <span key={j} className="bio-scene-headline-line">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="bio-scene-body">{activeScene.body}</p>

              <div className="bio-scene-stat">
                <span className="bio-scene-stat-value">{activeScene.stat}</span>
                <span className="bio-scene-stat-label">
                  {activeScene.statLabel}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL BOX: stays constant */}
<div className="bio-scene-bg" aria-hidden="true">
  <div
    className="bio-visual-frame"
    style={{ '--bio-blur-img': `url(${activeScene.image})` }}
  >
    {/* Colour-matched blur glow — a blurred copy of the image */}
    <div
      key={activeScene.image + '-glow'}
      className="bio-scene-glow"
      data-dir={direction}
    />

    {/* The real image */}
    <div
      key={activeScene.image}
      className="bio-scene-image-swap"
      data-dir={direction}
    >
      <img
        src={activeScene.image}
        alt=""
        style={{ objectPosition: activeScene.imageFocus }}
      />
    </div>

    <div className="bio-scene-gradient" />
    <div className="bio-scene-grain" />
  </div>
</div>
        </Hotspot>

        <div className="bio-ui">
          <div className="bio-ui-progress">
            {SCENES.map((scene, i) => (
              <div
                key={scene.id}
                className={`bio-ui-dot ${
                  i === activeIdx ? 'is-active' : ''
                } ${i < activeIdx ? 'is-past' : ''}`}
              >
                <span className="bio-ui-dot-label">{scene.id}</span>
              </div>
            ))}
          </div>

          <div className="bio-ui-scroll-hint" data-transitioning={transitioning}>

          </div>
        </div>
      </div>
    </section>
  );
}