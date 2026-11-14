/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/InteractionPrompt.tsx
 * Restrained tactical HUD prompt displayed when an astronaut approaches
 * within operational proximity of a base module.
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';
import { eventBus } from '../store/bus.ts';
import {
  Building2,
  Zap,
  FlaskConical,
  Droplets,
  ShieldAlert,
  Cpu,
  Radio,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { BuildingId } from '../sim/types.ts';

interface PromptDef {
  name: string;
  code: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BUILDING_PROMPTS: Record<BuildingId, PromptDef> = {
  habitat: {
    name: 'HABITAT COMMAND',
    code: 'HAB-01',
    action: 'Rest, Sleep & Thermal Life Support',
    icon: Building2,
  },
  power_station: {
    name: 'SOLAR POWER ARRAY',
    code: 'EPS-01',
    action: 'Cell Maintenance & Angle Optimization',
    icon: Zap,
  },
  greenhouse: {
    name: 'HYDROPONIC GREENHOUSE',
    code: 'BIO-01',
    action: 'Aeroponics, Crop Seeding & Harvest',
    icon: FlaskConical,
  },
  recycler: {
    name: 'WATER RECYCLER',
    code: 'ECLSS-01',
    action: 'Filter Servicing & Distillation Flush',
    icon: Droplets,
  },
  shelter: {
    name: 'RADIATION SHELTER',
    code: 'RAD-01',
    action: 'Storm Bunker & Regolith Shielding',
    icon: ShieldAlert,
  },
  laboratory: {
    name: 'SCIENCE LABORATORY',
    code: 'LAB-01',
    action: 'Regolith Analysis & Volatiles Research',
    icon: Cpu,
  },
  comms: {
    name: 'COMMS PHASED DISH',
    code: 'COM-01',
    action: 'Houston Telemetry & Science Uplink',
    icon: Radio,
  },
  rover_bay: {
    name: 'ROVER MAINTENANCE BAY',
    code: 'BAY-01',
    action: 'Chassis Service & Surface Expeditions',
    icon: Truck,
  },
};

export const InteractionPrompt: React.FC = () => {
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);
  const activeModal = useGameStore((s) => s.activeModal);
  const selectedEntity = useGameStore((s) => s.selectedEntity);
  const openTaskMenu = useGameStore((s) => s.openTaskMenu);

  // If a modal or context panel is open, do not obstruct with the prompt
  if (!nearbyBuilding || activeModal !== 'none' || selectedEntity) return null;

  const info = BUILDING_PROMPTS[nearbyBuilding] || {
    name: nearbyBuilding.toUpperCase(),
    code: 'MOD-01',
    action: 'Operate Module Systems',
    icon: Building2,
  };
  const Icon = info.icon;

  const handleInteract = () => {
    openTaskMenu(nearbyBuilding);
    eventBus.emit('sound:play', { name: 'click' });
  };

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none animate-fadeIn font-mono">
      <button
        onClick={handleInteract}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-700/80 hover:border-sky-400 shadow-2xl backdrop-blur-md transition-all hover:scale-102 cursor-pointer text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wider">
              {info.name}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-sky-500 text-slate-950 text-[10px] font-black shadow-sm">
              [ E ]
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
            {info.action}
          </div>
        </div>

        <div className="ml-2 flex items-center text-[11px] font-bold text-sky-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
          <span>OPERATE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
