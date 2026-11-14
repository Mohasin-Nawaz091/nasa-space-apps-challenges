/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/sim/engine.ts
 * Pure TypeScript 10-Sol Tick Simulation Engine.
 * Authoritative, deterministic simulation calculations for:
 * Resources (Battery, Oxygen, Water, Food, Spare Parts, Science),
 * Buildings, 3 Astronaut Specialists (Alex, Mia, Leo),
 * Tasks, Sol Stages, Scripted Events, and Victory/Failure Endings.
 */

import {
  GameState,
  Command,
  Difficulty,
  SiteConfig,
  BuildingId,
  CrewId,
  ActiveCrewTask,
  DailyReport,
} from './types.ts';
import { Mulberry32Rng } from './rng.ts';
import { INITIAL_CREW, calculateTravelTicks, calculateDailyHealthDelta, getCrewDisplayName } from './rules/crew.ts';
import { calculatePowerTick } from './rules/power.ts';
import { calculateLifeSupportTick } from './rules/life.ts';
import { calculateWaterTick } from './rules/water.ts';
import { calculateFoodTick, updateCropBedDay, CROP_DEFINITIONS } from './rules/food.ts';
import {
  getPositionFactor,
  calculateEventExposure,
  calculateBaselineSurfaceExposurePerTick,
  checkExposureThresholds,
} from './rules/radiation.ts';
import { getScriptedDecisionForDay, getDailyBriefingForSol, tryTriggerRandomEvent } from './events.ts';
import { calculateScore, determineEnding } from './scoring.ts';
import { BUILDING_UPGRADES } from './rules/upgrades.ts';
import { RESEARCH_PROJECTS } from './rules/research.ts';
import { ROVER_DESTINATIONS } from './rules/rover.ts';
import { CONSTRUCTION_PROJECTS } from './rules/construction.ts';
import { ConstructionProjectId } from './types.ts';
import { createInitialObjectives, createInitialAchievements } from './rules/objectives.ts';

export function createInitialState(
  seed: number,
  difficulty: Difficulty = 'commander',
  siteConfig?: SiteConfig
): GameState {
  const spareParts =
    difficulty === 'cadet' ? 8 : difficulty === 'commander' || difficulty === 'explorer' ? 6 : 4;

  const startBattery = difficulty === 'cadet' ? 95 : 85;
  const startOxygen = difficulty === 'cadet' ? 95 : 90;
  const startWater = difficulty === 'cadet' ? 90 : 80;
  const startFood = difficulty === 'cadet' ? 85 : 75;

  const crew = JSON.parse(JSON.stringify(INITIAL_CREW)) as typeof INITIAL_CREW;

  const state: GameState = {
    mission: {
      day: 1,
      tick: 0,
      totalTicks: 0,
      speed: 1,
      isPaused: false,
      seed,
      difficulty,
      siteId: siteConfig?.id ?? 'moon',
      stage: 1,
      solStage: 'briefing',
      status: 'in_progress',
    },
    resources: {
      battery: startBattery,
      oxygen: startOxygen,
      water: startWater,
      food: startFood,
      shieldProtection: 60,
      shieldLayersBuilt: 0,
      spareParts,
      science: 0,
    },
    systems: {
      solarArray: { condition: 100, isFaulted: false, name: 'Solar Array' },
      lifeSupport: { condition: 100, isFaulted: false, name: 'Life Support' },
      recycler: { condition: 100, isFaulted: false, name: 'Water Recycler' },
      greenhouse: { condition: 100, isFaulted: false, name: 'Greenhouse' },
      comms: { condition: 100, isFaulted: false, name: 'Communications' },
    },
    buildingModes: {
      lifeSupport: 'normal',
      greenhouse: 'normal',
      solar: 'normal',
    },
    greenhouseBeds: {
      bed1: {
        id: 'bed1',
        unlocked: true,
        cropType: null,
        daysPlanted: 0,
        daysMissed: 0,
        stage: 'empty',
        tendedToday: false,
      },
      bed2: {
        id: 'bed2',
        unlocked: false, // Unlocks Sol 3
        cropType: null,
        daysPlanted: 0,
        daysMissed: 0,
        stage: 'empty',
        tendedToday: false,
      },
    },
    greenhouseLightSetting: 'normal',
    rover: {
      condition: 100,
      isFaulted: false,
      name: 'Exploration Rover',
      isAway: false,
      crewOnBoard: [],
      batteryCharge: 100,
      samplesCollected: 0,
    },
    lab: {
      activeExperiment: false,
      experimentDaysLeft: 0,
      condition: 100,
      completedProjects: [],
      progressTicks: 0,
      totalTicksNeeded: 0,
    },
    crew,
    powerPriority: ['essential', 'recycler', 'greenhouse', 'laboratory', 'rover_upgrades'],
    powerBreakdown: {
      sunlightFactor: 1.0,
      generationPerDay: 120,
      generationPerTick: 5,
      essentialDemandPerDay: 45,
      recyclerDemandPerDay: 15,
      greenhouseDemandPerDay: 0,
      labDemandPerDay: 0,
      totalDemandPerDay: 60,
      servedDemandPerTick: 2.5,
      batteryDeltaPerTick: 2.5,
      shedSystems: [],
    },
    radiationAdvisory: null,
    pendingDecisions: [],
    completedEvents: [],
    randomEventCooldown: 24, // 1 Sol initial grace period
    stats: {
      daysOxygenNotRed: 0,
      daysBatteryAbove20: 0,
      emergenciesCount: 0,
      consecutiveOxygenZeroTicks: 0,
      maxConsecutiveOxygenZeroTicks: 0,
      protectionBeforeAdvisory: 60,
      experimentsCompleted: 0,
      samplesCollected: 0,
      advisoriesSurvived: 0,
      decisionsMade: [],
    },
    log: [
      {
        id: 'init_log',
        day: 1,
        tick: 0,
        message: 'Artemis Base Alpha outpost activated. 10-Sol Lunar Expedition commenced.',
        type: 'info',
      },
    ],
    upgrades: {
      solar_cells: false,
      dust_coating: false,
      thermal_insulation: false,
      emergency_o2: false,
      nanofilter: false,
      crop_led: false,
      spectrometer: false,
      high_gain_antenna: false,
      regolith_shield: false,
    },
    construction: {
      aux_battery_bank: { built: false, inProgress: false, progressTicks: 0 },
      secondary_water_tank: { built: false, inProgress: false, progressTicks: 0 },
      emergency_o2_cell: { built: false, inProgress: false, progressTicks: 0 },
      surface_sensor_array: { built: false, inProgress: false, progressTicks: 0 },
    },
    objectives: createInitialObjectives(),
    achievements: createInitialAchievements(),
    dailyBriefing: getDailyBriefingForSol(1),
    dailyReport: null,
  };

  return state;
}

