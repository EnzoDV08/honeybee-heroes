/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useBeeEngine } from '../hooks/useBeeEngine';

const BeeContext = createContext(null);

export function BeeProvider({ children }) {
  const [speech, setSpeech] = useState({
    text: "Hi! I'm Mellie. Let me show you how adopting a hive makes a real difference.",
    visible: false,
  });

  const [interaction, setInteraction] = useState({ mode: 'none' });

  // NEW: tells the input field to wait while Mellie is talking
  const [isMellieTalking, setIsMellieTalking] = useState(false);

  const bubbleDomRef = useRef(null);

  const onSpeechChange = useCallback((data) => {
    setSpeech(data);

    if (data?.visible && data?.text) {
      setIsMellieTalking(true);
    }
  }, []);

  const hideSpeechBubble = useCallback(() => {
    setSpeech((prev) => ({
      ...prev,
      visible: false,
    }));

    setIsMellieTalking(false);
  }, []);

  const onInteractionChange = useCallback((data) => {
    setInteraction(data);
  }, []);

  const {
    canvasRef,
    moveBeeToSection,
    handleHotspot,
    handleQuery,
    handleChoiceAnswer,
  } = useBeeEngine({
    onSpeechChange,
    onInteractionChange,
    bubbleDomRef,
  });

  return (
    <BeeContext.Provider
      value={{
        canvasRef,
        speech,
        interaction,
        bubbleDomRef,

        isMellieTalking,
        hideSpeechBubble,

        moveBeeToSection,
        handleHotspot,
        handleQuery,
        handleChoiceAnswer,
      }}
    >
      {children}
    </BeeContext.Provider>
  );
}

export function useBee() {
  return useContext(BeeContext);
}