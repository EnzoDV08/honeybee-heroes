import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/sections/bee-inspect.css';

const BEE_PARTS = [
  {
    key: 'wings',
    label: 'Wings',
    title: 'Fast wings, big purpose',
    body: 'A bee’s wings help it move between flowers, carry nectar back to the hive, and support the pollination journey.',
    speech: 'These are my wings! They help me travel between flowers, hives, and the plants that need pollination.',
    infoTitle: 'Built for movement',
    infoText:
      'Mellie’s wings are not just for flying around. They help her move quickly between flowers, which makes pollination possible across gardens, farms, and natural spaces.',
    infoTag: 'Flight + pollination',
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
    label: 'Eyes',
    title: 'Eyes made for flowers',
    body: 'Bees use their eyes to notice colour, movement, and flower patterns that guide them toward nectar.',
    speech: 'My eyes help me find flowers and read tiny visual signals that people often miss.',
    infoTitle: 'Finding the right flowers',
    infoText:
      'Mellie’s eyes help her notice flowers and navigate the environment. This makes every flight more focused, helping her find nectar and pollen more efficiently.',
    infoTag: 'Vision + navigation',
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
    label: 'Legs',
    title: 'Pollen carriers',
    body: 'Bees collect and carry pollen on their legs, which is one of the reasons they are so important for pollination.',
    speech: 'My legs help carry pollen. That pollen moves between flowers and helps plants keep growing.',
    infoTitle: 'Carrying pollen with purpose',
    infoText:
      'Mellie’s legs help collect and move pollen from flower to flower. This small action is one of the biggest reasons bees matter to food systems and biodiversity.',
    infoTag: 'Pollen + plants',
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
    label: 'Body',
    title: 'Small body, huge role',
    body: 'The bee’s body is built for collecting nectar, carrying pollen, and supporting the life cycle of plants.',
    speech: 'Even though I am small, my body is built for a very important job: helping nature stay connected.',
    infoTitle: 'A tiny body with ecosystem impact',
    infoText:
      'Mellie may look small, but her body is designed for work that connects flowers, hives, honey, food, and the Honeybee Heroes mission.',
    infoTag: 'Hive + ecosystem',
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

        <div className="bee-inspect-panel">
          <span className="panel-kicker">Interactive anatomy</span>

          <h3>{activePart.title}</h3>
          <p className="bee-panel-copy">{activePart.body}</p>

          <div className="bee-part-buttons" aria-label="Choose bee body part">
            {BEE_PARTS.map((part) => (
<button
  type="button"
  key={part.key}
  className={`bee-part-btn ${
    activePart.key === part.key ? 'active' : ''
  }`}
  onClick={() => inspectPart(part)}
>
  {part.label}
</button>
            ))}
          </div>

          <div className="bee-media-card">
            <div className="bee-media-header">
              <span>{activePart.infoTag}</span>
            </div>

            <div className="bee-media-layout">
              <div className="bee-media-image-side">
                <div className="bee-carousel-frame">
                  <img
                    key={activeImage.src}
                    src={activeImage.src}
                    alt={activeImage.alt}
                  />
                  <div className="bee-carousel-shine" />
                </div>

                <p className="bee-carousel-caption">{activeImage.caption}</p>
              </div>

              <div className="bee-info-content">
                <h4>{activePart.infoTitle}</h4>
                <p>{activePart.infoText}</p>

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