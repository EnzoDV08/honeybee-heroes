import Hotspot from '../Hotspot';
import '../../styles/sections/journey.css';


const TIMELINE = [
  {
    when: 'First',
    label: 'Welcome aboard.',
    body: 'Your hive gets your name. Your adoption certificate is sent. The relationship begins.',
    speech: 'It begins with a welcome — your hive is named, and your adoption certificate is sent to you.'
  },
  {
    when: 'Then',
    label: 'Your hive lives.',
    body: 'Built and tended on the farm by trained beekeepers. Yours, but in their care.',
    speech: 'Your hive is built and looked after on the farm by the trained beekeepers.'
  },
  {
    when: 'Throughout',
    label: 'Updates land.',
    body: 'Seasonal updates come through. You see your hive working. You see what your money is doing.',
    speech: 'Seasonal updates from your hive are sent through over the year.'
  },
  {
    when: 'Eventually',
    label: 'Your honey arrives.',
    body: 'Six jars of raw honey, harvested from the hives on the farm. Pure, local, traceable.',
    speech: 'Six jars of raw honey from the harvest arrive — pure, local, and traceable.'
  },
  {
    when: 'Then',
    label: 'You meet your bees.',
    body: 'Your complimentary Bee Experience for two — you and a guest, on the farm, hands-on.',
    speech: 'You and a guest are invited to the farm for a Bee Experience — meet the bees, meet the team.'
  },
  {
    when: 'And then',
    label: 'It keeps going.',
    body: 'The hive keeps producing. You can renew, gift, or simply enjoy what you have started.',
    speech: 'The story does not end — the hive keeps producing, and you can renew, gift, or share the experience.'
  },
];

export default function JourneySection() {
  return (
    <section className="section journey-section" id="journey">
      <span className="section-num" aria-hidden="true">05</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-journey" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-journey)"/>
      </svg>

      <div className="journey-header">
        <span className="eyebrow">04 / What unfolds</span>
        <h2>What happens<br/>after you <em>adopt.</em></h2>
        <p className="journey-lead">
          Adopting a hive is not a one-off donation. It is the start of a relationship that
          plays out across the year. Here is what unfolds, drawn straight from what every
          package includes.
        </p>
      </div>

      <ol className="journey-list">
        {TIMELINE.map((step, i) => (
          <Hotspot
            as="li"
            key={step.label}
            className={`journey-node ${i === TIMELINE.length - 1 ? 'final' : ''}`}
            speech={step.speech}
          >
            <span className="journey-node-marker" aria-hidden="true">
              <span className="journey-hex">⬡</span>
              <span className="journey-num">0{i + 1}</span>
            </span>
            <div className="journey-node-content">
              <span className="journey-when">{step.when}</span>
              <h3>{step.label}</h3>
              <p>{step.body}</p>
            </div>
          </Hotspot>
        ))}
      </ol>
    </section>
  );
}