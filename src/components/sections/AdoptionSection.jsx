import React from 'react';
import Hotspot from '../Hotspot';

const STEPS = [
  { num: '1', label: 'You Invest',     reveal: 'Your choice starts it all.',   media: '/images/invest.jpg',    speech: 'It starts with your choice to fund and invest in a new hive.' },
  { num: '2', label: 'We Build It',    reveal: 'Built safely on our farm.',    media: '/images/build.jpg',     speech: 'We build the hive on the Honeybee Heroes farm and ensure it thrives.' },
  { num: '3', label: 'Bees Pollinate', reveal: 'Nature does the rest.',        media: '/images/pollinate.jpg', speech: 'The bees do what they do best: pollinating the environment.' },
  { num: '4', label: 'You Get Honey',  reveal: 'Pure honey, straight to you.', media: '/images/honey.jpg',     speech: 'You get to enjoy the honey produced by the very hive you helped build.' },
];

export default function AdoptionSection() {
  return (
    <section className="section story-section alt" id="adoption">
      <span className="section-num" aria-hidden="true">03</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-adoption" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-adoption)"/>
      </svg>
      <div className="section-copy right">
        <span className="eyebrow">02</span>
        <h2>Your investment builds a home.</h2>
        <p>
          When you adopt a hive, you are funding the physical construction of a beehive on our
          farms. That support creates a safe, ethical home for the bees, while yielding delicious
          honey for you as a reward.
        </p>
      </div>
      <div className="impact-path">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.num}>
            <Hotspot className="path-step" speech={step.speech}>
              <span>{step.num}</span>
              <strong>{step.label}</strong>
              <span className="step-reveal">{step.reveal}</span>
              <div className="step-media">
                <img src={step.media} alt={step.label} loading="lazy" />
              </div>
            </Hotspot>
            {i < STEPS.length - 1 && <div className="path-line" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}