export type EventSeverity = "info" | "warning" | "danger" | "critical";

export interface MissionEventChoice {
  id: string;
  label: string;
  description: string;
  educationalExplanation: string;
  powerCost?: number;
  waterCost?: number;
  materialsCost?: number;
  scienceBonus?: number;
  radiationRisk?: number; // mSv exposure
  healthImpact?: number; // delta %
  shelterCrew?: boolean;
}

export interface MissionEvent {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  severity: EventSeverity;
  description: string;
  scienceBackground: string;
  dataSourceLabel: "Live NASA Data" | "Historical NASA Data" | "Curated Scientific Reference" | "Fictional Simulation Event";
  choices: MissionEventChoice[];
  resolvedChoiceId?: string;
  isResolved: boolean;
  visualTriggerEffect?: "solar_cme" | "dust_storm" | "power_dim" | "alarm_red";
}
