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

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/images/mellie-icon.svg" alt="Honeybee Heroes logo" />
            </div>

            <div>
              <span>Honeybee Heroes</span>
              <h2>Adopt a hive. Support real local impact.</h2>
            </div>
          </div>

          <button
            type="button"
            className="footer-adopt-btn"
            onClick={() => scrollToSection('adoption')}
          >
            Adopt a Hive
            <span>→</span>
          </button>
        </div>

        <div className="footer-main">
          <div className="footer-about">
            <p>
              A simple interactive journey showing how one hive supports bees,
              women beekeepers, honey, and local pollination.
            </p>

            <div className="footer-impact-row">
              <span>Training</span>
              <span>Honey</span>
              <span>Pollination</span>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <button
                key={link.target}
                type="button"
                onClick={() => scrollToSection(link.target)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Honeybee Heroes</span>

          <div className="footer-bottom-actions">
            <a
              href="https://www.honeybeeheroes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official site
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('hero')}
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}