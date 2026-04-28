import { useRef, useEffect } from 'react';
import { useBee } from '../context/BeeContext';

export default function SpeechBubble() {
  const { speech, bubbleDomRef } = useBee();
  const elRef   = useRef(null);
  const spanRef = useRef(null);
  const swapTimer = useRef(null);
  const currentText = useRef(speech.text);

  useEffect(() => {
    bubbleDomRef.current = elRef.current;
  }, [bubbleDomRef]);

  useEffect(() => {
    const span = spanRef.current;
    if (!span || !speech.text || speech.text === currentText.current) return;
    clearTimeout(swapTimer.current);

    span.style.opacity   = '0';
    span.style.transform = 'translateY(5px)';

    swapTimer.current = setTimeout(() => {
      currentText.current = speech.text;
      span.textContent     = speech.text;
      span.style.opacity   = '1';
      span.style.transform = 'translateY(0)';
    }, 160);

    return () => clearTimeout(swapTimer.current);
  }, [speech.text]);

  return (
    <div
      ref={elRef}
      className="speech-bubble"
      style={{
        opacity:   speech.visible ? 1 : 0,
        transform: speech.visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
      }}
      aria-live="polite"
    >
      {/* Honeycomb hex accent top-right */}
      <div className="bubble-hex-accent" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2L24.39 8V20L14 26L3.61 20V8L14 2Z"
            fill="rgba(181,122,18,0.12)"
            stroke="rgba(181,122,18,0.22)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Mellie label */}
      <div className="bubble-speaker">🐝 Mellie</div>

      {/* Text */}
      <span
        ref={spanRef}
        className="bubble-text"
        style={{
          display:    'block',
          transition: 'opacity 0.16s ease, transform 0.16s ease',
        }}
      >
        {speech.text}
      </span>

      {/* Tail — SVG pointing downward, positioned bottom-left by CSS */}
      <svg
        className="bubble-tail"
        width="22"
        height="14"
        viewBox="0 0 22 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 0 Q4 0 8 8 Q11 14 14 8 Q18 0 22 0"
          fill="#fffefa"
          stroke="rgba(181,122,18,0.28)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Mask the top border of the bubble where tail meets */}
        <rect x="0" y="0" width="22" height="1.5" fill="#fffefa" />
      </svg>
    </div>
  );
}