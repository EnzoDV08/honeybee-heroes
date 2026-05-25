import { useState, useRef, useMemo, useEffect } from 'react';
import { useBee } from '../context/BeeContext';
import '../styles/components/interaction.css';

/* drag-to-scroll for the prompt carousel: click-drag with a mouse,
   native swipe on touch. Also toggles edge-fade classes so the user
   can see there's more to scroll in each direction. */
function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });

  const updateEdges = () => {
    const el = ref.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 2;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    el.classList.toggle('at-start', atStart);
    el.classList.toggle('at-end', atEnd);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateEdges); ro.disconnect(); };
  }, []);

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
    el.classList.add('dragging');
  };
  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved += Math.abs(dx);
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    const el = ref.current;
    if (el) el.classList.remove('dragging');
    // brief flag so a drag doesn't also fire a chip click
    const wasDrag = drag.current.moved > 6;
    drag.current.down = false;
    return wasDrag;
  };

  // expose a function (read at click-time, never during render) instead
  // of the raw ref, so a chip can tell a real tap from a drag.
  const wasDragging = () => drag.current.moved > 6;

  return { ref, onPointerDown, onPointerMove, endDrag, wasDragging };
}

/* Mellie icon — uses your image at /images/mellie-icon.svg.
   Falls back to the bee emoji if the file isn't there yet, so
   nothing breaks before you add the asset. */
function MellieIcon({ className }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={className} role="img" aria-label="Mellie">🐝</span>;
  return (
    <img
      src="/images/mellie-icon.svg"
      alt=""
      className={className}
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}

export default function InteractionUI() {
  const {
    interaction,
    handleQuery,
    handleChoiceAnswer,
    hideSpeechBubble,
  } = useBee();

  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const inputRef = useRef(null);
  const closeTimer = useRef(null);
  const {
    ref: carouselRef,
    onPointerDown: onTrackDown,
    onPointerMove: onTrackMove,
    endDrag: onTrackUp,
    wasDragging,
  } = useDragScroll();

  const mode = interaction?.mode;
  const options = useMemo(() => interaction?.options ?? [], [interaction?.options]);
  const hasChoices = mode === 'choices' && options.length > 0;

  const quickPrompts = [
    'How does adopting a hive help?',
    'What do I get with a package?',
    'Who looks after the hives?',
    'How much does a hive cost?',
    'Where do the hives live?',
    'Why are bees so important?',
    'Can I visit my hive?',
    'How is the honey harvested?',
    'What makes the honey special?',
    'Who are the women beekeepers?',
    'How long does adoption last?',
    'Can I gift a hive to someone?',
  ];

  function openInput() {
    clearTimeout(closeTimer.current);
    hideSpeechBubble?.();
    setIsClosing(false);
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 180);
  }

  // animate the panel out, THEN unmount, so closing isn't an abrupt cut
  function closeInput() {
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 240);
  }

  function submit() {
    if (!inputVal.trim()) return;
    hideSpeechBubble?.();
    handleQuery(inputVal.trim());
    setInputVal('');
    closeInput();
  }

  function handleQuickPrompt(prompt) {
    clearTimeout(closeTimer.current);
    hideSpeechBubble?.();
    setInputVal(prompt);
    setIsClosing(false);
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 180);
  }

  return (
    <div className={`interaction-container active ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button
          type="button"
          className="mellie-reply-launcher"
          onClick={openInput}
          aria-label="Open Mellie reply input"
        >
<span className="launcher-bee">
  <MellieIcon className="launcher-bee-img" />
</span>

<span className="launcher-copy">
  <span className="launcher-title">Ask Mellie</span>
  <span className="launcher-subtitle">
    <span className="launcher-live-dot" />
    Online · ask anytime
  </span>
</span>

<span className="launcher-cta">
  <span>Chat</span>
  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8h9M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</span>

<span className="launcher-shine" aria-hidden="true" />
<span className="launcher-click-ring" aria-hidden="true" />
<span className="launcher-pulse" aria-hidden="true" />
        </button>
      )}

      {isExpanded && (
        <div className={`interaction-shell ${isClosing ? 'is-closing' : ''}`}>
          <div className="interaction-topbar">
            <span className="topbar-avatar">
              <MellieIcon className="topbar-avatar-img" />
            </span>
            <div className="topbar-copy">
              <span className="interaction-kicker">Mellie is listening</span>
              <strong>Ask anything about the hive</strong>
            </div>
            <button
              type="button"
              className="interaction-collapse-btn"
              onClick={closeInput}
              aria-label="Collapse Mellie input"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="interaction-card ask-card">
            <div className="chat-input-row">
              <input
                ref={inputRef}
                className="chat-real-input"
                value={inputVal}
                onFocus={() => hideSpeechBubble?.()}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                placeholder="Ask Mellie something…"
                aria-label="Ask Mellie something"
              />
              <button
                className="btn-send"
                onClick={submit}
                aria-label="Send question"
                disabled={!inputVal.trim()}
              >
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M10 4l4 4-4 4" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="prompt-carousel">
              <div
                className="prompt-track at-start"
                ref={carouselRef}
                onPointerDown={onTrackDown}
                onPointerMove={onTrackMove}
                onPointerUp={onTrackUp}
                onPointerLeave={onTrackUp}
                onPointerCancel={onTrackUp}
              >
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={prompt}
                    type="button"
                    className="prompt-chip"
                    style={{ animationDelay: `${0.08 + i * 0.035}s` }}
                    onClick={() => {
                      // ignore the click if the user was dragging
                      if (wasDragging()) return;
                      handleQuickPrompt(prompt);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasChoices && (
            <div className="interaction-card choices-card soft-choice-card">
              <p className="floating-question-text">
                Mellie also asked:
                <span>{interaction.question}</span>
              </p>
              <div className="options-grid">
                {options.map((opt, i) => (
                  <button
                    key={opt.label}
                    className="fly-in-option"
                    style={{ animationDelay: `${0.12 + i * 0.07}s` }}
                    onClick={() => {
                      hideSpeechBubble?.();
                      handleChoiceAnswer(opt.reply);
                      closeInput();
                    }}
                  >
                    <span className="option-key" aria-hidden="true">{i + 1}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}