export class SimulationEngine {
  private rng: Mulberry32Rng;
  private siteConfig?: SiteConfig;

  constructor(seed: number, siteConfig?: SiteConfig) {
    this.rng = new Mulberry32Rng(seed);
    this.siteConfig = siteConfig;
  }

  /**
   * Executes a command on the game state deterministically.
   */
  dispatch(state: GameState, command: Command): GameState {
    const nextState = JSON.parse(JSON.stringify(state)) as GameState;

    switch (command.type) {
      case 'SET_SPEED':
        nextState.mission.speed = command.speed;
        nextState.mission.isPaused = command.speed === 0;
        break;

      case 'PAUSE':
        nextState.mission.isPaused = true;
        break;

      case 'RESUME':
        nextState.mission.isPaused = false;
        if (nextState.mission.speed === 0) {
          nextState.mission.speed = 1;
        }
        break;

      case 'SET_SOL_STAGE':
        nextState.mission.solStage = command.stage;
        break;

      case 'ADVANCE_SOL': {
        // Run all remaining ticks for current Sol (up to 24 ticks per day)
        const currentTick = nextState.mission.tick;
        const ticksRemainingInSol = 24 - currentTick;

        nextState.mission.isPaused = false;
        let currentState = nextState;
        for (let i = 0; i < ticksRemainingInSol; i++) {
          currentState = this.tick(currentState);
          if (currentState.mission.status !== 'in_progress') break;
        }

        // At end of Sol, pause and present Daily Report
        currentState.mission.isPaused = true;
        currentState.mission.solStage = 'report';
        return currentState;
      }

      case 'MOVE_CREW': {
        const member = nextState.crew[command.crewId];
        if (member && member.location !== command.targetBuilding) {
          const travelTicks = calculateTravelTicks(
            member.location === 'transit' || member.location === 'surface'
              ? 'habitat'
              : member.location,
            command.targetBuilding
          );
          member.location = 'transit';
          member.targetBuilding = command.targetBuilding;
          member.travelTicksRemaining = travelTicks;
          // Cancel active task if moving away to a different building
          if (member.currentTask && member.currentTask.buildingId !== command.targetBuilding) {
            member.currentTask = undefined;
          }
        }
        break;
      }

      case 'ASSIGN_TASK': {
        const member = nextState.crew[command.crewId];
        if (!member) break;

        const travelTicks =
          member.location === command.buildingId
            ? 0
            : calculateTravelTicks(
                member.location === 'transit' || member.location === 'surface'
                  ? 'habitat'
                  : member.location,
                command.buildingId
              );

        // Calculate task duration with specialist perks
        let hours = 2;
        if (command.taskType === 'minor_repair') {
          hours = command.crewId === 'alex' ? 3 : 4; // Alex repairs 1h faster
        } else if (command.taskType === 'major_repair') {
          hours = command.crewId === 'alex' ? 7 : 8; // Alex overhauls faster
        } else if (command.taskType === 'plant_crop') {
          hours = command.crewId === 'daniel' ? 1 : 2; // Leo plants faster
        } else if (command.taskType === 'tend_crop') {
          hours = 1;
        } else if (command.taskType === 'harvest_crop') {
          hours = command.crewId === 'daniel' ? 1 : 2; // Leo harvests faster
        } else if (command.taskType === 'run_experiment' || command.taskType === 'research') {
          hours = command.crewId === 'sara' ? 3 : 4; // Mia researches faster
        } else if (command.taskType === 'inspect') {
          hours = 1;
        } else if (command.taskType === 'clean_dust') {
          hours = 2;
        } else if (command.taskType === 'rest') {
          hours = 2;
        }

        const totalTicks = travelTicks + hours;

        if (travelTicks > 0) {
          member.location = 'transit';
          member.targetBuilding = command.buildingId;
          member.travelTicksRemaining = travelTicks;
        }

        member.currentTask = {
          type: command.taskType,
          buildingId: command.buildingId,
          ticksRemaining: totalTicks,
          totalTicks,
          targetBed: command.bedId,
          cropType: command.cropType,
          projectId: command.projectId,
          upgradeId: command.upgradeId,
          destinationId: command.destinationId,
        };

        // Deduct stamina
        if (command.taskType !== 'rest') {
          member.stamina -= hours;
          if (member.stamina < 0) {
            member.skippedRestOrExercise = true;
          }
        }

        // Apply resource costs:
        // Alex saves 1 spare part on major repair (1 part instead of 2)! Minor repair costs 0 parts.
        if (command.taskType === 'major_repair') {
          const partsCost = command.crewId === 'alex' ? 1 : 2;
          nextState.resources.spareParts = Math.max(0, nextState.resources.spareParts - partsCost);
          nextState.resources.battery = Math.max(0, nextState.resources.battery - 5);
        }
        break;
      }

      case 'CANCEL_TASK': {
        const member = nextState.crew[command.crewId];
        if (member) {
          member.currentTask = undefined;
        }
        break;
      }

      case 'REST_CREW': {
        const member = nextState.crew[command.crewId];
        if (member) {
          const travelTicks =
            member.location === 'habitat' ? 0 : calculateTravelTicks(member.location as BuildingId, 'habitat');
          member.location = travelTicks > 0 ? 'transit' : 'habitat';
          member.targetBuilding = 'habitat';
          member.travelTicksRemaining = travelTicks;
          member.currentTask = {
            type: 'rest',
            buildingId: 'habitat',
            ticksRemaining: travelTicks + 2,
            totalTicks: travelTicks + 2,
          };
        }
        break;
      }

      case 'CLEAN_SOLAR_DUST': {
        const alex = nextState.crew[command.crewId || 'alex'];
        if (alex) {
          const travelTicks =
            alex.location === 'power_station'
              ? 0
              : calculateTravelTicks(alex.location as BuildingId, 'power_station');
          alex.location = travelTicks > 0 ? 'transit' : 'power_station';
          alex.targetBuilding = 'power_station';
          alex.travelTicksRemaining = travelTicks;
          alex.currentTask = {
            type: 'clean_dust',
            buildingId: 'power_station',
            ticksRemaining: travelTicks + 2,
            totalTicks: travelTicks + 2,
          };
          alex.stamina -= 2;
        }
        break;
      }

      case 'SET_BUILDING_MODE': {
        if (!nextState.buildingModes) {
          nextState.buildingModes = { lifeSupport: 'normal', greenhouse: 'normal', solar: 'normal' };
        }
        if (command.buildingId === 'habitat' || command.buildingId === 'recycler') {
          nextState.buildingModes.lifeSupport = command.mode as any;
        } else if (command.buildingId === 'greenhouse') {
          nextState.buildingModes.greenhouse = command.mode as any;
        } else if (command.buildingId === 'power_station') {
          nextState.buildingModes.solar = command.mode as any;
        }
        break;
      }

      case 'SET_POWER_PRIORITY':
        nextState.powerPriority = [...command.priority];
        break;

      case 'SET_GREENHOUSE_LIGHTS':
        nextState.greenhouseLightSetting = command.setting;
        break;

      case 'BUILD_SHIELD_LAYER': {
        if (
          nextState.resources.shieldLayersBuilt < 3 &&
          nextState.resources.spareParts >= 1 &&
          nextState.resources.battery >= 8
        ) {
          nextState.resources.spareParts -= 1;
          nextState.resources.battery -= 8;
          nextState.resources.shieldLayersBuilt += 1;
          nextState.resources.shieldProtection = Math.min(
            90,
            nextState.resources.shieldProtection + 10
          );

          const builder = nextState.crew.alex;
          builder.stamina -= 8;
          if (builder.stamina < 0) {
            builder.skippedRestOrExercise = true;
          }

          nextState.log.push({
            id: `shield_${nextState.mission.totalTicks}`,
            day: nextState.mission.day,
            tick: nextState.mission.tick,
            message: `Regolith shield layer ${nextState.resources.shieldLayersBuilt}/3 constructed over RAD-01 (+10 protection).`,
            type: 'success',
          });
        }
        break;
      }

      case 'START_RESEARCH': {
        const proj = RESEARCH_PROJECTS[command.projectId];
        if (proj && nextState.resources.battery >= proj.powerPerTick) {
          nextState.lab.activeExperiment = true;
          nextState.lab.activeProject = command.projectId;
          const ticksNeeded = command.crewId === 'sara' ? proj.hoursNeeded - 1 : proj.hoursNeeded;
          nextState.lab.totalTicksNeeded = ticksNeeded;
          nextState.lab.progressTicks = 0;

          const member = nextState.crew[command.crewId];
          if (member) {
            const travelTicks =
              member.location === 'laboratory'
                ? 0
                : calculateTravelTicks(member.location as BuildingId, 'laboratory');
            member.location = travelTicks > 0 ? 'transit' : 'laboratory';
            member.targetBuilding = 'laboratory';
            member.travelTicksRemaining = travelTicks;
            member.currentTask = {
              type: 'research',
              buildingId: 'laboratory',
              projectId: command.projectId,
              ticksRemaining: travelTicks + ticksNeeded,
              totalTicks: travelTicks + ticksNeeded,
            };
            member.stamina -= ticksNeeded;
          }

          nextState.log.push({
            id: `start_res_${nextState.mission.totalTicks}`,
            day: nextState.mission.day,
            tick: nextState.mission.tick,
            message: `Laboratory started investigation: ${proj.name}.`,
            type: 'info',
          });
        }
        break;
      }

      case 'PURCHASE_UPGRADE': {
        const upg = BUILDING_UPGRADES[command.upgradeId];
        if (upg) {
          // Alex Morgan perk: saves 1 spare part on upgrades
          const partsCost = command.crewId === 'alex' ? Math.max(1, upg.costParts - 1) : upg.costParts;
          if (
            nextState.resources.spareParts >= partsCost &&
            nextState.resources.battery >= upg.costPower
          ) {
            nextState.resources.spareParts -= partsCost;
            nextState.resources.battery -= upg.costPower;
            if (command.crewId && nextState.crew[command.crewId]) {
              nextState.crew[command.crewId].stamina = Math.max(0, nextState.crew[command.crewId].stamina - 2);
            }
            const upgs = nextState.upgrades || ({} as any);
            upgs[command.upgradeId] = true;
            nextState.upgrades = upgs;

            // Apply immediate benefits
            if (command.upgradeId === 'regolith_shield') {
              nextState.resources.shieldProtection = Math.min(
                90,
                nextState.resources.shieldProtection + 10
              );
            } else if (command.upgradeId === 'emergency_o2') {
              nextState.resources.oxygen = Math.min(100, nextState.resources.oxygen + 20);
            }

            nextState.log.push({
              id: `upg_${command.upgradeId}_${nextState.mission.totalTicks}`,
              day: nextState.mission.day,
              tick: nextState.mission.tick,
              message: `Installed upgrade: ${upg.name} at ${command.buildingId.toUpperCase()}.`,
              type: 'success',
            });
          }
        }
        break;
      }

      case 'START_CONSTRUCTION': {
        const proj = CONSTRUCTION_PROJECTS[command.projectId];
        if (proj) {
          const partsCost = command.crewId === 'alex' ? Math.max(1, proj.costParts - 1) : proj.costParts;
          if (
            nextState.resources.spareParts >= partsCost &&
            nextState.resources.battery >= proj.costPower
          ) {
            nextState.resources.spareParts -= partsCost;
            nextState.resources.battery -= proj.costPower;
            if (command.crewId && nextState.crew[command.crewId]) {
              nextState.crew[command.crewId].stamina = Math.max(0, nextState.crew[command.crewId].stamina - 2);
            }
            const cMap = nextState.construction || ({} as any);
            cMap[command.projectId] = {
              built: false,
              inProgress: true,
              progressTicks: 0,
            };
            nextState.construction = cMap;

            nextState.log.push({
              id: `const_${command.projectId}_${nextState.mission.totalTicks}`,
              day: nextState.mission.day,
              tick: nextState.mission.tick,
              message: `Commenced construction on ${proj.name}.`,
              type: 'info',
            });
          }
        }
        break;
      }

      case 'START_ROVER_TRIP': {
        if (!nextState.rover.isAway && nextState.rover.condition > 0 && nextState.resources.battery >= 20) {
          nextState.rover.isAway = true;
          nextState.rover.returnTick = nextState.mission.totalTicks + 6;
          nextState.rover.crewOnBoard = [command.crew1, command.crew2];
          nextState.resources.battery -= 20;
          nextState.rover.condition = Math.max(0, nextState.rover.condition - 10);

          nextState.crew[command.crew1].stamina -= 6;
          nextState.crew[command.crew2].stamina -= 6;

          nextState.log.push({
            id: `rover_depart_${nextState.mission.totalTicks}`,
            day: nextState.mission.day,
            tick: nextState.mission.tick,
            message: `Rover departed from bay on a 6-hour surface reconnaissance sortie.`,
            type: 'info',
          });
        }
        break;
      }

      case 'START_EXPEDITION': {
        const dest = ROVER_DESTINATIONS[command.destinationId];
        if (dest && !nextState.rover.isAway && nextState.resources.battery >= dest.batteryCost) {
          nextState.rover.isAway = true;
          nextState.rover.returnTick = nextState.mission.totalTicks + dest.travelTicks;
          nextState.rover.crewOnBoard = [command.crew1, command.crew2 || 'alex'];
          nextState.rover.destination = command.destinationId;
          nextState.resources.battery -= dest.batteryCost;
          nextState.rover.condition = Math.max(0, nextState.rover.condition - 10);

          nextState.crew[command.crew1].stamina -= dest.travelTicks;
          if (command.crew2) {
            nextState.crew[command.crew2].stamina -= dest.travelTicks;
          }

          nextState.log.push({
            id: `exp_depart_${nextState.mission.totalTicks}`,
            day: nextState.mission.day,
            tick: nextState.mission.tick,
            message: `Rover expedition launched to ${dest.name} (Traverse: ${dest.travelTicks}h).`,
            type: 'info',
          });
        }
        break;
      }

      case 'RESOLVE_DECISION': {
        const decIndex = nextState.pendingDecisions.findIndex((d) => d.id === command.decisionId);
        if (decIndex !== -1) {
          const dec = nextState.pendingDecisions[decIndex];
          const opt = dec.options.find((o) => o.id === command.optionId);
          if (opt) {
            nextState.stats.decisionsMade.push({
              day: nextState.mission.day,
              title: dec.title,
              choice: opt.label,
            });
            nextState.completedEvents.push(dec.id);
            nextState.pendingDecisions.splice(decIndex, 1);
            return this.dispatch(nextState, opt.action);
          }
        }
        break;
      }

      case 'DISMISS_DECISION': {
        const decIndex = nextState.pendingDecisions.findIndex((d) => d.id === command.decisionId);
        if (decIndex !== -1) {
          nextState.completedEvents.push(command.decisionId);
          nextState.pendingDecisions.splice(decIndex, 1);
        }
        break;
      }
    }

    return nextState;
  }

