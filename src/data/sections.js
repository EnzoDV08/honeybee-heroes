export const SECTIONS_DATA = [
  {
    id: 'hero',
    bee: { x: 6.2, y: 2, rot: 0.8, scale: 0.095 },
    speech: "Hi! I'm Mellie. Let me show you how adopting a hive makes a real difference.",
    interaction: 'ask',
  },
  {
    id: 'importance',
    bee: { x: -7.2, y: -1.3, rot: 2.3, scale: 0.095 },
    speech: "Before we talk more about your hive, we need to understand why bees matter so much.",
    interaction: 'choices',
    question: 'Quick question: what is one of the biggest reasons bees matter?',
    options: [
      { label: 'They only make honey', reply: 'Not quite. Honey is amazing, but that is not their biggest role.' },
      { label: 'They help with pollination', reply: 'Exactly! Bees are vital pollinators and help plants, flowers, and crops grow.' },
      { label: 'They make the weather warmer', reply: 'Nope, not that one. Their biggest impact here is pollination.' },
    ],
  },
  {
    id: 'adoption',
    bee: { x: 9, y: 0.7, rot: 0.8, scale: 0.095 },
    speech: 'Now let me show you how your investment becomes real support on the farm.',
    interaction: 'ask',
  },
  {
    id: 'caretakers',
    bee: { x: -9.4, y: 0.1, rot: 2.3, scale: 0.095 },
    speech: 'You are not doing this alone. Trained women beekeepers help care for the hive on your behalf.',
    interaction: 'ask',
  },
  {
    id: 'journey',
    bee: { x: 7.0, y: 0.3, rot: 0.6, scale: 0.095 },
    speech: 'Let me show you the journey of a hive after it has been funded.',
    interaction: 'choices',
    question: 'What happens at the end of the hive journey?',
    options: [
      { label: 'The hive disappears', reply: 'No, the hive continues being cared for on the farm.' },
      { label: 'You receive honey', reply: 'Yes! You receive the pure honey harvested from the hive you supported.' },
      { label: 'The bees stop working', reply: 'Not at all. Bees continue pollinating and supporting the ecosystem.' },
    ],
  },
  {
    id: 'cta',
    bee: { x: 0, y: 2.2, rot: 1.6, scale: 0.09 },
    speech: "Now you can see the bigger picture. Are you ready to fund a hive and get your honey?",
    interaction: 'none',
  },
];

export const BEE_ANSWERS = {
  honey: 'As an investor, you get pure honey from the hive you helped fund.',
  women: 'Honeybee Heroes trains and supports women beekeepers who care for the hives on the farm.',
  location: 'Your hive stays safely on the Honeybee Heroes farm where it can be protected and looked after.',
  help: 'Bees are important because they pollinate flowers, crops, and plants that support life and food systems.',
  cost: 'The investment helps fund the hive, bee care, pollination education, and support for the women beekeepers.',
  default: "That's a lovely question. For this prototype, I can best answer things about hives, honey, pollination, and women beekeepers.",
};
