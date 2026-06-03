import '../styles/components/npo-navbar.css';

const LINKS_LEFT = [
  { label: 'Home', href: 'https://www.honeybeeheroes.com/' },
  { label: 'About Us', href: 'https://www.honeybeeheroes.com/who-we-are' },
  { label: 'Online Shop', href: 'https://honeybeeheroesstore.company.site/' },
];

const LINKS_RIGHT = [
  { label: 'Adopt A Hive', href: '#adoption', active: true },
  { label: 'Blog', href: 'https://www.honeybeeheroes.com/blog' },
  { label: 'Visit Us', href: 'https://www.honeybeeheroes.com/visit-our-farm' },
];

export default function NpoNavbar() {
  return (
    <header className="npo-navbar">
      <nav className="npo-navbar-inner" aria-label="Honeybee Heroes navigation">
        <div className="npo-nav-group npo-nav-left">
          {LINKS_LEFT.map((link) => (
            <a key={link.label} href={link.href} className="npo-nav-link">
              {link.label}
            </a>
          ))}
        </div>

        <a href="https://www.honeybeeheroes.com/" className="npo-nav-bee" aria-label="Honeybee Heroes home">
          <img src="/images/mellie-icon.svg" alt="" />
        </a>

        <div className="npo-nav-group npo-nav-right">
          {LINKS_RIGHT.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`npo-nav-link ${link.active ? 'is-active' : ''}`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="https://www.honeybeeheroes.com/donate"
            className="npo-nav-donate"
          >
            Donate
          </a>
        </div>
      </nav>
    </header>
  );
}