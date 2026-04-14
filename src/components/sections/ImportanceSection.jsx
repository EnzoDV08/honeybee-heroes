import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

const CARDS = [
  {
    num: '01',
    title: 'Flowers',
    body: 'Bees help flowering plants reproduce and continue growing.',
    speech: 'Flowers need pollination to reproduce, and bees help carry pollen from one flower to another.',
  },
  {
    num: '02',
    title: 'Food Crops',
    body: 'Pollination supports the crops people and farmers depend on.',
    speech: 'Many crops depend on pollinators. When bees are healthy, food systems are stronger too.',
  },
  {
    num: '03',
    title: 'Biodiversity',
    body: 'Bees help ecosystems stay rich, healthy, and balanced.',
    speech: 'Healthy bee activity supports biodiversity by helping many different plants survive and spread.',
  },
];

export default function ImportanceSection() {
  const ref = useSection('importance');

  return (
    <section className="section story-section" id="importance" ref={ref}>
      <div className="section-copy left">
        <span className="eyebrow">01</span>
        <h2>Bees help keep life connected.</h2>
        <p>
          Our goal is to help people learn how important bees are. They do much more than make
          honey—they help pollinate flowers, support plant growth, and play a massive role in global
          food systems.
        </p>
      </div>

      <div className="card-grid">
        {CARDS.map((card) => (
          <Hotspot key={card.num} className="info-card" speech={card.speech}>
            <span className="card-number">{card.num}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </Hotspot>
        ))}
      </div>
    </section>
  );
}
