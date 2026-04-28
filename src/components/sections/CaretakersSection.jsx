import Hotspot from '../Hotspot';

const TAGS = [
  { label: 'Suit',      speech: 'Protective gear helps our beekeepers work safely on the farm.' },
  { label: 'Hive',      speech: 'This is the hive you funded, carefully managed on our land.' },
  { label: 'Education', speech: 'Tools and training give these women the knowledge they need to succeed.' },
];

const PANELS = [
  { title: 'You fund the hive',     body: 'The investor provides the foundation without needing to learn beekeeping.' },
  { title: 'They provide the care', body: 'Trained women beekeepers look after the hive on the farm.' },
  { title: 'The impact is bigger',  body: 'Your investment creates jobs, educates the public, and rewards you with honey.' },
];

const CAROUSEL_IMAGES = [
  { src: '/images/caretaker-1.jpg', alt: 'Beekeeper inspecting a hive' },
  { src: '/images/caretaker-2.jpg', alt: 'Woman in protective suit' },
  { src: '/images/honey-harvest.jpg', alt: 'Fresh honey harvest' },
  { src: '/images/hive-farm.jpg', alt: 'Hives on the farm' },
  { src: '/images/caretaker-3.jpg', alt: 'Community beekeeper training' },
  { src: '/images/caretaker-1.jpg', alt: 'Beekeeper inspecting a hive' },
  { src: '/images/caretaker-2.jpg', alt: 'Woman in protective suit' },
  { src: '/images/honey-harvest.jpg', alt: 'Fresh honey harvest' },
  { src: '/images/hive-farm.jpg', alt: 'Hives on the farm' },
  { src: '/images/caretaker-3.jpg', alt: 'Community beekeeper training' },
];

export default function CaretakersSection() {
  return (
    <section className="section story-section" id="caretakers">
      <span className="section-num" aria-hidden="true">04</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-caretakers" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-caretakers)"/>
      </svg>
      <div className="section-copy left">
        <span className="eyebrow">03</span>
        <h2>Women beekeepers care for your hive.</h2>
        <p>
          One of the most meaningful parts of your investment is that trained women from low-income
          areas manage and care for the hive. This means your support empowers people with skills
          and livelihoods, while keeping your bees perfectly healthy.
        </p>
      </div>
      <div className="caretaker-layout">
        <div className="caretaker-carousel-wrap">
          <div className="caretaker-carousel-track">
            {CAROUSEL_IMAGES.map((img, i) => (
              <div key={i} className="carousel-slide">
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
          {TAGS.map((tag, i) => (
            <Hotspot key={tag.label} className={`hotspot-tag tag-${i + 1}`} speech={tag.speech}>
              {tag.label}
            </Hotspot>
          ))}
        </div>
        <div className="impact-list">
          {PANELS.map((panel) => (
            <div key={panel.title} className="mini-panel">
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}