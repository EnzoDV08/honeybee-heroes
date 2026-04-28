import { BeeProvider } from './context/BeeContext';
import BeeCanvas      from './components/BeeCanvas';
import SpeechBubble   from './components/SpeechBubble';
import InteractionUI  from './components/InteractionUI';
import PollenCursor   from './components/HoneyCursor';   // ← new

import HeroSection      from './components/sections/HeroSection';
import ImportanceSection from './components/sections/ImportanceSection';
import BeeInspectSection from './components/sections/BeeInspectSection';
import AdoptionSection  from './components/sections/AdoptionSection';
import CaretakersSection from './components/sections/CaretakersSection';
import JourneySection   from './components/sections/JourneySection';
import CTASection       from './components/sections/CTASection';

export default function App() {
  return (
    <BeeProvider>
      {/* Cursor layer — sits above everything, pointer-events: none */}
      <PollenCursor />

      {/* Three.js bee */}
      <BeeCanvas />

      {/* Bee speech & interaction */}
      <SpeechBubble />
      <InteractionUI />

      {/* Page content */}
      <main className="content">
        <HeroSection />
        <ImportanceSection />
        <BeeInspectSection />
        <AdoptionSection />
        <CaretakersSection />
        <JourneySection />
        <CTASection />
      </main>

      <footer className="site-footer" />
    </BeeProvider>
  );
}