import { useRef, useEffect } from 'react';
import Hotspot from '../Hotspot';
import '../../styles/sections/hero.css';
import '../../styles/sections/hero-stories.css';

const STORIES = [
  {
    id: 1,
    tag: 'Family Apiary',
    title: 'Why did you adopt? A family apiary',
    date: 'Jan 2022',
    img: '/images/stories/family-apiary.jpg',
    views: 55,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-a-family-apiary',
  },
  {
    id: 2,
    tag: 'For My Child',
    title: 'Safeguarding the future for my child',
    date: 'Apr 2022',
    img: '/images/stories/child.jpg',
    views: 104,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-safeguarding-the-future-for-my-child',
  },
  {
    id: 3,
    tag: 'Anniversary',
    title: 'Celebrating 4 years of marriage',
    date: 'Nov 2021',
    img: '/images/stories/marriage.jpg',
    views: 55,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-celebrating-4-years-of-marriage',
  },
  {
    id: 4,
    tag: 'Aligned Values',
    title: 'Why did you adopt? Aligned values',
    date: 'Oct 2021',
    img: '/images/stories/values.jpg',
    views: 64,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-aligned-values',
  },
  {
    id: 5,
    tag: 'Lifelong Dream',
    title: 'Fulfilling a lifelong dream',
    date: 'Oct 2021',
    img: '/images/stories/dream.jpg',
    views: 62,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-fulfilling-a-lifelong-dream',
  },
  {
    id: 6,
    tag: 'In Memory',
    title: 'In memory of Johan Swart',
    date: 'Oct 2021',
    img: '/images/stories/johan.jpg',
    views: 104,
    link: 'https://www.honeybeeheroes.com/post/why-did-you-adopt-in-memory-of-johan-swart',
  },
];

const STORIES_DOUBLED = [...STORIES, ...STORIES];

