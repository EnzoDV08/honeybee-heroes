import Hotspot from '../Hotspot';
import '../../styles/sections/caretakers.css';

const PILLARS = [
{
  title: 'Skills, not handouts',
  tag: 'Training',
  body: 'Real, transferable beekeeping training — not charity.',
  detail: 'Learning real hive care, safety, and honey skills.',
  image: '/images/caretaker-2.jpg',
  speech:
    'This is not charity. The women who care for these hives are trained beekeepers. It is a real, transferable craft.',
},
  {
    title: 'Local, not abstract',
    tag: 'Local impact',
    body: 'Your investment stays in South Africa. The training happens here.',
    detail: 'Support stays local and helps real people on the farm.',
    impact: 'Keeps support close to home',
    image: '/images/caretaker-1.jpg',
    speech:
      'The hives, the training, and the harvest all stay local. Your money supports work happening on South African soil.',
  },
  {
    title: 'Beyond the hive',
    tag: 'Future skill',
    body: 'Skills that can support a household long after.',
    detail: 'Knowledge that can support a family beyond one season.',
    impact: 'Creates long-term opportunity',
    image: '/images/caretaker-3.jpg',
    speech:
      'Each beekeeper goes home with knowledge that can support her family long after the training is over.',
  },
  
];

export default function CaretakersSection() {
  return (
    <section className="section caretakers-section" id="caretakers">
      <div className="caretakers-wrap">
        <div className="caretakers-hero">
          <div className="caretakers-content">
            <span className="eyebrow caretakers-eyebrow">
              The hands behind the honey
            </span>

            <h2 className="caretakers-headline">
              Your hive is in <em>her</em> hands.
            </h2>

            <p className="caretakers-deck">
              Every hive on the Honeybee Heroes farm is cared for by a trained South
              African woman. When you adopt, you do not just fund a hive. You fund
              training, income, and a future.
            </p>

            <blockquote className="caretakers-mini-quote">
              “The women on the farm are not the side story. <em>They are the story.</em>”
            </blockquote>
          </div>

<div className="caretakers-visual-stack" aria-label="Beekeeper at work">
  <div className="caretakers-image-card">
    <div className="caretakers-image-glow" aria-hidden="true" />
    <div className="caretakers-image-honeycomb" aria-hidden="true" />

    <div className="caretakers-image-label">
      <span>Hive caretaker</span>
      <strong>Trained locally</strong>
    </div>
  </div>

  <img
    className="caretakers-group-photo"
    src="/images/group-photo.png"
    alt="Group of Honeybee Heroes caretakers"
    loading="lazy"
    onError={(e) => {
      e.currentTarget.style.opacity = '0';
    }}
  />
</div>
        </div>

        <div className="caretakers-pillars">
          {PILLARS.map((p, i) => (
            <Hotspot
              key={p.title}
              className={`caretakers-pillar pillar-${i + 1}`}
              speech={p.speech}
            >
              <div className="pillar-honeycomb" aria-hidden="true">
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <span className="pillar-num">⬡ 0{i + 1}</span>
              <span className="pillar-tag">{p.tag}</span>

<h3>{p.title}</h3>

<p className="pillar-main-text">{p.body}</p>

<p className="pillar-extra-text">{p.detail}</p>

<span className="pillar-action">Ask Mellie about this →</span>
            </Hotspot>
          ))}
        </div>
      </div>
    </section>
  );
}