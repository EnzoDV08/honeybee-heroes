import { BeeProvider } from './context/BeeContext';
import BeeCanvas from './components/BeeCanvas';
import SpeechBubble from './components/SpeechBubble';
import InteractionUI from './components/InteractionUI';
import HeroSection from './components/sections/HeroSection';
import ImportanceSection from './components/sections/ImportanceSection';
import AdoptionSection from './components/sections/AdoptionSection';
import CaretakersSection from './components/sections/CaretakersSection';
import JourneySection from './components/sections/JourneySection';
import CTASection from './components/sections/CTASection';

export default function App() {
  return (
    <BeeProvider>
      <BeeCanvas />
      <SpeechBubble />
      <InteractionUI />

      <main className="content">
        <HeroSection />
        <ImportanceSection />
        <AdoptionSection />
        <CaretakersSection />
        <JourneySection />
        <CTASection />
      </main>

      <footer className="site-footer" />
    </BeeProvider>
  );
}
