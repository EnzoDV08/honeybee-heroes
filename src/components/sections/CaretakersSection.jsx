import Hotspot from '../Hotspot';
import '../../styles/sections/caretakers.css';

const PILLARS = [
  {
    title: 'Skills, not handouts',
    tag: 'Training',
    body: 'Low-income women are trained in hive care, safety, and honey handling.',
    detail:
      'Your support helps build practical skills while the wider farm team also helps care for the bees.',
    image: '/images/caretaker-2.jpg',
    speech:
      'This support helps low-income women build real beekeeping skills like hive care, safety, and honey handling. The bees are cared for by a wider farm team too, including men, so the impact supports people and hives together.',
  },
  {
    title: 'Local, not abstract',
    tag: 'Local impact',
    body: 'The support stays connected to South African hives, caretakers, and farm workers.',
    detail: 'The training, hive care, and honey journey happen close to home.',
    image: '/images/caretaker-1.jpg',
    speech:
      'Your support stays close to the farm. It helps real South African caretakers and farm workers look after real hives.',
  },
  {
    title: 'Beyond the hive',
    tag: 'Future skill',
    body: 'Beekeeping knowledge can keep creating value after one season.',
    detail:
      'It becomes practical experience that trained caretakers can carry forward.',
    image: '/images/caretaker-3.jpg',
    speech:
      'The skill does not end with one hive season. Beekeeping knowledge can become long-term experience that supports future opportunity for trained caretakers.',
  },
];

export default function CaretakersSection() {
  return (
    <section
      className="section caretakers-section"
      id="caretakers"
      style={{
        backgroundImage: "url('/images/pink.png')",
        backgroundSize: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="caretakers-wrap">
        <div className="caretakers-hero">
          <div className="caretakers-content">
            <h2 className="caretakers-headline">
              Your hive is in <em>caring</em> hands.
            </h2>

            <p className="caretakers-deck">
              Every hive on the Honeybee Heroes farm is cared for by a dedicated
              farm team. A key part of the project is training low-income South
              African women in practical beekeeping skills. When you adopt, you
              do not just fund a hive. You support{' '}
              <span className="caretakers-yellow-highlight">
                training, income, hive care, and a future.
              </span>
            </p>

            <blockquote className="caretakers-mini-quote">
              “The hive is cared for by a team, but the training given to women
              is one of the biggest parts of the impact.”
            </blockquote>
          </div>

          <div
            className="caretakers-visual-stack"
            aria-label="Honeybee Heroes farm caretakers"
          >
            <div className="caretakers-image-card">
              <div className="caretakers-image-glow" aria-hidden="true" />
              <div className="caretakers-image-honeycomb" aria-hidden="true" />

              <div className="caretakers-image-caption">
                <small>Farm caretakers</small>
                <span>Trained locally</span>
              </div>
            </div>

            <img
              className="caretakers-group-photo"
              src="/images/group-photo.png"
              alt="Honeybee Heroes farm caretakers and beekeeping team"
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

              <span className="pillar-listen-indicator" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </Hotspot>
          ))}
        </div>
      </div>
    </section>
  );
}