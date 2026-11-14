import { describe, it, expect } from 'vitest';
import { createInitialState, SimulationEngine } from '../src/sim/engine.ts';
import { EndingType } from '../src/sim/types.ts';
import { Mulberry32Rng } from '../src/sim/rng.ts';

interface BotRunSummary {
  mission_accomplished: number;
  scientific_success_resource_failure: number;
  emergency_mission: number;
  mission_abort: number;
  total: number;
  goldOrSilverBands: number;
}

function runRandomGame(seed: number): { ending: EndingType; scoreBand?: string } {
  const engine = new SimulationEngine(seed);
  let state = createInitialState(seed, 'commander');
  const botRng = new Mulberry32Rng(seed + 9999);

  for (let t = 0; t < 240; t++) {
    if (state.mission.status !== 'in_progress') break;

    // Handle any pending decisions randomly
    if (state.pendingDecisions.length > 0) {
      const decision = state.pendingDecisions[0];
      const randomOption = botRng.pick(decision.options);
      state = engine.dispatch(state, {
        type: 'RESOLVE_DECISION',
        decisionId: decision.id,
        optionId: randomOption.id,
      });
      state.mission.isPaused = false;
    }

    state = engine.tick(state);
  }

  return {
    ending: state.mission.status as EndingType,
    scoreBand: state.mission.score?.band,
  };
}

function runCarefulGame(seed: number): { ending: EndingType; scoreBand?: string } {
  const engine = new SimulationEngine(seed);
  let state = createInitialState(seed, 'commander');

  for (let t = 0; t < 240; t++) {
    if (state.mission.status !== 'in_progress') break;

    // Strategic decision making
    if (state.pendingDecisions.length > 0) {
      const decision = state.pendingDecisions[0];
      let preferredOption = decision.options[0];

      if (decision.day === 8 || decision.id.includes('storm')) {
        // Space weather advisory: shelter or build shield layer
        const shieldOpt = decision.options.find((o) => o.id === 'build_shield_layer' || o.id === 'shelter_crew');
        preferredOption = shieldOpt || decision.options[0];
      } else if (decision.day === 2 || decision.day === 3) {
        // Repair solar array immediately
        const repairOpt = decision.options.find((o) => o.id === 'repair_now' || o.id.includes('repair'));
        preferredOption = repairOpt || decision.options[0];
      } else if (decision.day === 5 || decision.day === 6) {
        // Recycler or science priority
        const overhaulOpt = decision.options.find((o) => o.id.includes('recycler') || o.id.includes('science'));
        preferredOption = overhaulOpt || decision.options[0];
      }

      state = engine.dispatch(state, {
        type: 'RESOLVE_DECISION',
        decisionId: decision.id,
        optionId: preferredOption.id,
      });
      state.mission.isPaused = false;
    }

    // Radiation Advisory: move all astronauts to underground shelter during storm
    if (state.radiationAdvisory && !state.radiationAdvisory.resolved) {
      for (const cid of ['alex', 'sara', 'daniel'] as const) {
        if (state.crew[cid].location !== 'shelter' && state.crew[cid].location !== 'transit') {
          state = engine.dispatch(state, {
            type: 'MOVE_CREW',
            crewId: cid,
            targetBuilding: 'shelter',
          });
        }
      }
    }

    // After storm passes, return to habitat
    if (state.radiationAdvisory?.resolved && state.mission.day === 9 && state.mission.tick === 0) {
      for (const cid of ['alex', 'sara', 'daniel'] as const) {
        if (state.crew[cid].location === 'shelter') {
          state = engine.dispatch(state, {
            type: 'MOVE_CREW',
            crewId: cid,
            targetBuilding: 'habitat',
          });
        }
      }
    }

    // Scientific Research: Mia conducts experiments on Sols 1, 3, 5, 7 to reach 60+ science points
    if (
      state.resources.science < 65 &&
      !state.crew.sara.currentTask &&
      !state.lab.activeExperiment &&
      state.crew.sara.stamina >= 4 &&
      state.resources.battery >= 20
    ) {
      const projId: 'regolith_composition' | 'water_ice_investigation' | 'sustainable_agriculture' =
        state.resources.science < 25
          ? 'regolith_composition'
          : state.resources.science < 45
          ? 'water_ice_investigation'
          : 'sustainable_agriculture';

      state = engine.dispatch(state, {
        type: 'START_RESEARCH',
        projectId: projId,
        crewId: 'sara',
      });
    }

    // Farming: Leo manages Bed 1 on Sols 2-6
    if (state.greenhouseBeds.bed1.stage === 'empty' && !state.crew.daniel.currentTask && state.crew.daniel.stamina >= 2) {
      state = engine.dispatch(state, {
        type: 'ASSIGN_TASK',
        crewId: 'daniel',
        taskType: 'plant_crop',
        buildingId: 'greenhouse',
        bedId: 'bed1',
        cropType: 'quick_greens',
      });
    }
    if (state.greenhouseBeds.bed1.stage === 'ready' && !state.crew.daniel.currentTask) {
      state = engine.dispatch(state, {
        type: 'ASSIGN_TASK',
        crewId: 'daniel',
        taskType: 'harvest_crop',
        buildingId: 'greenhouse',
        bedId: 'bed1',
      });
    }

    // Maintenance: Alex services solar array and ECLSS if condition degrades
    if (state.systems.solarArray.condition < 70 && !state.crew.alex.currentTask && state.resources.spareParts >= 1 && state.crew.alex.stamina >= 3) {
      state = engine.dispatch(state, {
        type: 'ASSIGN_TASK',
        crewId: 'alex',
        taskType: 'minor_repair',
        buildingId: 'power_station',
      });
    } else if (state.systems.lifeSupport.condition < 70 && !state.crew.alex.currentTask && state.resources.spareParts >= 1 && state.crew.alex.stamina >= 3) {
      state = engine.dispatch(state, {
        type: 'ASSIGN_TASK',
        crewId: 'alex',
        taskType: 'minor_repair',
        buildingId: 'habitat',
      });
    }

    state = engine.tick(state);
  }

  return {
    ending: state.mission.status as EndingType,
    scoreBand: state.mission.score?.band,
  };
}

