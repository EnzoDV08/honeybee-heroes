export const SECTIONS_DATA = [
  {
    id: 'hero',
    bee: { x: 6.2, y: 2, rot: 0.8, scale: 0.095 },
    speech: "Hi! I'm Mellie. I'm here to help you understand why a hive is worth your support.",
    interaction: 'ask',
  },
{
  id: 'importance',
  bee: { x: 5.25, y: 2.05, rot: -0.4, scale: 0.078 },
  speech: "Let me show you what your hive actually does — flower, field, farm, table.",
  interaction: 'none',
},
  {
    id: 'bee-inspect',
    bee: { x: 0, y: 0, rot: 0, scale: 0.16 },
    speech: "This is me up close. Click around — I do a lot more than buzz.",
    interaction: 'none',
  },
  {
    id: 'adoption',
    bee: { x: 9, y: 0.7, rot: 0.8, scale: 0.095 },
    speech: 'Honeybee Heroes has four ways to adopt — pick the one that fits and head over to their site to make it real.',
    interaction: 'ask',
  },
  {
    id: 'caretakers',
    bee: { x: -9.4, y: 0.1, rot: 2.3, scale: 0.095 },
    speech: 'Every hive is cared for by a trained South African woman. Your investment funds her training.',
    interaction: 'ask',
  },
  {
    id: 'journey',
    bee: { x: 7.0, y: 0.3, rot: 0.6, scale: 0.095 },
    speech: 'Here is what your year as an investor looks like — built straight from the package perks.',
    interaction: 'choices',
    question: 'What comes with every adoption package?',
    options: [
      { label: 'Just a certificate', reply: 'There is more — six jars of raw honey, seasonal updates, and a Bee Experience for two are all included.' },
      { label: 'Honey, updates, and a farm visit', reply: 'Yes! Six jars of honey, seasonal updates, your certificate, and a Bee Experience for two.' },
      { label: 'Only the honey', reply: 'Honey is part of it, but there is also the certificate, updates, and a farm visit included.' },
    ],
  },
  {
    id: 'cta',
    bee: { x: 0, y: 2.2, rot: 1.6, scale: 0.09 },
    speech: "You have seen the why and the what. The actual adoption happens on their site — go meet your hive.",
    interaction: 'none',
  },
];

export const BEE_ANSWERS = {
  honey: 'Every package includes six jars of raw honey, harvested from the hives on the Honeybee Heroes farm.',
  women: 'Each hive is cared for by a trained South African woman. The training is part of what your adoption funds.',
  location: 'The hives live on the Honeybee Heroes farm in the Western Cape. They are managed and protected there.',
  help: 'Pollinators are responsible for about a third of all human food. Without them, food systems falter.',
  cost: 'Packages start at R2,900. The Honeybee package is the classic — there are also Queen Bee, Veldskoen, and Kidz options.',
  default: "Good question. I am best at chatting about hives, honey, the women beekeepers, the packages, and what your adoption supports.",
};