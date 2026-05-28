import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/sections/bee-inspect.css';

const BEE_PARTS = [
  {
  key: 'origin',
  svgIcon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l5-2 4 2 5-2 4 2v10l-4 2-5-2-4 2-5-2V7z" />
      <path d="M8 5v12" />
      <path d="M12 7v12" />
      <path d="M17 5v12" />
    </svg>
  ),

  label: 'Cape bee',
  title: 'The Cape honey bee belongs to the Cape region',
  body:
    'The Cape honey bee is a South African honey bee subspecies naturally linked to the Western Cape fynbos region and parts of the Eastern Cape.',

  speech:
    'The Cape honey bee comes from the Cape region of South Africa. A healthy colony is usually queen-led, but Cape honey bee workers have a rare ability to produce female offspring if the colony becomes queenless.',

  infoTitle: 'Where the Cape honey bee comes from',
  infoText:
    'The Cape honey bee, Apis mellifera capensis, is naturally found in the fynbos biome of the Western Cape and extends eastwards into parts of the Eastern Cape. It should not be shown as a bee that naturally belongs across all of South Africa.',

  infoTag: 'Cape region + fynbos',
  funFact: 'Workers can produce female offspring',
  didYouKnow:
    'Cape honey bee colonies are normally queen-led, but if a colony becomes queenless, workers can lay diploid eggs that develop into female bees.',

  stats: [
    'Natural to the Cape region',
    'Important fynbos pollinator',
    'Usually queen-led colonies',
  ],

  mapMode: true,
  mapSrc: '/images/bee-inspect/beemap.png',

  rotY: 0,
  rotX: 0,
  rotZ: 0,
},
  {
    key: 'wings',
        svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12C8 8 2 9 2 5c0-2 2-3 4-2 3 1 5 4 6 9z"/>
        <path d="M12 12c4-4 10-3 10-7 0-2-2-3-4-2-3 1-5 4-6 9z"/>
        <path d="M12 12c-2 5-1 10-4 11-2 1-3-1-2-3 1-3 4-5 6-8z"/>
        <path d="M12 12c2 5 1 10 4 11 2 1 3-1 2-3-1-3-4-5-6-8z"/>
      </svg>
 ),
    label: 'Wings',
title: 'Wings built for Cape conditions',
body: 'Cape honey bees use their wings to move between flowering plants, return to the hive, and support pollination in the Cape landscape.',
speech:
  'My wings help me travel between flowers in the Cape landscape and return to the hive with nectar and pollen.',
infoTitle: 'Flight through flowering landscapes',
infoText:
  'Cape honey bees forage on nectar and pollen from flowering plants. Their movement between flowers helps transfer pollen and supports plant reproduction.',
infoTag: 'Flight + fynbos',
funFact: 'Wings help warm the hive',
didYouKnow:
  'A honey bee colony does not simply hibernate in winter. Bees can help maintain warmth inside the hive by working their wings.',
stats: ['Moves between flowers', 'Returns nectar to the hive', 'Supports pollination'],
    images: [
      {
        src: '/images/bee-inspect/wings-01.jpg',
        alt: 'Close-up of honey bee wings',
        caption: 'Thin transparent wings help honey bees move quickly between flowers.',
      },
    ],
    rotY: -0.45,
    rotX: 0.08,
    rotZ: 0.08,
  },
  {
    key: 'eyes',
        svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
     ),
    label: 'Eyes',
   title: 'Eyes made for finding flowers',
body: 'Cape honey bees use their eyes to detect colour, movement, and flower cues while foraging.',
speech:
  'My eyes help me find flowering plants and navigate while I forage.',
infoTitle: 'Finding flowers efficiently',
infoText:
  'Cape honey bees forage from flowering plants for nectar and pollen. Their vision helps them move through the environment and locate useful flowers.',
infoTag: 'Vision + foraging',
funFact: 'Built for flower finding',
didYouKnow:
  'The Cape honey bee depends on flowering plants for nectar and pollen, while also helping those plants reproduce through pollination.',
stats: ['Finds flowering plants', 'Guides flight direction', 'Supports foraging'],
    images: [
      {
        src: '/images/bee-inspect/eyes-01.jpg',
        alt: 'Honey bee face close-up',
        caption: 'A honey bee’s vision helps guide it toward nectar-rich flowers.',
      },
    ],
    rotY: 0.1,
    rotX: -0.04,
    rotZ: 0,
  },
  {
    key: 'legs',
        svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v8l-4 4"/>
        <path d="M8 11l4 4v6"/>
        <path d="M16 3v8l4 4"/>
        <path d="M16 11l-4 4v6"/>
      </svg>
    ),
    label: 'Legs',
    title: 'Legs that carry pollen',
body: 'Cape honey bees collect pollen on their bodies and move it between flowers, helping plants reproduce.',
speech:
  'Cape honey bee legs help carry pollen while they move between flowers.',
infoTitle: 'Pollen carried with purpose',
infoText:
  'Pollen sticks to the bee’s hairs and is moved into pollen baskets on the rear legs. This helps the bee carry pollen back to the hive while also transferring pollen between flowers.',
