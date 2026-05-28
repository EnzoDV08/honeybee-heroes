import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function useBeeEngine({ onSpeechChange, onInteractionChange, bubbleDomRef }) {
  const canvasRef   = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const rendererRef = useRef(null);
  const beeGroupRef = useRef(null);
  const mixerRef    = useRef(null);
  const clockRef    = useRef(new THREE.Clock());
  const rafRef      = useRef(null);

const s = useRef({
  targetX:     4.8,
  targetY:     0.8,
  targetScale: 0.095,
  isInspecting: false,
  inspectTimer: null,
  activeSectionId: 'hero',


// Close-up bee inspection mode
isBeeInspectSection: false,
inspectTargetId: null,
manualRotX: 0,
manualRotY: 0,
manualRotZ: 0,

isImportanceSection: false,
});

  const onSpeechRef      = useRef(onSpeechChange);
  const onInteractionRef = useRef(onInteractionChange);
  useEffect(() => { onSpeechRef.current = onSpeechChange; });
  useEffect(() => { onInteractionRef.current = onInteractionChange; });

  const interactionTimer = useRef(null);

  const hideInteraction = useCallback(() => {
    clearTimeout(interactionTimer.current);
    onInteractionRef.current?.({ mode: 'none' });
  }, []);

  // ─── TTS ──────────────────────────────────────────────────────
  const speakText = useCallback(async (text) => {
    if (!text || text === '...') return;
    try {
      const res  = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${import.meta.env.VITE_ELEVEN_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVEN_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      const blob  = await res.blob();
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await new Promise((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play();
      });
    } catch (err) {
      console.warn('TTS failed:', err);
    }
  }, []);

  const moveBee = useCallback((x, y, scale) => {
    s.current.targetX     = x;
    s.current.targetY     = y;
    if (scale !== undefined) s.current.targetScale = scale;
  }, []);

  const screenToBeeWorld = useCallback((screenX, screenY) => {
  const camera = cameraRef.current;
  if (!camera) return null;

  const ndcX = (screenX / window.innerWidth) * 2 - 1;
  const ndcY = -(screenY / window.innerHeight) * 2 + 1;

  const distance = camera.position.z;
  const visibleHeight =
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
  const visibleWidth = visibleHeight * camera.aspect;

  return {
    x: ndcX * (visibleWidth / 2),
    y: ndcY * (visibleHeight / 2),
  };
}, []);

  // ─── Called by hotspot click ───────────────────────────────────
const handleHotspot = useCallback((speech, elementRect, element) => {
  const isCaretakerPillar = element?.classList?.contains('caretakers-pillar');

  let targetScreenX;
  let targetScreenY;

  if (isCaretakerPillar) {
    // Snap Mellie closer to the card, near the image side.
    targetScreenX = elementRect.right - Math.min(85, elementRect.width * 0.18);
    targetScreenY = elementRect.top + elementRect.height * 0.16;
  } else {
    // Default hotspot position.
    targetScreenX = elementRect.left + elementRect.width / 2;
    targetScreenY = elementRect.top - 30;
  }

  const worldPos = screenToBeeWorld(targetScreenX, targetScreenY);

  if (!worldPos) return;

  const wx = Math.max(-4.2, Math.min(4.2, worldPos.x));
  const wy = Math.max(-2.3, Math.min(2.4, worldPos.y));

  s.current.isInspecting = true;
  s.current.hotspotMoveSpeed = isCaretakerPillar ? 0.16 : 0.06;

  onSpeechRef.current?.({
    text: speech,
    visible: true,
    size: 'compact',
  });

  hideInteraction();

  moveBee(wx, wy, isCaretakerPillar ? 0.078 : 0.082);

  clearTimeout(s.current.inspectTimer);

  // For caretaker cards, keep Mellie snapped while the user is hovering.
  // The mouse-leave logic will release her.
  if (!isCaretakerPillar) {
    s.current.inspectTimer = setTimeout(() => {
      s.current.isInspecting = false;
      s.current.targetScale = 0.095;
      s.current.hotspotMoveSpeed = 0.06;
    }, 2200);
  }
}, [moveBee, hideInteraction, screenToBeeWorld]);

  // ─── AI query ─────────────────────────────────────────────────
  const handleQuery = useCallback(async (query) => {
    hideInteraction();
    onSpeechRef.current?.({ text: '...', visible: true });

    try {
      const res  = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 80,
          messages: [
            {
              role: 'system',
              content: `You are Mellie, a friendly honeybee mascot for Honeybee Heroes, a South African non-profit where people invest in beehives, trained women beekeepers care for the hives, and investors receive pure honey. Keep answers warm, short (2 sentences max).`,
            },
            { role: 'user', content: query },
          ],
        }),
      });
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim()
        || "That's a great question! I'm best at answering things about bees and honey.";

      onSpeechRef.current?.({ text: reply, visible: true });
      speakText(reply);
      interactionTimer.current = setTimeout(() => {
        onInteractionRef.current?.({ mode: 'ask' });
      }, 400);

    } catch {
      onSpeechRef.current?.({ text: "Buzz! Something went wrong. Try again!", visible: true });
      interactionTimer.current = setTimeout(() => {
        onInteractionRef.current?.({ mode: 'ask' });
      }, 3000);
    }
  }, [hideInteraction, speakText]);

  const handleChoiceAnswer = useCallback((reply) => {
    hideInteraction();
    onSpeechRef.current?.({ text: reply, visible: true });
    interactionTimer.current = setTimeout(() => {
      onInteractionRef.current?.({ mode: 'ask' });
    }, 3000);
  }, [hideInteraction]);

  // ─── Three.js init ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene    = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    scene.add(new THREE.DirectionalLight(0xffffff, 2.1).position.set(5, 6, 7) && new THREE.DirectionalLight(0xffffff, 2.1));
    const key  = new THREE.DirectionalLight(0xffffff, 2.1);  key.position.set(5, 6, 7);  scene.add(key);
    const fill = new THREE.DirectionalLight(0xffefcf, 1.15); fill.position.set(-4, 1, 5); scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const beeGroup = new THREE.Group();
    beeGroup.scale.set(0.095, 0.095, 0.095);
    beeGroup.position.set(4.8, 0.8, 0);
    scene.add(beeGroup);
    beeGroupRef.current = beeGroup;

    const loader = new GLTFLoader();
    loader.load('/bee.glb', (gltf) => {
      const mesh = gltf.scene;
      mesh.rotation.y = 0;
      beeGroup.add(mesh);
      if (gltf.animations?.length) {
        const mixer = new THREE.AnimationMixer(mesh);
        mixer.clipAction(gltf.animations[0]).play();
        mixerRef.current = mixer;
      }
onSpeechRef.current?.({
  text: "Hi! I'm Mellie, your guide through Honeybee Heroes. I’ll help you understand how one hive can support bees, women beekeepers, and the food we all rely on.",
  visible: true,
  size: 'large',
  lockToHero: true,
});
onInteractionRef.current?.({ mode: 'ask' });
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const time  = performance.now() * 0.001;

      if (mixerRef.current) mixerRef.current.update(delta);

      const bee   = beeGroupRef.current;
      if (!bee) return;
      const state = s.current;

      const idleHover = Math.sin(time * 2.1) * 0.075;
      const idleSide  = Math.cos(time * 1.4) * 0.018;
      const depth     = Math.cos(time * 1.3) * 0.025;

// If Mellie is in the inspect section, keep her attached to the frame
// If Mellie is in the inspect section, place her manually
if (state.isBeeInspectSection) {
  state.targetX = -5.3;
  state.targetY = -3.35;
}

// Pin Mellie to the top-right corner of the importance image card
// Importance section snap.
// Target X/Y comes from the ImportanceSection event,
// so this only keeps the scale stable while pinned.
if (
  state.isImportanceSection &&
  !state.isBeeInspectSection &&
  !state.isInspecting
) {
  state.targetScale = 0.072;
}

const desiredY = state.targetY + idleHover;
const dx = state.targetX - bee.position.x;
const dy = desiredY - bee.position.y;
const dist = Math.hypot(dx, dy);

const moveSpeed = state.isBeeInspectSection
  ? 0.14
  : state.hotspotMoveSpeed || 0.06;

bee.position.x += dx * moveSpeed;
bee.position.y += dy * moveSpeed;
      bee.position.z  = depth + idleSide;

if (state.isBeeInspectSection) {
  const isDragging = state.isUserRotating;

  const inspectRotY = state.manualRotY + (isDragging ? 0 : Math.sin(time * 0.8) * 0.04);
  const inspectRotX = state.manualRotX + (isDragging ? 0 : Math.sin(time * 1.1) * 0.018);
  const inspectRotZ = state.manualRotZ + (isDragging ? 0 : Math.cos(time * 0.9) * 0.018);

  let diffY = inspectRotY - bee.rotation.y;
  diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

  bee.rotation.y += diffY * 0.08;
  bee.rotation.x += (inspectRotX - bee.rotation.x) * 0.08;
  bee.rotation.z += (inspectRotZ - bee.rotation.z) * 0.08;
} else if (state.isImportanceSection) {
  // IMPORTANCE SECTION ROTATION CONTROLS
  // rotY = turns Mellie left/right
  // rotX = tilts Mellie up/down
  // rotZ = leans Mellie sideways

const importanceRotY = -1.1; // turns Mellie left/right
const importanceRotX = 0.05;  // tilts Mellie up/down
const importanceRotZ = -0.18; // leans Mellie sideways

  const floatRotY = Math.sin(time * 0.9) * 0.035;
  const floatRotX = Math.sin(time * 1.1) * 0.018;
  const floatRotZ = Math.cos(time * 0.8) * 0.018;

  let diffY = importanceRotY + floatRotY - bee.rotation.y;
  diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

  bee.rotation.y += diffY * 0.08;
  bee.rotation.x += (importanceRotX + floatRotX - bee.rotation.x) * 0.08;
  bee.rotation.z += (importanceRotZ + floatRotZ - bee.rotation.z) * 0.08;

} else {
  const isTravelling = dist > 0.12;
  let targetRotY = 0;
  if (isTravelling) targetRotY = (dx / dist) * 1;

  let diffY = targetRotY - bee.rotation.y;
  diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
  bee.rotation.y += diffY * 0.1;

  const bank  = THREE.MathUtils.clamp(dx * -0.16, -0.35, 0.35);
  bee.rotation.z += (bank - bee.rotation.z) * 0.07;

  const pitch =
    0.1 +
    THREE.MathUtils.clamp(dy * 0.1, -0.15, 0.15) +
    Math.sin(time * 2.6) * 0.025;

  bee.rotation.x += (pitch - bee.rotation.x) * 0.07;
}

      const cs = bee.scale.x;
      const ts = state.targetScale;
      bee.scale.setScalar(cs + (ts - cs) * 0.1);

      // ── Bubble follows bee ──
      const vec = new THREE.Vector3();
      bee.getWorldPosition(vec);
      vec.project(camera);
      const bx = (vec.x * 0.5 + 0.5) * window.innerWidth;
      const by = (-vec.y * 0.5 + 0.5) * window.innerHeight;
      const el = bubbleDomRef?.current;
      if (el) {
const bw = el.offsetWidth || Math.min(320, window.innerWidth - 24);
const bh = el.offsetHeight || 80;

// Move bubble directly above Mellie
// Bigger number = bubble moves higher above the bee
const normalBubbleGap = 135;
const inspectBubbleGap = 270;

const bubbleGap = state.isBeeInspectSection
  ? inspectBubbleGap
  : normalBubbleGap;

let left = bx - bw / 2;
let top = by - bh - bubbleGap;

// If the bee is too high, place the bubble below the bee instead
if (top < 12) {
  top = by + 60;
}

// Keep bubble inside the screen horizontally
if (left + bw > window.innerWidth - 12) {
  left = window.innerWidth - bw - 12;
}

if (left < 12) {
  left = 12;
}

// Keep bubble inside the screen vertically
if (top + bh > window.innerHeight - 12) {
  top = window.innerHeight - bh - 12;
}

// Decide if the tail should be at the top or bottom
const bubbleCenterY = top + bh / 2;
const beeIsAboveBubble = by < bubbleCenterY;

// Move the tail so it points closer to the bee,
// even when the bubble is pushed left or right by the screen edge.
const tailX = Math.max(24, Math.min(bw - 24, bx - left));

el.dataset.tail = beeIsAboveBubble ? 'top' : 'bottom';
el.style.setProperty('--tail-x', `${Math.round(tailX)}px`);

el.style.left = `${Math.round(left)}px`;
el.style.top = `${Math.round(top)}px`;
      }

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Mouse follow ─────────────────────────────────────────────
  useEffect(() => {
const onMove = (e) => {
if (
  s.current.isInspecting ||
  s.current.isBeeInspectSection ||
  s.current.isImportanceSection
) {
  return;
}
      const ndcX = (e.clientX / window.innerWidth)  * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      s.current.targetX = ndcX * 6.5;
      s.current.targetY = ndcY * 3.0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ─── Hotspot hover — speak on enter, restore on leave ─────────
  useEffect(() => {
    let current = null;
    let lastCheck = 0;
    let restoreTimer = null;

const onMove = (e) => {
  if (s.current.isBeeInspectSection) return;

  // Keep Mellie's hero intro stable.
  // Do not let random hover checks replace the intro while inside hero.
if (
  s.current.activeSectionId === 'hero' ||
  s.current.isImportanceSection
) {
  return;
}

  const now = performance.now();
      if (now - lastCheck < 40) return;
      lastCheck = now;

      let node  = document.elementFromPoint(e.clientX, e.clientY);
      let found = null;
      for (let i = 0; i < 5 && node; i++) {
        if (node.classList?.contains('hotspot')) { found = node; break; }
        node = node.parentElement;
      }

if (found && found !== current) {
  if (current) {
    current.classList.remove('is-mellie-speaking');
  }

  current = found;
  current.classList.add('is-mellie-speaking');

  clearTimeout(restoreTimer);

  const speech = found.dataset.speech || '';
  const rect = found.getBoundingClientRect();

  handleHotspot(speech, rect, found);
} else if (!found && current) {
  current.classList.remove('is-mellie-speaking');
  current = null;

  s.current.isInspecting = false;
  s.current.hotspotMoveSpeed = 0.06;
  s.current.targetScale = 0.095;
  restoreTimer = setTimeout(() => {
    const sectionSpeech = s.current.getActiveSectionSpeech?.()
      || "Hi! I'm Mellie. I’ll guide you through the most important parts of the hive story.";
    onSpeechRef.current?.({ text: sectionSpeech, visible: true });
    onInteractionRef.current?.({ mode: 'ask' });
  }, 400);
}
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [handleHotspot]);

  // ─── Section entry speech via IntersectionObserver ────────────
// ─── Section entry speech via IntersectionObserver ────────────
useEffect(() => {
const SECTION_SPEECHES = {
  hero: "Hi! I'm Mellie, your guide through Honeybee Heroes. I’ll help you understand how one hive can support bees, women beekeepers, and the food we all rely on.",
  importance: "Bees do far more than make honey. This part shows why pollination matters from flower to food.",
  'bee-inspect': "Let’s zoom in. You can explore my body up close and see how each part helps me work.",
  adoption: "This is how hive adoption works, from your support to real impact on the farm.",
  caretakers: "Every hive has people behind it. Here you’ll meet the women who care for the bees.",
  journey: "Here’s what your year as a hive supporter can look like, from adoption to honey and updates.",
  cta: "You’ve seen the full story. Now the next step is helping a real hive grow.",
};

  // Track which section is currently active
  let activeSectionId = null;

  const observers = [];

  document.querySelectorAll('section[id]').forEach((el) => {
    const id = el.getAttribute('id');
    const speech = SECTION_SPEECHES[id];
    if (!speech) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
if (entry.isIntersecting) {
  activeSectionId = id;
  s.current.activeSectionId = id;

  // Importance has its own slide-by-slide speech.
  // Do not use the generic section intro here.
  if (id === 'importance') return;

  if (!s.current.isInspecting) {
    onSpeechRef.current?.({
      text: speech,
      visible: true,
      size: id === 'hero' ? 'large' : 'compact',
      lockToHero: id === 'hero',
    });

    onInteractionRef.current?.({ mode: 'ask' });
  }
}
        });
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    observers.push(obs);
  });

  // Expose active section id so the hotspot leave handler
  // can restore the right section speech
  s.current.getActiveSectionSpeech = () =>
    SECTION_SPEECHES[activeSectionId] || SECTION_SPEECHES.hero;

  return () => observers.forEach((o) => o.disconnect());
}, []);

// ─── Bee inspection section mode ───────────────────────────────
useEffect(() => {
  const onInspect = (e) => {
    const detail = e.detail || {};

    if (detail.active) {
      clearTimeout(s.current.inspectTimer);

      s.current.isBeeInspectSection = true;
      s.current.isInspecting = true;
      s.current.inspectTargetId = detail.targetId || 'mellie-zoom-frame';
      s.current.targetScale = 0.21;

if (typeof detail.rotX === 'number') {
  s.current.manualRotX = detail.rotX;
}

if (typeof detail.rotY === 'number') {
  s.current.manualRotY = detail.rotY;
}

if (typeof detail.rotZ === 'number') {
  s.current.manualRotZ = detail.rotZ;
}

      onSpeechRef.current?.({
        text: detail.speech || 'Take a closer look at how my body helps me support the hive.',
        visible: true,
        size: 'large',
      });

      onInteractionRef.current?.({ mode: 'none' });
    } else {
      s.current.isBeeInspectSection = false;
      s.current.isInspecting = false;
      s.current.inspectTargetId = null;

      // Send Mellie away from the inspection snap position
      // This is a nice position for the Importance section after Bee Inspect.
      s.current.targetX = -7.5;
      s.current.targetY = 0;
      s.current.targetScale = 0.085;

      // Reset inspection rotation influence
      s.current.manualRotX = 0;
      s.current.manualRotY = 0;
      s.current.manualRotZ = 0;

      onSpeechRef.current?.({
        text:
          s.current.getActiveSectionSpeech?.() ||
          "Hi! I'm Mellie. I’ll guide you through the most important parts of the hive story.",
        visible: true,
        size: 'compact',
      });

      onInteractionRef.current?.({ mode: 'ask' });
    }
  };

  window.addEventListener('mellie:inspect', onInspect);

  return () => {
    window.removeEventListener('mellie:inspect', onInspect);
  };
}, []);

// ─── Importance section pin + slide speech ─────────────────────
useEffect(() => {
  const onImportance = (e) => {
    const detail = e.detail || {};

    if (detail.active) {
      const worldPos = screenToBeeWorld(
        detail.screenX ?? window.innerWidth * 0.9,
        detail.screenY ?? window.innerHeight * 0.42
      );

      s.current.isImportanceSection = true;
      s.current.isBeeInspectSection = false;
      s.current.isInspecting = false;

      // IMPORTANCE SECTION POSITION CONTROLS
      const IMPORTANCE_OFFSET_X = -1.7;
      const IMPORTANCE_OFFSET_Y = 0.6;
      const IMPORTANCE_SCALE = 0.072;

      if (worldPos) {
        s.current.targetX = worldPos.x + IMPORTANCE_OFFSET_X;
        s.current.targetY = worldPos.y + IMPORTANCE_OFFSET_Y;
      }

      s.current.targetScale = IMPORTANCE_SCALE;
    } else {
      s.current.isImportanceSection = false;
      s.current.targetScale = 0.095;
    }
  };

  const onImportanceSpeech = (e) => {
    const detail = e.detail || {};

    if (!detail.speech) return;

    s.current.activeSectionId = 'importance';

    clearTimeout(interactionTimer.current);

    onSpeechRef.current?.({
      text: detail.speech,
      visible: true,
      size: 'compact',
      lockToHero: false,
    });

    onInteractionRef.current?.({ mode: 'none' });
  };

  window.addEventListener('mellie:importance', onImportance);
  window.addEventListener('mellie:importance:speech', onImportanceSpeech);

  return () => {
    window.removeEventListener('mellie:importance', onImportance);
    window.removeEventListener('mellie:importance:speech', onImportanceSpeech);
  };
}, [screenToBeeWorld]);

// ─── Importance slide speech ───────────────────────────────────


// ─── Manual bee rotation while inspecting ─────────────────────
useEffect(() => {
  const onRotate = (e) => {
    const detail = e.detail || {};

    if (!s.current.isBeeInspectSection) return;

    if (typeof detail.rotX === 'number') {
      s.current.manualRotX = detail.rotX;
    }

    if (typeof detail.rotY === 'number') {
      s.current.manualRotY = detail.rotY;
    }

    if (typeof detail.rotZ === 'number') {
      s.current.manualRotZ = detail.rotZ;
    }
  };

  window.addEventListener('mellie:rotate', onRotate);

  return () => {
    window.removeEventListener('mellie:rotate', onRotate);
  };
}, []);


  return { canvasRef, moveBeeToSection: () => {}, handleHotspot, handleQuery, handleChoiceAnswer };
}