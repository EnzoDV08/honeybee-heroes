import Hotspot from '../Hotspot';

const STEPS = [
  { label: 'Fund',      reveal: 'You invest in a hive.',         speech: 'The journey begins when you choose to invest in a hive.' },
  { label: 'Build',     reveal: 'We construct it on the farm.',  speech: 'The hive is built and looked after on our farm.' },
  { label: 'Pollinate', reveal: 'Bees get to work.',             speech: 'Bees forage, work, and contribute to vital pollination.' },
  { label: 'Educate',   reveal: 'Communities learn and grow.',   speech: 'The public is educated about why this process matters.' },
  { label: 'Harvest',   reveal: 'Your honey arrives.',           speech: 'You receive the pure honey harvested from your hive.' },
];

export default function JourneySection() {
  return (
    <section className="section story-section alt" id="journey">
      <span className="section-num" aria-hidden="true">05</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-journey" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-journey)"/>
      </svg>
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
            <span className="step-reveal">{step.reveal}</span>
          </Hotspot>
        ))}
      </div>
    </section>
  );
}