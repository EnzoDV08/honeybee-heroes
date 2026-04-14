import React from 'react';
import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

const STEPS = [
  { num: '1', label: 'You Invest',     speech: 'It starts with your choice to fund and invest in a new hive.' },
  { num: '2', label: 'We Build It',    speech: 'We build the hive on the Honeybee Heroes farm and ensure it thrives.' },
  { num: '3', label: 'Bees Pollinate', speech: 'The bees do what they do best: pollinating the environment.' },
  { num: '4', label: 'You Get Honey',  speech: 'You get to enjoy the honey produced by the very hive you helped build.' },
];

export default function AdoptionSection() {
  const ref = useSection('adoption');

  return (
    <section className="section story-section alt" id="adoption" ref={ref}>
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
            </Hotspot>
            {i < STEPS.length - 1 && <div className="path-line" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}