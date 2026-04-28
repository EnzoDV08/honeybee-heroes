import { useEffect, useRef, useState } from 'react';

const BEE_PARTS = [
  {
    key: 'wings',
    label: 'Wings',
    title: 'Fast wings, big purpose',
    body: 'A bee’s wings beat extremely fast, helping it fly between flowers and return to the hive with nectar and pollen.',
    speech: 'These are my wings! They help me travel between flowers, hives, and the plants that need pollination.',
    rotY: -0.45,
    rotX: 0.08,
    rotZ: 0.08,
  },
  {
    key: 'eyes',
    label: 'Eyes',
    title: 'Eyes made for finding flowers',
    body: 'Bees use their eyes to detect colour, movement, and patterns on flowers that guide them toward nectar.',
    speech: 'My eyes help me find flowers and read tiny visual signals that people often miss.',
    rotY: 0.1,
    rotX: -0.04,
    rotZ: 0,
  },
  {
    key: 'legs',
    label: 'Legs',
    title: 'Pollen carriers',
    body: 'Bees collect and carry pollen on their legs. This is one of the reasons they are such important pollinators.',
    speech: 'My legs help carry pollen. That pollen moves between flowers and helps plants keep growing.',
    rotY: 0.55,
    rotX: 0.12,
    rotZ: -0.08,
  },
  {
    key: 'body',
    label: 'Body',
    title: 'Small body, huge ecosystem role',
    body: 'The bee’s body is built for collecting nectar, carrying pollen, and supporting the life cycle of plants.',
    speech: 'Even though I am small, my body is built for a very important job: helping nature stay connected.',
    rotY: 0,
    rotX: 0,
    rotZ: 0,
  },
];

export default function BeeInspectSection() {
  const [activePart, setActivePart] = useState(BEE_PARTS[0]);


const isInspectActiveRef = useRef(false);
const lockedScreenPosRef = useRef(null);
const activePartRef = useRef(BEE_PARTS[0]);

const dragRef = useRef({
  isDragging: false,
  startX: 0,
  startY: 0,
  rotX: 0,
  rotY: 0,
});

function getFixedBeeScreenPosition() {
  return {
    // Change this number to move Mellie left/right
    // smaller = more left, bigger = more right
    screenX: window.innerWidth * 0.31,

    // Change this number to move Mellie up/down
    // smaller = higher, bigger = lower
    screenY: window.innerHeight * 0.52,
  };
}

function sendInspectEvent(part, useLockedPosition = true) {
  setActivePart(part);
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

        rotY: dragRef.current.rotY + part.rotY,
        rotX: dragRef.current.rotX + part.rotX,
        rotZ: part.rotZ,

        targetId: 'mellie-zoom-frame',

        screenX: screenPosition.screenX,
        screenY: screenPosition.screenY,
      },
    })
  );
}

function inspectPart(part) {
  sendInspectEvent(part, true);
}

function updateBeeRotation() {
  const part = activePartRef.current;

  window.dispatchEvent(
    new CustomEvent('mellie:inspect', {
      detail: {
        active: true,
        speech: part.speech,

        rotY: dragRef.current.rotY + part.rotY,
        rotX: dragRef.current.rotX + part.rotX,
        rotZ: part.rotZ,

        targetId: 'mellie-zoom-frame',
      },
    })
  );
}

function handleDragStart(e) {
  dragRef.current.isDragging = true;
  dragRef.current.startX = e.clientX;
  dragRef.current.startY = e.clientY;

  e.currentTarget.setPointerCapture?.(e.pointerId);
}

function handleDragMove(e) {
  if (!dragRef.current.isDragging) return;

  const dx = e.clientX - dragRef.current.startX;
  const dy = e.clientY - dragRef.current.startY;

  dragRef.current.startX = e.clientX;
  dragRef.current.startY = e.clientY;

  // Left/right drag rotates around Y axis
  dragRef.current.rotY += dx * 0.01;

  // Up/down drag tilts around X axis
  dragRef.current.rotX += dy * 0.006;

  // Prevent flipping too far up/down
  dragRef.current.rotX = Math.max(-0.8, Math.min(0.8, dragRef.current.rotX));

  updateBeeRotation();
}

function handleDragEnd(e) {
  dragRef.current.isDragging = false;
  e.currentTarget.releasePointerCapture?.(e.pointerId);
}





useEffect(() => {
  const section = document.getElementById('bee-inspect');
  if (!section) return;

  const activateBeeInspect = () => {
    if (isInspectActiveRef.current) return;

    isInspectActiveRef.current = true;

    // Lock Mellie to a fixed screen position once
    lockedScreenPosRef.current = getFixedBeeScreenPosition();

    sendInspectEvent(BEE_PARTS[0], true);
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

  // Works both scrolling down AND scrolling up.
  // The bee becomes active when the inspect section is meaningfully visible.
const sectionIsVisible =
  sectionRect.top < vh * 0.10 &&
  sectionRect.bottom > vh * 0.15;

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
}, []);

  return (
    <section className="section bee-inspect-section" id="bee-inspect">
      <span className="section-num" aria-hidden="true">03</span>

      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-bee-inspect" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
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
          <p>
            This section lets the user slow down and interact with Mellie as more than a mascot.
            By exploring her body parts, they understand how a tiny bee connects to pollination,
            plants, honey, and the bigger Honeybee Heroes mission.
          </p>

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
          <p>{activePart.body}</p>



          <div className="bee-part-buttons">
            {BEE_PARTS.map((part) => (
              <button
                key={part.key}
                className={`bee-part-btn ${activePart.key === part.key ? 'active' : ''}`}
                onMouseEnter={() => inspectPart(part)}
                onClick={() => inspectPart(part)}
              >
                {part.label}
              </button>
            ))}
          </div>

          <div className="bee-fact-card">
            <strong>Why this works:</strong>
            <span>
              The bee becomes a learning object, not just decoration. The user interacts, Mellie
              reacts, and the information changes at the same time.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}