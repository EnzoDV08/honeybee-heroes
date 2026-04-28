import { useRef, useEffect } from 'react';
import Hotspot from '../Hotspot';

const STORIES = [
  {
    id: 1,
    tag: 'Family Apiary',
    title: 'Why did you adopt? A family apiary',
    date: 'Jan 2022',
    img: '/images/stories/family-apiary.jpg',
    views: 55,
  },
  {
    id: 2,
    tag: 'For My Child',
    title: 'Safeguarding the future for my child',
    date: 'Apr 2022',
    img: '/images/stories/child.jpg',
    views: 104,
  },
  {
    id: 3,
    tag: 'Anniversary',
    title: 'Celebrating 4 years of marriage',
    date: 'Nov 2021',
    img: '/images/stories/marriage.jpg',
    views: 55,
  },
  {
    id: 4,
    tag: 'Aligned Values',
    title: 'Why did you adopt? Aligned values',
    date: 'Oct 2021',
    img: '/images/stories/values.jpg',
    views: 64,
  },
  {
    id: 5,
    tag: 'Lifelong Dream',
    title: 'Fulfilling a lifelong dream',
    date: 'Oct 2021',
    img: '/images/stories/dream.jpg',
    views: 62,
  },
  {
    id: 6,
    tag: 'In Memory',
    title: 'In memory of Johan Swart',
    date: 'Oct 2021',
    img: '/images/stories/johan.jpg',
    views: 104,
  },
];

const STORIES_DOUBLED = [...STORIES, ...STORIES];

export default function HeroSection() {
  const videoRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      const scrollDriven = window.scrollY / 2.5;
      const halfWidth = track.scrollWidth / 2;
      const pos = scrollDriven % halfWidth;
      track.style.transform = `translateX(-${pos}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        <img src="/images/hero-plants4.png" alt="" className="hero-plant-img" />
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
  <span className="stories-label-arrow">→</span>
</div>

{/* ── Stories strip ── */}
<div className="hero-stories-strip">
  {/* label div removed from here */}

        {/* Scrolling area */}
        <div className="stories-mask">
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
                <div className="story-card-body">
                  <span className="story-card-tag">{story.tag}</span>
                  <span className="story-card-title">{story.title}</span>
                  <span className="story-card-meta">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {story.views} · {story.date}
                  </span>
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