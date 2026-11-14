/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/sim/rules/objectives.ts
 * Mission objectives and achievement definitions.
 * Pure TypeScript. No React, Three, or DOM imports.
 */

import { Achievement, MissionObjective } from '../types.ts';

export function createInitialObjectives(): MissionObjective[] {
  return [
    {
      id: 'obj_survive',
      title: 'Survive 10 Lunar Sols',
      description: 'Keep Artemis Base Alpha fully operational and maintain life support for the 10-Sol expedition.',
      category: 'primary',
      progress: 1,
      target: 10,
      unit: 'Sols',
      isCompleted: false,
      rewardDescription: 'Primary mission success criterion.',
    },
    {
      id: 'obj_crew_alive',
      title: 'Zero Crew Casualties',
      description: 'Protect all 3 astronauts (Alex, Mia, Leo) with health maintained above 50%.',
      category: 'primary',
      progress: 3,
      target: 3,
      unit: 'Astronauts',
      isCompleted: false,
      rewardDescription: 'Required for Silver or Gold Commander badge.',
    },
    {
      id: 'obj_research',
      title: 'Achieve 60 Research Points',
      description: 'Conduct deep-space research at the Laboratory into regolith, volatiles, and closed-loop systems.',
      category: 'primary',
      progress: 0,
      target: 60,
      unit: 'Pts',
      isCompleted: false,
      rewardDescription: 'Required for Mission Accomplished Victory Certification.',
    },
    {
      id: 'obj_crops',
      title: 'Harvest Fresh Food Crops',
      description: 'Cultivate and harvest hydroponic crops (Quick Greens, Tomatoes, Potatoes) in the greenhouse.',
      category: 'secondary',
      progress: 0,
      target: 20,
      unit: 'Food',
      isCompleted: false,
      rewardDescription: '+30 Food Security Score.',
    },
    {
      id: 'obj_rover',
      title: 'Execute 1 Rover Surface Expedition',
      description: 'Deploy the lunar rover to craters, peaks, or historic sites to collect geological samples.',
      category: 'secondary',
      progress: 0,
      target: 1,
      unit: 'Expeditions',
      isCompleted: false,
      rewardDescription: '+40 Exploration Science Score.',
    },
    {
      id: 'obj_shield',
      title: 'Build Sintered Regolith Shielding',
      description: 'Construct sintered lunar soil bulkheads over the Radiation Shelter for solar flare protection.',
      category: 'bonus',
      progress: 0,
      target: 1,
      unit: 'Layers',
      isCompleted: false,
      rewardDescription: '+20 Radiation Preparedness Score.',
    },
  ];
}

export function createInitialAchievements(): Achievement[] {
  return [
    {
      id: 'first_harvest',
      title: 'First Lunar Harvest',
      description: 'Successfully harvested fresh crops grown inside the Hydroponic Greenhouse.',
      icon: '🌱',
      unlocked: false,
    },
    {
      id: 'master_mechanic',
      title: 'Fast Mechanic',
      description: 'Completed a building repair utilizing Alex Morgan’s specialized engineering perk.',
      icon: '🛠️',
      unlocked: false,
    },
    {
      id: 'lunar_rover',
      title: 'Cold-Trap Explorer',
      description: 'Dispatched the lunar rover to a permanently shadowed south polar crater.',
      icon: '🚜',
      unlocked: false,
    },
    {
      id: 'science_breakthrough',
      title: 'Scientific Discovery',
      description: 'Completed a scientific research investigation inside the Science Laboratory.',
      icon: '🔬',
      unlocked: false,
    },
    {
      id: 'solar_fortress',
      title: 'Regolith Bastion',
      description: 'Constructed sintered regolith radiation shielding over the habitat.',
      icon: '☢️',
      unlocked: false,
    },
    {
      id: 'gold_commander',
      title: 'Gold Commander Badge',
      description: 'Achieved the prestigious Gold Commander score rating upon completing 30 days.',
      icon: '🏆',
      unlocked: false,
    },
    {
      id: 'space_botanist',
      title: 'Green Thumb Bonus',
      description: 'Harvested crops with Dr. Sara Williams to earn the +10% yield bonus.',
      icon: '🍅',
      unlocked: false,
    },
    {
      id: 'perfect_health',
      title: 'Expedition in Peak Health',
      description: 'Kept all four crew members above 75 HP through day 15.',
      icon: '❤️',
      unlocked: false,
    },
  ];
}

