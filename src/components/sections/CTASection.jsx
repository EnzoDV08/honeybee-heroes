import Hotspot from '../Hotspot';

export default function CTASection() {
  return (
    <section className="section cta-section" id="cta">
      <span className="section-num" aria-hidden="true">06</span>
      <svg className="section-hex-bg" aria-hidden="true">
        <pattern id="hex-cta" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,38 28,50 2,38 2,14" fill="none" stroke="#b57a12" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-cta)"/>
      </svg>
      <div className="cta-box">
        <span className="eyebrow">05</span>
        <h2>Fund a Hive. Enjoy the Honey.</h2>
        <p>
          Join Honeybee Heroes. Your investment builds a hive on our farm, helps us educate the
          world about pollination, empowers women beekeepers, and rewards you with pure, ethical
          honey.
        </p>
        <div className="cta-actions">
          <Hotspot className="btn btn-primary" speech="This is where the journey becomes yours. Let's build a hive!">
            Invest in a Hive
          </Hotspot>
          <Hotspot className="btn btn-secondary" speech="Learn more about our Non-Profit Organization and our educational goals.">
            About Our Mission
          </Hotspot>
        </div>
      </div>
    </section>
  );
}