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


// Close-up bee inspection mode
isBeeInspectSection: false,
inspectTargetId: null,
manualRotX: 0,
manualRotY: 0,
manualRotZ: 0,
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

  // ─── Called by hotspot click ───────────────────────────────────
  const handleHotspot = useCallback((speech, elementRect) => {
    const vx   = elementRect.left + elementRect.width  / 2;
    const vy   = elementRect.top  - 30;
    const ndcX = (vx / window.innerWidth)  * 2 - 1;
    const ndcY = -(vy / window.innerHeight) * 2 + 1;
    const wx   = Math.max(-3.2, Math.min(3.2, ndcX * 5.2));
    const wy   = Math.max(-1.6, Math.min(2.2, ndcY * 3.4));

    s.current.isInspecting = true;
    onSpeechRef.current?.({ text: speech, visible: true });
    hideInteraction();
    moveBee(wx, wy, 0.082);

    clearTimeout(s.current.inspectTimer);
    s.current.inspectTimer = setTimeout(() => {
      s.current.isInspecting = false;
      s.current.targetScale  = 0.095;
    }, 2200);
  }, [moveBee, hideInteraction]);

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
              content: `You are Mellie, a friendly honeybee mascot for Honeybee Heroes — a South African non-profit where people invest in beehives, trained women beekeepers care for the hives, and investors receive pure honey. Keep answers warm, short (2 sentences max).`,
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
  text: "Hi! I'm Mellie — your guide to Honeybee Heroes. Hover anything and I'll explain it!",
  visible: true,
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
if (state.isBeeInspectSection && state.inspectTargetId) {
  const targetEl = document.getElementById(state.inspectTargetId);

  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();

    // This controls where inside the circle Mellie sits
    const screenX = rect.left + rect.width * 0.05;
    const screenY = rect.top + rect.height * 0.9;

    const ndcX = (screenX / window.innerWidth) * 2 - 1;
    const ndcY = -(screenY / window.innerHeight) * 2 + 1;

    state.targetX = THREE.MathUtils.clamp(ndcX * 5.2, -4.2, 4.2);
    state.targetY = THREE.MathUtils.clamp(ndcY * 3.2, -2.2, 2.2);
  }
}

const desiredY = state.targetY + idleHover;
const dx = state.targetX - bee.position.x;
const dy = desiredY - bee.position.y;
const dist = Math.hypot(dx, dy);

const moveSpeed = state.isBeeInspectSection ? 0.14 : 0.06;

bee.position.x += dx * moveSpeed;
bee.position.y += dy * moveSpeed;
      bee.position.z  = depth + idleSide;

if (state.isBeeInspectSection) {
  const inspectRotY = state.manualRotY + Math.sin(time * 0.8) * 0.08;
  const inspectRotX = state.manualRotX + Math.sin(time * 1.1) * 0.035;
  const inspectRotZ = state.manualRotZ + Math.cos(time * 0.9) * 0.035;

  let diffY = inspectRotY - bee.rotation.y;
  diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

  bee.rotation.y += diffY * 0.08;
  bee.rotation.x += (inspectRotX - bee.rotation.x) * 0.08;
  bee.rotation.z += (inspectRotZ - bee.rotation.z) * 0.08;
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
        const bw = Math.min(280, window.innerWidth - 24);
        const bh = el.offsetHeight || 80;
        let left = bx + 70;
        let top  = by - bh - 20;
        if (left + bw > window.innerWidth  - 10) left = bx - bw - 18;
        if (left < 10) left = 10;
        if (top  < 10) top  = by + 20;
        if (top + bh > window.innerHeight - 10) top = window.innerHeight - bh - 10;
        el.style.left = `${left}px`;
        el.style.top  = `${top}px`;
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
      if (s.current.isInspecting) return;
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
        current = found;
        clearTimeout(restoreTimer);
        const speech = found.dataset.speech || '';
        const rect   = found.getBoundingClientRect();
        handleHotspot(speech, rect);
} else if (!found && current) {
  current = null;
  s.current.isInspecting = false;
  restoreTimer = setTimeout(() => {
    const sectionSpeech = s.current.getActiveSectionSpeech?.()
      || "Hi! I'm Mellie. Hover over anything and I'll tell you all about it!";
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
  hero: "Hi! I'm Mellie. Hover over anything on the page and I'll tell you all about it!",
  importance: "Bees do far more than make honey. Hover the cards to learn what they keep alive.",
  'bee-inspect': "Let's zoom in! Choose a part of my body and I'll show you how it helps the hive.",
  adoption: "This is how your investment works. Hover each step to follow the journey.",
  caretakers: "These are the women behind every hive. Hover the tags to learn more about them.",
  journey: "From funding to harvest — hover each stage to see what happens along the way.",
  cta: "You've seen the full story. Ready to fund a hive and make a real difference?",
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
            // Only speak the section intro if bee is not
            // currently inspecting a hotspot
            if (!s.current.isInspecting) {
              onSpeechRef.current?.({ text: speech, visible: true });
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

      s.current.manualRotX = detail.rotX ?? 0;
      s.current.manualRotY = detail.rotY ?? 0;
      s.current.manualRotZ = detail.rotZ ?? 0;

      onSpeechRef.current?.({
        text: detail.speech || 'Take a closer look at how my body helps me support the hive.',
        visible: true,
      });

      onInteractionRef.current?.({ mode: 'none' });
    } else {
      s.current.isBeeInspectSection = false;
      s.current.isInspecting = false;
      s.current.inspectTargetId = null;
      s.current.targetScale = 0.095;

      onSpeechRef.current?.({
        text:
          s.current.getActiveSectionSpeech?.() ||
          "Hi! I'm Mellie. Hover over anything and I'll tell you all about it!",
        visible: true,
      });

      onInteractionRef.current?.({ mode: 'ask' });
    }
  };

  window.addEventListener('mellie:inspect', onInspect);

  return () => {
    window.removeEventListener('mellie:inspect', onInspect);
  };
}, []);
  return { canvasRef, moveBeeToSection: () => {}, handleHotspot, handleQuery, handleChoiceAnswer };
}