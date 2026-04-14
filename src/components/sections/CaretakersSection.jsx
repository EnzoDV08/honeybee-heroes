import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

const TAGS = [
  { label: 'Suit',      speech: 'Protective gear helps our beekeepers work safely on the farm.' },
  { label: 'Hive',      speech: 'This is the hive you funded, carefully managed on our land.' },
  { label: 'Education', speech: 'Tools and training give these women the knowledge they need to succeed.' },
];

const PANELS = [
  { title: 'You fund the hive',    body: 'The investor provides the foundation without needing to learn beekeeping.' },
  { title: 'They provide the care', body: 'Trained women beekeepers look after the hive on the farm.' },
  { title: 'The impact is bigger', body: 'Your investment creates jobs, educates the public, and rewards you with honey.' },
];

export default function CaretakersSection() {
  const ref = useSection('caretakers');

  return (
    <section className="section story-section" id="caretakers" ref={ref}>
      <div className="section-copy left">
        <span className="eyebrow">03</span>
        <h2>Women beekeepers care for your hive.</h2>
        <p>
          One of the most meaningful parts of your investment is that trained women from low-income
          areas manage and care for the hive. This means your support empowers people with skills
          and livelihoods, while keeping your bees perfectly healthy.
        </p>
      </div>

      <div className="caretaker-layout">
        <div className="caretaker-visual">
          <div className="visual-circle" />
          {TAGS.map((tag, i) => (
            <Hotspot key={tag.label} className={`hotspot-tag tag-${i + 1}`} speech={tag.speech}>
              {tag.label}
            </Hotspot>
          ))}
        </div>

        <div className="impact-list">
          {PANELS.map((panel) => (
            <div key={panel.title} className="mini-panel">
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
