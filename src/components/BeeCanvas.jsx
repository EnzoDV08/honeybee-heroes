import { useBee } from '../context/BeeContext';
import '../styles/components/bee-canvas.css';

export default function BeeCanvas() {
  const { canvasRef } = useBee();
  return <canvas ref={canvasRef} className="bee-canvas" aria-hidden="true" />;
}
