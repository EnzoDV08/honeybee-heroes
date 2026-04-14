import { useBee } from '../context/BeeContext';

export default function BeeCanvas() {
  const { canvasRef } = useBee();
  return <canvas ref={canvasRef} className="bee-canvas" aria-hidden="true" />;
}
