export type AstronautRole = "Engineer" | "Scientist" | "Botanist";

export type AstronautStatus =
  | "Available"
  | "Walking"
  | "Working"
  | "Resting"
  | "Needs Attention";

export type TaskType =
  // Engineering (Alex)
  | "repair_solar"
  | "repair_life_support"
  | "inspect_habitat"
  // Science (Mia)
  | "conduct_experiment"
  | "collect_soil"
  | "analyze_sample"
  // Agriculture (Leo)
  | "harvest_crops"
  | "maintain_crops"
  | "plant_seeds"
  // Universal
  | "rest_in_habitat"
  | "shelter_in_bunker";

export interface CrewTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  targetBuildingId?: string;
  targetPosition: [number, number, number];
  duration: number; // in seconds
  elapsed: number; // in seconds
  status: "Assigned" | "Travelling" | "Working" | "Completed" | "Cancelled" | "Failed";
  rewardLabel: string;
  costLabel?: string;
}

export interface AstronautState {
  id: string; // "alex" | "mia" | "leo"
  name: string;
  role: AstronautRole;
  avatar: string;
  accentColor: string; // hex code
  badgeBg: string; // tailwind class
  health: number; // 0 to 100
  energy: number; // 0 to 100 (stamina)
  radiationDose: number; // in mSv
  status: AstronautStatus;
  currentTask: CrewTask | null;
  taskHistory: string[];
  currentPosition: [number, number, number];
  targetPosition: [number, number, number];
  isSheltered: boolean;
  statusMessage: string;
}