export default function HeroSection() {
const videoRef = useRef(null);
const trackRef = useRef(null);
const maskRef = useRef(null);

const dragOffsetRef = useRef(0);
const isDraggingRef = useRef(false);

const startXRef = useRef(0);
const startOffsetRef = useRef(0);

const velocityRef = useRef(0);
const lastXRef = useRef(0);
const lastTimeRef = useRef(0);
const animationRef = useRef(null);

useEffect(() => {
  const track = trackRef.current;
  const mask = maskRef.current;

  if (!track || !mask) return;

  function getLoopedPosition(value, halfWidth) {
    return ((value % halfWidth) + halfWidth) % halfWidth;
  }

  function updateStoriesPosition() {
    const halfWidth = track.scrollWidth / 2;
    if (!halfWidth) return;

    const scrollDriven = window.scrollY / 2.5;
    const totalPosition = scrollDriven + dragOffsetRef.current;
    const pos = getLoopedPosition(totalPosition, halfWidth);

    track.style.transform = `translateX(-${pos}px)`;
  }

  function stopMomentum() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }

  function startMomentum() {
    stopMomentum();

    function animate() {
      /*
        Bigger friction = stops faster.
        Smaller friction = slides longer.
        Try 0.94 to 0.97.
      */
      velocityRef.current *= 0.95;

      dragOffsetRef.current += velocityRef.current;
      updateStoriesPosition();

      if (Math.abs(velocityRef.current) > 0.15) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }

  function onScroll() {
    if (isDraggingRef.current) return;
    updateStoriesPosition();
  }

  function onPointerDown(e) {
    stopMomentum();

    isDraggingRef.current = true;

    startXRef.current = e.clientX;
    startOffsetRef.current = dragOffsetRef.current;

    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    mask.classList.add('is-dragging');
    mask.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const currentTime = performance.now();

    const dragDistance = currentX - startXRef.current;

    dragOffsetRef.current = startOffsetRef.current - dragDistance;

    const deltaX = currentX - lastXRef.current;
    const deltaTime = currentTime - lastTimeRef.current || 16;

    /*
      Negative because the strip moves opposite to the pointer movement.
      This creates the slide momentum after release.
    */
    velocityRef.current = -(deltaX / deltaTime) * 16;

    lastXRef.current = currentX;
    lastTimeRef.current = currentTime;

    updateStoriesPosition();
  }

  function stopDragging(e) {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;

    mask.classList.remove('is-dragging');
    mask.releasePointerCapture?.(e.pointerId);

    startMomentum();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  mask.addEventListener('pointerdown', onPointerDown);
  mask.addEventListener('pointermove', onPointerMove);
  mask.addEventListener('pointerup', stopDragging);
  mask.addEventListener('pointercancel', stopDragging);
  mask.addEventListener('pointerleave', stopDragging);

  updateStoriesPosition();

  return () => {
    window.removeEventListener('scroll', onScroll);

    mask.removeEventListener('pointerdown', onPointerDown);
    mask.removeEventListener('pointermove', onPointerMove);
    mask.removeEventListener('pointerup', stopDragging);
    mask.removeEventListener('pointercancel', stopDragging);
    mask.removeEventListener('pointerleave', stopDragging);

    stopMomentum();
  };
}, []);

  return (
    <section className="section story-section hero-section" id="hero">
      <span className="section-num" aria-hidden="true">01</span>

      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-hero" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-hero)"/>
      </svg>

      {/* ── Video + blur ── */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          src="/videos/beekeeper.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-video-blur" />



      </div>

                    {/* ── Plants layer ── */}
      <div className="hero-plant-layer" aria-hidden="true">
        <img src="/images/hero-plants.png" alt="" className="hero-plant-img" />
      </div>



      {/* ── Hero copy ── */}
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Honeybee Heroes</span>
          <h1>Adopt a Hive.<br />Support something bigger.</h1>
          <p className="lead">
            When you invest in a hive, it stays safely on the Honeybee Heroes farms. You receive the
            pure honey it produces, while supporting bee care, education, and the trained women
            beekeepers who care for the hive on your behalf.
          </p>
          <div className="hero-actions">
            <Hotspot as="a" href="#importance" className="btn btn-primary" speech="Let's start with why bees matter in the first place.">
              See the story
            </Hotspot>
            <Hotspot className="btn btn-secondary" speech="You fund the hive, we build it on our farm, and you enjoy the honey!">
              What is Adopt-a-Hive?
            </Hotspot>
          </div>
        </div>
      </div>

{/* ── Stories heading ── */}
<div className="stories-heading">
  <span className="stories-label-eyebrow">Real investors</span>
  <span className="stories-label-title">Why they adopted</span>
</div>

{/* ── Stories strip ── */}
<div className="hero-stories-strip">
  {/* label div removed from here */}

        {/* Scrolling area */}
        <div className="stories-mask" ref={maskRef}>
          <div className="stories-track" ref={trackRef}>
            {STORIES_DOUBLED.map((story, i) => (
              <div className="story-card" key={`${story.id}-${i}`}>

                {/* Image */}
                <div className="story-card-img">
                  <img
                    src={story.img}
                    alt={story.title}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  {/* Honeycomb fallback pattern */}
                  <div className="story-card-img-fallback" aria-hidden="true">
                    <svg viewBox="0 0 60 52" width="36" opacity="0.3">
                      <polygon points="30,2 56,14 56,40 30,52 4,40 4,14" fill="none" stroke="#b57a12" strokeWidth="2"/>
                      <polygon points="30,10 48,20 48,38 30,48 12,38 12,20" fill="rgba(181,122,18,0.15)" stroke="none"/>
                    </svg>
                  </div>
                </div>

                {/* Text content */}
{/* Text content */}
<div className="story-card-body">
  <span className="story-card-tag">{story.tag}</span>

  <span className="story-card-title">{story.title}</span>

  <div className="story-card-footer">
    <span className="story-card-meta">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {story.views} · {story.date}
    </span>

    <a
      href={story.link}
      target="_blank"
      rel="noopener noreferrer"
      className="story-card-button"
      onPointerDownCapture={(e) => e.stopPropagation()}
      onPointerUpCapture={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();

        if (!story.link || story.link.includes('PASTE-THE-REAL-STORY-LINK-HERE')) {
          e.preventDefault();
          console.warn('Please add the real story link for:', story.title);
        }
      }}
    >
      View story
    </a>
  </div>
</div>

                {/* Hover gold dot */}
                <div className="story-card-dot" aria-hidden="true" />
              </div>
            ))}
          </div>

          {/* Edge fade masks */}
          <div className="stories-fade-l" aria-hidden="true" />
          <div className="stories-fade-r" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}