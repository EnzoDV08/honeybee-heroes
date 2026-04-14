import { useRef, useEffect } from 'react';
import { useBee } from '../context/BeeContext';

export default function SpeechBubble() {
  const { speech, bubbleDomRef } = useBee();
  const elRef = useRef(null);
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

    // Fade out
    span.style.opacity = '0';
    span.style.transform = 'translateY(4px)';

    // Swap and fade in
    swapTimer.current = setTimeout(() => {
      currentText.current = speech.text;
      span.textContent = speech.text;
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
    }, 180);

    return () => clearTimeout(swapTimer.current);
  }, [speech.text]);

  return (
    <div
      ref={elRef}
      className="speech-bubble"
      style={{
        opacity: speech.visible ? 1 : 0,
        transform: speech.visible ? 'translateY(0)' : 'translateY(10px)',
      }}
      aria-live="polite"
    >
      <span
        ref={spanRef}
        style={{
          display: 'block',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {speech.text}
      </span>
    </div>
  );
}