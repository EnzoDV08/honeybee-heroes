import ScrollStack, { ScrollStackItem } from '../ScrollStack';
import '../../styles/sections/journey.css';

import step1 from '../../../public/images/step1.png';

const JOURNEY_STEPS = [
  {
    number: '01',
    kicker: 'Hive adoption',
    title: 'Your hive is yours.',
    text: 'A hand-crafted beehive with your name on it is placed on the farm and cared for by trained beekeepers.',
    extra:
      'This helps people understand that adoption is not just a gift product. It directly supports real hive care, local beekeeping work, and the protection of bee colonies.',
    image: step1,
    alt: 'Adopted beehive',
    label: 'Named hive placed on the farm',
  },
  {
    number: '02',
    kicker: 'Seasonal updates',
    title: 'You follow the story.',
    text: 'Across the year, you receive updates showing what is happening inside your hive and how your support is helping.',
    extra:
      'Instead of only receiving honey at the end, adopters stay connected to the hive journey through simple updates about the bees, the farm, and the beekeepers.',
    image: '/images/journey-update.png',
    alt: 'Seasonal hive update',
    label: 'Updates from your hive',
  },
  {
    number: '03',
    kicker: 'Honey box',
    title: 'Your box arrives.',
    text: 'You receive an adoption box with 6 jars of raw local honey and your official adoption certificate.',
    extra:
      'The honey becomes a physical reminder of the impact. It shows the link between healthy bees, ethical harvesting, and real local produce.',
    image: '/images/journey-honey.png',
    alt: 'Honey adoption box',
    label: 'Raw local honey and certificate',
  },
  {
    number: '04',
    kicker: 'Bee experience',
    title: 'You meet your bees.',
    text: 'You and a guest are invited to the farm for a complimentary Bee Experience where the impact becomes real and personal.',
    extra:
      'This turns the adoption into a memory. Visitors can see the farm, learn about bees, and understand why pollination matters for food, plants, and communities.',
    image: '/images/journey-farm.png',
    alt: 'Bee farm experience',
    label: 'Complimentary visit for two',
  },
];

const isMobile =
  typeof window !== 'undefined' && window.innerWidth <= 768;

export default function JourneySection() {
  return (
    <section className="journey-section" id="journey">
      <div className="journey-heading">
        <span>Adopt-a-hive journey</span>
        <h2>
          What happens after you <em>adopt.</em>
        </h2>
        <p>
          From naming your hive to receiving honey and visiting the farm, this
          journey shows how one adoption supports bees, beekeepers, and local
          biodiversity.
        </p>
      </div>

<ScrollStack
  className="journey-stack"
  useWindowScroll={true}
  itemDistance={isMobile ? 80 : 120}
  itemScale={isMobile ? 0.018 : 0.03}
  itemStackDistance={isMobile ? 22 : 38}
  stackPosition={isMobile ? '10%' : '15%'}
  scaleEndPosition={isMobile ? '5%' : '8%'}
  baseScale={isMobile ? 0.9 : 0.84}
  rotationAmount={0}
  blurAmount={0}
>
        {JOURNEY_STEPS.map((step) => (
          <ScrollStackItem key={step.number} itemClassName="journey-card">
            <div className="journey-card-layout">
              <div className="journey-card-copy">
                <span className="journey-card-number">{step.number}</span>
                <span className="journey-card-kicker">{step.kicker}</span>

                <h3>{step.title}</h3>

                <p>{step.text}</p>

                <div className="journey-card-extra">
                  <span>Why it matters</span>
                  <p>{step.extra}</p>
                </div>
              </div>

              <div
                className="journey-card-image"
                style={{ '--journey-blur-img': `url(${step.image})` }}
              >
                <img
                  className="journey-card-photo"
                  src={step.image}
                  alt={step.alt}
                  loading={step.number === '01' ? 'eager' : 'lazy'}
                />

                <div className="journey-image-label">
                  <span>{step.label}</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}