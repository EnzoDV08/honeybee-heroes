import { BeeProvider } from './context/BeeContext';
import BeeCanvas      from './components/BeeCanvas';
import SpeechBubble   from './components/SpeechBubble';
import InteractionUI  from './components/InteractionUI';

import HeroSection         from './components/sections/HeroSection';
import BeeInspectSection   from './components/sections/BeeInspectSection';
import ImportanceSection   from './components/sections/ImportanceSection';
import CaretakersSection   from './components/sections/CaretakersSection';
import JourneySection      from './components/sections/JourneySection';
import AdoptionSection     from './components/sections/AdoptionSection';
import CTASection          from './components/sections/CTASection';

export default function App() {
  return (
<BeeProvider>
  <BeeCanvas />
  <SpeechBubble />
  <InteractionUI />

      <main className="content">
        <HeroSection />
        <BeeInspectSection />     {/* Meet Mellie */}
        <ImportanceSection />     {/* Pollination Journey */}
        <CaretakersSection />     {/* The Women */}
        <JourneySection />        {/* Your Year */}
        <AdoptionSection />       {/* Packages */}
        <CTASection />
      </main>

      <footer className="site-footer" />
    </BeeProvider>
  );
}