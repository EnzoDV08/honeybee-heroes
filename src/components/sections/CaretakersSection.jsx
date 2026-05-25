import Hotspot from '../Hotspot';
import '../../styles/sections/caretakers.css';

const PHOTOS = [
  { src: '/images/caretaker-1.jpg', alt: 'Beekeeper inspecting a hive', cls: 'photo-main' },
  { src: '/images/caretaker-2.jpg', alt: 'Woman in protective beekeeping suit', cls: 'photo-side-top' },
  { src: '/images/caretaker-3.jpg', alt: 'Beekeeper at work', cls: 'photo-side-bottom' },
];

const PILLARS = [
  {
    title: 'Skills, not handouts',
    body: 'Real, transferable beekeeping training — not charity.',
    speech: 'This is not charity. The women who care for these hives are trained beekeepers. It is a real, transferable craft.',
  },
  {
    title: 'Local, not abstract',
    body: 'Your investment stays in South Africa. The training happens here.',
    speech: 'The hives, the training, and the harvest all stay local. Your money supports work happening on South African soil.',
  },
  {
    title: 'Beyond the hive',
    body: 'Skills that can support a household long after.',
    speech: 'Each beekeeper goes home with knowledge that can support her family long after the training is over.',
  },
];

export default function CaretakersSection() {
  return (
    <section className="section caretakers-section" id="caretakers">
      <span className="section-num" aria-hidden="true">04</span>

      {/* Layered, atmospheric collage */}
      <div className="caretakers-stage">
        <div className="caretakers-photos">
          {PHOTOS.map((photo, i) => (
            <div key={i} className={`caretakers-photo ${photo.cls}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </div>
          ))}
          <div className="caretakers-photo-vignette" aria-hidden="true" />
        </div>

        <div className="caretakers-overlay-content">
          <span className="eyebrow caretakers-eyebrow">03 / The hands behind the honey</span>
          <h2 className="caretakers-headline">
            Your hive is in <em>her</em> hands.
          </h2>
          <p className="caretakers-deck">
            Every hive on the Honeybee Heroes farm is cared for by a trained South African woman.
            When you adopt, you do not just fund a hive. You fund a programme that gives a woman a
            craft, an income, and a future.
          </p>
        </div>
      </div>

      {/* Floating pillar cards */}
      <div className="caretakers-pillars">
        {PILLARS.map((p, i) => (
          <Hotspot
            key={p.title}
            className={`caretakers-pillar pillar-${i + 1}`}
            speech={p.speech}
          >
            <span className="pillar-num">⬡ 0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </Hotspot>
        ))}
      </div>

      {/* Pulled quote */}
      <blockquote className="caretakers-pullquote">
        <span className="pullquote-mark">&ldquo;</span>
        <p>The women on the farm are not the side story. <em>They are the story.</em></p>
      </blockquote>
    </section>
  );
}