import '../styles/components/footer.css';

const quickLinks = [
  { label: 'Home', target: 'hero' },
  { label: 'Why bees matter', target: 'importance' },
  { label: 'Meet Mellie', target: 'bee-inspect' },
  { label: 'Women beekeepers', target: 'caretakers' },
  { label: 'Your journey', target: 'journey' },
  { label: 'Adopt a hive', target: 'adoption' },
];

export default function Footer() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-bg-comb" aria-hidden="true" />
      <div className="footer-glow footer-glow-left" aria-hidden="true" />
      <div className="footer-glow footer-glow-right" aria-hidden="true" />

      <div className="footer-shell">
        <div className="footer-left">
          <div className="footer-brand-row">
            <div className="footer-logo">
              <img src="/images/mellie-icon.svg" alt="Honeybee Heroes logo" />
            </div>

            <div>
              <span className="footer-small-label">Honeybee Heroes</span>
              <h2>Small hives. Real local impact.</h2>
            </div>
          </div>

          <p>
            Adopt a hive, support women beekeepers, protect pollination,
            receive local honey from the farm.
          </p>

          <div className="footer-cta-row">
            <button
              type="button"
              className="footer-main-btn"
              onClick={() => scrollToSection('adoption')}
            >
              Adopt a Hive
              <span>→</span>
            </button>

            <button
              type="button"
              className="footer-ghost-btn"
              onClick={() => scrollToSection('journey')}
            >
              View journey
            </button>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-column">
            <h3>Explore</h3>

            <div className="footer-link-list">
              {quickLinks.slice(0, 3).map((link) => (
                <button
                  key={link.target}
                  type="button"
                  onClick={() => scrollToSection(link.target)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h3>Support</h3>

            <div className="footer-link-list">
              {quickLinks.slice(3).map((link) => (
                <button
                  key={link.target}
                  type="button"
                  onClick={() => scrollToSection(link.target)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-note-card">
            <span>Hive impact</span>
            <strong>Training · Honey · Pollination</strong>
            <p>One adoption connects people back to the hive.</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Honeybee Heroes</span>

        <button
          type="button"
          onClick={() => scrollToSection('hero')}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}