/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/ResourceDashboard.tsx
 * Professional game resource telemetry bar: Electricity, Oxygen, Water, Food,
 * Crew Health, Radiation Safety, Spare Parts, and Research Points.
 */

import React, { useState } from 'react';
import { useGameStore } from '../store/store.ts';
import {
  Zap,
  Wind,
  Droplets,
  Sprout,
  Heart,
  ShieldAlert,
  Wrench,
  FlaskConical,
} from 'lucide-react';

interface TooltipData {
  title: string;
  category: string;
  current: string;
  rate: string;
  status: string;
  explanation: string;
  tip: string;
}

export const ResourceDashboard: React.FC = () => {
  const state = useGameStore((s) => s.state);
  const [activeTooltip, setActiveTooltip] = useState<TooltipData | null>(null);

  const { resources, powerBreakdown, systems, crew, greenhouseBeds } = state;

  // Average crew health
  const crewMembers = Object.values(crew);
  const avgHealth = Math.round(crewMembers.reduce((acc, c) => acc + c.health, 0) / crewMembers.length);

  // Battery status & trends
  const batteryDelta = Math.round(powerBreakdown.batteryDeltaPerTick * 24 * 10) / 10;
  const isBatteryDraining = powerBreakdown.batteryDeltaPerTick < 0;

  // Active crop count
  const activeBeds = [greenhouseBeds.bed1, greenhouseBeds.bed2].filter((b) => b.unlocked && b.cropType !== null);
  const readyBeds = activeBeds.filter((b) => b.stage === 'ready');

  // Days estimates
  const oxygenDaysLeft = resources.oxygen > 0 ? (resources.oxygen / 6.0).toFixed(1) : '0';
  const waterDemandDaily = 4.0 + activeBeds.length * 2.0;
  const netWaterDaily = Math.max(0.5, waterDemandDaily - (waterDemandDaily * 0.75 * (systems.recycler.condition / 100)));
  const waterDaysLeft = (resources.water / netWaterDaily).toFixed(1);
  const foodDaysLeft = (resources.food / 3.5).toFixed(1);

  return (
    <div className="relative px-3 pt-1 select-none z-20 pointer-events-auto font-mono">
      {/* Compact Unified Resource Strip */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 p-1 px-3 bg-slate-950/90 border border-slate-800 rounded-lg shadow-xl backdrop-blur-md text-xs">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 flex-1 overflow-x-auto no-scrollbar py-0.5">
          {/* 1. Electricity */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              resources.battery < 20
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'ELECTRICAL POWER SUBSYSTEM (EPS)',
                category: 'Power & Storage',
                current: `${Math.round(resources.battery)} / 100 kWh Buffer`,
                rate: `${batteryDelta >= 0 ? '+' : ''}${batteryDelta} kWh / Sol`,
                status: powerBreakdown.shedSystems.length > 0 ? 'Load Shedding Active' : 'Nominal',
                explanation: 'Photovoltaic generation charges battery reserves to sustain life support across lunar night.',
                tip: 'Assign Alex to service solar panels if condition falls below 60%.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{Math.round(resources.battery)}%</span>
            <span
              className={`text-[9px] font-bold ${
                isBatteryDraining ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {batteryDelta >= 0 ? '+' : ''}
              {batteryDelta}/s
            </span>
          </div>

          {/* 2. Oxygen */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              resources.oxygen < 20
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'ATMOSPHERE REVITALIZATION (ECLSS)',
                category: 'Life Support',
                current: `${Math.round(resources.oxygen)} / 100 O₂ Reserve`,
                rate: '-6.0 O₂ / Sol crew consumption',
                status: systems.lifeSupport.condition < 50 ? 'Degraded scrubbers' : 'Pressurized',
                explanation: 'Electrolysis and CO₂ scrubbers maintain atmospheric oxygen levels above critical thresholds.',
                tip: 'Prevent life support condition from dropping below 50% to prevent suffocation.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{Math.round(resources.oxygen)}%</span>
            <span className="text-[9px] text-slate-400">~{oxygenDaysLeft}s</span>
          </div>

          {/* 3. Water */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              resources.water < 20
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'WATER RECOVERY SYSTEM (WRS)',
                category: 'Hydrology',
                current: `${Math.round(resources.water)} / 100 L Buffer`,
                rate: `-${netWaterDaily.toFixed(1)} L / Sol net`,
                status: `75% Recovery at ${systems.recycler.condition}% Cond`,
                explanation: 'Vacuum distillation reclaims potable water from graywater and habitat condensate.',
                tip: 'Deploy rover to extract polar crater ice if reserves drop under 20L.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{Math.round(resources.water)}L</span>
            <span className="text-[9px] text-slate-400">~{waterDaysLeft}s</span>
          </div>

          {/* 4. Food */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              resources.food < 20
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'HYDROPONIC BIOMASS RATIONS',
                category: 'Nutritional Reserves',
                current: `${Math.round(resources.food)} / 100 kg Food Reserves`,
                rate: '-3.5 kg / Sol crew consumption',
                status: readyBeds.length > 0 ? `${readyBeds.length} Crop Ready` : 'Growing in Greenhouse',
                explanation: 'Fresh greens from the VEGGIE chamber supplement rations to maintain crew health.',
                tip: 'Assign Leo to harvest mature crops in the greenhouse promptly.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{Math.round(resources.food)}%</span>
            {readyBeds.length > 0 ? (
              <span className="text-[9px] font-bold text-emerald-400 animate-pulse">HARVEST</span>
            ) : (
              <span className="text-[9px] text-slate-400">~{foodDaysLeft}s</span>
            )}
          </div>

          {/* 5. Crew Health */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              avgHealth < 40
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'EXPEDITION CREW BIOMETRICS',
                category: 'Human Factors',
                current: `Average Health: ${avgHealth} HP`,
                rate: '3 Active Astronaut Specialists',
                status: avgHealth < 60 ? 'Medical Concern' : 'Fit for Duty',
                explanation: 'Lunar 1/6th gravity and radiation exposure impact physical conditioning.',
                tip: 'Ensure astronauts rest in the Habitat to restore stamina and HP.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{avgHealth} HP</span>
            <span className="text-[9px] text-slate-400">3/3 FIT</span>
          </div>

          {/* 6. Radiation Safety */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors cursor-help ${
              state.radiationAdvisory && !state.radiationAdvisory.resolved
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 hover:border-sky-400'
            }`}
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'SPACE WEATHER & DOSIMETRY',
                category: 'Environmental Hazard',
                current: state.radiationAdvisory && !state.radiationAdvisory.resolved ? 'ADVISORY' : 'NOMINAL',
                rate: 'Background Solar Wind',
                status: state.radiationAdvisory && !state.radiationAdvisory.resolved ? 'Solar Storm Incoming' : 'Safe',
                explanation: 'Solar proton events can impart acute radiation risk without sintered regolith shielding.',
                tip: 'Move all crew members into the Radiation Shelter during solar flares.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-[10px]">
              {state.radiationAdvisory && !state.radiationAdvisory.resolved ? 'WARNING' : 'SAFE'}
            </span>
          </div>

          {/* 7. Spare Parts */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-300 cursor-help"
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'SPARE PARTS INVENTORY',
                category: 'Logistics',
                current: `${resources.spareParts} Modular Units`,
                rate: 'Consumed during repairs',
                status: resources.spareParts > 2 ? 'Supplies Available' : 'Stock Low',
                explanation: 'Standard mechanical and electrical replacement parts for outpost maintenance.',
                tip: 'Perform preventative minor repairs to conserve spare components.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{resources.spareParts}</span>
            <span className="text-[9px] text-slate-400">PARTS</span>
          </div>

          {/* 8. Research Points */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-400 text-sky-400 cursor-help"
            onMouseEnter={() =>
              setActiveTooltip({
                title: 'SCIENTIFIC RESEARCH DATA',
                category: 'Mission Accomplishment',
                current: `${resources.science} Research Points`,
                rate: 'Generated by Lab & Field Sampling',
                status: 'Transmission link active',
                explanation: 'Lunar geology samples and biological telemetry transmitted to Earth mission command.',
                tip: 'Conduct lab research and rover expeditions to maximize final score.',
              })
            }
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <FlaskConical className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-bold text-white text-[11px]">{resources.science}</span>
            <span className="text-[9px] text-sky-400">PTS</span>
          </div>
        </div>
      </div>

      {/* Scientific Educational Hover Tooltip */}
      {activeTooltip && (
        <div className="max-w-md mx-auto mt-1.5 p-3 rounded-lg bg-slate-950/95 border border-sky-500/70 text-slate-200 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {activeTooltip.title}
            </span>
            <span className="text-[9px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800">
              {activeTooltip.category}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/80 p-1.5 rounded border border-slate-800 mb-1.5">
            <div>
              <span className="text-slate-400 block text-[8px]">CURRENT LEVEL:</span>
              <span className="font-bold text-white">{activeTooltip.current}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[8px]">RATE / TREND:</span>
              <span className="font-bold text-emerald-400">{activeTooltip.rate}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-1.5">
            {activeTooltip.explanation}
          </p>
          <div className="text-[9px] text-sky-300 bg-sky-950/40 p-1 rounded border border-sky-900/60">
            💡 <strong>Mission Guidance:</strong> {activeTooltip.tip}
          </div>
        </div>
      )}
    </div>
  );
};
