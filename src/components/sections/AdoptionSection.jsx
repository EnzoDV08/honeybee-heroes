import { useState } from 'react';
import Hotspot from '../Hotspot';
import '../../styles/sections/adoption.css';

const PACKAGES = [
  {
    name: 'Honeybee',
    badge: 'The Classic',
    tagline: 'Where every hero starts.',
    price: 'R2,900',
    media: '/images/packages/honeybee.jpeg',
    perks: [
      'Your name on a branded hive',
      'Six jars of raw honey',
      'Wooden honey dipper',
      'Official adoption certificate',
      'Beekeeping Experience for two',
    ],
    speech: 'The Honeybee is the classic adoption, your hive, your honey, and a Bee Experience for two.',
    href: 'https://www.honeybeeheroes.com/adopt-a-hive-form-honeybee',
  },
  {
    name: 'Queen Bee',
    badge: 'Honey Royalty',
    tagline: 'For the honey-lover who wants more.',
    price: 'R4,000',
    media: '/images/packages/queenbee.jpeg',
    perks: [
      'Everything in the Honeybee package',
      'Curated honey-based food selection',
      'Luxurious honey-infused beauty products',
    ],
    speech: 'The Queen Bee builds on the classic with curated honey foods and beauty products.',
    href: 'https://www.honeybeeheroes.com/adopt-a-hive-form-honeybee',
  },
  {
    name: 'Veldskoen',
    badge: 'Walks the Walk',
    tagline: 'For the bee-lover who walks the walk.',
    price: 'R4,000',
    media: '/images/packages/veldskoen.jpeg',
    perks: [
      'Everything in the Honeybee package',
      'Custom Veldskoen × Honeybee Heroes shoes',
      'Various colour options available',
    ],
    speech: 'The Veldskoen pairs your hive with a custom pair of Veldskoen × Honeybee Heroes shoes.',
    href: 'https://www.honeybeeheroes.com/adopt-a-hive-form-honeybee',
  },
  {
    name: 'Kidz',
    badge: 'For Little Heroes',
    tagline: 'Get the little ones buzzing about bees.',
    price: 'R4,000',
    media: '/images/packages/kidz.jpeg',
    perks: [
      'Everything in the Honeybee package',
      'DIY Gogga Hotel kit from Stumped',
      "Children's book on the life of bees",
    ],
    speech: 'The Kidz package is built for younger investors, full of educational extras for kids.',
    href: 'https://www.honeybeeheroes.com/adopt-a-hive-form-honeybee',
  },
];

export default function AdoptionSection() {
  // Default to the first package being open
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section adoption-section" id="adoption">
      
      <div className="adoption-header">
        <h2>Four ways to<br/>become a <em>hero.</em></h2>
        <p className="adoption-lead">
          Honeybee Heroes packages everything you need to start. Pick the one that fits, then
          head over to their site to make it real.
        </p>
      </div>

      <div className="package-gallery">
        {PACKAGES.map((pkg, i) => {
          const isActive = activeIndex === i;
          
          return (
          <article
            key={pkg.name}
            className={`package-panel ${isActive ? 'is-active' : ''}`}
            onMouseEnter={() => {
              if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                setActiveIndex(i);
              }
            }}
            onClick={() => setActiveIndex(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveIndex(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
          >
              {/* Background Image handling the visual weight */}
              <div className="panel-bg">
                <img src={pkg.media} alt={pkg.name} loading="lazy" />
                <div className="panel-gradient"></div>
              </div>

              {/* Collapsed Vertical Title */}
              <div className="panel-collapsed-title">
                <span>0{i + 1}</span>
                <h3>{pkg.name}</h3>
              </div>

              {/* Expanded Content Area */}
              <div className="panel-expanded-content">
                <Hotspot as="div" className="panel-hotspot" speech={pkg.speech}>
                  <span className="package-badge">{pkg.badge}</span>
                </Hotspot>

                <div className="panel-info">
                  <div className="panel-header-row">
                    <h3>{pkg.name}</h3>
                    <div className="panel-price">
                      <small>From</small>
                      <strong>{pkg.price}</strong>
                    </div>
                  </div>
                  
                  <p className="package-tagline">{pkg.tagline}</p>
                  
                  <ul className="package-perks">
                    {pkg.perks.map((perk, idx) => (
                      <li key={idx}>{perk}</li>
                    ))}
                  </ul>

                  <a className="package-cta" href={pkg.href} target="_blank" rel="noopener noreferrer">
                    Adopt {pkg.name} <span>→</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}