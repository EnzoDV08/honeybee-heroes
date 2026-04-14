import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SECTIONS_DATA } from '../data/sections';

export function useBeeEngine({ onSpeechChange, onInteractionChange, bubbleDomRef }) {
  const canvasRef = useRef(null);

  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const rendererRef = useRef(null);
  const beeGroupRef = useRef(null);
  const mixerRef    = useRef(null);
  const clockRef    = useRef(new THREE.Clock());
  const rafRef      = useRef(null);

  const s = useRef({
    targetX: 4.8,
    targetY: 0.8,
    targetScale: 0.095,
    defaultScale: 0.095,
    currentSectionId: null,
    speech: "Hi! I'm Mellie. Let me show you how adopting a hive makes a real difference.",
    restingRotY: 0,
    isInspecting: false,
    inspectTimer: null,
    lockToCTA: false,
    freezeOnCTA: false,
  });

  const showSpeechRef    = useRef(false);
  const interactionTimer = useRef(null);
  const scrollEndTimer   = useRef(null);
  const isSpeechHidden   = useRef(false);
  const hasInteractedRef = useRef(false);
  const hasSpokenRef     = useRef(false);
  const speakTextRef     = useRef(null);

  const onSpeechRef      = useRef(onSpeechChange);
  const onInteractionRef = useRef(onInteractionChange);
  useEffect(() => { onSpeechRef.current = onSpeechChange; });
  useEffect(() => { onInteractionRef.current = onInteractionChange; });

  function clampX(x) {
    return Math.max(-6.5, Math.min(6.5, x));
  }

  const hideInteraction = useCallback(() => {
    clearTimeout(interactionTimer.current);
    onInteractionRef.current?.({ mode: 'none' });
  }, []);

  // ─── ElevenLabs TTS — defined BEFORE showInteractionFor ──────
  const speakText = useCallback(async (text) => {
    if (!text || text === '...') return;
    try {
      const response = await fetch(
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
      const blob  = await response.blob();
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await new Promise((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.play();
      });
    } catch (err) {
      console.warn('TTS failed:', err);
    }
  }, []);

  useEffect(() => { speakTextRef.current = speakText; }, [speakText]);

  const showInteractionFor = useCallback((sectionData) => {
    if (!sectionData) return;
    clearTimeout(interactionTimer.current);

    const speak = async () => {
      if (hasInteractedRef.current && !hasSpokenRef.current) {
        hasSpokenRef.current = true;
        await speakText(sectionData.speech);
      }
      interactionTimer.current = setTimeout(() => {
        if (sectionData.interaction === 'choices') {
          onInteractionRef.current?.({
            mode: 'choices',
            question: sectionData.question,
            options: sectionData.options,
          });
        } else if (sectionData.interaction === 'ask') {
          onInteractionRef.current?.({ mode: 'ask' });
        } else {
          onInteractionRef.current?.({ mode: 'none' });
        }
      }, 400);
    };

    speak();
  }, [speakText]);

  const moveBee = useCallback((x, y, speech, scale) => {
    s.current.targetX = x;
    s.current.targetY = y;
    if (scale !== undefined) s.current.targetScale = scale;
    if (speech != null) s.current.speech = speech;
  }, []);

  const moveBeeToSection = useCallback((sectionData) => {
    if (!sectionData) return;
    if (s.current.currentSectionId === sectionData.id) return;

    const { x, y, rot, scale } = sectionData.bee;
    s.current.currentSectionId = sectionData.id;
    s.current.defaultScale     = scale;
    s.current.restingRotY      = rot;
    s.current.isInspecting     = false;

    showSpeechRef.current  = false;
    isSpeechHidden.current = true;
    hasSpokenRef.current   = false;
    onSpeechRef.current?.({ text: '', visible: false });
    hideInteraction();
    moveBee(clampX(x), y, sectionData.speech, scale);
  }, [moveBee, hideInteraction]);

  const handleHotspot = useCallback((speech, elementRect) => {
    if (s.current.lockToCTA && s.current.currentSectionId === 'cta') return;

    const vx   = elementRect.left + elementRect.width / 2;
    const vy   = elementRect.top - 30;
    const ndcX = (vx / window.innerWidth) * 2 - 1;
    const ndcY = -(vy / window.innerHeight) * 2 + 1;
    const worldX = Math.max(-3.2, Math.min(3.2, ndcX * 5.2));
    const worldY = Math.max(-1.6, Math.min(2.2, ndcY * 3.4));

    s.current.isInspecting = true;
    showSpeechRef.current  = false;
    isSpeechHidden.current = true;
    onSpeechRef.current?.({ text: '', visible: false });
    hideInteraction();
    moveBee(worldX, worldY, speech, 0.082);

    clearTimeout(s.current.inspectTimer);
    s.current.inspectTimer = setTimeout(() => {
      s.current.targetScale  = 0.092;
      s.current.isInspecting = false;
    }, 320);
  }, [moveBee, hideInteraction]);

  // ─── AI query handler ─────────────────────────────────────────
  const handleQuery = useCallback(async (query) => {
    hasInteractedRef.current = true;
    hideInteraction();
    showSpeechRef.current  = false;
    isSpeechHidden.current = false;
    s.current.speech = '...';
    onSpeechRef.current?.({ text: '...', visible: true });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 80,
          messages: [
            {
              role: 'system',
              content: `You are Mellie, a friendly honeybee mascot for Honeybee Heroes — a South African non-profit where people invest in beehives on the farm, trained women beekeepers care for the hives, and investors receive pure honey. Keep answers warm, short (2 sentences max), and always relate back to bees, honey, pollination, or the Honeybee Heroes mission.`,
            },
            { role: 'user', content: query },
          ],
        }),
      });

      const data  = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim()
        || "That's a great question! I'm best at answering things about bees, honey, and our hives.";

      s.current.speech = reply;
      onSpeechRef.current?.({ text: reply, visible: true });
      moveBee(s.current.targetX, s.current.targetY - 0.12, reply, 0.11);
      await speakText(reply);

      interactionTimer.current = setTimeout(() => {
        onInteractionRef.current?.({ mode: 'ask' });
      }, 400);

    } catch {
      const fallback = "Buzz! Something went wrong on my end. Try asking me again!";
      s.current.speech = fallback;
      onSpeechRef.current?.({ text: fallback, visible: true });

      interactionTimer.current = setTimeout(() => {
        onInteractionRef.current?.({ mode: 'ask' });
      }, 3000);
    }
  }, [moveBee, hideInteraction, speakText]);

  const handleChoiceAnswer = useCallback((reply) => {
    hasInteractedRef.current = true;
    hideInteraction();
    showSpeechRef.current  = false;
    isSpeechHidden.current = true;
    onSpeechRef.current?.({ text: '', visible: false });
    moveBee(s.current.targetX, s.current.targetY, reply, s.current.defaultScale);

    clearTimeout(s.current.inspectTimer);
    s.current.inspectTimer = setTimeout(() => {
      s.current.isInspecting = false;
    }, 400);

    interactionTimer.current = setTimeout(() => {
      onInteractionRef.current?.({ mode: 'ask' });
    }, 3000);
  }, [moveBee, hideInteraction]);

  // ─── Three.js init ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffefcf, 1.15);
    fillLight.position.set(-4, 1, 5);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const beeGroup = new THREE.Group();
    scene.add(beeGroup);
    beeGroupRef.current = beeGroup;
    beeGroup.scale.set(0.095, 0.095, 0.095);
    beeGroup.position.set(4.8, 0.8, 0);

    const loader = new GLTFLoader();
    loader.load('/bee.glb', (gltf) => {
      const beeMesh = gltf.scene;
      beeMesh.rotation.y = -Math.PI / 2;
      beeGroup.add(beeMesh);
      if (gltf.animations?.length) {
        const mixer = new THREE.AnimationMixer(beeMesh);
        mixer.clipAction(gltf.animations[0]).play();
        mixerRef.current = mixer;
      }
      showSpeechRef.current  = true;
      isSpeechHidden.current = false;
      onSpeechRef.current?.({ text: s.current.speech, visible: true });
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();
      const time  = performance.now() * 0.001;

      if (mixerRef.current) mixerRef.current.update(delta);

      const bee = beeGroupRef.current;
      if (!bee) return;

      const state = s.current;

      const idleHover = state.freezeOnCTA ? 0 : Math.sin(time * 2.1) * 0.075;
      const idleSide  = state.freezeOnCTA ? 0 : Math.cos(time * 1.4) * 0.018;
      const depth     = state.freezeOnCTA ? 0 : Math.cos(time * 1.3) * 0.025;

      const desiredY = state.targetY + idleHover;
      const dx = state.targetX - bee.position.x;
      const dy = desiredY      - bee.position.y;

      const dist      = Math.hypot(dx, dy);
      const lerpSpeed = 0.022;

      bee.position.x += dx * lerpSpeed;
      bee.position.y += dy * lerpSpeed;
      bee.position.z  = depth + idleSide;

      const isTravelling = dist > 0.06;

      let desiredRotY = state.restingRotY;
      if (isTravelling) {
        const angle = (dx / (dist || 1)) * 0.55;
        const blend = THREE.MathUtils.clamp((dist - 0.1) / 1.2, 0, 1);
        desiredRotY = state.restingRotY + (angle - state.restingRotY) * blend;
      }

      let diffY = desiredRotY - bee.rotation.y;
      diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
      bee.rotation.y += diffY * 0.07;

      const bank = THREE.MathUtils.clamp(dx * -0.16, -0.35, 0.35);
      bee.rotation.z += (bank - bee.rotation.z) * 0.07;

      const pitch = 0.1 + THREE.MathUtils.clamp(dy * 0.1, -0.15, 0.15) + Math.sin(time * 2.6) * 0.025;
      bee.rotation.x += (pitch - bee.rotation.x) * 0.07;

      const cs = bee.scale.x;
      bee.scale.set(
        cs + (state.targetScale - cs) * 0.1,
        cs + (state.targetScale - cs) * 0.1,
        cs + (state.targetScale - cs) * 0.1,
      );

      // ── Show speech once bee has arrived ──
      if (!isTravelling && isSpeechHidden.current) {
        isSpeechHidden.current = false;
        showSpeechRef.current  = true;
        onSpeechRef.current?.({ text: state.speech, visible: true });
        const sec = SECTIONS_DATA.find(d => d.id === state.currentSectionId);
        if (sec) showInteractionFor(sec);
      }

      // ── Bubble position — direct DOM, zero re-renders ──
      const vec = new THREE.Vector3();
      bee.getWorldPosition(vec);
      vec.project(camera);
      const bx = (vec.x * 0.5 + 0.5) * window.innerWidth;
      const by = (-vec.y * 0.5 + 0.5) * window.innerHeight;
      const el = bubbleDomRef?.current;
      if (el) {
        const bw = Math.min(280, window.innerWidth - 24);
        const bh = el.offsetHeight || 80;
        let left = bx + 20;
        let top  = by - bh - 20;
        if (left + bw > window.innerWidth - 10) left = bx - bw - 18;
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

  // ─── Scroll handler ───────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        if (s.current.speech) {
          speakTextRef.current?.(s.current.speech);
        }
      }
      clearTimeout(scrollEndTimer.current);

      const state    = s.current;
      const footerEl = document.querySelector('.site-footer');

      if (footerEl) {
        const fr = footerEl.getBoundingClientRect();
        if (fr.top < window.innerHeight && fr.bottom > 0) {
          if (!state.lockToCTA) {
            state.lockToCTA   = true;
            state.freezeOnCTA = true;
            const ctaData = SECTIONS_DATA.find(d => d.id === 'cta');
            if (ctaData) moveBeeToSection(ctaData);
          }
          return;
        }
      }

      if (state.lockToCTA) {
        state.lockToCTA   = false;
        state.freezeOnCTA = false;
      }

      if (!isSpeechHidden.current) {
        isSpeechHidden.current = true;
        showSpeechRef.current  = false;
        onSpeechRef.current?.({ text: '', visible: false });
        hideInteraction();
      }

      scrollEndTimer.current = setTimeout(() => {
        isSpeechHidden.current = false;
      }, 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [moveBeeToSection, hideInteraction]);

  return { canvasRef, moveBeeToSection, handleHotspot, handleQuery, handleChoiceAnswer };
}