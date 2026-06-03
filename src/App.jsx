import { BeeProvider } from './context/BeeContext';
import BeeCanvas from './components/BeeCanvas';
import SpeechBubble from './components/SpeechBubble';
import InteractionUI from './components/InteractionUI';
import Footer from './components/Footer';
import NpoNavbar from './components/NpoNavbar';

import HeroSection from './components/sections/HeroSection';
import BeeInspectSection from './components/sections/BeeInspectSection';
import ImportanceSection from './components/sections/ImportanceSection';
import CaretakersSection from './components/sections/CaretakersSection';
import JourneySection from './components/sections/JourneySection';
import AdoptionSection from './components/sections/AdoptionSection';
import CTASection from './components/sections/CTASection';

import { useSectionReveal } from './hooks/useSectionReveal';
import './styles/components/section-reveal.css';
import './styles/theme-honeybeeheroes.css';

export default function App() {
  useSectionReveal();

  return (
    <BeeProvider>
      <BeeCanvas />
      <SpeechBubble />
      <InteractionUI />
      <NpoNavbar />

      <main className="content">
        <HeroSection />
        <ImportanceSection />
        <BeeInspectSection />
        <CaretakersSection />
        <JourneySection />
        <AdoptionSection />
        <CTASection />
      </main>

      <Footer />
    </BeeProvider>
  );
}