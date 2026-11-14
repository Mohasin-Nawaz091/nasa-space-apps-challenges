/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/sim/events.ts
 * 10-Sol Master Scripted Narrative Spine, Morning Briefings,
 * and Seeded Random Environmental Events with fairness rules.
 */

import { GameState, PendingDecision, DailyBriefing } from './types.ts';
import { Mulberry32Rng } from './rng.ts';

export const DAILY_BRIEFINGS: Record<number, DailyBriefing> = {
  1: {
    sol: 1,
    title: 'Arrival at Shackleton Rim',
    situation:
      'The 3-astronaut expedition has safely touched down at Artemis Base Alpha. Primary life-support and solar arrays have booted into initial baseline configuration.',
    challenge:
      'Inspect your surroundings, understand base modules, and verify life support telemetry.',
    recommendedObjective: 'Inspect Habitat Command and Solar Power Substation.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Select Alex and assign him to inspect the Solar Power Substation.',
    weatherAdvisory: 'Nominal space weather. Solar illumination 100%.',
  },
  2: {
    sol: 2,
    title: 'Solar Grid Telemetry & Dust Accumulation',
    situation:
      'Surface sensor telemetry indicates low-angle lunar dust accumulation across the photovoltaic array tracking linkages.',
    challenge:
      'Maintain battery reserves above 20 kWh while servicing mechanical tracking linkages.',
    recommendedObjective: 'Inspect and clean solar panel surfaces (EPS-01).',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Assign Alex to inspect and perform routine maintenance on EPS-01.',
    weatherAdvisory: 'Mild electrostatic dust levitation observed along crater rim.',
  },
  3: {
    sol: 3,
    title: 'Closed-Loop ECLSS Optimization',
    situation:
      'Water distillation columns and Sabatier oxygen scrubbers require mechanical calibration to achieve 75% recycling efficiency.',
    challenge:
      'Ensure daily oxygen and water production outpace crew consumption.',
    recommendedObjective: 'Inspect ECLSS Life Support and Water Recycler.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Assign Alex to verify distillation unit integrity in ECLSS-01.',
    weatherAdvisory: 'Sunlight steady at 100%. Thermal conditions nominal.',
  },
  4: {
    sol: 4,
    title: 'Hydroponic Agriculture Activation',
    situation:
      'Greenhouse Bed 1 is primed with nutrient-rich lunar soil simulant. Fresh crops supplement packed food rations and boost crew morale.',
    challenge:
      'Seed the active crop bed and maintain steady irrigation.',
    recommendedObjective: 'Sow Quick Greens or Dwarf Tomatoes in the greenhouse.',
    suggestedSpecialist: 'daniel',
    suggestedAction: 'Select Leo and assign him to plant Quick Greens in Bed 1.',
    weatherAdvisory: 'Greenhouse photosynthetic grow lights operating nominal.',
  },
  5: {
    sol: 5,
    title: 'Scientific Research & Volatiles Analysis',
    situation:
      'Permanently shadowed crater core samples are waiting for mass-spectrometric evaluation in the Science Lab.',
    challenge:
      'Achieve at least 20 research points toward the 60-point mission victory requirement.',
    recommendedObjective: 'Begin Elemental Regolith or Volatiles Analysis in LAB-01.',
    suggestedSpecialist: 'sara',
    suggestedAction: 'Select Mia and assign her to initiate a scientific experiment.',
    weatherAdvisory: 'Deep space telemetry uplink operating nominal.',
  },
  6: {
    sol: 6,
    title: 'Mid-Mission Hardware Integrity Review',
    situation:
      'Continuous thermal cycling and micrometeorite dust abrasion are causing mechanical wear across exterior base modules.',
    challenge:
      'Prioritize maintenance without depleting limited spare parts reserves.',
    recommendedObjective: 'Restore any degraded modules above 70% condition.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Assign Alex to perform preventative maintenance on worn modules.',
    weatherAdvisory: 'Solar tracking angle declining slightly (90% illumination).',
  },
  7: {
    sol: 7,
    title: 'Space-Weather Risk Advisory & Shelter Drill',
    situation:
      'Deep-space satellites have detected an active solar sunspot region rotating into Earth-Moon alignment. An energetic proton event is possible within 24-48 hours.',
    challenge:
      'Inspect Radiation Shelter bulkheads and prepare emergency procedures.',
    recommendedObjective: 'Construct a sintered regolith shield layer over RAD-01.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Deploy a regolith shield layer or verify emergency supplies in RAD-01.',
    weatherAdvisory: 'Solar activity increasing. Coronal magnetic tension rising.',
  },
  8: {
    sol: 8,
    title: 'CRITICAL EMERGENCY: Solar Storm (SPE)',
    situation:
      'An X-class solar flare has erupted! High-energy proton flux will bathe the lunar south pole for the next 12 game hours.',
    challenge:
      'Protect all 3 astronauts from ionising radiation without letting life support fail.',
    recommendedObjective: 'Order all astronauts into the Radiation Shelter.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Initiate crew lockdown in RAD-01 or shelter exposed astronauts immediately.',
    weatherAdvisory: 'DANGER: Intense Solar Particle Event (SPE) in progress!',
  },
  9: {
    sol: 9,
    title: 'Post-Storm Recovery & Grid Optimization',
    situation:
      'The solar storm particle wave has passed. Base systems must be stabilized and research pushed across the 60-point threshold.',
    challenge:
      'Reach at least 60 research points and restore exhausted crew health and energy.',
    recommendedObjective: 'Finalize laboratory research and rest tired astronauts in Habitat.',
    suggestedSpecialist: 'sara',
    suggestedAction: 'Assign Mia to finish active research; send tired crew to rest in Habitat.',
    weatherAdvisory: 'Space weather returned to calm. Sunlight steady at 90%.',
  },
  10: {
    sol: 10,
    title: 'Final Mission Evaluation: Artemis Base Alpha',
    situation:
      'The 10-Sol expedition concludes today. Houston Flight Operations is evaluating base survivability, crew health, and scientific discoveries.',
    challenge:
      'Ensure all 3 astronauts remain healthy (>50% HP) and life support remains nominal.',
    recommendedObjective: 'Confirm all victory conditions: 3 alive, health >50%, research >=60.',
    suggestedSpecialist: 'alex',
    suggestedAction: 'Conduct final module inspections, advance to debriefing, and receive your Mission Certification.',
    weatherAdvisory: 'Mission conclusion day. Final telemetry evaluation underway.',
  },
};

