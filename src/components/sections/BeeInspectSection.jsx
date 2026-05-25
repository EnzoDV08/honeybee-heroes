import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/sections/bee-inspect.css';

const BEE_PARTS = [
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
    title: 'Fast wings, big purpose',
    body: 'A bee’s wings help it move between flowers, carry nectar back to the hive, and support the pollination journey.',
    speech: 'These are my wings! They help me travel between flowers, hives, and the plants that need pollination.',
    
    infoTitle: 'Built for movement',
    infoText:
      'Mellie’s wings are not just for flying around. They help her move quickly between flowers, which makes pollination possible across gardens, farms, and natural spaces.',
    infoTag: 'Flight + pollination',
    funFact: 'Wings beat 200× per second',
    didYouKnow: "That's so fast it creates the buzzing sound you hear when Mellie flies past.",
    stats: ['Moves between flowers', 'Carries nectar home', 'Supports plant growth'],
    images: [
      {
        src: '/images/bee-inspect/wings-01.jpg',
        alt: 'Close-up of bee wings',
        caption: 'Thin transparent wings help bees move quickly between flowers.',
      }
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
    title: 'Eyes made for flowers',
    body: 'Bees use their eyes to notice colour, movement, and flower patterns that guide them toward nectar.',
    speech: 'My eyes help me find flowers and read tiny visual signals that people often miss.',
    infoTitle: 'Finding the right flowers',
    infoText:
      'Mellie’s eyes help her notice flowers and navigate the environment. This makes every flight more focused, helping her find nectar and pollen more efficiently.',
    infoTag: 'Vision + navigation',
    funFact: "Sees UV light humans can't",
didYouKnow: 'Flowers have hidden UV patterns — like runway lights guiding bees straight to the nectar.',
    stats: ['Detects movement', 'Finds flower patterns', 'Guides flight direction'],
    images: [
      {
        src: '/images/bee-inspect/eyes-01.jpg',
        alt: 'Bee face close-up',
        caption: 'Their vision helps guide them toward nectar-rich flowers.',
      }
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
    title: 'Pollen carriers',
    body: 'Bees collect and carry pollen on their legs, which is one of the reasons they are so important for pollination.',
    speech: 'My legs help carry pollen. That pollen moves between flowers and helps plants keep growing.',
    infoTitle: 'Carrying pollen with purpose',
    infoText:
      'Mellie’s legs help collect and move pollen from flower to flower. This small action is one of the biggest reasons bees matter to food systems and biodiversity.',
    infoTag: 'Pollen + plants',
    funFact: 'Carries half her body weight',
didYouKnow: 'The pollen baskets on her back legs lock the load in tight for the whole flight home.',
    stats: ['Collects pollen', 'Transfers between flowers', 'Supports biodiversity'],
    images: [
      {
        src: '/images/bee-inspect/legs-01.jpg',
        alt: 'Bee legs carrying pollen',
        caption: 'Pollen sticks to the bee’s legs while it moves between flowers.',
      }
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
    title: 'Small body, huge role',
    body: 'The bee’s body is built for collecting nectar, carrying pollen, and supporting the life cycle of plants.',
    speech: 'Even though I am small, my body is built for a very important job: helping nature stay connected.',
    infoTitle: 'A tiny body with ecosystem impact',
    infoText:
      'Mellie may look small, but her body is designed for work that connects flowers, hives, honey, food, and the Honeybee Heroes mission.',
    infoTag: 'Hive + ecosystem',
    funFact: '5 eyes on one tiny body',
didYouKnow: 'Two big compound eyes for wide vision, plus three simple eyes on top for light and balance.',
    stats: ['Collects nectar', 'Supports the hive', 'Connects nature'],
    images: [
      {
        src: '/images/bee-inspect/body-01.jpg',
        alt: 'Honeybee body close-up',
        caption: 'A bee’s body is built for gathering, carrying, and surviving.',
      }
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
const activeImage = activePart.images[0];

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
          <span className="eyebrow">Meet Mellie</span>
          <h2>Explore the bee up close.</h2>

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
            <p>Click and drag to rotate Mellie.</p>
          </div>
        </div>

        <div className="bee-inspect-panel-wrapper">

  <div className="bee-panel-header">
    <span className="panel-kicker">Interactive anatomy</span>
    <h3>{activePart.title}</h3>
    <p className="bee-panel-copy">{activePart.body}</p>
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
    <div className="bee-media-header">
      <span className="bee-media-tag">✦ {activePart.infoTag}</span>
    </div>

    <div className="bee-media-layout">
      <div className="bee-media-image-side">
        <div className="bee-carousel-frame">
        <img
          key={activeImage.src + animKey}
          src={activeImage.src}
          alt={activeImage.alt}
        />
          <div className="bee-carousel-shine" />
        </div>
        <p className="bee-carousel-caption">{activeImage.caption}</p>
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