infoTag: 'Pollen + plants',
funFact: 'Pollen baskets on the back legs',
didYouKnow:
  'The Cape honey bee’s pollen collection helps both the hive and the flowering plants it visits.',
stats: ['Collects pollen', 'Carries pollen baskets', 'Transfers pollen between flowers'],
    images: [
      {
        src: '/images/bee-inspect/legs-01.jpg',
        alt: 'Honey bee legs carrying pollen',
        caption: 'Pollen sticks to a honey bee’s legs while it moves between flowers.',
      },
    ],
    rotY: 0.55,
    rotX: 0.12,
    rotZ: -0.08,
  },
  {
    key: 'body',
    svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="5" ry="8"/>
        <path d="M7 9c-2-1-4 0-4 2s2 3 4 2"/>
        <path d="M17 9c2-1 4 0 4 2s-2 3-4 2"/>
        <path d="M9 4c0-2 6-2 6 0"/>
        <path d="M10 2l-2-2M14 2l2-2"/>
      </svg>
),
    label: 'Body',
title: 'Small body, important role',
body: 'The Cape honey bee’s body is built for collecting nectar, carrying pollen, and supporting the colony.',
speech:
  'My body is built for collecting nectar, carrying pollen, and helping the colony survive.',
infoTitle: 'A small body with Cape impact',
infoText:
  'The Cape honey bee plays an important role in pollinating fynbos plants and food crops such as apples, pears, blueberries, and canola.',
infoTag: 'Fynbos + crops',
funFact: 'Important fynbos pollinator',
didYouKnow:
  'The Cape honey bee supports both wild flowering plants and pollination-dependent crops in the Cape region.',
stats: ['Pollinates fynbos', 'Supports food crops', 'Feeds on nectar and pollen'],
    images: [
      {
        src: '/images/bee-inspect/body-01.jpg',
        alt: 'Honey bee body close-up',
        caption: 'A honey bee’s body is built for gathering, carrying, and surviving.',
      },
    ],
    rotY: 0,
    rotX: 0,
    rotZ: 0,
  },
];

function getFixedBeeScreenPosition() {
  return {
    screenX: window.innerWidth * 0.31,
    screenY: window.innerHeight * 0.52,
  };
}

