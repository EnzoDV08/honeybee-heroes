import { useState } from 'react';
import Hotspot from '../Hotspot';
import '../../styles/sections/cta.css';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // Mailto fallback — opens user's email client with prefilled message
    const subject = encodeURIComponent('I would like to know more about adopting a hive');
    const body = encodeURIComponent(
      `Hi Honeybee Heroes,\n\nI just learned about your Adopt-a-Hive programme and I am interested in joining.\n\nPlease could you send me more information?\n\nThanks,\n${email}`
    );
    window.location.href = `mailto:hello@honeybeeheroes.co.za?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

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
<h2>You have met Mellie. Now go meet your hive.</h2>
<p>
  This page exists to help you understand what adopting a hive really means — the stakes, the
  women behind it, and what your support actually does. The hive itself, the payment, and the
  honey delivery are all handled by Honeybee Heroes on their official site. Click through to
  pick your package.
</p>

        <div className="cta-actions">
          <a
            href="https://www.honeybeeheroes.com/adopt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary cta-primary-link"
          >
            Adopt a Hive →
          </a>
          <a
            href="https://www.honeybeeheroes.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary cta-secondary-link"
          >
            Visit Honeybee Heroes
          </a>
        </div>

        <div className="cta-soft">
          <span className="cta-soft-label">Have a question first?</span>
          {!submitted ? (
            <form className="cta-soft-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Email Honeybee Heroes</button>
            </form>
          ) : (
            <p className="cta-soft-thanks">Your email is opening — Mellie says thanks.</p>
          )}
        </div>

        <p className="cta-trust">
          All adoptions, payments, and deliveries are handled by Honeybee Heroes — a registered
          South African non-profit. This page exists to introduce their work.
        </p>
      </div>
    </section>
  );
}