describe('1,000-Game Balance Bot Simulation', () => {
  it(
    'runs 1,000 games and confirms balance targets: random play fails frequently, careful play succeeds ~60%',
    async () => {
    const randomStats: BotRunSummary = {
      mission_accomplished: 0,
      scientific_success_resource_failure: 0,
      emergency_mission: 0,
      mission_abort: 0,
      total: 500,
      goldOrSilverBands: 0,
    };

    const carefulStats: BotRunSummary = {
      mission_accomplished: 0,
      scientific_success_resource_failure: 0,
      emergency_mission: 0,
      mission_abort: 0,
      total: 500,
      goldOrSilverBands: 0,
    };

    // 1. Run 500 Random Games
    for (let i = 1; i <= 500; i++) {
      if (i % 50 === 0) await new Promise((res) => setTimeout(res, 0));
      const res = runRandomGame(10000 + i);
      randomStats[res.ending]++;
      if (res.scoreBand === 'Gold Commander' || res.scoreBand === 'Silver') {
        randomStats.goldOrSilverBands++;
      }
    }

    // 2. Run 500 Careful Games
    for (let i = 1; i <= 500; i++) {
      if (i % 50 === 0) await new Promise((res) => setTimeout(res, 0));
      const res = runCarefulGame(20000 + i);
      carefulStats[res.ending]++;
      if (res.scoreBand === 'Gold Commander' || res.scoreBand === 'Silver') {
        carefulStats.goldOrSilverBands++;
      }
    }

    // Print Balance Bot Results
    const carefulSuccessRate = (carefulStats.mission_accomplished / carefulStats.total) * 100;
    const randomSuccessRate = (randomStats.mission_accomplished / randomStats.total) * 100;

    console.log('\n================================================================');
    console.log('       LUNAR FRONTIER: 1,000-GAME BALANCE BOT EVALUATION       ');
    console.log('================================================================');
    console.log(`Difficulty: Commander (Default) | Seed range: 10001 - 20500\n`);

    console.log('--- RANDOM PLAY BOT (500 runs) ---');
    console.log(`  Mission Accomplished:                ${randomStats.mission_accomplished.toString().padStart(4)} (${randomSuccessRate.toFixed(1)}%)`);
    console.log(`  Emergency Mission:                   ${randomStats.emergency_mission.toString().padStart(4)} (${((randomStats.emergency_mission / 500) * 100).toFixed(1)}%)`);
    console.log(`  Scientific Success Resource Failure: ${randomStats.scientific_success_resource_failure.toString().padStart(4)} (${((randomStats.scientific_success_resource_failure / 500) * 100).toFixed(1)}%)`);
    console.log(`  Mission Abort (Casualty/Evac):       ${randomStats.mission_abort.toString().padStart(4)} (${((randomStats.mission_abort / 500) * 100).toFixed(1)}%)`);
    console.log(`  Gold/Silver Score Bands:             ${randomStats.goldOrSilverBands.toString().padStart(4)} (${((randomStats.goldOrSilverBands / 500) * 100).toFixed(1)}%)\n`);

    console.log('--- CAREFUL PLAY BOT (500 runs) ---');
    console.log(`  Mission Accomplished:                ${carefulStats.mission_accomplished.toString().padStart(4)} (${carefulSuccessRate.toFixed(1)}%)`);
    console.log(`  Emergency Mission:                   ${carefulStats.emergency_mission.toString().padStart(4)} (${((carefulStats.emergency_mission / 500) * 100).toFixed(1)}%)`);
    console.log(`  Scientific Success Resource Failure: ${carefulStats.scientific_success_resource_failure.toString().padStart(4)} (${((carefulStats.scientific_success_resource_failure / 500) * 100).toFixed(1)}%)`);
    console.log(`  Mission Abort (Casualty/Evac):       ${carefulStats.mission_abort.toString().padStart(4)} (${((carefulStats.mission_abort / 500) * 100).toFixed(1)}%)`);
    console.log(`  Gold/Silver Score Bands:             ${carefulStats.goldOrSilverBands.toString().padStart(4)} (${((carefulStats.goldOrSilverBands / 500) * 100).toFixed(1)}%)`);
    console.log('================================================================\n');

    // Verification targets from Section 14 & GDD:
    // Random play often fails (abort or emergency)
    expect(randomStats.mission_accomplished).toBeLessThan(carefulStats.mission_accomplished);
    expect(randomStats.mission_abort + randomStats.emergency_mission).toBeGreaterThan(250);

    // Careful play succeeds reliably (target >= 60% on Commander)
    expect(carefulSuccessRate).toBeGreaterThanOrEqual(60);
    expect(carefulSuccessRate).toBeLessThanOrEqual(100);
  }, 120000);
});
