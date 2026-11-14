export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  childExplanation: string;
  category: "Environment" | "Life Support" | "Engineering" | "Space Weather";
  realWorldFact: string;
}

export const SCIENCE_GLOSSARY: GlossaryTerm[] = [
  {
    id: "regolith",
    term: "Lunar Regolith",
    definition: "A layer of loose, heterogeneous superficial deposits covering solid rock, specifically powdered moon dust.",
    childExplanation: "Sharp, powdery moon dirt created over billions of years as meteorites smashed into lunar rocks.",
    category: "Environment",
    realWorldFact: "Because there is no wind or rain on the Moon to smooth down rock edges, moon dust is sharp like broken glass!",
  },
  {
    id: "cme",
    term: "Coronal Mass Ejection (CME)",
    definition: "A significant release of plasma and accompanying magnetic field from the solar corona into space.",
    childExplanation: "A gigantic bubble of super-hot electrified gas and radiation shot out into space by the Sun.",
    category: "Space Weather",
    realWorldFact: "CMEs can travel at speeds exceeding 3 million miles per hour through the Solar System!",
  },
  {
    id: "eclss",
    term: "ECLSS",
    definition: "Environmental Control and Life Support System, providing breathable atmosphere and clean water.",
    childExplanation: "The colony's mechanical lungs and kidneys, recycling astronaut air and water so they can breathe and drink.",
    category: "Life Support",
    realWorldFact: "On the International Space Station, ECLSS recycles over 98% of all water, including sweat and breath droplets!",
  },
  {
    id: "isru",
    term: "In-Situ Resource Utilization (ISRU)",
    definition: "The practice of collecting, processing, and using materials found on other celestial bodies.",
    childExplanation: "Living off the land! Using Moon dirt, rocks, and ice to build bases, drink water, and make rocket fuel.",
    category: "Engineering",
    realWorldFact: "Shipping 1 bottle of water from Earth to the Moon would cost thousands of dollars, so finding water on the Moon is a game changer!",
  },
  {
    id: "radiation",
    term: "Space Radiation",
    definition: "High-energy particles from the Sun and deep space (Galactic Cosmic Rays) that pass through objects.",
    childExplanation: "Invisible energetic rays from the Sun and distant stars that can make human bodies sick if not blocked.",
    category: "Space Weather",
    realWorldFact: "Earth's atmosphere and magnetic field protect us on the ground, but astronauts on the Moon need thick soil walls for protection.",
  },
  {
    id: "psr",
    term: "Permanently Shadowed Regions (PSR)",
    definition: "Craters near the lunar poles that never receive direct sunlight due to the small tilt of the Moon's axis.",
    childExplanation: "Deep, freezing crater bowls at the Moon's poles where the Sun never shines, acting like cosmic freezers for water ice.",
    category: "Environment",
    realWorldFact: "Temperatures inside these craters can drop below -240°C (-400°F), making them some of the coldest places in the entire solar system!",
  },
  {
    id: "photovoltaic",
    term: "Photovoltaic Solar Power",
    definition: "Technology that converts light energy directly into electrical energy using semiconductor materials.",
    childExplanation: "Shiny blue panels that turn golden sunlight directly into electricity to charge the base batteries.",
    category: "Engineering",
    realWorldFact: "At the lunar south pole, solar panels stand tall like towers to catch the Sun hovering just above the horizon all day.",
  },
  {
    id: "hydroponics",
    term: "Hydroponics & Aeroponics",
    definition: "Method of growing plants without soil by exposing roots to mineral-rich water solutions or mist.",
    childExplanation: "Growing tasty veggies and dwarf wheat with plant food water and purple LED lights instead of soil dirt.",
    category: "Life Support",
    realWorldFact: "NASA astronauts on the ISS have successfully grown and eaten space-grown lettuce, radishes, and chili peppers!",
  },
];
