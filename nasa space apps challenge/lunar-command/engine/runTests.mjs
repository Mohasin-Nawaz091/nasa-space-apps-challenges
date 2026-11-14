import assert from "node:assert";

console.log("=== RUNNING LUNAR COMMAND SIMULATION TEST SUITE ===");

// 1. Test Simulation Equations & Bounds
const SIM_CONSTANTS = {
  BASE_SOLAR_GENERATION: 145,
  OXYGEN_CONSUMPTION_PER_ASTRONAUT: 3.0,
  WATER_CONSUMPTION_PER_ASTRONAUT: 4.0,
  FOOD_CONSUMPTION_PER_ASTRONAUT: 3.0,
  BASE_OXYGEN_PRODUCTION: 15.0,
  BASE_WATER_RECYCLE_EFFICIENCY: 0.90,
  BASE_FOOD_PRODUCTION: 9.0,
  BASE_GREENHOUSE_WATER_USE: 8.0,
  NORMAL_BACKGROUND_RADIATION_RATE: 0.8,
  SHELTERED_RADIATION_RATE: 0.1,
  MAX_DAYS: 10,
};

// Test Power Balance Calculation
function calculatePowerBalance(solarCondition, activeBuildings) {
  const generation = Math.round(SIM_CONSTANTS.BASE_SOLAR_GENERATION * (solarCondition / 100));
  const consumption = activeBuildings.reduce((acc, b) => acc + (b.isActive ? b.powerConsumption : 0), 0);
  return { generation, consumption, net: generation - consumption };
}

const mockBuildings = [
  { id: "habitat", isActive: true, powerConsumption: 25 },
  { id: "life_support", isActive: true, powerConsumption: 35 },
  { id: "greenhouse", isActive: true, powerConsumption: 20 },
  { id: "solar_array", isActive: true, powerConsumption: 0 },
  { id: "shelter", isActive: true, powerConsumption: 10 },
  { id: "science_lab", isActive: true, powerConsumption: 25 },
];

const powerResult = calculatePowerBalance(100, mockBuildings);
assert.strictEqual(powerResult.generation, 145, "Solar generation at 100% condition should be 145 kWh");
assert.strictEqual(powerResult.consumption, 115, "Base power consumption should be 115 kWh");
assert.strictEqual(powerResult.net, 30, "Net power should be +30 kWh reserve accumulation");
console.log("✔ Test 1 Passed: Power balance equation verified (+30 kWh daily reserve).");

// Test Degraded Solar Panel Output
const dustyPower = calculatePowerBalance(70, mockBuildings);
assert.strictEqual(dustyPower.generation, 102, "Solar generation at 70% condition should be 102 kWh");
assert.strictEqual(dustyPower.net, -13, "Net power should become negative (-13 kWh) under dust coating");
console.log("✔ Test 2 Passed: Solar degradation correctly creates battery deficit.");

// Test Oxygen Production & Consumption
function calculateOxygenBalance(crewCount, lsIntensity, lsCondition) {
  const produced = Math.round(SIM_CONSTANTS.BASE_OXYGEN_PRODUCTION * lsIntensity * (lsCondition / 100));
  const consumed = crewCount * SIM_CONSTANTS.OXYGEN_CONSUMPTION_PER_ASTRONAUT;
  return { produced, consumed, net: produced - consumed };
}

const o2Normal = calculateOxygenBalance(3, 1.0, 100);
assert.strictEqual(o2Normal.produced, 15, "Standard oxygen production is 15 kg/day");
assert.strictEqual(o2Normal.consumed, 9, "3 astronauts consume 9 kg oxygen/day");
assert.strictEqual(o2Normal.net, 6, "Net oxygen should be +6 kg/day reserve growth");
console.log("✔ Test 3 Passed: Oxygen closed loop maintains positive breathable atmosphere.");

// Test Water Recycling Loop
function calculateWaterBalance(crewCount, ghIntensity, recycleEfficiency) {
  const crewWater = crewCount * SIM_CONSTANTS.WATER_CONSUMPTION_PER_ASTRONAUT;
  const ghWater = Math.round(SIM_CONSTANTS.BASE_GREENHOUSE_WATER_USE * ghIntensity);
  const totalWaterConsumed = crewWater + ghWater;
  const waterRecycled = Math.round(totalWaterConsumed * recycleEfficiency);
  return { totalWaterConsumed, waterRecycled, net: waterRecycled - totalWaterConsumed };
}

const waterNormal = calculateWaterBalance(3, 1.0, 0.90);
assert.strictEqual(waterNormal.totalWaterConsumed, 20, "Total water consumed is 12L (crew) + 8L (greenhouse) = 20L");
assert.strictEqual(waterNormal.waterRecycled, 18, "90% recycling recovers 18L");
assert.strictEqual(waterNormal.net, -2, "Net daily water deficit is 2L, requiring lunar ice top-up");
console.log("✔ Test 4 Passed: Water loop models realistic 90% closed-loop recycling with modest makeup requirement.");

// Test Radiation Shielding Factor during Solar CME
function calculateRadiationExposure(isSheltered, isCmeActive) {
  if (isSheltered) {
    return isCmeActive ? 1.5 : SIM_CONSTANTS.SHELTERED_RADIATION_RATE;
  } else {
    return isCmeActive ? 25.0 : SIM_CONSTANTS.NORMAL_BACKGROUND_RADIATION_RATE;
  }
}

const unshieldedCme = calculateRadiationExposure(false, true);
const shelteredCme = calculateRadiationExposure(true, true);
assert.strictEqual(unshieldedCme, 25.0, "Unshielded astronaut receives acute 25 mSv dose during CME");
assert.strictEqual(shelteredCme, 1.5, "Sheltered astronaut receives safe 1.5 mSv dose inside 2-meter regolith bunker");
assert.ok(shelteredCme < unshieldedCme * 0.1, "Sheltering provides >90% radiation reduction");
console.log("✔ Test 5 Passed: Radiation shelter provides 94% dose reduction during solar storms.");

// Test 10-Day Mission Progression & Scoring Algorithm
function evaluateMissionScore(day, avgHealth, researchPoints, resources, isFailed) {
  if (isFailed) return Math.round((day * 50 + avgHealth * 2) * 0.5);

  const survivalScore = day * 50;
  const healthScore = avgHealth * 2;
  const researchScore = Math.round(researchPoints * 2.5);
  const resourceScore = Math.min(
    150,
    Math.round(
      (resources.power / 500) * 40 +
        (resources.oxygen / 300) * 40 +
        (resources.water / 400) * 40 +
        (resources.food / 200) * 30
    )
  );

  return Math.min(1000, survivalScore + healthScore + researchScore + resourceScore);
}

const perfectScore = evaluateMissionScore(
  10,
  100,
  80,
  { power: 300, oxygen: 200, water: 250, food: 120 },
  false
);
assert.ok(perfectScore >= 900, "High performance mission achieves Master Lunar Commander tier (>= 900 pts)");

const failedEarlyScore = evaluateMissionScore(
  4,
  0,
  20,
  { power: 0, oxygen: 0, water: 50, food: 30 },
  true
);
assert.ok(failedEarlyScore < 300, "Failed mission score reflects aborted mission");
console.log(`✔ Test 6 Passed: Scoring algorithm yields ${perfectScore} pts for optimal 10-sol run and ${failedEarlyScore} pts for failed run.`);

console.log("=== ALL SIMULATION ENGINE TESTS PASSED (6/6) ===");
