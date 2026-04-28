import Hotspot from '../Hotspot';

const CARDS = [
  {
    num: '01',
    title: 'Flowers',
    body: 'Bees help flowering plants reproduce and continue growing.',
    reveal: 'Hover to ask Mellie more about pollination.',
    media: '/images/flowers.jpg',
    speech: 'Flowers need pollination to reproduce, and bees help carry pollen from one flower to another.',
  },
  {
    num: '02',
    title: 'Food Crops',
    body: 'Pollination supports the crops people and farmers depend on.',
    reveal: 'Hover to ask Mellie about food systems.',
    media: '/images/food-crops.jpg',
    speech: 'Many crops depend on pollinators. When bees are healthy, food systems are stronger too.',
  },
  {
    num: '03',
    title: 'Biodiversity',
    body: 'Bees help ecosystems stay rich, healthy, and balanced.',
    reveal: 'Hover to ask Mellie about ecosystems.',
    media: '/images/biodiversity.jpg',
    speech: 'Healthy bee activity supports biodiversity by helping many different plants survive and spread.',
  },
];

export default function ImportanceSection() {
  return (
    <section className="section story-section" id="importance">
      <span className="section-num" aria-hidden="true">02</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-importance" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-importance)"/>
      </svg>
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
            <span className="card-reveal">{card.reveal}</span>
            <div className="card-media">
              <img src={card.media} alt={card.title} loading="lazy" />
            </div>
          </Hotspot>
        ))}
      </div>
    </section>
  );
}