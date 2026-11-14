import { create } from "zustand";
import { GameMissionState, CameraViewMode, ColonyResources } from "../types/game";
import { INITIAL_BUILDINGS, BUILDING_INTERACTIONS } from "../constants/buildings";
import { INITIAL_ASTRONAUTS, INITIAL_RESOURCES, SIMULATION_CONSTANTS } from "../constants/simulation";
import { MISSION_DAYS_EVENTS } from "../data/missions";
import { MissionEvent } from "../types/events";
import { CrewTask, TaskType } from "../types/astronaut";

interface GameActions {
  selectBuilding: (id: string | null) => void;
  setCameraMode: (mode: CameraViewMode) => void;
  enterInterior: (buildingId: string) => void;
  exitInterior: () => void;
  setPaused: (isPaused: boolean) => void;
  togglePause: () => void;
  advanceDay: () => void;
  resolveActiveEvent: (choiceId: string) => void;
  dismissActiveEvent: () => void;
  updateBuildingSetting: (buildingId: string, settingKey: string) => void;
  repairBuilding: (buildingId: string) => void;
  setCrewSheltered: (sheltered: boolean) => void;
  assignAstronaut: (astronautId: string, buildingId: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setGraphicsQuality: (quality: "low" | "medium" | "high") => void;
  restartMission: (seed?: string) => void;
  setMainMenuOpen: (open: boolean) => void;
  setBriefingOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setTutorialActive: (active: boolean, step?: number) => void;
  setTutorialStep: (step: number) => void;
  startNewMission: () => void;
  continueMission: () => boolean;
  saveMissionToStorage: () => void;
  setGameStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  recordBuildingInspection: (buildingId: string) => void;
  setResourceExplanationKey: (key: string | null) => void;
  setTargetObjectiveBuildingId: (id: string | null) => void;
  awardStar: () => void;
  // Interactive Astronaut Controls
  selectAstronaut: (id: string | null) => void;
  setDestinationMarker: (marker: { position: [number, number, number]; timestamp: number } | null) => void;
  moveAstronaut: (astronautId: string, position: [number, number, number]) => void;
  updateAstronautPosition: (astronautId: string, position: [number, number, number]) => void;
  assignCrewTask: (astronautId: string, task: Omit<CrewTask, "id" | "elapsed" | "status">) => void;
  progressCrewTask: (astronautId: string, deltaSeconds: number) => void;
  completeCrewTask: (astronautId: string) => void;
  cancelCrewTask: (astronautId: string) => void;
  restCrewMember: (astronautId: string) => void;
  setTaskPickerOpen: (open: boolean) => void;
  setCrewSelectionOpen: (open: boolean) => void;
}

export const useGameStore = create<GameMissionState & GameActions>((set, get) => ({
  currentDay: 1,
  maxDays: SIMULATION_CONSTANTS.MAX_DAYS,
  isPaused: false,
  gameSpeed: 1,
  isMissionCompleted: false,
  isMissionFailed: false,
  failureReason: undefined,
  resources: { ...INITIAL_RESOURCES },
  buildings: { ...INITIAL_BUILDINGS },
  astronauts: [...INITIAL_ASTRONAUTS],
  selectedBuildingId: null,
  cameraMode: "colony",
  interiorBuildingId: null,
  activeEvent: MISSION_DAYS_EVENTS[1] ? { ...MISSION_DAYS_EVENTS[1] } : null,
  eventHistory: [],
  missionLogs: [
    {
      id: "log_init",
      day: 1,
      timestamp: "08:00 UTC",
      type: "status",
      title: "Touchdown Confirmed",
      message: "Artemis Base Alpha touched down at Shackleton Crater rim. Solar tracking and life support online.",
      scienceNote: "The lunar south pole features areas of near-permanent sunlight, ideal for solar power generation.",
    },
  ],
  dailyReports: [],
  seed: "ARTEMIS-2026",
  soundEnabled: true,
  musicEnabled: true,
  graphicsQuality: "high",
  isAdvancingDay: false,
  isMainMenuOpen: true, // Shows Main Menu on first load
  isBriefingOpen: false,
  isSettingsOpen: false,
  isTutorialActive: false,
  tutorialStep: 1,
  gameStage: 1,
  stageProgress: {},
  missionStars: 1,
  resourceExplanationKey: null,
  targetObjectiveBuildingId: null,
  selectedAstronautId: null,
  destinationMarker: null,
  isTaskPickerOpen: false,
  isCrewSelectionOpen: false,

  setGameStage: (stage) => set({ gameStage: stage }),
  recordBuildingInspection: (buildingId) =>
    set((state) => ({
      stageProgress: { ...state.stageProgress, [buildingId]: true },
    })),
  setResourceExplanationKey: (key) => set({ resourceExplanationKey: key }),
  setTargetObjectiveBuildingId: (id) => set({ targetObjectiveBuildingId: id }),
  setCrewSelectionOpen: (open) => set({ isCrewSelectionOpen: open }),
  awardStar: () =>
    set((state) => ({
      missionStars: state.missionStars + 1,
    })),

  selectAstronaut: (id) =>
    set((state) => ({
      selectedAstronautId: id,
      selectedBuildingId: id ? null : state.selectedBuildingId,
      isTaskPickerOpen: false,
    })),

  setDestinationMarker: (marker) => set({ destinationMarker: marker }),

  setTaskPickerOpen: (open) => set({ isTaskPickerOpen: open }),

  moveAstronaut: (astronautId, targetPosition) => {
    set((state) => {
      const a = state.astronauts.find((ast) => ast.id === astronautId);
      if (!a) return state;

      const clampedTarget: [number, number, number] = [
        Math.max(-32, Math.min(32, targetPosition[0])),
        0,
        Math.max(-32, Math.min(32, targetPosition[2])),
      ];

      const updated = state.astronauts.map((ast) => {
        if (ast.id !== astronautId) return ast;
        return {
          ...ast,
          targetPosition: clampedTarget,
          status: "Walking" as const,
          statusMessage: "Moving across lunar regolith to coordinate...",
          currentTask: null,
        };
      });

      return {
        astronauts: updated,
        destinationMarker: {
          position: clampedTarget,
          timestamp: Date.now(),
        },
      };
    });
  },

  updateAstronautPosition: (astronautId, position) => {
    set((state) => ({
      astronauts: state.astronauts.map((ast) =>
        ast.id === astronautId ? { ...ast, currentPosition: position } : ast
      ),
    }));
  },

  assignCrewTask: (astronautId, taskData) => {
    set((state) => {
      const ast = state.astronauts.find((a) => a.id === astronautId);
      if (!ast) return state;

      const fullTask: CrewTask = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        elapsed: 0,
        status: "Travelling",
      };

      const newLog = {
        id: `log_task_assign_${Date.now()}`,
        day: state.currentDay,
        timestamp: "09:30 UTC",
        type: "status" as const,
        title: `Order Dispatched: ${ast.name}`,
        message: `Assigned task: "${fullTask.title}". En route to sector.`,
      };

      const updated = state.astronauts.map((a) => {
        if (a.id !== astronautId) return a;
        return {
          ...a,
          targetPosition: fullTask.targetPosition,
          status: "Walking" as const,
          statusMessage: `En route to ${fullTask.title}...`,
          currentTask: fullTask,
        };
      });

      return {
        astronauts: updated,
        missionLogs: [newLog, ...state.missionLogs],
        destinationMarker: {
          position: fullTask.targetPosition,
          timestamp: Date.now(),
        },
        isTaskPickerOpen: false,
      };
    });
  },

  progressCrewTask: (astronautId, deltaSeconds) => {
    const { astronauts } = get();
    const ast = astronauts.find((a) => a.id === astronautId);
    if (!ast || !ast.currentTask) return;

    const task = ast.currentTask;

    if (task.status === "Travelling") {
      const dist = Math.hypot(
        ast.currentPosition[0] - task.targetPosition[0],
        ast.currentPosition[2] - task.targetPosition[2]
      );
      if (dist < 1.0) {
        set((state) => ({
          astronauts: state.astronauts.map((a) => {
            if (a.id !== astronautId || !a.currentTask) return a;
            return {
              ...a,
              status: "Working" as const,
              statusMessage: `Active: Performing ${a.currentTask.title}...`,
              currentTask: {
                ...a.currentTask,
                status: "Working" as const,
              },
            };
          }),
        }));
        return;
      }
    } else if (task.status === "Working") {
      const newElapsed = task.elapsed + deltaSeconds;
      if (newElapsed >= task.duration) {
        get().completeCrewTask(astronautId);
      } else {
        set((state) => ({
          astronauts: state.astronauts.map((a) => {
            if (a.id !== astronautId || !a.currentTask) return a;
            return {
              ...a,
              currentTask: {
                ...a.currentTask,
                elapsed: newElapsed,
              },
            };
          }),
        }));
      }
    }
  },

  completeCrewTask: (astronautId) => {
    set((state) => {
      const ast = state.astronauts.find((a) => a.id === astronautId);
      if (!ast || !ast.currentTask) return state;

      const task = ast.currentTask;
      const type = task.type;

      const newResources = { ...state.resources };
      const newBuildings = { ...state.buildings };
      const logTitle = `Task Completed: ${task.title}`;
      let logMsg = `${ast.name} successfully finished operations.`;
      let scienceNote: string | undefined = undefined;

      if (type === "repair_solar") {
        const cur = newBuildings.solar_array?.condition || 80;
        const restored = Math.min(100, cur + 25);
        newBuildings.solar_array = { ...newBuildings.solar_array, condition: restored };
        logMsg = `${ast.name} repaired photovoltaic tracking mounts, raising array condition to ${restored}%.`;
        scienceNote = "High panel efficiency ensures stable power during the long lunar day.";
      } else if (type === "repair_life_support") {
        const cur = newBuildings.life_support?.condition || 80;
        const restored = Math.min(100, cur + 25);
        newBuildings.life_support = { ...newBuildings.life_support, condition: restored };
        logMsg = `${ast.name} overhauled ECLSS air scrubbers, restoring life-support integrity to ${restored}%.`;
        scienceNote = "NASA ECLSS systems scrub carbon dioxide and regenerate breathable oxygen.";
      } else if (type === "inspect_habitat") {
        const cur = newBuildings.habitat?.condition || 85;
        const restored = Math.min(100, cur + 20);
        newBuildings.habitat = { ...newBuildings.habitat, condition: restored };
        newResources.researchPoints = Math.min(newResources.targetResearchPoints, newResources.researchPoints + 5);
        logMsg = `${ast.name} checked pressure seals and airlocks (+5 NASA Science).`;
      } else if (type === "conduct_experiment") {
        newResources.researchPoints = Math.min(newResources.targetResearchPoints, newResources.researchPoints + 8);
        logMsg = `${ast.name} completed crystallization research, generating +8 NASA Science Points!`;
        scienceNote = "Zero-g and fractional gravity allow researchers to grow ultra-pure protein crystals.";
      } else if (type === "collect_soil") {
        newResources.researchPoints = Math.min(newResources.targetResearchPoints, newResources.researchPoints + 6);
        newResources.materials = Math.min(newResources.maxMaterials, newResources.materials + 4);
        logMsg = `${ast.name} retrieved pristine ilmenite regolith core samples (+6 Science, +4 Materials).`;
        scienceNote = "Lunar regolith is rich in oxygen, silicon, and titanium ore.";
      } else if (type === "analyze_sample") {
        newResources.researchPoints = Math.min(newResources.targetResearchPoints, newResources.researchPoints + 10);
        logMsg = `${ast.name} completed mass-spectrometer analysis (+10 NASA Science Points).`;
      } else if (type === "harvest_crops") {
        newResources.food = Math.min(newResources.maxFood, newResources.food + 15);
        logMsg = `${ast.name} harvested hydroponic greens and micro-radishes (+15 Food rations).`;
        scienceNote = "Fresh plants provide essential vitamins and psychological well-being for astronauts.";
      } else if (type === "maintain_crops") {
        const cur = newBuildings.greenhouse?.condition || 80;
        const restored = Math.min(100, cur + 25);
        newBuildings.greenhouse = { ...newBuildings.greenhouse, condition: restored };
        logMsg = `${ast.name} balanced aeroponic nutrient feeds, restoring greenhouse condition to ${restored}%.`;
      } else if (type === "plant_seeds") {
        newResources.food = Math.min(newResources.maxFood, newResources.food + 10);
        newResources.researchPoints = Math.min(newResources.targetResearchPoints, newResources.researchPoints + 3);
        logMsg = `${ast.name} planted new dwarf-wheat germination trays (+10 Food, +3 Science).`;
      } else if (type === "rest_in_habitat") {
        logMsg = `${ast.name} finished rest cycle in habitat sleep pod. Energy fully restored!`;
      }

      const isRest = type === "rest_in_habitat";
      const newEnergy = isRest ? 100 : Math.max(0, ast.energy - 15);
      const newHealth = isRest ? Math.min(100, ast.health + 10) : ast.health;
      const nextStatus = newEnergy <= 20 ? ("Needs Attention" as const) : ("Available" as const);
      const nextMsg = newEnergy <= 20
        ? "Exhausted! Needs rest in Habitat to recharge energy."
        : "Task finished. Ready for next assignment.";

      const newHistory = [task.title, ...ast.taskHistory].slice(0, 5);

      const newLog = {
        id: `log_task_done_${Date.now()}`,
        day: state.currentDay,
        timestamp: "15:00 UTC",
        type: "status" as const,
        title: logTitle,
        message: logMsg,
        scienceNote,
      };

      const updatedAstronauts = state.astronauts.map((a) => {
        if (a.id !== astronautId) return a;
        return {
          ...a,
          energy: newEnergy,
          health: newHealth,
          status: nextStatus,
          statusMessage: nextMsg,
          currentTask: null,
          taskHistory: newHistory,
        };
      });

      return {
        resources: newResources,
        buildings: newBuildings,
        astronauts: updatedAstronauts,
        missionLogs: [newLog, ...state.missionLogs],
      };
    });
  },

  cancelCrewTask: (astronautId) => {
    set((state) => ({
      astronauts: state.astronauts.map((a) => {
        if (a.id !== astronautId) return a;
        return {
          ...a,
          targetPosition: a.currentPosition,
          status: "Available" as const,
          statusMessage: "Task cancelled. Standing by.",
          currentTask: null,
        };
      }),
      destinationMarker: null,
    }));
  },

  restCrewMember: (astronautId) => {
    get().assignCrewTask(astronautId, {
      type: "rest_in_habitat",
      title: "Rest in Habitat Bunk",
      description: "Rest inside Habitat module to recharge stamina and recover energy.",
      targetBuildingId: "habitat",
      targetPosition: [-1.5, 0, 1.5],
      duration: 5,
      rewardLabel: "Restores Energy to 100% and +10 Health",
    });
  },

  selectBuilding: (id) => {
    set((state) => {
      if (id === state.selectedBuildingId) return state;
      const newProgress = id ? { ...state.stageProgress, [id]: true } : state.stageProgress;
      return {
        selectedBuildingId: id,
        cameraMode: id ? "inspecting" : "colony",
        stageProgress: newProgress,
      };
    });
  },

  setCameraMode: (mode) => {
    set((state) => ({
      cameraMode: mode,
      selectedBuildingId: mode === "colony" ? null : state.selectedBuildingId,
    }));
  },

  enterInterior: (buildingId) => {
    const b = get().buildings[buildingId];
    if (b && b.canEnterInterior) {
      set({
        interiorBuildingId: buildingId,
        cameraMode: "interior",
        selectedBuildingId: buildingId,
      });
    }
  },

  exitInterior: () => {
    set((state) => ({
      interiorBuildingId: null,
      cameraMode: state.selectedBuildingId ? "inspecting" : "colony",
    }));
  },

  setPaused: (isPaused) => set({ isPaused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  updateBuildingSetting: (buildingId, settingKey) => {
    set((state) => {
      const b = state.buildings[buildingId];
      if (!b) return state;

      const interactionOptions = BUILDING_INTERACTIONS[buildingId];
      const option = interactionOptions?.find((o) => o.settingKey === settingKey);
      if (!option) return state;

      const newPower = Math.max(0, b.powerConsumption + option.powerDelta);

      const updatedBuilding = {
        ...b,
        operationalSetting: settingKey,
        operationalIntensity: option.intensity,
        powerConsumption: newPower,
      };

      const newLog = {
        id: `log_setting_${Date.now()}`,
        day: state.currentDay,
        timestamp: "12:00 UTC",
        type: "decision" as const,
        title: `${b.name}: ${option.label}`,
        message: option.description,
        scienceNote: option.educationalTradeoff,
      };

      return {
        buildings: {
          ...state.buildings,
          [buildingId]: updatedBuilding,
        },
        missionLogs: [newLog, ...state.missionLogs],
      };
    });
  },

  repairBuilding: (buildingId) => {
    const { resources, buildings, currentDay, missionLogs } = get();
    const b = buildings[buildingId];
    if (!b || b.condition >= 100 || resources.materials < 4) return;

    set({
      resources: {
        ...resources,
        materials: resources.materials - 4,
      },
      buildings: {
        ...buildings,
        [buildingId]: {
          ...b,
          condition: 100,
        },
      },
      missionLogs: [
        {
          id: `log_repair_${Date.now()}`,
          day: currentDay,
          timestamp: "14:00 UTC",
          type: "status",
          title: `Repair Completed: ${b.name}`,
          message: `Consolidated 4 spare parts to overhaul facility components and restore 100% operational condition.`,
          scienceNote: "Preventive maintenance reduces wear from abrasive lunar regolith particles.",
        },
        ...missionLogs,
      ],
    });
  },

  setCrewSheltered: (shelter) => {
    set((state) => {
      const updatedAstronauts = state.astronauts.map((a) => ({
        ...a,
        isSheltered: shelter,
        status: shelter ? ("Resting" as const) : ("Available" as const),
        targetPosition: shelter ? ([6, 0.1, 7.5] as [number, number, number]) : a.targetPosition,
        statusMessage: shelter
          ? "Protected inside 2-meter regolith storm bunker."
          : "Carrying out assigned base operations.",
      }));

      const newLog = {
        id: `log_shelter_${Date.now()}`,
        day: state.currentDay,
        timestamp: "11:30 UTC",
        type: "alert" as const,
        title: shelter ? "SHELTER LOCKDOWN ENGAGED" : "All Clear: Crew Released from Shelter",
        message: shelter
          ? "All crew members evacuated to the radiation storm shelter."
          : "Crew returned to standard outpost modules.",
        scienceNote: shelter
          ? "Thick lunar regolith shielding blocks intense solar proton flux."
          : "Safe surface radiation levels restored.",
      };

      return {
        astronauts: updatedAstronauts,
        missionLogs: [newLog, ...state.missionLogs],
      };
    });
  },

  assignAstronaut: (astronautId, buildingId) => {
    set((state) => ({
      astronauts: state.astronauts.map((a) =>
        a.id === astronautId ? { ...a, assignedBuildingId: buildingId } : a
      ),
    }));
  },

  resolveActiveEvent: (choiceId) => {
    const { activeEvent, currentDay, resources, astronauts, missionLogs, eventHistory } = get();
    if (!activeEvent || activeEvent.isResolved) return;

    const choice = activeEvent.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply immediate impacts
    const newResources: ColonyResources = {
      ...resources,
      power: Math.max(0, Math.min(resources.maxPower, resources.power - (choice.powerCost || 0))),
      water: Math.max(0, Math.min(resources.maxWater, resources.water - (choice.waterCost || 0))),
      materials: Math.max(
        0,
        Math.min(resources.maxMaterials, resources.materials - (choice.materialsCost || 0))
      ),
      researchPoints: Math.min(
        resources.targetResearchPoints,
        resources.researchPoints + (choice.scienceBonus || 0)
      ),
    };

    let updatedAstronauts = [...astronauts];
    if (choice.shelterCrew !== undefined) {
      updatedAstronauts = updatedAstronauts.map((a) => ({
        ...a,
        isSheltered: choice.shelterCrew ?? false,
        radiationDose: a.radiationDose + (choice.radiationRisk || 0),
        health: Math.max(0, Math.min(100, a.health + (choice.healthImpact || 0))),
        status: choice.shelterCrew ? ("Resting" as const) : a.status,
      }));
    } else if (choice.healthImpact || choice.radiationRisk) {
      updatedAstronauts = updatedAstronauts.map((a) => ({
        ...a,
        health: Math.max(0, Math.min(100, a.health + (choice.healthImpact || 0))),
        radiationDose: a.radiationDose + (choice.radiationRisk || 0),
      }));
    }

    const resolvedEvent: MissionEvent = {
      ...activeEvent,
      resolvedChoiceId: choiceId,
      isResolved: true,
    };

    const newLog = {
      id: `log_event_${Date.now()}`,
      day: currentDay,
      timestamp: "16:00 UTC",
      type: "decision" as const,
      title: `${activeEvent.title}: ${choice.label}`,
      message: choice.educationalExplanation,
      scienceNote: activeEvent.scienceBackground,
    };

    set({
      resources: newResources,
      astronauts: updatedAstronauts,
      activeEvent: resolvedEvent,
      eventHistory: [...eventHistory, resolvedEvent],
      missionLogs: [newLog, ...missionLogs],
    });
  },

  dismissActiveEvent: () => {
    set({ activeEvent: null });
  },

  advanceDay: () => {
    const state = get();
    if (state.isAdvancingDay || state.isMissionCompleted || state.isMissionFailed) return;
    set({ isAdvancingDay: true });

    const nextDay = state.currentDay + 1;

    // 1. Calculate Daily Production & Consumption
    const solarBuilding = state.buildings.solar_array;
    const solarEfficiency = (solarBuilding?.condition || 100) / 100;
    const powerGenerated = Math.round(SIMULATION_CONSTANTS.BASE_SOLAR_GENERATION * solarEfficiency);

    const totalPowerConsumed = Object.values(state.buildings).reduce((acc, b) => {
      return acc + (b.isActive ? b.powerConsumption : 0);
    }, 0);

    const netPower = powerGenerated - totalPowerConsumed;
    const updatedPower = Math.max(0, Math.min(state.resources.maxPower, state.resources.power + netPower));

    // Life support & greenhouse
    const lsBuilding = state.buildings.life_support;
    const ghBuilding = state.buildings.greenhouse;
    const isPowerAvailable = updatedPower > 10;

    const o2Produced = isPowerAvailable
      ? Math.round(
          SIMULATION_CONSTANTS.BASE_OXYGEN_PRODUCTION *
            (lsBuilding.operationalIntensity || 1.0) *
            (lsBuilding.condition / 100)
        )
      : 2;

    const o2Consumed = state.astronauts.length * SIMULATION_CONSTANTS.OXYGEN_CONSUMPTION_PER_ASTRONAUT;
    const updatedOxygen = Math.max(
      0,
      Math.min(state.resources.maxOxygen, state.resources.oxygen + o2Produced - o2Consumed)
    );

    const waterConsumedByCrew = state.astronauts.length * SIMULATION_CONSTANTS.WATER_CONSUMPTION_PER_ASTRONAUT;
    const waterConsumedByGh = ghBuilding.isActive
      ? Math.round(SIMULATION_CONSTANTS.BASE_GREENHOUSE_WATER_USE * (ghBuilding.operationalIntensity || 1.0))
      : 0;
    const totalWaterConsumed = waterConsumedByCrew + waterConsumedByGh;
    const waterRecycled = isPowerAvailable
      ? Math.round(totalWaterConsumed * SIMULATION_CONSTANTS.BASE_WATER_RECYCLE_EFFICIENCY)
      : 0;
    const updatedWater = Math.max(
      0,
      Math.min(state.resources.maxWater, state.resources.water + waterRecycled - totalWaterConsumed)
    );

    const foodProduced = isPowerAvailable && ghBuilding.isActive
      ? Math.round(
          SIMULATION_CONSTANTS.BASE_FOOD_PRODUCTION *
            (ghBuilding.operationalIntensity || 1.0) *
            (ghBuilding.condition / 100)
        )
      : 0;
    const foodConsumed = state.astronauts.length * SIMULATION_CONSTANTS.FOOD_CONSUMPTION_PER_ASTRONAUT;
    const updatedFood = Math.max(
      0,
      Math.min(state.resources.maxFood, state.resources.food + foodProduced - foodConsumed)
    );

    // Research points
    const labBuilding = state.buildings.science_lab;
    const scienceAdded = labBuilding.isActive && isPowerAvailable ? 8 : 1;
    const updatedResearch = Math.min(
      state.resources.targetResearchPoints,
      state.resources.researchPoints + scienceAdded
    );

    // 2. Evaluate Crew Health
    let healthPenalty = 0;
    if (updatedPower <= 0) healthPenalty += 10;
    if (updatedOxygen <= 0) healthPenalty += 30;
    if (updatedWater <= 0) healthPenalty += 20;
    if (updatedFood <= 0) healthPenalty += 10;

    const updatedAstronauts = state.astronauts.map((a) => {
      const radiationRate = a.isSheltered
        ? SIMULATION_CONSTANTS.SHELTERED_RADIATION_RATE
        : SIMULATION_CONSTANTS.NORMAL_BACKGROUND_RADIATION_RATE;
      const newDose = +(a.radiationDose + radiationRate).toFixed(1);
      const newHealth = Math.max(0, Math.min(100, a.health - healthPenalty));
      return {
        ...a,
        radiationDose: newDose,
        health: newHealth,
      };
    });

    // 3. Degrade building conditions slightly
    const updatedBuildings = { ...state.buildings };
    Object.keys(updatedBuildings).forEach((key) => {
      const b = updatedBuildings[key];
      const wear = b.operationalIntensity > 1.2 ? 3 : 1;
      updatedBuildings[key] = {
        ...b,
        condition: Math.max(20, b.condition - wear),
      };
    });

    // 4. Check Failure & Victory
    const isCrewDead = updatedAstronauts.some((a) => a.health <= 0);
    const isOxygenDepleted = updatedOxygen <= 0;
    const isPowerStarved = updatedPower <= 0;

    let failed = false;
    let failReason = "";

    if (isCrewDead) {
      failed = true;
      failReason = "Mission Aborted: Critical astronaut health failure. Houston has initiated emergency evacuation.";
    } else if (isOxygenDepleted && state.resources.oxygen <= 0) {
      failed = true;
      failReason = "Mission Aborted: Colony oxygen reserves exhausted. Emergency life support expired.";
    } else if (isPowerStarved && state.resources.power <= 0) {
      failed = true;
      failReason = "Mission Aborted: Total base electrical blackout during sub-zero thermal night.";
    }

    const isCompleted = nextDay > SIMULATION_CONSTANTS.MAX_DAYS && !failed;

    // 5. Next Event
    const nextEvent = nextDay <= SIMULATION_CONSTANTS.MAX_DAYS && MISSION_DAYS_EVENTS[nextDay]
      ? { ...MISSION_DAYS_EVENTS[nextDay] }
      : null;

    const dailyReport = {
      day: state.currentDay,
      summary: `Day ${state.currentDay} complete. Solar generation produced ${powerGenerated} kWh. Net power: ${netPower > 0 ? "+" : ""}${netPower} kWh. Food balance: ${foodProduced - foodConsumed >= 0 ? "+" : ""}${foodProduced - foodConsumed} rations.`,
      deltas: {
        powerDelta: netPower,
        oxygenDelta: o2Produced - o2Consumed,
        waterDelta: waterRecycled - totalWaterConsumed,
        foodDelta: foodProduced - foodConsumed,
        materialsDelta: 0,
      },
      eventsHandled: state.activeEvent?.isResolved ? [state.activeEvent.title] : [],
      crewStatusSummary: `All ${updatedAstronauts.length} astronauts operational. Average vitals: ${Math.round(
        updatedAstronauts.reduce((acc, a) => acc + a.health, 0) / updatedAstronauts.length
      )}%.`,
      scienceMilestones: [`+${scienceAdded} Science Research points accumulated.`],
    };

    const newLog = {
      id: `log_day_${nextDay}`,
      day: nextDay <= SIMULATION_CONSTANTS.MAX_DAYS ? nextDay : SIMULATION_CONSTANTS.MAX_DAYS,
      timestamp: "06:00 UTC",
      type: "status" as const,
      title: isCompleted ? "Mission Certification Achieved!" : `Simulated Sol ${nextDay} Begun`,
      message: isCompleted
        ? "Congratulations Commander! You have successfully guided Artemis Base Alpha through its 10-day mission!"
        : `Solar arrays adjusted to lunar horizon. Life support running on morning cycle.`,
      scienceNote: isCompleted
        ? "You demonstrated the principles of closed-loop life support and lunar resource engineering!"
        : undefined,
    };

    set({
      currentDay: Math.min(SIMULATION_CONSTANTS.MAX_DAYS, nextDay),
      isMissionCompleted: isCompleted,
      isMissionFailed: failed,
      failureReason: failReason || undefined,
      resources: {
        power: updatedPower,
        maxPower: state.resources.maxPower,
        oxygen: updatedOxygen,
        maxOxygen: state.resources.maxOxygen,
        water: updatedWater,
        maxWater: state.resources.maxWater,
        food: updatedFood,
        maxFood: state.resources.maxFood,
        materials: state.resources.materials,
        maxMaterials: state.resources.maxMaterials,
        researchPoints: updatedResearch,
        targetResearchPoints: state.resources.targetResearchPoints,
      },
      astronauts: updatedAstronauts,
      buildings: updatedBuildings,
      activeEvent: nextEvent,
      dailyReports: [...state.dailyReports, dailyReport],
      missionLogs: [newLog, ...state.missionLogs],
      isAdvancingDay: false,
    });

    get().saveMissionToStorage();
  },

  setMainMenuOpen: (open) => set({ isMainMenuOpen: open }),
  setBriefingOpen: (open) => set({ isBriefingOpen: open }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setTutorialActive: (active, step = 1) => set({ isTutorialActive: active, tutorialStep: step }),
  setTutorialStep: (step) => set({ tutorialStep: step }),

  startNewMission: () => {
    get().restartMission("ARTEMIS-" + Math.floor(Math.random() * 9000 + 1000));
    set({
      isMainMenuOpen: false,
      isBriefingOpen: false,
      isCrewSelectionOpen: true,
      isTutorialActive: false,
    });
  },

  continueMission: () => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("lunar_command_save");
      if (!saved) return false;
      const data = JSON.parse(saved);
      if (data && data.currentDay) {
        // Validate crew integrity
        const validCrew = (data.astronauts || []).every(
          (a: any) => ["alex", "mia", "leo"].includes(a.id)
        );
        const crewToUse =
          validCrew && data.astronauts?.length === 3 ? data.astronauts : [...INITIAL_ASTRONAUTS];

        set({
          ...data,
          astronauts: crewToUse,
          selectedAstronautId: null,
          destinationMarker: null,
          isTaskPickerOpen: false,
          isMainMenuOpen: false,
          isBriefingOpen: false,
          isSettingsOpen: false,
          isTutorialActive: false,
          isAdvancingDay: false,
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  },

  saveMissionToStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const state = get();
      const saveData = {
        currentDay: state.currentDay,
        resources: state.resources,
        buildings: state.buildings,
        astronauts: state.astronauts,
        eventHistory: state.eventHistory,
        missionLogs: state.missionLogs,
        dailyReports: state.dailyReports,
        seed: state.seed,
      };
      localStorage.setItem("lunar_command_save", JSON.stringify(saveData));
    } catch {}
  },

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),

  restartMission: (newSeed) => {
    set({
      currentDay: 1,
      isPaused: false,
      isMissionCompleted: false,
      isMissionFailed: false,
      failureReason: undefined,
      resources: { ...INITIAL_RESOURCES },
      buildings: { ...INITIAL_BUILDINGS },
      astronauts: [...INITIAL_ASTRONAUTS],
      selectedBuildingId: null,
      selectedAstronautId: null,
      destinationMarker: null,
      isTaskPickerOpen: false,
      isCrewSelectionOpen: false,
      cameraMode: "colony",
      interiorBuildingId: null,
      activeEvent: { ...MISSION_DAYS_EVENTS[1] },
      eventHistory: [],
      dailyReports: [],
      missionLogs: [
        {
          id: `log_restart_${Date.now()}`,
          day: 1,
          timestamp: "08:00 UTC",
          type: "status",
          title: "Mission Reset & Initialized",
          message: "New 10-day lunar surface simulation initialized.",
        },
      ],
      seed: newSeed || "ARTEMIS-2026",
      isAdvancingDay: false,
    });
  },
}));
