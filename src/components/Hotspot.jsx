/* eslint-disable no-unused-vars */

import { useRef } from 'react';
import { useBee } from '../context/BeeContext';

/**
 * Hotspot — any clickable element that moves Mellie when clicked.
 * Pass `as` to render as a different element (default: button).
 */
export default function Hotspot({ as: Tag = 'button', speech, children, className = '', ...rest }) {
  const { handleHotspot } = useBee();
  const ref = useRef(null);

  function onClick(e) {
    if (ref.current) {
      handleHotspot(speech, ref.current.getBoundingClientRect());
    }
    rest.onClick?.(e);
  }

  return (
    <Tag ref={ref} className={`hotspot ${className}`} onClick={onClick} {...rest}>
      {children}
    </Tag>
  );
}
