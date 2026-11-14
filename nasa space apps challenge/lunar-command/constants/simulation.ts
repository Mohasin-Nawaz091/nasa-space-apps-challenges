import { ColonyResources } from "../types/game";
import { AstronautState } from "../types/astronaut";

export const INITIAL_RESOURCES: ColonyResources = {
  power: 280,
  maxPower: 500,
  oxygen: 160,
  maxOxygen: 300,
  water: 220,
  maxWater: 400,
  food: 90,
  maxFood: 200,
  materials: 40,
  maxMaterials: 100,
  researchPoints: 10,
  targetResearchPoints: 60,
};

export const INITIAL_ASTRONAUTS: AstronautState[] = [
  {
    id: "alex",
    name: "Alex",
    role: "Engineer",
    avatar: "👨‍🔧",
    accentColor: "#C78C55",
    badgeBg: "bg-[#C78C55]",
    health: 100,
    energy: 100,
    radiationDose: 2.1,
    status: "Available",
    currentTask: null,
    taskHistory: [],
    currentPosition: [-6, 0, 1],
    targetPosition: [-6, 0, 1],
    isSheltered: false,
    statusMessage: "Ready to inspect solar panels and repair life support systems.",
  },
  {
    id: "mia",
    name: "Mia",
    role: "Scientist",
    avatar: "👩‍🔬",
    accentColor: "#7189A6",
    badgeBg: "bg-[#7189A6]",
    health: 100,
    energy: 100,
    radiationDose: 2.0,
    status: "Available",
    currentTask: null,
    taskHistory: [],
    currentPosition: [0, 0, -6],
    targetPosition: [0, 0, -6],
    isSheltered: false,
    statusMessage: "Ready to analyze Moon core samples and conduct NASA lab research.",
  },
  {
    id: "leo",
    name: "Leo",
    role: "Botanist",
    avatar: "🧑‍🌾",
    accentColor: "#79966B",
    badgeBg: "bg-[#79966B]",
    health: 100,
    energy: 100,
    radiationDose: 1.9,
    status: "Available",
    currentTask: null,
    taskHistory: [],
    currentPosition: [5, 0, -2],
    targetPosition: [5, 0, -2],
    isSheltered: false,
    statusMessage: "Ready to plant seeds, tend crop trays, and harvest fresh food packs.",
  },
];

export const SIMULATION_CONSTANTS = {
  BASE_SOLAR_GENERATION: 145, // kWh/day
  OXYGEN_CONSUMPTION_PER_ASTRONAUT: 3.0, // kg/day
  WATER_CONSUMPTION_PER_ASTRONAUT: 4.0, // L/day
  FOOD_CONSUMPTION_PER_ASTRONAUT: 3.0, // rations/day
  BASE_OXYGEN_PRODUCTION: 15.0, // kg/day
  BASE_WATER_RECYCLE_EFFICIENCY: 0.90, // 90%
  BASE_FOOD_PRODUCTION: 9.0, // rations/day
  BASE_GREENHOUSE_WATER_USE: 8.0, // L/day
  NORMAL_BACKGROUND_RADIATION_RATE: 0.8, // mSv/day (unshielded lunar surface)
  SHELTERED_RADIATION_RATE: 0.1, // mSv/day
  MAX_DAYS: 10,
};
