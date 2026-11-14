import { BuildingState } from "./building";
import { AstronautState } from "./astronaut";
import { MissionEvent } from "./events";

export type CameraViewMode = "colony" | "inspecting" | "interior";

export interface ColonyResources {
  power: number; // kWh
  maxPower: number;
  oxygen: number; // kg
  maxOxygen: number;
  water: number; // L
  maxWater: number;
  food: number; // rations
  maxFood: number;
  materials: number; // units
  maxMaterials: number;
  researchPoints: number; // 0-100
  targetResearchPoints: number;
}

export interface ResourceDelta {
  powerDelta: number;
  oxygenDelta: number;
  waterDelta: number;
  foodDelta: number;
  materialsDelta: number;
}

export interface MissionLogEntry {
  id: string;
  day: number;
  timestamp: string;
  type: "status" | "warning" | "discovery" | "decision" | "alert";
  title: string;
  message: string;
  scienceNote?: string;
}

export interface DailyReport {
  day: number;
  summary: string;
  deltas: ResourceDelta;
  eventsHandled: string[];
  crewStatusSummary: string;
  scienceMilestones: string[];
}

export interface GameMissionState {
  currentDay: number;
  maxDays: number;
  isPaused: boolean;
  gameSpeed: number; // 1x, 2x
  isMissionCompleted: boolean;
  isMissionFailed: boolean;
  failureReason?: string;
  resources: ColonyResources;
  buildings: Record<string, BuildingState>;
  astronauts: AstronautState[];
  selectedBuildingId: string | null;
  cameraMode: CameraViewMode;
  interiorBuildingId: string | null;
  activeEvent: MissionEvent | null;
  eventHistory: MissionEvent[];
  missionLogs: MissionLogEntry[];
  dailyReports: DailyReport[];
  seed: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  graphicsQuality: "low" | "medium" | "high";
  isAdvancingDay: boolean;
  isMainMenuOpen: boolean;
  isBriefingOpen: boolean;
  isSettingsOpen: boolean;
  isTutorialActive: boolean;
  tutorialStep: number;
  // New Kid-Friendly Redesign State
  gameStage: 1 | 2 | 3 | 4 | 5; // 1: Welcome, 2: Core 3, 3: Power Challenge, 4: Advanced Modules, 5: Full 10-Sol
  stageProgress: Record<string, boolean>;
  missionStars: number;
  resourceExplanationKey: string | null;
  targetObjectiveBuildingId: string | null;
  // Interactive Astronaut Controls
  selectedAstronautId: string | null;
  destinationMarker: { position: [number, number, number]; timestamp: number } | null;
  isTaskPickerOpen: boolean;
  isCrewSelectionOpen: boolean;
}
