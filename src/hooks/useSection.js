import { useRef, useEffect } from 'react';
import { useBee } from '../context/BeeContext';
import { SECTIONS_DATA } from '../data/sections';

export function useSection(sectionId) {
  const ref = useRef(null);
  const { moveBeeToSection } = useBee();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const data = SECTIONS_DATA.find((s) => s.id === sectionId);
    if (!data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger once when section crosses 40% visibility
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            moveBeeToSection(data);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId, moveBeeToSection]);

  return ref;
}