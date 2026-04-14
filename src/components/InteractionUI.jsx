import { useState, useEffect, useRef } from 'react';
import { useBee } from '../context/BeeContext';

export default function InteractionUI() {
  const { interaction, bubbleDomRef, handleQuery, handleChoiceAnswer } = useBee();
  const [inputVal, setInputVal] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const mode = interaction.mode;
  const isVisible = mode === 'ask' || mode === 'choices';

  // Update position directly on DOM — no React state, no cascading renders
useEffect(() => {
  const container = containerRef.current;
  const bubbleEl = bubbleDomRef?.current;
  if (!container || !bubbleEl) return;

  const rect = bubbleEl.getBoundingClientRect();
  const containerH = container.offsetHeight || 120;
  const containerW = container.offsetWidth || 280;
  const padding = 10;

  // Align left edge with bubble, clamp to viewport
  let left = rect.left;
  if (left + containerW > window.innerWidth - padding) {
    left = window.innerWidth - containerW - padding;
  }
  if (left < padding) left = padding;

  // Position above bubble, fall back below if no room
  let top = rect.top - containerH - 8;
  if (top < padding) top = rect.bottom + 8;

  container.style.left = `${left}px`;
  container.style.top = `${top}px`;
}, [mode, bubbleDomRef]);

  // Focus input when ask bar appears
  useEffect(() => {
    if (mode === 'ask' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [mode]);

  function onSubmit() {
    if (!inputVal.trim()) return;
    handleQuery(inputVal.trim());
    setInputVal('');
  }

  function onKeyPress(e) {
    if (e.key === 'Enter') onSubmit();
  }

  return (
    <div
      ref={containerRef}
      className={`interaction-container${isVisible ? ' active' : ''}`}
      style={{ left: '12px', top: '100px' }}
    >
      {mode === 'choices' && (
        <div className="floating-question-block">
          <p className="floating-question-text">{interaction.question}</p>
          <div className="options-grid">
            {interaction.options?.map((opt, i) => (
              <button
                key={opt.label}
                className="fly-in-option"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => handleChoiceAnswer(opt.reply)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'ask' && (
        <div className="chat-input-container mini-input">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask Mellie something..."
            aria-label="Ask Mellie something"
          />
          <button className="btn-send" onClick={onSubmit} aria-label="Send question">
            ➜
          </button>
        </div>
      )}
    </div>
  );
}