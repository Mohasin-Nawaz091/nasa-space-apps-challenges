export type BuildingType =
  | "habitat"
  | "life_support"
  | "greenhouse"
  | "solar_array"
  | "shelter"
  | "science_lab";

export interface BuildingState {
  id: string;
  type: BuildingType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  level: number;
  condition: number; // 0 to 100
  isActive: boolean;
  powerConsumption: number; // in kWh per day
  operationalSetting: string; // e.g. "normal", "overdrive", "eco", "sheltered"
  operationalIntensity: number; // 0.0 to 2.0
  description: string;
  educationalFact: string;
  canEnterInterior: boolean;
}

export interface BuildingInteractionOptions {
  label: string;
  settingKey: string;
  intensity: number;
  powerDelta: number;
  description: string;
  educationalTradeoff: string;
}