export default function BeeInspectSection() {
const [activePart, setActivePart] = useState(BEE_PARTS[0]);
const [animKey, setAnimKey] = useState(0);
const activeImage = activePart.images?.[0] ?? null;

  const isInspectActiveRef = useRef(false);
  const lockedScreenPosRef = useRef(null);
  const activePartRef = useRef(BEE_PARTS[0]);

const dragRef = useRef({
  isDragging: false,

  startX: 0,
  startY: 0,

  startRotX: 0,
  startRotY: 0,

  rotX: 0,
  rotY: 0,
});



const sendInspectEvent = useCallback((part, useLockedPosition = true, updatePanel = true) => {
  if (updatePanel) {
    setActivePart(part);
  }

  activePartRef.current = part;

  let screenPosition = lockedScreenPosRef.current;

  if (!screenPosition || !useLockedPosition) {
    screenPosition = getFixedBeeScreenPosition();
    lockedScreenPosRef.current = screenPosition;
  }

  window.dispatchEvent(
    new CustomEvent('mellie:inspect', {
      detail: {
        active: true,
        speech: part.speech,
        targetId: 'mellie-zoom-frame',
        screenX: screenPosition.screenX,
        screenY: screenPosition.screenY,
      },
    })
  );
}, []);

function inspectPart(part) {
  if (part.key === activePart.key) return;
  setAnimKey(k => k + 1);
  sendInspectEvent(part, true, true);
}

function updateBeeRotation() {
  window.dispatchEvent(
    new CustomEvent('mellie:rotate', {
      detail: {
        rotY: dragRef.current.rotY,
        rotX: dragRef.current.rotX,
        rotZ: 0,
        isDragging: dragRef.current.isDragging,
      },
    })
  );
}

function handleDragStart(e) {
  dragRef.current.isDragging = true;

  dragRef.current.startX = e.clientX;
  dragRef.current.startY = e.clientY;

  dragRef.current.startRotX = dragRef.current.rotX;
  dragRef.current.startRotY = dragRef.current.rotY;

  updateBeeRotation();
}

function handleDragMove(e) {
  if (!dragRef.current.isDragging) return;

  const totalDx = e.clientX - dragRef.current.startX;
  const totalDy = e.clientY - dragRef.current.startY;

  dragRef.current.rotY = dragRef.current.startRotY + totalDx * 0.006;
  dragRef.current.rotX = dragRef.current.startRotX + totalDy * 0.004;

  dragRef.current.rotX = Math.max(
    -0.45,
    Math.min(0.45, dragRef.current.rotX)
  );

  updateBeeRotation();
}

function handleDragEnd() {
  if (!dragRef.current.isDragging) return;

  dragRef.current.isDragging = false;
  updateBeeRotation();
}

  useEffect(() => {
    const section = document.getElementById('bee-inspect');
    if (!section) return;

    const activateBeeInspect = () => {
      if (isInspectActiveRef.current) return;

      isInspectActiveRef.current = true;
      lockedScreenPosRef.current = getFixedBeeScreenPosition();

      sendInspectEvent(BEE_PARTS[0], true, false);
    };

    const deactivateBeeInspect = () => {
      if (!isInspectActiveRef.current) return;

      isInspectActiveRef.current = false;
      lockedScreenPosRef.current = null;

      window.dispatchEvent(
        new CustomEvent('mellie:inspect', {
          detail: { active: false },
        })
      );
    };

    const checkSectionPosition = () => {
      const sectionRect = section.getBoundingClientRect();
      const vh = window.innerHeight;

const ENTER_EARLIER = 0.45;
const LEAVE_EARLIER = 0.85;

const sectionIsVisible =
  sectionRect.top < vh * ENTER_EARLIER &&
  sectionRect.bottom > vh * LEAVE_EARLIER;

      if (sectionIsVisible) {
        activateBeeInspect();
      } else {
        deactivateBeeInspect();
      }
    };

    checkSectionPosition();

    window.addEventListener('scroll', checkSectionPosition, { passive: true });
    window.addEventListener('resize', checkSectionPosition);

    return () => {
      window.removeEventListener('scroll', checkSectionPosition);
      window.removeEventListener('resize', checkSectionPosition);

      window.dispatchEvent(
        new CustomEvent('mellie:inspect', {
          detail: { active: false },
        })
      );
    };
  }, [sendInspectEvent]);

  return (
    <section className="bee-inspect-section" id="bee-inspect">


      <svg className="section-hex-bg" aria-hidden="true">
        <pattern
          id="hex-bee-inspect"
          x="0"
          y="0"
          width="56"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="28,2 54,14 54,38 28,50 2,38 2,14"
            fill="none"
            stroke="#b57a12"
            strokeWidth="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-bee-inspect)" />
      </svg>

      <div className="bee-inspect-grid">
        <div className="bee-inspect-left">
        <span className="eyebrow">Honey bee anatomy</span>
        <h2>Explore the honey bee up close.</h2>

          <div
            className="bee-zoom-frame"
            id="mellie-zoom-frame"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onPointerLeave={handleDragEnd}
          >
            <div className="bee-zoom-ring ring-one" />
            <div className="bee-zoom-ring ring-two" />
            <div className="bee-rotate-callout">
  <span className="bee-rotate-icon">↻</span>
  <div>
<strong>Rotate the honey bee</strong>
<small>Click and drag to inspect it</small>
  </div>
</div>
          </div>
        </div>

        <div className="bee-inspect-panel-wrapper">

<div className="bee-panel-header">
<span className="panel-kicker">Mellie explains her species</span>
<h3>Meet the Cape honey bee.</h3>
<p className="bee-panel-copy">
  Start with where the Cape honey bee comes from, then inspect how its body supports pollination.
</p>
</div>

<div className="bee-tab-row" role="tablist" aria-label="Bee body parts">
  {BEE_PARTS.map((part) => (
<button
  type="button"
  key={part.key}
  role="tab"
  aria-selected={activePart.key === part.key}
  className={`bee-tab ${activePart.key === part.key ? 'active' : ''}`}
  onClick={() => inspectPart(part)}
>
  <span className="bee-tab-icon" aria-hidden="true">
    {part.svgIcon}
  </span>
  {part.label}
</button>
  ))}
</div>

<div className="bee-inspect-panel" key={animKey}>


    <div className="bee-media-layout">
<div className="bee-media-image-side">
  {activePart.mapMode ? (
    <div className="bee-map-stage">
      <div className="bee-map-topline">Cape honey bee range</div>

<div className="bee-sa-map-wrap">
  <img
    src={activePart.mapSrc}
    alt="Map showing the Cape honey bee range in the Western Cape and parts of the Eastern Cape"
    className="bee-sa-map"
  />

  <div className="bee-map-sweep" />
</div>

<p className="bee-map-caption">
  The Cape honey bee is mainly linked to the Western Cape fynbos region and parts of the Eastern Cape.
</p>
    </div>
  ) : (
    <>
      <div className="bee-carousel-frame">
        <img
          key={activeImage.src + animKey}
          src={activeImage.src}
          alt={activeImage.alt}
        />
        <div className="bee-carousel-shine" />
      </div>
      <p className="bee-carousel-caption">{activeImage.caption}</p>
    </>
  )}
</div>

<div className="bee-info-content" key={'info-' + animKey}>
  <h4>{activePart.infoTitle}</h4>
  <p>{activePart.infoText}</p>

  <div className="bee-fun-fact">
    <span className="bee-fun-fact-label">Quick fact</span>
    <strong className="bee-fun-fact-value">{activePart.funFact}</strong>
  </div>

  <div className="bee-did-you-know">
    <span className="bee-dyk-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
    </span>
    <p>{activePart.didYouKnow}</p>
  </div>

  <div className="bee-mini-facts">
    {activePart.stats.map((stat) => (
      <span key={stat}>{stat}</span>
    ))}
  </div>
</div>
    </div>
  </div>
        </div>
      </div>
    </section>
  );
}