export function getDailyBriefingForSol(sol: number): DailyBriefing {
  return (
    DAILY_BRIEFINGS[sol] || {
      sol,
      title: `Sol ${sol} Operations`,
      situation: 'Nominal surface expedition operations in progress at Shackleton Rim.',
      challenge: 'Balance power, life support, and crew stamina.',
      recommendedObjective: 'Keep base infrastructure operational and crew safe.',
      suggestedSpecialist: 'alex',
      suggestedAction: 'Inspect critical modules and manage tasks.',
      weatherAdvisory: 'Solar illumination nominal.',
    }
  );
}

export function getScriptedDecisionForDay(day: number, state: GameState): PendingDecision | null {
  const eventId = `scripted_day_${day}`;
  if (state.completedEvents.includes(eventId)) {
    return null;
  }

  switch (day) {
    case 2:
      return {
        id: eventId,
        day: 2,
        title: 'Solar Array Dust Accumulation',
        situation:
          'Electrostatic lunar dust has coated the solar panel hinges. Photovoltaic tracking efficiency has dropped by 15%.',
        learningPoint:
          'Solar power is life on the Moon. Cleaning or repairing panels early prevents compounding battery deficits.',
        sourceBadge: 'Simulated',
        critical: true,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'clean_array',
            label: 'Clean & Calibrate Solar Array',
            description: 'Send engineer Alex to clean dust coatings and calibrate tracking hinges.',
            costDescription: 'Costs 3 crew hours, 0 parts. Restores array condition to 100%.',
            hoursCost: 3,
            powerCost: 0,
            partsCost: 0,
            action: {
              type: 'ASSIGN_TASK',
              crewId: 'alex',
              taskType: 'minor_repair',
              buildingId: 'power_station',
            },
          },
          {
            id: 'defer_solar',
            label: 'Defer Cleaning for Later',
            description: 'Save crew stamina for habitat checks; accept reduced power output today.',
            costDescription: 'Costs 0 hours. Array condition drops by 15% immediately.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'DISMISS_DECISION', decisionId: eventId },
          },
        ],
      };

    case 3:
      return {
        id: eventId,
        day: 3,
        title: 'Water Recycler Distillation Calibration',
        situation:
          'The ECLSS water recycler vacuum distillation pump is showing pressure oscillations.',
        learningPoint:
          'On the Moon, 98% of water must be reclaimed from humidity, sweat, and wastewater to avoid depleting limited water tanks.',
        sourceBadge: 'Simulated',
        critical: true,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'service_recycler',
            label: 'Service Distillation Columns',
            description: 'Assign Alex to flush valves and calibrate distillation pressures.',
            costDescription: 'Costs 3 crew hours, 0 parts. Secures 75% closed-loop water recovery.',
            hoursCost: 3,
            powerCost: 0,
            partsCost: 0,
            action: {
              type: 'ASSIGN_TASK',
              crewId: 'alex',
              taskType: 'minor_repair',
              buildingId: 'recycler',
            },
          },
          {
            id: 'run_eco',
            label: 'Switch Recycler to Eco Mode',
            description: 'Reduce pump speed to prevent component strain, saving power but reducing reclaimed water.',
            costDescription: 'Costs 0 hours. Water consumption increases slightly.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'DISMISS_DECISION', decisionId: eventId },
          },
        ],
      };

    case 4:
      return {
        id: eventId,
        day: 4,
        title: 'Greenhouse Crop Acceleration Opportunity',
        situation:
          'Botanist Leo reports that hydroponic nutrient circulation in Bed 1 is optimal for accelerated seedling germination.',
        learningPoint:
          'Controlled Environment Agriculture allows fast-growing microgreens to mature in just 2 Sols, providing vital vitamins.',
        sourceBadge: 'Simulated',
        critical: false,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'plant_fast_greens',
            label: 'Plant High-Resilience Microgreens',
            description: 'Assign Leo to sow Quick Greens in Bed 1 for harvest by Sol 6.',
            costDescription: 'Costs 2 crew hours (Leo perk), 2 water/Sol. Produces +16 fresh food.',
            hoursCost: 2,
            powerCost: 0,
            partsCost: 0,
            action: {
              type: 'ASSIGN_TASK',
              crewId: 'daniel',
              taskType: 'plant_crop',
              buildingId: 'greenhouse',
              bedId: 'bed1',
              cropType: 'quick_greens',
            },
          },
          {
            id: 'conserve_water',
            label: 'Rely on Packaged Rations',
            description: 'Keep crop bed dormant today to conserve water reservoirs.',
            costDescription: '0 hours. No fresh food produced.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'DISMISS_DECISION', decisionId: eventId },
          },
        ],
      };

    case 5:
      return {
        id: eventId,
        day: 5,
        title: 'Permanently Shadowed Crater Volatiles Discovery',
        situation:
          'Automated probe sensors have flagged an ice-rich regolith outcrop inside a permanently shadowed cold trap 2 km south.',
        learningPoint:
          'Water ice locked in cold traps at -246°C can be refined into oxygen for breathing and hydrogen for rocket propellant.',
        sourceBadge: 'Archived NASA',
        sourceTag: 'NASA LCROSS Water Ice Detection',
        critical: false,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'lab_analysis',
            label: 'Initiate Volatiles Mass-Spectrometry',
            description: 'Assign scientist Mia to analyze ice core spectral signatures in LAB-01.',
            costDescription: 'Costs 6 crew hours, 5 power. Rewards +25 science points toward victory.',
            hoursCost: 6,
            powerCost: 5,
            partsCost: 0,
            action: {
              type: 'START_RESEARCH',
              projectId: 'water_ice_investigation',
              crewId: 'sara',
            },
          },
          {
            id: 'defer_science',
            label: 'Save Power & Stand By',
            description: 'Preserve battery reserves for life support.',
            costDescription: '0 resources consumed.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'DISMISS_DECISION', decisionId: eventId },
          },
        ],
      };

    case 6:
      return {
        id: eventId,
        day: 6,
        title: 'Mid-Mission Mechanical Overhaul Priority',
        situation:
          'Vibrations from vacuum pumps have caused mechanical wear in the life-support air filtration loops.',
        learningPoint:
          'Space habitat air filters capture fine toxic lunar regolith particles brought in on spacesuits.',
        sourceBadge: 'Simulated',
        critical: true,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'overhaul_filters',
            label: 'Replace Air Filtration Seals',
            description: 'Assign Alex to service ECLSS filters and restore 100% mechanical condition.',
            costDescription: 'Costs 3 crew hours, 0 parts. Keeps oxygen generation nominal.',
            hoursCost: 3,
            powerCost: 0,
            partsCost: 0,
            action: {
              type: 'ASSIGN_TASK',
              crewId: 'alex',
              taskType: 'minor_repair',
              buildingId: 'habitat',
            },
          },
          {
            id: 'defer_filter',
            label: 'Postpone Maintenance',
            description: 'Keep Alex available for other duties.',
            costDescription: 'Life support condition drops by 15%.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'DISMISS_DECISION', decisionId: eventId },
          },
        ],
      };

    case 7:
      return {
        id: eventId,
        day: 7,
        title: 'Space Weather Risk Briefing & Bunker Preparation',
        situation:
          'NASA DONKI alert: An X-class solar flare has erupted on the eastern solar limb. Coronal mass ejection protons will arrive at the Moon tomorrow (Sol 8).',
        learningPoint:
          'The Moon has no atmosphere or global magnetic field. Sintered lunar regolith bulkheads provide dense shielding against dangerous solar protons.',
        sourceBadge: 'Archived NASA',
        sourceTag: 'NASA DONKI CME Space Weather Watch',
        critical: true,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'build_regolith_shield',
            label: 'Build Sintered Regolith Shield Layer',
            description: 'Deploy sintered regolith bulkheads over the Radiation Shelter (+10 permanent protection).',
            costDescription: 'Costs 10 crew hours, 8 power, 1 spare part. Permanent +10 protection.',
            hoursCost: 10,
            powerCost: 8,
            partsCost: 1,
            action: { type: 'BUILD_SHIELD_LAYER' },
          },
          {
            id: 'prepare_bunker',
            label: 'Prepare Emergency Supplies in Shelter',
            description: 'Inspect shelter life support and stage medical packs in RAD-01.',
            costDescription: 'Costs 2 crew hours, 0 parts.',
            hoursCost: 2,
            powerCost: 0,
            partsCost: 0,
            action: {
              type: 'ASSIGN_TASK',
              crewId: 'alex',
              taskType: 'inspect',
              buildingId: 'shelter',
            },
          },
        ],
      };

    case 8:
      return {
        id: eventId,
        day: 8,
        title: 'CRITICAL: Solar Storm Particle Wave Arrival',
        situation:
          'High-energy solar protons are impinging upon Shackleton Rim! Surface radiation is 5x above baseline.',
        learningPoint:
          'Astronauts must immediately shelter inside RAD-01 to avoid dangerous ionising radiation exposure.',
        sourceBadge: 'Archived NASA',
        sourceTag: 'NASA DONKI Alert SPE-2024-05-10',
        critical: true,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'shelter_all_crew',
            label: 'Lock Down All Astronauts in Shelter (RAD-01)',
            description: 'Relocate all 3 astronauts into the Radiation Shelter for maximum protection.',
            costDescription: 'Protects crew cells from exposure during peak flux hours.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'MOVE_CREW', crewId: 'alex', targetBuilding: 'shelter' },
          },
          {
            id: 'shelter_and_power_conserve',
            label: 'Shelter Crew & Set Base to Eco Power Grid',
            description: 'Shelter crew and conserve batteries while surface solar arrays take radiation noise.',
            costDescription: 'Saves 15 kWh while protecting crew.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'MOVE_CREW', crewId: 'sara', targetBuilding: 'shelter' },
          },
        ],
      };

    case 9:
      return {
        id: eventId,
        day: 9,
        title: 'Final Science Discovery Push',
        situation:
          'The solar storm has cleared. With 2 Sols remaining, Houston Flight Operations recommends completing all scientific investigations to reach the 60-point victory threshold.',
        learningPoint:
          'Scientific return justifies the investment in lunar exploration. Reaching 60 research points fulfills the expedition charter.',
        sourceBadge: 'Simulated',
        critical: false,
        createdAtTick: state.mission.totalTicks,
        options: [
          {
            id: 'final_science_experiment',
            label: 'Run Final Mass-Spectrometer Analysis',
            description: 'Assign Mia to complete Elemental Regolith analysis for +20 research points.',
            costDescription: 'Costs 6 crew hours, 5 power. Yields +20 science.',
            hoursCost: 6,
            powerCost: 5,
            partsCost: 0,
            action: {
              type: 'START_RESEARCH',
              projectId: 'regolith_composition',
              crewId: 'sara',
            },
          },
          {
            id: 'secure_systems',
            label: 'Focus on Rest & Final Infrastructure Check',
            description: 'Send tired astronauts to rest in Habitat and verify life support reserves.',
            costDescription: 'Costs 0 resources. Restores astronaut health and stamina.',
            hoursCost: 0,
            powerCost: 0,
            partsCost: 0,
            action: { type: 'REST_CREW', crewId: 'alex' },
          },
        ],
      };

    default:
      return null;
  }
}