  /**
   * Advances the simulation by 1 tick (1 game hour = 1/24th of a Sol).
   */
  tick(state: GameState): GameState {
    if (state.mission.isPaused || state.mission.status !== 'in_progress') {
      return state;
    }

    const nextState = JSON.parse(JSON.stringify(state)) as GameState;
    const mission = nextState.mission;

    // Advance Stage: Sol 1-3 Stage 1, Sol 4-7 Stage 2, Sol 8-10 Stage 3
    if (mission.day >= 8) {
      mission.stage = 3;
    } else if (mission.day >= 3) {
      mission.stage = 2;
      nextState.greenhouseBeds.bed2.unlocked = true; // Bed 2 unlocks on Sol 3
    } else {
      mission.stage = 1;
    }

    // 1. Process Power Simulation
    const powerResult = calculatePowerTick(nextState, this.siteConfig);
    nextState.powerBreakdown = powerResult.breakdown;
    nextState.resources.battery = powerResult.newBattery;

    // 2. Process Life Support (Oxygen)
    const lifeResult = calculateLifeSupportTick(
      nextState,
      powerResult.poweredSystems.lifeSupport && !nextState.systems.lifeSupport.isFaulted
    );
    nextState.resources.oxygen = lifeResult.newOxygen;

    if (nextState.resources.oxygen <= 0) {
      nextState.stats.consecutiveOxygenZeroTicks += 1;
      nextState.stats.maxConsecutiveOxygenZeroTicks = Math.max(
        nextState.stats.maxConsecutiveOxygenZeroTicks,
        nextState.stats.consecutiveOxygenZeroTicks
      );
    } else {
      nextState.stats.consecutiveOxygenZeroTicks = 0;
    }

    // 3. Process Water Recycling & Consumption
    const waterResult = calculateWaterTick(
      nextState,
      powerResult.poweredSystems.recycler && !nextState.systems.recycler.isFaulted
    );
    nextState.resources.water = waterResult.newWater;

    // 4. Process Food Consumption
    const foodResult = calculateFoodTick(nextState.resources.food);
    nextState.resources.food = foodResult.newFood;

    // 5. Baseline Radiation Exposure for astronauts outside/surface
    for (const crew of Object.values(nextState.crew)) {
      const baseline = calculateBaselineSurfaceExposurePerTick(crew.location);
      crew.exposure = Math.round((crew.exposure + baseline) * 100) / 100;
    }

    // 6. Process Active Radiation Advisory Countdown & Particle Event Impact
    if (nextState.radiationAdvisory && !nextState.radiationAdvisory.resolved) {
      nextState.radiationAdvisory.countdownTicks -= 1;
      if (nextState.radiationAdvisory.countdownTicks <= 0) {
        const adv = nextState.radiationAdvisory;
        adv.resolved = true;
        nextState.stats.advisoriesSurvived += 1;

        for (const crew of Object.values(nextState.crew)) {
          const posFactor = getPositionFactor(crew.location);
          const exposurePoints = calculateEventExposure(
            adv.severity,
            posFactor,
            nextState.resources.shieldProtection
          );
          crew.exposure = Math.round((crew.exposure + exposurePoints) * 100) / 100;

          const thresholds = checkExposureThresholds(crew);
          if (thresholds.isRed) {
            crew.health = Math.max(0, crew.health - thresholds.healthPenalty);
          }
        }

        nextState.log.push({
          id: `solar_hit_${mission.totalTicks}`,
          day: mission.day,
          tick: mission.tick,
          message: `Solar storm proton flux (${adv.eventType}) engulfed outpost! Radiation absorbed according to crew bunker positions.`,
          type: 'alert',
        });
      }
    }

    // 7. Process Crew Travel & Active Task Execution
    for (const crew of Object.values(nextState.crew)) {
      // Travel progress
      if (crew.location === 'transit') {
        crew.travelTicksRemaining -= 1;
        if (crew.travelTicksRemaining <= 0) {
          crew.location = crew.targetBuilding || 'habitat';
          crew.targetBuilding = undefined;
        }
      }

      // Task progress
      if (crew.currentTask) {
        crew.currentTask.ticksRemaining -= 1;
        if (crew.currentTask.ticksRemaining <= 0) {
          this.completeTask(nextState, crew, crew.currentTask);
          crew.currentTask = undefined;
        }
      }
    }

    // 8. Process Rover Expedition Return
    if (nextState.rover.isAway && nextState.rover.returnTick !== undefined) {
      if (mission.totalTicks >= nextState.rover.returnTick) {
        nextState.rover.isAway = false;
        nextState.rover.returnTick = undefined;
        nextState.rover.crewOnBoard = [];

        let scienceReward = 15;
        if (nextState.rover.destination) {
          const dest = ROVER_DESTINATIONS[nextState.rover.destination];
          if (dest) scienceReward = dest.scienceYield;
        }
        nextState.resources.science = Math.min(100, nextState.resources.science + scienceReward);
        nextState.stats.samplesCollected += 1;

        nextState.log.push({
          id: `rover_return_${mission.totalTicks}`,
          day: mission.day,
          tick: mission.tick,
          message: `Exploration rover returned safely! Geological sample pods yielded +${scienceReward} science points.`,
          type: 'success',
        });
      }
    }

    // 9. Process Construction Projects
    if (nextState.construction) {
      for (const [projId, cState] of Object.entries(nextState.construction)) {
        if (cState.inProgress && !cState.built) {
          cState.progressTicks += 1;
          const projDef = CONSTRUCTION_PROJECTS[projId as ConstructionProjectId];
          if (projDef && cState.progressTicks >= projDef.hoursNeeded) {
            cState.built = true;
            cState.inProgress = false;
            nextState.log.push({
              id: `const_done_${projId}_${mission.totalTicks}`,
              day: mission.day,
              tick: mission.tick,
              message: `Construction completed: ${projDef.name}!`,
              type: 'success',
            });
          }
        }
      }
    }

    // Advance Tick Counter
    mission.tick += 1;
    mission.totalTicks += 1;

    // Check End of Sol (every 24 ticks)
    if (mission.tick >= 24) {
      mission.tick = 0;
      this.handleEndOfDay(nextState);
      mission.day += 1;

      // Prepare Morning Briefing for the new Sol
      if (mission.day <= 10) {
        nextState.dailyBriefing = getDailyBriefingForSol(mission.day);
      }
    }

    // Update Objectives & Achievements
    this.updateObjectivesAndAchievements(nextState);

    // Event cooldown decrement
    if (nextState.randomEventCooldown > 0) {
      nextState.randomEventCooldown -= 1;
    }

    // Check Scripted Events & Sol 8 Solar Storm
    this.checkForEvents(nextState);

    // Check Endings (Victory / Failure)
    const endingCheck = determineEnding(nextState);
    if (endingCheck) {
      mission.status = endingCheck.ending;
      mission.endingReason = endingCheck.reason;
      mission.isPaused = true;
      mission.score = calculateScore(nextState);
    }

    return nextState;
  }

