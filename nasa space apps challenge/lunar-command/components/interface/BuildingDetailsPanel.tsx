"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import { BUILDING_INTERACTIONS } from "../../constants/buildings";
import { X, Wrench, Zap, Eye, Lightbulb, Activity, CheckCircle2 } from "lucide-react";

export function BuildingDetailsPanel() {
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

  return (
    <aside className="absolute right-4 top-20 bottom-8 w-80 md:w-96 z-20 pointer-events-auto flex flex-col bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl text-white overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 to-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-base md:text-lg font-bold tracking-wide text-cyan-200">
              {building.name}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            SECTOR: LUNAR SOUTH POLE
          </p>
        </div>
        <button
          onClick={() => selectBuilding(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Close Panel [Esc]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status & Condition Bar */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Facility Integrity</span>
            <span
              className={`font-bold font-mono ${
                building.condition > 80
                  ? "text-emerald-400"
                  : building.condition > 50
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {building.condition}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                building.condition > 80
                  ? "bg-emerald-500"
                  : building.condition > 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${building.condition}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Draw: {building.powerConsumption} kWh/day</span>
            </div>
            {building.condition < 100 && (
              <button
                disabled={materials < 4}
                onClick={() => repairBuilding(building.id)}
                className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition text-white"
              >
                <Wrench className="w-3 h-3" />
                <span>Repair (-4 Parts)</span>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800/60">
          {building.description}
        </div>

        {/* Educational NASA Science Fact */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 p-3 rounded-xl border border-cyan-800/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span>NASA SCIENCE NOTE</span>
          </div>
          <p className="text-cyan-100/90 leading-relaxed text-[11px]">
            {building.educationalFact}
          </p>
        </div>

        {/* Operational Trade-Off Settings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engineering Mode & Trade-offs</span>
          </h3>
          <div className="space-y-2">
            {interactions.map((opt) => {
              const isSelectedSetting = building.operationalSetting === opt.settingKey;
              return (
                <button
                  key={opt.settingKey}
                  onClick={() => updateBuildingSetting(building.id, opt.settingKey)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelectedSetting
                      ? "bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/50"
                      : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isSelectedSetting ? "text-cyan-300" : "text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelectedSetting && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {opt.description}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[10px] text-amber-300/80 italic">
                    Trade-off: {opt.educationalTradeoff}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        {building.canEnterInterior && (
          <button
            onClick={() => enterInterior(building.id)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>INSPECT INTERIOR [F]</span>
          </button>
        )}
        <button
          onClick={() => selectBuilding(null)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 active:scale-98"
        >
          <span>← BACK TO COLONY VIEW [ESC]</span>
        </button>
      </div>
    </aside>
  );
}
