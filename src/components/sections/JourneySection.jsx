import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

const STEPS = [
  { label: 'Fund',      speech: 'The journey begins when you choose to invest in a hive.' },
  { label: 'Build',     speech: 'The hive is built and looked after on our farm.' },
  { label: 'Pollinate', speech: 'Bees forage, work, and contribute to vital pollination.' },
  { label: 'Educate',   speech: 'The public is educated about why this process matters.' },
  { label: 'Harvest',   speech: 'You receive the pure honey harvested from your hive.' },
];

export default function JourneySection() {
  const ref = useSection('journey');

  return (
    <section className="section story-section alt" id="journey" ref={ref}>
      <div className="section-copy right">
        <span className="eyebrow">04</span>
        <h2>Your support becomes an ongoing story.</h2>
        <p>
          Adopting a hive is not just a one-time transaction. It is an ongoing journey of care,
          education, active pollination, and an annual honey harvest for you to enjoy.
        </p>
      </div>

      <div className="timeline">
        {STEPS.map((step) => (
          <Hotspot key={step.label} className="timeline-step" speech={step.speech}>
            <span>{step.label}</span>
          </Hotspot>
        ))}
      </div>
    </section>
  );
}
