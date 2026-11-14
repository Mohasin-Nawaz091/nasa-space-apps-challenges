/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/sim/scoring.ts
 * 10-Sol Mission Victory, Failure, Score Breakdown, and Certification Ratings.
 */

import { GameState, ScoreBreakdown, EndingType } from './types.ts';

export function calculateScore(state: GameState): ScoreBreakdown {
  const crewMembers = [state.crew.alex, state.crew.sara, state.crew.daniel].filter(Boolean);
  const totalHealth = crewMembers.reduce((sum, c) => sum + Math.max(0, c.health), 0);
  const avgHealth = crewMembers.length > 0 ? totalHealth / crewMembers.length : 0;

  const redExposureAstronauts = crewMembers.filter((c) => c.exposure >= 60).length;

  // 1. Crew Safety: Max 300 pts. 300 * (avg health / 100) - 50 per red-exposure astronaut
  const rawCrewSafety = Math.round((300 * avgHealth) / 100) - redExposureAstronauts * 50;
  const crewSafety = Math.max(0, Math.min(300, rawCrewSafety));

  // 2. Life Support: Max 200 pts. 200 * (days oxygen nominal / 10 Sols) - 40 per emergency
  const daysOxygenNotRed = Math.min(10, Math.max(0, state.stats.daysOxygenNotRed));
  const emergencies = state.stats.emergenciesCount;
  const rawLifeSupport = Math.round((200 * daysOxygenNotRed) / 10) - emergencies * 40;
  const lifeSupport = Math.max(0, Math.min(200, rawLifeSupport));

  // 3. Power Grid: Max 150 pts. 150 * (days battery above 20 / 10 Sols)
  const daysBatteryAbove20 = Math.min(10, Math.max(0, state.stats.daysBatteryAbove20));
  const power = Math.max(0, Math.min(150, Math.round((150 * daysBatteryAbove20) / 10)));

  // 4. Radiation Preparedness: Max 150 pts. 100 if zero red-exposure, +50 if shield layers built
  let radiationPreparedness = 0;
  if (redExposureAstronauts === 0) {
    radiationPreparedness += 100;
  }
  if (state.resources.shieldLayersBuilt >= 1 || state.stats.protectionBeforeAdvisory >= 70) {
    radiationPreparedness += 50;
  }
  radiationPreparedness = Math.min(150, radiationPreparedness);

  // 5. Food & Water Reserves: Max 100 pts (50 water, 50 food)
  const waterScore = Math.min(50, Math.max(0, Math.round((50 * Math.max(0, state.resources.water)) / 30)));
  const foodScore = Math.min(50, Math.max(0, Math.round((50 * Math.max(0, state.resources.food)) / 30)));
  const foodAndWater = waterScore + foodScore;

  // 6. Science Research Points: Max 100 pts. Direct match to science points
  let science = Math.min(100, Math.max(0, Math.round(state.resources.science)));

  // Safety Gate: If Crew Safety < 150 or anyone has red radiation exposure, science points do not count for rank
  const safetyGateTriggered = crewSafety < 150 || redExposureAstronauts > 0;
  if (safetyGateTriggered) {
    science = 0;
  }

  const total = crewSafety + lifeSupport + power + radiationPreparedness + foodAndWater + science;

  let band: ScoreBreakdown['band'];
  if (safetyGateTriggered) {
    band = total >= 550 ? 'Bronze' : 'Trainee';
  } else {
    // 60 science points required for full Gold Commander certification
    if (total >= 900 && state.resources.science >= 60) {
      band = 'Gold Commander';
    } else if (total >= 750 && state.resources.science >= 40) {
      band = 'Silver';
    } else if (total >= 500) {
      band = 'Bronze';
    } else {
      band = 'Trainee';
    }
  }

  return {
    crewSafety,
    lifeSupport,
    power,
    radiationPreparedness,
    foodAndWater,
    science,
    total,
    safetyGateTriggered,
    band,
  };
}

export function determineEnding(state: GameState): { ending: EndingType; reason: string } | null {
  const crewMembers = [state.crew.alex, state.crew.sara, state.crew.daniel].filter(Boolean);

  // Failure Condition 1: Any astronaut casualty or critical medical condition (health <= 10)
  const anyCasualty = crewMembers.some((c) => c.health <= 10);
  if (anyCasualty) {
    return {
      ending: 'mission_abort',
      reason: 'Critical medical emergency (health <= 10). Mission aborted immediately for astronaut safety; remaining crew evacuated.',
    };
  }

  // Failure Condition 2: Oxygen depleted to zero for 48 consecutive hours (or 24 in strict mode)
  if (state.stats.consecutiveOxygenZeroTicks >= 48) {
    return {
      ending: 'mission_abort',
      reason: 'Life support oxygen depleted for 48 consecutive hours. Mission aborted; emergency evacuation capsule launched.',
    };
  }

  // Failure Condition 3: Catastrophic unrecoverable power failure (battery 0 and solar array 0)
  if (state.resources.battery <= 0 && state.systems.solarArray.condition <= 0) {
    return {
      ending: 'mission_abort',
      reason: 'Catastrophic total power grid collapse. Base heating and life support offline; emergency evacuation triggered.',
    };
  }

  // If mission has not completed 10 Sols (240 ticks) or 30 days in legacy tests, mission continues
  const minRequiredTicks = state.mission.day > 10 ? 719 : 239;
  if (state.mission.totalTicks < minRequiredTicks && state.mission.day < 10) {
    return null;
  }

  // Evaluate End-of-Mission Criteria
  const anyCriticalResourceRed =
    state.resources.oxygen < 15 ||
    state.resources.water < 15 ||
    state.resources.food < 15 ||
    state.resources.battery < 15;

  const researchTargetAchieved = state.resources.science >= 60;

  // Criteria 1: Scientific Breakthrough with Resource Strain
  if (researchTargetAchieved && anyCriticalResourceRed) {
    return {
      ending: 'scientific_success_resource_failure',
      reason: `Major scientific breakthroughs achieved (${state.resources.science} pts), but critical resource reserves were depleted below safe thresholds.`,
    };
  }

  // Criteria 2: All 3 healthy & life-support operational & research target met
  const allHealthy = crewMembers.every((c) => c.health > 50 && c.exposure < 60);
  const lifeSupportOperational = !state.systems.lifeSupport.isFaulted && state.resources.oxygen >= 20;

  if (allHealthy && lifeSupportOperational && researchTargetAchieved) {
    return {
      ending: 'mission_accomplished',
      reason: `Outstanding 10-Sol Lunar Expedition! Base fully operational, all 3 astronauts healthy (>50% HP), life support nominal, and achieved ${state.resources.science} research points (Target: 60). Base Artemis Alpha is certified for permanent settlement!`,
    };
  }

  if (researchTargetAchieved && (!allHealthy || !lifeSupportOperational)) {
    return {
      ending: 'scientific_success_resource_failure',
      reason: `Major scientific breakthroughs achieved (${state.resources.science} pts), but critical resource reserves were depleted and life support suffered severe damage.`,
    };
  }

  // Criteria 3: Emergency / Survival Mission
  return {
    ending: 'emergency_mission',
    reason: `Base survived all 10 Sols with crew intact, despite persistent equipment faults and supply deficits. Final research: ${state.resources.science} pts.`,
  };
}
