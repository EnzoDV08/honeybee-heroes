import { useEffect, useRef, useState, useCallback } from 'react';
import '../../styles/sections/importance.css';

const SCENES = [
  {
    id: 'flower',
    chapter: '01',
    eyebrow: 'Pollination starts here',
    kicker: 'First contact',
    headline: ['One landing', 'starts the', 'whole chain.'],
    body: 'A honey bee lands on a flower, collects pollen, and carries it to the next bloom. That tiny movement helps plants produce fruit, seeds, and food.',
    facts: [
      ['Pollen carried', '≈ 100k'],
      ['Flowers visited', 'up to 2,000/day'],
    ],
    stat: '1',
    statLabel: 'flower at a time',
    statContext: 'Small movement. Big food-system impact.',
    image: '/images/biodiversity/01-flower.png',
    imageFocus: '50% 50%',
    speech:
      'As a honey bee, I start with one flower at a time. That small landing helps move pollen and begins the food chain.',
  },
  {
    id: 'field',
    chapter: '02',
    eyebrow: 'Small actions multiply',
    kicker: 'Scale takes over',
    headline: ['One hive', 'reaches further', 'than you think.'],
    body: 'A single hive can support pollination across a wide area. Every flight, flower, and pollen transfer adds up until a field has a better chance of becoming a harvest.',
    facts: [
      ['Foraging radius', 'up to 5 km'],
      ['Pollination work', 'daily'],
    ],
    stat: '5km',
    statLabel: 'possible foraging range',
    statContext: 'One hive can support plant life far beyond the hive itself.',
    image: '/images/biodiversity/02-field.png',
    imageFocus: '50% 60%',
    speech:
      'Honey bees do not only visit one flower. Across many flights, one hive can support pollination over a much wider area.',
  },
  {
    id: 'farm',
    chapter: '03',
    eyebrow: 'Farms rely on pollinators',
    kicker: 'Food systems',
    headline: ['Farms', 'depend on', 'pollinators.'],
    body: 'Many crops rely on bees and other pollinators to produce strong harvests. When pollinator numbers drop, farms can produce less food, and that pressure moves through the supply chain.',
    facts: [
      ['SA crops needing bees', 'over 50 types'],
      ['Yield without bees', 'drops sharply'],
    ],
    stat: '75%',
    statLabel: 'of crops need pollinators',
    statContext: 'Remove the bee and the supply chain does not slow down, it breaks.',
    image: '/images/biodiversity/03-farm.png',
    imageFocus: '50% 45%',
    speech:
      'Many farms rely on honey bees and other pollinators. Without them, harvests can shrink and food becomes harder to produce.',
  },
  {
    id: 'table',
    chapter: '04',
    eyebrow: 'Pollination reaches you',
    kicker: 'Your plate',
    headline: ['A third of', 'every plate.'],
    body: 'Fruit, vegetables, oils, nuts, herbs, and many everyday foods are linked to pollination. Honey bees help keep that variety alive in the food people eat.',
    facts: [
      ['Of your diet', '1 in 3 bites'],
      ['Foods at risk', 'fruit, oils, nuts'],
    ],
    stat: '1/3',
    statLabel: 'of every meal',
    statContext: 'The variety on your table is not a given. It is pollinated into existence, daily.',
    image: '/images/biodiversity/04-table.png',
    imageFocus: '50% 55%',
    speech:
      'A lot of the variety on your plate depends on pollination. Honey bees help keep that food chain alive.',
  },
];

