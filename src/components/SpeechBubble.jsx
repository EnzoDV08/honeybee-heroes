import { useRef, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { useBee } from '../context/BeeContext';
import '../styles/components/speech-bubble.css';

function MellieIcon({ className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={className} role="img" aria-label="Mellie">
        🐝
      </span>
    );
  }

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

export default function SpeechBubble() {
  const { speech, bubbleDomRef, hideSpeechBubble } = useBee();

const elRef = useRef(null);
const typingTimer = useRef(null);
const hideTimer = useRef(null);
const wordTimers = useRef([]);
const previousBubbleHeight = useRef(0);


const words = useMemo(() => {
  return speech.text ? speech.text.trim().split(/\s+/) : [];
}, [speech.text]);

const getWordDelaySeconds = (word) => {
  const lastChar = word.slice(-1);

  // Keep a constant word rhythm.
  // Only punctuation gets a small natural pause.
  if (lastChar === '.' || lastChar === '!' || lastChar === '?') return 0.72;
  if (lastChar === ',' || lastChar === ';' || lastChar === ':') return 0.48;

  // Every normal word appears at the same pace.
  return 0.34;
};

const timedWords = useMemo(() => {
  return words.map((word, index) => {
    const delay = words
      .slice(0, index)
      .reduce((total, previousWord) => {
        return total + getWordDelaySeconds(previousWord);
      }, 0);

    return {
      word,
      index,
      delay,
    };
  });
}, [words]);

const [visibleWordCount, setVisibleWordCount] = useState(0);




  useEffect(() => {
    bubbleDomRef.current = elRef.current;
  }, [bubbleDomRef]);

useEffect(() => {
  clearTimeout(typingTimer.current);
  clearTimeout(hideTimer.current);

  wordTimers.current.forEach((timer) => clearTimeout(timer));
  wordTimers.current = [];

  let cancelled = false;

  if (!speech.visible || !speech.text || timedWords.length === 0) {
    const resetTimer = setTimeout(() => {
      if (!cancelled) setVisibleWordCount(0);
    }, 0);

    wordTimers.current.push(resetTimer);

    return () => {
      cancelled = true;
      clearTimeout(typingTimer.current);
      clearTimeout(hideTimer.current);
      wordTimers.current.forEach((timer) => clearTimeout(timer));
      wordTimers.current = [];
    };
  }

  const resetTimer = setTimeout(() => {
    if (!cancelled) setVisibleWordCount(0);
  }, 0);

  wordTimers.current.push(resetTimer);

  timedWords.forEach(({ delay }, index) => {
    const wordTimer = setTimeout(() => {
      if (!cancelled) {
        setVisibleWordCount(index + 1);
      }
    }, delay * 1000);

    wordTimers.current.push(wordTimer);
  });

  const lastWord = timedWords[timedWords.length - 1];
  const totalSpeakingTime = (lastWord.delay * 1000) + 900;

  typingTimer.current = setTimeout(() => {
    const readingTime = Math.min(
      11000,
      Math.max(4500, speech.text.length * 55)
    );

    hideTimer.current = setTimeout(() => {
      hideSpeechBubble?.();
    }, readingTime);
  }, totalSpeakingTime);

  return () => {
    cancelled = true;
    clearTimeout(typingTimer.current);
    clearTimeout(hideTimer.current);
    wordTimers.current.forEach((timer) => clearTimeout(timer));
    wordTimers.current = [];
  };
}, [speech.text, speech.visible, timedWords, hideSpeechBubble]);

useLayoutEffect(() => {
  const el = elRef.current;
  if (!el || !speech.visible) return;

  const newHeight = el.getBoundingClientRect().height;
  const oldHeight = previousBubbleHeight.current || newHeight;

  if (Math.abs(newHeight - oldHeight) > 1) {
    el.animate(
      [
        { height: `${oldHeight}px` },
        { height: `${newHeight}px` },
      ],
      {
        duration: 240,
        easing: 'cubic-bezier(.22, .68, 0, 1)',
      }
    );
  }

  previousBubbleHeight.current = newHeight;
}, [visibleWordCount, speech.visible, speech.text]);

const sizeClass = speech.size === 'large' ? 'is-large' : 'is-compact';

const lastWord = timedWords[timedWords.length - 1];
const totalSpeakingTime = lastWord ? lastWord.delay + 0.9 : 0;

const visibleWords = timedWords.slice(0, visibleWordCount);

const isSpeaking =
  speech.visible &&
  speech.text &&
  visibleWordCount < timedWords.length;

  return (
<div
  ref={elRef}
  className={`speech-bubble ${sizeClass} ${isSpeaking ? 'is-speaking' : ''}`}
  style={{
    opacity: speech.visible ? 1 : 0,
    pointerEvents: speech.visible ? 'auto' : 'none',
    transform: speech.visible
      ? 'translateY(0) scale(1)'
      : 'translateY(8px) scale(0.96)',
    '--talk-duration': `${totalSpeakingTime}s`,
  }}
  aria-live="polite"
>
      <div className="bubble-speaker">
        <MellieIcon className="bubble-speaker-img" />
        <span>Mellie</span>

        {isSpeaking && (
          <span className="bubble-talking-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </div>

<span className="bubble-text" key={`${speech.text}-${speech.visible}`}>
  {visibleWords.map(({ word }, index) => (
    <span key={`${word}-${index}`} className="bubble-word-wrap">
      <span className="bubble-word-inner">
        {word}
      </span>
      {index < visibleWords.length - 1 ? ' ' : ''}
    </span>
  ))}
</span>

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
        <rect x="0" y="0" width="22" height="1.5" fill="#fffefa" />
      </svg>
    </div>
  );
}