export function tryTriggerRandomEvent(
  state: GameState,
  rng: Mulberry32Rng
): { decision: PendingDecision | null; stateModifier?: (s: GameState) => void } {
  // Fairness rule: at most one random negative event per 3 Sols (72 ticks)
  if (state.randomEventCooldown > 0) {
    return { decision: null };
  }

  // Controlled probability check
  const roll = rng.next();
  if (roll > 0.3) {
    return { decision: null };
  }

  const pool = [
    'dust_on_panels',
    'greenhouse_pump_slowdown',
    'small_air_leak',
    'comms_noise',
  ];

  const selected = rng.pick(pool);
  const eventId = `random_${selected}_tick_${state.mission.totalTicks}`;

  switch (selected) {
    case 'dust_on_panels':
      return {
        decision: {
          id: eventId,
          day: state.mission.day,
          title: 'Electrostatic Dust on Solar Panels',
          situation:
            'A low-angle electrostatic dust fountain has coated the solar array in fine lunar regolith.',
          learningPoint:
            'Lunar dust is jagged volcanic glass. Cleaning it restores full photovoltaic absorption.',
          sourceBadge: 'Simulated',
          critical: false,
          createdAtTick: state.mission.totalTicks,
          options: [
            {
              id: 'dust_clean',
              label: 'Assign Alex to Clean Panels',
              description: 'Conduct quick wipe-down of solar arrays.',
              costDescription: 'Costs 2 crew hours. Restores full power generation.',
              hoursCost: 2,
              powerCost: 0,
              partsCost: 0,
              action: {
                type: 'ASSIGN_TASK',
                crewId: 'alex',
                taskType: 'minor_repair',
                buildingId: 'power_station',
              },
            },
            {
              id: 'ignore_dust',
              label: 'Leave Dust on Panels Today',
              description: 'Save crew stamina; accept -10% lower power output.',
              costDescription: 'No resource cost.',
              hoursCost: 0,
              powerCost: 0,
              partsCost: 0,
              action: { type: 'DISMISS_DECISION', decisionId: eventId },
            },
          ],
        },
      };

    case 'greenhouse_pump_slowdown':
      return {
        decision: {
          id: eventId,
          day: state.mission.day,
          title: 'Hydroponic Irrigation Flow Fluctuation',
          situation:
            'Mineral salts have accumulated in the nutrient line nozzle serving Greenhouse Bed 1.',
          learningPoint:
            'Hydroponic drippers require periodic clearing to ensure roots receive dissolved nutrients evenly.',
          sourceBadge: 'Simulated',
          critical: false,
          createdAtTick: state.mission.totalTicks,
          options: [
            {
              id: 'clear_nozzle',
              label: 'Clear Irrigation Lines (Leo)',
              description: 'Assign botanist Leo to flush the nutrient line.',
              costDescription: 'Costs 2 crew hours. Keeps crop growth at 100%.',
              hoursCost: 2,
              powerCost: 0,
              partsCost: 0,
              action: {
                type: 'ASSIGN_TASK',
                crewId: 'daniel',
                taskType: 'tend_crop',
                buildingId: 'greenhouse',
                bedId: 'bed1',
              },
            },
            {
              id: 'ignore_pump',
              label: 'Allow Pump to Self-Clear',
              description: 'Crops may experience minor stress today.',
              costDescription: '0 hours.',
              hoursCost: 0,
              powerCost: 0,
              partsCost: 0,
              action: { type: 'DISMISS_DECISION', decisionId: eventId },
            },
          ],
        },
      };

    case 'small_air_leak':
      return {
        decision: {
          id: eventId,
          day: state.mission.day,
          title: 'Airlock Outer Seal Micro-Leak',
          situation:
            'Atmospheric pressure sensors detect a tiny airlock seal leak in Habitat Command.',
          learningPoint:
            'Air pressure differential in space is intense. Airlock silicon seals must be inspected regularly.',
          sourceBadge: 'Simulated',
          critical: false,
          createdAtTick: state.mission.totalTicks,
          options: [
            {
              id: 'seal_airlock',
              label: 'Reseal Airlock Outer Flange',
              description: 'Assign Alex to tighten and reseal airlock gaskets.',
              costDescription: 'Costs 2 crew hours, 0 parts. Stops oxygen loss.',
              hoursCost: 2,
              powerCost: 0,
              partsCost: 0,
              action: {
                type: 'ASSIGN_TASK',
                crewId: 'alex',
                taskType: 'minor_repair',
                buildingId: 'habitat',
              },
            },
            {
              id: 'ignore_seal',
              label: 'Monitor Leak Rate',
              description: 'Postpone repair; lose 3 oxygen over the next day.',
              costDescription: 'Costs 3 oxygen.',
              hoursCost: 0,
              powerCost: 0,
              partsCost: 0,
              action: { type: 'DISMISS_DECISION', decisionId: eventId },
            },
          ],
        },
      };

    default:
      return { decision: null };
  }
}