export default function ImportanceSection() {
  const sectionRef = useRef(null);
const isImportanceActiveRef = useRef(false);
const lastSpokenSceneRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState('down');

  const activeScene = SCENES[activeIdx];
  const activeIdxRef = useRef(0);

useEffect(() => {
  activeIdxRef.current = activeIdx;
}, [activeIdx]);

const speakImportanceScene = useCallback((scene) => {
  if (!scene) return;

  if (lastSpokenSceneRef.current === scene.id) return;

  lastSpokenSceneRef.current = scene.id;

  window.dispatchEvent(
    new CustomEvent('mellie:importance:speech', {
      detail: {
        speech: scene.speech,
        sceneId: scene.id,
      },
    })
  );
}, []);

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

  useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  let pinned = false;
  let ticking = false;

  function getBeePositionBesideImagePanel() {
    const imagePanel = section.querySelector('.bio-scene-bg');

    if (!imagePanel) {
      return {
        screenX: window.innerWidth * 0.9,
        screenY: window.innerHeight * 0.42,
      };
    }

    const rect = imagePanel.getBoundingClientRect();

    // Bigger number = the guide bee sits further to the right of the image panel
    const BEE_SIDE_GAP = 90;

    // Stops Mellie from going fully off-screen
    const SCREEN_EDGE_SPACE = 95;

    return {
      screenX: Math.min(
        window.innerWidth - SCREEN_EDGE_SPACE,
        rect.right + BEE_SIDE_GAP
      ),

      // 0.42 means slightly above centre of the image panel
      screenY: Math.max(
        120,
        Math.min(window.innerHeight - 140, rect.top + rect.height * 0.42)
      ),
    };
  }

  const dispatchImportanceSnap = (active) => {
    if (active) {
      const beePos = getBeePositionBesideImagePanel();

      window.dispatchEvent(
        new CustomEvent('mellie:importance', {
          detail: {
            active: true,
            screenX: beePos.screenX,
            screenY: beePos.screenY,
          },
        })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent('mellie:importance', {
          detail: { active: false },
        })
      );
    }
  };

  const check = () => {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const inView = rect.top < vh * 0.55 && rect.bottom > vh * 0.55;

if (inView) {
  const wasPinned = pinned;

  pinned = true;
  isImportanceActiveRef.current = true;

  dispatchImportanceSnap(true);

  // This is the important part:
  // when the section first becomes active, speak the current slide immediately.
  if (!wasPinned) {
    const currentScene = SCENES[activeIdxRef.current] || SCENES[0];
    speakImportanceScene(currentScene);
  }
} else if (pinned) {
  pinned = false;
  isImportanceActiveRef.current = false;
  lastSpokenSceneRef.current = null;

  dispatchImportanceSnap(false);
}
    });
  };

  check();

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);

  return () => {
    window.removeEventListener('scroll', check);
    window.removeEventListener('resize', check);

    window.dispatchEvent(
      new CustomEvent('mellie:importance', {
        detail: { active: false },
      })
    );
  };
}, [speakImportanceScene]);

useEffect(() => {
  if (!isImportanceActiveRef.current) return;

  speakImportanceScene(activeScene);
}, [activeIdx, activeScene, speakImportanceScene]);



  return (
    <section ref={sectionRef} className="bio-section" id="importance">
      <div className="bio-stage" data-scene={activeScene.id}>
        {/* 
          IMPORTANT:
          No key here. 
          This wrapper must stay alive so the right box does not disappear.
        */}
<div className="bio-scene">
          {/* LEFT CONTENT: this is the only left part that swaps */}
          <div className="bio-scene-content-shell">
            <div
              key={activeScene.id}
              className="bio-scene-content"
              data-dir={direction}
            >


              <h2 className="bio-scene-headline">
                {activeScene.headline.map((line, j) => (
                  <span key={j} className="bio-scene-headline-line">
                    <span
                      className="bio-scene-headline-inner"
                      style={{ '--line-i': j }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>

              <p className="bio-scene-body">{activeScene.body}</p>

              <p className="bio-scene-note">{activeScene.statContext}</p>


              {/* Stat block — now with progress bar + context line */}
              <div className="bio-scene-stat">
                <div className="bio-scene-stat-head">
                  <span className="bio-scene-stat-value">{activeScene.stat}</span>
                  <span className="bio-scene-stat-label">
                    {activeScene.statLabel}
                  </span>
                </div>

                <div
                  className="bio-scene-stat-track"
                  aria-hidden="true"
                >
                  <span
                    className="bio-scene-stat-fill"
                    style={{ '--fill': `${((activeIdx + 1) / SCENES.length) * 100}%` }}
                  />
                </div>

                <p className="bio-scene-stat-context">
                  {activeScene.statContext}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL BOX: stays constant */}
          <div className="bio-scene-bg" aria-hidden="true">
            <div
              className="bio-visual-frame"
              style={{ '--bio-blur-img': `url(${activeScene.image})` }}
            >

              <div className="bio-visual-stats" key={`${activeScene.id}-stats`}>
  <div className="bio-visual-main-stat">
    <span className="bio-visual-stat-value">{activeScene.stat}</span>
    <span className="bio-visual-stat-label">{activeScene.statLabel}</span>
  </div>

  <div className="bio-visual-facts">
    {activeScene.facts.map(([label, value]) => (
      <div className="bio-visual-fact" key={label}>
        <span>{value}</span>
        <small>{label}</small>
      </div>
    ))}
  </div>
</div>
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
       </div>

        <div className="bio-ui">
          <div className="bio-ui-progress">
            {SCENES.map((scene, i) => (
              <div
                key={scene.id}
                className={`bio-ui-dot ${
                  i === activeIdx ? 'is-active' : ''
                } ${i < activeIdx ? 'is-past' : ''}`}
              >
                <span className="bio-ui-dot-label">
                <strong>{scene.chapter}</strong>
                <small>{scene.eyebrow}</small>
              </span>
              </div>
            ))}
          </div>

      <div className="bio-ui-scroll-hint" data-transitioning={transitioning}>
        <span className="bio-scroll-hint-text">Scroll to follow the chain</span>
        <span className="bio-scroll-hint-icon" aria-hidden="true">
          <span />
        </span>
      </div>
        </div>
      </div>
    </section>
  );
}