  private completeTask(state: GameState, crew: typeof INITIAL_CREW[CrewId], task: ActiveCrewTask) {
    const crewInfo = getCrewDisplayName(crew);

    switch (task.type) {
      case 'inspect': {
        state.log.push({
          id: `inspect_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} completed diagnostic inspection of ${task.buildingId.toUpperCase()}. Systems verified.`,
          type: 'info',
        });
        break;
      }

      case 'minor_repair': {
        const sys = this.getSystemForBuilding(state, task.buildingId);
        if (sys) {
          sys.condition = Math.min(100, sys.condition + 30);
          if (sys.condition >= 25) sys.isFaulted = false;
        }
        state.log.push({
          id: `repair_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} completed routine maintenance on ${task.buildingId.toUpperCase()} (+30% integrity).`,
          type: 'success',
        });
        break;
      }

      case 'major_repair': {
        const sys = this.getSystemForBuilding(state, task.buildingId);
        if (sys) {
          sys.condition = 100;
          sys.isFaulted = false;
        }
        state.log.push({
          id: `major_repair_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} completed component overhaul of ${task.buildingId.toUpperCase()} (Restored 100%, fault cleared).`,
          type: 'success',
        });
        break;
      }

      case 'clean_dust': {
        state.systems.solarArray.condition = 100;
        state.systems.solarArray.isFaulted = false;
        state.log.push({
          id: `clean_dust_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} swept lunar dust off solar panels. Array restored to 100% absorption.`,
          type: 'success',
        });
        break;
      }

      case 'rest': {
        crew.stamina = Math.min(8, crew.stamina + 4);
        crew.health = Math.min(100, crew.health + 5);
        state.log.push({
          id: `rest_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} rested in Habitat Command quarters (+4 stamina, +5 HP).`,
          type: 'info',
        });
        break;
      }

      case 'plant_crop': {
        if (task.targetBed && task.cropType) {
          const bed = state.greenhouseBeds[task.targetBed];
          bed.cropType = task.cropType;
          bed.daysPlanted = 0;
          bed.daysMissed = 0;
          bed.stage = 'growing';
          bed.tendedToday = true;
          state.log.push({
            id: `plant_${state.mission.totalTicks}`,
            day: state.mission.day,
            tick: state.mission.tick,
            message: `${crewInfo.name} sowed ${CROP_DEFINITIONS[task.cropType].name} in ${task.targetBed.toUpperCase()}.`,
            type: 'info',
          });
        }
        break;
      }

      case 'tend_crop': {
        if (task.targetBed) {
          state.greenhouseBeds[task.targetBed].tendedToday = true;
          state.log.push({
            id: `tend_${state.mission.totalTicks}`,
            day: state.mission.day,
            tick: state.mission.tick,
            message: `${crewInfo.name} tended crops in ${task.targetBed.toUpperCase()}. Nutrient flow verified.`,
            type: 'info',
          });
        }
        break;
      }

      case 'harvest_crop': {
        if (task.targetBed) {
          const bed = state.greenhouseBeds[task.targetBed];
          if (bed.cropType && bed.stage === 'ready') {
            const def = CROP_DEFINITIONS[bed.cropType];
            let yieldAmount = def.yield;
            // Leo perk: +25% crop yield
            if (crew.id === 'daniel') {
              yieldAmount = Math.round(yieldAmount * 1.25);
            }
            state.resources.food = Math.min(100, state.resources.food + yieldAmount);
            bed.cropType = null;
            bed.stage = 'empty';
            bed.daysPlanted = 0;
            bed.daysMissed = 0;
            state.log.push({
              id: `harvest_${state.mission.totalTicks}`,
              day: state.mission.day,
              tick: state.mission.tick,
              message: `${crewInfo.name} harvested ripe ${def.name} (+${yieldAmount} food packs)!`,
              type: 'success',
            });
          }
        }
        break;
      }

      case 'run_experiment':
      case 'research': {
        let reward = 20;
        if (task.projectId && RESEARCH_PROJECTS[task.projectId]) {
          reward = RESEARCH_PROJECTS[task.projectId].scienceReward;
        }
        // Mia perk: +25% research yield
        if (crew.id === 'sara') {
          reward = Math.round(reward * 1.25);
        }
        state.resources.science = Math.min(100, state.resources.science + reward);
        state.stats.experimentsCompleted += 1;
        state.lab.activeExperiment = false;
        if (task.projectId && !state.lab.completedProjects?.includes(task.projectId)) {
          state.lab.completedProjects = [...(state.lab.completedProjects || []), task.projectId];
        }
        state.log.push({
          id: `res_done_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: state.mission.tick,
          message: `${crewInfo.name} completed scientific analysis (+${reward} research points)!`,
          type: 'success',
        });
        break;
      }
    }
  }

  private getSystemForBuilding(state: GameState, buildingId: BuildingId) {
    if (buildingId === 'power_station') return state.systems.solarArray;
    if (buildingId === 'habitat') return state.systems.lifeSupport;
    if (buildingId === 'recycler') return state.systems.recycler;
    if (buildingId === 'greenhouse') return state.systems.greenhouse;
    if (buildingId === 'comms') return state.systems.comms;
    if (buildingId === 'rover_bay') return state.rover;
    return null;
  }

  private handleEndOfDay(state: GameState) {
    const prevWater = state.resources.water;
    const prevFood = state.resources.food;
    const prevScience = state.resources.science;

    // 1. Stats tracking for score
    if (state.resources.oxygen >= 20) {
      state.stats.daysOxygenNotRed += 1;
    }
    if (state.resources.battery >= 20) {
      state.stats.daysBatteryAbove20 += 1;
    }

    // 2. Hardware wear: -1 condition per Sol
    state.systems.solarArray.condition = Math.max(0, state.systems.solarArray.condition - 1);
    state.systems.lifeSupport.condition = Math.max(0, state.systems.lifeSupport.condition - 1);
    state.systems.recycler.condition = Math.max(0, state.systems.recycler.condition - 1);
    state.systems.greenhouse.condition = Math.max(0, state.systems.greenhouse.condition - 1);
    state.systems.comms.condition = Math.max(0, state.systems.comms.condition - 1);

    for (const sys of Object.values(state.systems)) {
      if (sys.condition < 25) {
        sys.isFaulted = true;
      }
    }

    // 3. Greenhouse Crop Progression
    const isGreenhousePowered = state.powerBreakdown.servedDemandPerTick > 0;
    const waterAvailable = state.resources.water >= 15;

    for (const bedKey of ['bed1', 'bed2'] as const) {
      const res = updateCropBedDay(
        state.greenhouseBeds[bedKey],
        isGreenhousePowered,
        waterAvailable,
        state.greenhouseLightSetting
      );
      state.greenhouseBeds[bedKey] = res.updatedBed;
      if (res.lostCrop) {
        state.log.push({
          id: `crop_lost_${state.mission.totalTicks}`,
          day: state.mission.day,
          tick: 0,
          message: `Crop in ${bedKey.toUpperCase()} withered due to 3 missed days of care/water/power.`,
          type: 'alert',
        });
      }
    }

    // 4. Crew health & daily stamina recovery
    const healthDeltas: Record<CrewId, number> = {} as any;
    const energyDeltas: Record<CrewId, number> = {} as any;

    for (const cid of ['alex', 'sara', 'daniel'] as CrewId[]) {
      const crew = state.crew[cid];
      if (!crew) continue;
      const delta = calculateDailyHealthDelta(crew, state.resources, true);
      crew.health = Math.max(0, Math.min(100, crew.health + delta));
      healthDeltas[cid] = delta;

      const staminaRecovered = crew.staminaMax - crew.stamina;
      energyDeltas[cid] = staminaRecovered;
      crew.stamina = crew.staminaMax;
      crew.skippedRestOrExercise = false;

      if (crew.health < 30) {
        state.stats.emergenciesCount += 1;
      }
    }

    // 5. Build Authoritative Daily Report
    const warnings: string[] = [];
    if (state.resources.oxygen < 25) warnings.push('Critical Oxygen Reserve (<25%)');
    if (state.resources.battery < 20) warnings.push('Critical Battery Depletion (<20%)');
    if (state.resources.water < 20) warnings.push('Low Potable Water Reservoir');
    if (state.resources.food < 20) warnings.push('Low Food Supply');

    const completedToday = state.log
      .filter((l) => l.day === state.mission.day && l.type === 'success')
      .map((l) => l.message);

    const report: DailyReport = {
      sol: state.mission.day,
      powerProduced: Math.round(state.powerBreakdown.generationPerDay),
      powerConsumed: Math.round(state.powerBreakdown.totalDemandPerDay),
      oxygenProduced: 6,
      oxygenConsumed: 6,
      waterRecycled: Math.round(state.resources.water - prevWater + 4),
      waterConsumed: 4,
      foodHarvested: Math.max(0, Math.round(state.resources.food - prevFood + 4)),
      foodConsumed: 4,
      researchGained: Math.max(0, Math.round(state.resources.science - prevScience)),
      buildingsRepaired: completedToday.filter((m) => m.toLowerCase().includes('repair')),
      buildingsDamaged: Object.values(state.systems)
        .filter((s) => s.condition < 60)
        .map((s) => `${s.name} (${s.condition}%)`),
      completedTasks: completedToday,
      crewHealthDeltas: healthDeltas,
      crewEnergyDeltas: energyDeltas,
      warnings,
    };

    state.dailyReport = report;
  }

  private updateObjectivesAndAchievements(state: GameState) {
    if (!state.objectives) return;

    for (const obj of state.objectives) {
      if (obj.id === 'obj_survive') {
        obj.progress = Math.min(10, state.mission.day);
        if (state.mission.day >= 10 && state.mission.tick >= 23) obj.isCompleted = true;
      } else if (obj.id === 'obj_crew_alive') {
        const activeCrew = [state.crew.alex, state.crew.sara, state.crew.daniel].filter(Boolean);
        const aliveCount = activeCrew.filter((c) => c.health > 0).length;
        obj.progress = aliveCount;
        if (state.mission.day >= 10 && aliveCount === 3 && activeCrew.every((c) => c.health > 50)) {
          obj.isCompleted = true;
        }
      } else if (obj.id === 'obj_research') {
        obj.progress = Math.min(60, state.resources.science);
        if (state.resources.science >= 60) obj.isCompleted = true;
      } else if (obj.id === 'obj_crops') {
        obj.progress = Math.min(20, Math.round(state.resources.food));
        if (state.resources.food >= 20) obj.isCompleted = true;
      } else if (obj.id === 'obj_rover') {
        obj.progress = Math.min(1, state.stats.samplesCollected);
        if (state.stats.samplesCollected >= 1) obj.isCompleted = true;
      } else if (obj.id === 'obj_shield') {
        obj.progress = state.resources.shieldLayersBuilt;
        if (state.resources.shieldLayersBuilt >= 1) obj.isCompleted = true;
      }
    }
  }

  private checkForEvents(state: GameState) {
    // Sol 8 Scripted Solar Storm (SPE) Trigger
    if (state.mission.day === 8 && state.mission.tick === 0 && !state.radiationAdvisory) {
      state.radiationAdvisory = {
        active: true,
        eventId: 'sol_8_solar_storm',
        eventType: 'X-Class Solar Flare & SEP Wave',
        classType: 'X2.4',
        severity: 4,
        countdownTicks: 8, // Arrives in 8 game hours
        sourceBadge: 'Archived NASA',
        timestamp: 'NASA DONKI CME-2024-05-10',
        details: 'High-energy coronal mass ejection protons en route to lunar south pole.',
        resolved: false,
      };
      state.log.push({
        id: `advisory_sol8`,
        day: 8,
        tick: 0,
        message: 'DONKI ALERT: Severe X-class solar flare detected. High-energy proton flux arrival in 8 hours!',
        type: 'alert',
      });
    }

    // Daily Scripted Decision at 02:00 LT
    if (state.mission.tick === 2) {
      const decision = getScriptedDecisionForDay(state.mission.day, state);
      if (decision && !state.pendingDecisions.some((d) => d.id === decision.id)) {
        state.pendingDecisions.push(decision);
      }
    }

    // Midday Seeded Random Event check at 12:00 LT
    if (state.mission.tick === 12 && state.mission.day > 1 && state.pendingDecisions.length === 0) {
      const { decision } = tryTriggerRandomEvent(state, this.rng);
      if (decision) {
        state.pendingDecisions.push(decision);
        state.randomEventCooldown = 48; // 2 Sols cooldown
      }
    }
  }
}
