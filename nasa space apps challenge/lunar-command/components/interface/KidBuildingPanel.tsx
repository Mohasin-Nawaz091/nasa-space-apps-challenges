"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import { BUILDING_INTERACTIONS } from "../../constants/buildings";
import {
  X,
  Wrench,
  Zap,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Activity,
  Heart,
  Droplet,
  Utensils,
  Wind,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function KidBuildingPanel() {
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const buildings = useGameStore((s) => s.buildings);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const enterInterior = useGameStore((s) => s.enterInterior);
  const updateBuildingSetting = useGameStore((s) => s.updateBuildingSetting);
  const repairBuilding = useGameStore((s) => s.repairBuilding);
  const materials = useGameStore((s) => s.resources.materials);

  if (!selectedBuildingId) return null;
  const building = buildings[selectedBuildingId];
  if (!building) return null;

  const interactions = BUILDING_INTERACTIONS[selectedBuildingId] || [];

  // Building simplified kid-friendly summaries
  const buildingMeta: Record<
    string,
    { emoji: string; shortRole: string; producedText: string; consumedText: string }
  > = {
    habitat: {
      emoji: "🏠",
      shortRole: "Where your 3 astronauts sleep, eat, and rest.",
      producedText: "Provides living quarters & sleep pods",
      consumedText: "Uses 25 kWh electricity per Sol",
    },
    life_support: {
      emoji: "💨",
      shortRole: "Cleans the air and recycles water for the whole colony.",
      producedText: "Makes +15 kg clean oxygen & recycles 90% water",
      consumedText: "Uses 35 kWh electricity per Sol",
    },
    greenhouse: {
      emoji: "🌿",
      shortRole: "Your astronauts grow fresh strawberries, wheat, and greens here.",
      producedText: "Makes +9 food packs per Sol",
      consumedText: "Uses 8 L water & 20 kWh electricity per Sol",
    },
    solar_array: {
      emoji: "⚡",
      shortRole: "Tracks the low polar sun to harvest clean solar electricity.",
      producedText: "Generates +145 kWh electricity per Sol",
      consumedText: "Zero power consumed (generates power!)",
    },
    shelter: {
      emoji: "🛡️",
      shortRole: "Underground bunker beneath 2m of lunar soil to shield against solar storms.",
      producedText: "Blocks 94% of lethal solar radiation rays",
      consumedText: "Uses 10 kWh electricity on standby",
    },
    science_lab: {
      emoji: "🔬",
      shortRole: "Analyzes Moon rocks, core samples, and sends research to NASA.",
      producedText: "Produces +8 NASA Science Points per Sol",
      consumedText: "Uses 25 kWh electricity per Sol",
    },
  };

  const meta = buildingMeta[selectedBuildingId] || {
    emoji: "🏢",
    shortRole: building.description,
    producedText: "Essential outpost function",
    consumedText: `Uses ${building.powerConsumption} kWh/day`,
  };

  return (
    <aside className="absolute right-4 top-24 bottom-24 w-84 md:w-96 z-30 pointer-events-auto flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-400/80 rounded-3xl shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 select-none">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20 shadow-inner">
            {meta.emoji}
          </div>
          <div>
            <h2 className="text-base font-black tracking-wide text-white leading-tight">
              {building.name}
            </h2>
            <p className="text-[11px] text-cyan-300 font-medium">
              Sector: Shackleton Crater Rim
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            selectBuilding(null);
          }}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-slate-300 hover:text-white"
          title="Close [Esc]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Simple Plain-English Purpose */}
        <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-slate-700 dark:text-cyan-100 leading-relaxed font-medium">
          {meta.shortRole}
        </div>

        {/* Health & Condition Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Building Health</span>
            </span>
            <span
              className={`font-black font-mono ${
                building.condition >= 85
                  ? "text-emerald-600 dark:text-emerald-400"
                  : building.condition >= 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {building.condition}% Condition
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                building.condition >= 85
                  ? "bg-emerald-500"
                  : building.condition >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${building.condition}%` }}
            />
          </div>

          {building.condition < 100 && (
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Worn by abrasive lunar dust
              </span>
              <button
                disabled={materials < 4}
                onClick={() => {
                  sounds.playSuccess();
                  repairBuilding(building.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-[11px] shadow-md transition active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Fix Building (-4 Parts)</span>
              </button>
            </div>
          )}
        </div>

        {/* What it Produces & Consumes */}
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-400 block mb-0.5">
              WHAT IT MAKES:
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-emerald-100">
              {meta.producedText}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-[10px] uppercase font-extrabold text-amber-700 dark:text-amber-400 block mb-0.5">
              WHAT IT USES:
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-amber-100">
              {meta.consumedText}
            </p>
          </div>
        </div>

        {/* Operating Mode Buttons with Plain-Language Consequences */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            CHOOSE OPERATING MODE:
          </span>
          <div className="space-y-2">
            {interactions.map((opt) => {
              const isSelected = building.operationalSetting === opt.settingKey;
              return (
                <button
                  key={opt.settingKey}
                  onClick={() => {
                    sounds.playClick();
                    updateBuildingSetting(building.id, opt.settingKey);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "bg-cyan-50 dark:bg-cyan-950/70 border-cyan-500 shadow-md ring-2 ring-cyan-500/30"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {opt.description}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    Trade-off: {opt.educationalTradeoff}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 space-y-2">
        {building.canEnterInterior && (
          <button
            onClick={() => {
              sounds.playClick();
              enterInterior(building.id);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>INSPECT INTERIOR ROOM</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            selectBuilding(null);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Base View</span>
        </button>
      </div>
    </aside>
  );
}
