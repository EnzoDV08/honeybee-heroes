import { useEffect, useRef, useState, useCallback } from 'react';
import '../../styles/sections/importance.css';

const SCENES = [
  {
    id: 'flower',
    chapter: '01',
    eyebrow: 'Pollination starts here',
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

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function ImportanceSection() {
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const activeIdxRef = useRef(0);
  const lastRawRef = useRef(0);
  const isImportanceActiveRef = useRef(false);
  const lastSpokenSceneRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollState, setScrollState] = useState({
    progress: 0,
    raw: 0,
    direction: 'down',
    transitioning: false,
  });

  const activeScene = SCENES[activeIdx];

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

  const updateScrollState = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalScrollable = section.offsetHeight - vh;

    if (totalScrollable <= 0) return;

    const progress = clamp(-rect.top / totalScrollable, 0, 1);

    /*
      raw moves from 0 → 3 for 4 scenes.
      This lets the next full scene slide over the current one,
      instead of swapping like a normal slideshow.
    */
    const raw = progress * (SCENES.length - 1);
    const direction = raw >= lastRawRef.current ? 'down' : 'up';

    const nextIdx = clamp(
      Math.floor(raw + 0.5),
      0,
      SCENES.length - 1
    );

    lastRawRef.current = raw;

    if (nextIdx !== activeIdxRef.current) {
      activeIdxRef.current = nextIdx;
      setActiveIdx(nextIdx);

      window.clearTimeout(transitionTimerRef.current);

      setScrollState({
        progress,
        raw,
        direction,
        transitioning: true,
      });

      transitionTimerRef.current = window.setTimeout(() => {
        setScrollState((prev) => ({
          ...prev,
          transitioning: false,
        }));
      }, 600);

      return;
    }

    setScrollState((prev) => ({
      ...prev,
      progress,
      raw,
      direction,
    }));
  }, []);

  useEffect(() => {
    const requestUpdate = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateScrollState();
      });
    };

    requestUpdate();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }

      window.clearTimeout(transitionTimerRef.current);
    };
  }, [updateScrollState]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let pinned = false;
    let ticking = false;

    function getBeePositionBesideImagePanel() {
      const stage = section.querySelector('.bio-stage');
    
      if (!stage) {
        return {
          screenX: window.innerWidth - 170,
          screenY: 150,
        };
      }
    
      const rect = stage.getBoundingClientRect();
    
      /*
        Fixed corner position.
        Increase BEE_FROM_RIGHT to move Mellie more left.
        Increase BEE_FROM_TOP to move Mellie lower.
      */
        const BEE_FROM_RIGHT = 165;
        const BEE_FROM_TOP = 360;
    
      return {
        screenX: Math.min(window.innerWidth - 95, rect.right - BEE_FROM_RIGHT),
        screenY: Math.max(110, rect.top + BEE_FROM_TOP),
      };
    }

    function dispatchImportanceSnap(active) {
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
    }

    function checkImportanceView() {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;

        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;

        const inView = rect.top < vh * 0.55 && rect.bottom > vh * 0.55;

        if (inView) {
          const wasPinned = pinned;

          pinned = true;
          isImportanceActiveRef.current = true;

          dispatchImportanceSnap(true);

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
    }

    checkImportanceView();

    window.addEventListener('scroll', checkImportanceView, { passive: true });
    window.addEventListener('resize', checkImportanceView);

    return () => {
      window.removeEventListener('scroll', checkImportanceView);
      window.removeEventListener('resize', checkImportanceView);

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

  function getLayerStyle(index) {
    const raw = scrollState.raw;
  
    const smoothStep = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };
  
    /*
      Keeps the scroll-over effect:
      - next scene still slides upward over the previous one
      - previous scene fades/softens away while the new one comes in
      - no background panel is needed anymore
    */
    const enterProgress =
      index === 0 ? 1 : clamp(raw - (index - 1), 0, 1);
  
    const passedProgress = clamp(raw - index, 0, 1);
  
    const easedEnter = smoothStep(enterProgress);
  
    // Fade out starts slightly after the next scene begins entering
    const fadeOutProgress = smoothStep(
      clamp((passedProgress - 0.12) / 0.88, 0, 1)
    );
  
    // Incoming scene fades in quicker than it moves, so it feels smoother
    const fadeInProgress =
      index === 0
        ? 1
        : smoothStep(clamp(enterProgress / 0.58, 0, 1));
  
    const y = index === 0 ? 0 : (1 - easedEnter) * 108;
    const scale = 1 - fadeOutProgress * 0.018;
    const lift = fadeOutProgress * -1.2;
    const blur = fadeOutProgress * 4;
  
    const layerOpacity = clamp(
      fadeInProgress * (1 - fadeOutProgress),
      0,
      1
    );
  
    return {
      '--layer-y': `${y}%`,
      '--layer-scale': scale,
      '--layer-lift': `${lift}vh`,
      '--layer-blur': `${blur}px`,
      zIndex: 10 + index,
      opacity: layerOpacity < 0.03 ? 0 : layerOpacity,
    };
  }

  return (
    <section
      ref={sectionRef}
      className="bio-section"
      id="importance"
      style={{ '--scene-count': SCENES.length }}
    >
      <div
        className="bio-stage"
        data-active-scene={activeScene.id}
        data-direction={scrollState.direction}
      >
        <div className="bio-layer-stack">
          {SCENES.map((scene, index) => {
            const isActive = index === activeIdx;
            const isPast = index < activeIdx;

            return (
              <article
                key={scene.id}
                className={`bio-scene-layer ${isActive ? 'is-active' : ''} ${
                  isPast ? 'is-past' : ''
                }`}
                data-scene={scene.id}
                data-dir={scrollState.direction}
                style={getLayerStyle(index)}
              >
                <div className="bio-scene">
                  <div className="bio-scene-content-shell">
                    <div className="bio-scene-content" data-dir={scrollState.direction}>
                      <h2 className="bio-scene-headline">
                        {scene.headline.map((line, j) => (
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

                      <p className="bio-scene-body">{scene.body}</p>

                      <p className="bio-scene-note">{scene.statContext}</p>
                    </div>
                  </div>

                  <div className="bio-scene-bg" aria-hidden="true">
                    <div
                      className="bio-visual-frame"
                      style={{ '--bio-blur-img': `url(${scene.image})` }}
                    >
                      <div className="bio-visual-stats">
                        <div className="bio-visual-main-stat">
                          <span className="bio-visual-stat-value">{scene.stat}</span>
                          <span className="bio-visual-stat-label">
                            {scene.statLabel}
                          </span>
                        </div>

                        <div className="bio-visual-facts">
                          {scene.facts.map(([label, value]) => (
                            <div className="bio-visual-fact" key={label}>
                              <span>{value}</span>
                              <small>{label}</small>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bio-scene-glow" />

                      <div className="bio-scene-image-swap">
                        <img
                          src={scene.image}
                          alt=""
                          style={{ objectPosition: scene.imageFocus }}
                        />
                      </div>

                      <div className="bio-scene-gradient" />
                      <div className="bio-scene-grain" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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

          <div
            className="bio-ui-scroll-hint"
            data-transitioning={scrollState.transitioning}
          >
            <span className="bio-scroll-hint-text">
              Scroll to follow the chain
            </span>
            <span className="bio-scroll-hint-icon" aria-hidden="true">
              <span />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}