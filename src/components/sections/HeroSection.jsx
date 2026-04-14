import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

export default function HeroSection() {
  const ref = useSection('hero');

  return (
    <section className="section story-section" id="hero" ref={ref}>
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Honeybee Heroes</span>
          <h1>Adopt a Hive.<br />Support something bigger.</h1>
          <p className="lead">
            When you invest in a hive, it stays safely on the Honeybee Heroes farms. You receive the
            pure honey it produces, while supporting bee care, education, and the trained women
            beekeepers who care for the hive on your behalf.
          </p>

          <div className="hero-actions">
            <Hotspot
              as="a"
              href="#importance"
              className="btn btn-primary"
              speech="Let's start with why bees matter in the first place."
            >
              See the story
            </Hotspot>

            <Hotspot
              className="btn btn-secondary"
              speech="You fund the hive, we build it on our farm, and you enjoy the honey!"
            >
              What is Adopt-a-Hive?
            </Hotspot>
          </div>
        </div>
      </div>
    </section>
  );
}
