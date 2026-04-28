import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBee } from '../context/BeeContext';

export default function InteractionUI() {
  const { interaction, bubbleDomRef, handleQuery, handleChoiceAnswer } = useBee();

  const [inputVal,    setInputVal]    = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showHint,    setShowHint]    = useState(true);

  const containerRef = useRef(null);
  const hintTimer    = useRef(null);

  const mode      = interaction.mode;
  const isVisible = mode === 'ask' || mode === 'choices';

  const options = useMemo(
    () => interaction.options ?? [],
    [interaction.options]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setInputVal('');
    setSelectedIdx(0);
    setShowHint(true);
    clearTimeout(hintTimer.current);
    if (isVisible) {
      hintTimer.current = setTimeout(() => setShowHint(false), 3200);
    }
    return () => clearTimeout(hintTimer.current);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const positionContainer = useCallback(() => {
    const container = containerRef.current;
    const bubbleEl  = bubbleDomRef?.current;
    if (!container || !bubbleEl) return;

    const rect = bubbleEl.getBoundingClientRect();
    const cH   = container.offsetHeight || 140;
    const cW   = container.offsetWidth  || 290;
    const pad  = 12;

    let left = rect.left;
    if (left + cW > window.innerWidth - pad) left = window.innerWidth - cW - pad;
    if (left < pad) left = pad;

    let top = rect.bottom + 10;
    if (top + cH > window.innerHeight - pad) top = rect.top - cH - 10;
    if (top < pad) top = pad;

    container.style.left = `${left}px`;
    container.style.top  = `${top}px`;
  }, [bubbleDomRef]);

  useEffect(() => {
    if (!isVisible) return;
    let raf;
    const tick = () => { positionContainer(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, positionContainer]);

  const submit = useCallback(() => {
    if (!inputVal.trim()) return;
    handleQuery(inputVal.trim());
    setInputVal('');
  }, [inputVal, handleQuery]);

  useEffect(() => {
  if (!isVisible) return;

  const onKeyDown = (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    const browserScrollKeys = [
      ' ',
      'Space',
      'Spacebar',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ];

    const browserBackKeys = ['Backspace'];

    if (
      browserScrollKeys.includes(e.key) ||
      browserBackKeys.includes(e.key) ||
      e.key === 'Enter'
    ) {
      e.preventDefault();
    }

    if (mode === 'ask') {
      if (e.key === 'Backspace') {
        setInputVal((v) => v.slice(0, -1));
        setShowHint(false);
      } else if (e.key === 'Enter') {
        submit();
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setInputVal((v) => v + e.key);
        setShowHint(false);
      }
    }

    if (mode === 'choices') {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setSelectedIdx((i) => Math.min(i + 1, options.length - 1));
        setShowHint(false);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setSelectedIdx((i) => Math.max(i - 1, 0));
        setShowHint(false);
      } else if (e.key === 'Enter') {
        const opt = options[selectedIdx];
        if (opt) handleChoiceAnswer(opt.reply);
      }
    }
  };

  window.addEventListener('keydown', onKeyDown, { passive: false });

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}, [isVisible, mode, options, selectedIdx, submit, handleChoiceAnswer]);

  return (
    <div
      ref={containerRef}
      className={`interaction-container${isVisible ? ' active' : ''}`}
      style={{ left: '12px', top: '200px' }}
    >
      {mode === 'ask' && (
        <div className="interaction-card ask-card">
          {showHint && (
            <div className="kb-hint">
              <span className="kb-key">Type</span> anything to ask Mellie
              <span className="kb-key enter-key">↵ Enter</span> to send
            </div>
          )}
          <div className="chat-input-row">
            <div className="chat-input-display" aria-label="Your message">
              {inputVal || <span className="chat-placeholder">Ask Mellie something…</span>}
              <span className="cursor-blink" aria-hidden="true">|</span>
            </div>
            <button
              className="btn-send"
              onClick={submit}
              aria-label="Send question"
              disabled={!inputVal.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M10 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {mode === 'choices' && (
        <div className="interaction-card choices-card">
          <p className="floating-question-text">{interaction.question}</p>

          {showHint && (
            <div className="kb-hint choices-hint">
              <span className="kb-key">↑↓</span> navigate
              <span className="kb-key enter-key">↵</span> choose
            </div>
          )}

          <div className="options-grid">
            {options.map((opt, i) => (
              <button
                key={opt.label}
                className={`fly-in-option${i === selectedIdx ? ' selected' : ''}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => handleChoiceAnswer(opt.reply)}
                onMouseEnter={() => { setSelectedIdx(i); setShowHint(false); }}
              >
                <span className="option-key" aria-hidden="true">{i + 1}</span>
                {opt.label}
                {i === selectedIdx && (
                  <span className="option-selected-indicator" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}