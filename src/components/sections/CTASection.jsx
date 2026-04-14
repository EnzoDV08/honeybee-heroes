import { useSection } from '../../hooks/useSection';
import Hotspot from '../Hotspot';

export default function CTASection() {
  const ref = useSection('cta');

  return (
    <section className="section cta-section" id="cta" ref={ref}>
      <div className="cta-box">
        <span className="eyebrow">05</span>
        <h2>Fund a Hive. Enjoy the Honey.</h2>
        <p>
          Join Honeybee Heroes. Your investment builds a hive on our farm, helps us educate the
          world about pollination, empowers women beekeepers, and rewards you with pure, ethical
          honey.
        </p>

        <div className="cta-actions">
          <Hotspot
            className="btn btn-primary"
            speech="This is where the journey becomes yours. Let's build a hive!"
          >
            Invest in a Hive
          </Hotspot>

          <Hotspot
            className="btn btn-secondary"
            speech="Learn more about our Non-Profit Organization and our educational goals."
          >
            About Our Mission
          </Hotspot>
        </div>
      </div>
    </section>
  );
}
