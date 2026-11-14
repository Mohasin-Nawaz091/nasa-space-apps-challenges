"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  X,
  Zap,
  Heart,
  Radio,
  ClipboardList,
  Home,
  Ban,
  Activity,
  ArrowRight,
  Sparkles,
  Wrench,
  FlaskConical,
  Sprout,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function CrewCommandPanel() {
  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);
  const astronauts = useGameStore((s) => s.astronauts);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const setTaskPickerOpen = useGameStore((s) => s.setTaskPickerOpen);
  const cancelCrewTask = useGameStore((s) => s.cancelCrewTask);
  const restCrewMember = useGameStore((s) => s.restCrewMember);
  const assignCrewTask = useGameStore((s) => s.assignCrewTask);
  const cameraMode = useGameStore((s) => s.cameraMode);

  if (cameraMode === "interior" || !selectedAstronautId) return null;

  const astronaut = astronauts.find((a) => a.id === selectedAstronautId);
  if (!astronaut) return null;

  const isWorking = astronaut.status === "Working";
  const hasTask = Boolean(astronaut.currentTask);
  const taskProgress = astronaut.currentTask
    ? Math.min(
        100,
        Math.round((astronaut.currentTask.elapsed / astronaut.currentTask.duration) * 100)
      )
    : 0;

  return (
    <div className="fixed top-20 right-4 z-40 w-80 md:w-96 bg-slate-900/95 border-2 rounded-2xl shadow-2xl backdrop-blur-md p-4 text-white flex flex-col gap-3 select-none animate-in slide-in-from-right duration-200 border-cyan-500/60 ring-2 ring-cyan-500/20">
      {/* Header with Avatar & Name */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border-2"
            style={{
              borderColor: astronaut.accentColor,
              backgroundColor: `${astronaut.accentColor}25`,
            }}
          >
            {astronaut.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-white">
                {astronaut.name}
              </h2>
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded text-white font-mono uppercase tracking-wider"
                style={{ backgroundColor: astronaut.accentColor }}
              >
                {astronaut.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Artemis Base Alpha Crew
            </p>
          </div>
        </div>

        {/* Deselect Button */}
        <button
          onClick={() => {
            sounds.playClick();
            selectAstronaut(null);
          }}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Deselect Astronaut [Esc]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Vitals: Health & Stamina Meters */}
      <div className="grid grid-cols-2 gap-2">
        {/* Health */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Heart className="w-3.5 h-3.5 text-emerald-400" /> Vitals
            </span>
            <span className="font-black text-emerald-400">{astronaut.health}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                astronaut.health > 70
                  ? "bg-emerald-500"
                  : astronaut.health > 40
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${astronaut.health}%` }}
            />
          </div>
        </div>

        {/* Energy / Stamina */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Stamina
            </span>
            <span className="font-black text-amber-400">{astronaut.energy}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${astronaut.energy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Radiation & Location Telemetry */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-cyan-400" />
          Rad: {astronaut.radiationDose} mSv
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-purple-400" />
          Status: <strong className="text-white capitalize">{astronaut.status}</strong>
        </span>
      </div>

      {/* Current Task Progress Card */}
      {astronaut.currentTask ? (
        <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <span className="animate-spin text-sm">⚙️</span>
              {astronaut.currentTask.title}
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              {taskProgress}%
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {astronaut.currentTask.description}
          </p>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-200"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Reward: <strong className="text-emerald-400">{astronaut.currentTask.rewardLabel}</strong></span>
            <button
              onClick={() => {
                sounds.playClick();
                cancelCrewTask(astronaut.id);
              }}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Ban className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 italic">
          "{astronaut.statusMessage}"
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Assign Order Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setTaskPickerOpen(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition active:scale-95 cursor-pointer"
        >
          <ClipboardList className="w-4 h-4" />
          <span>ASSIGN MISSION ORDER</span>
        </button>

        {/* Quick Contextual Specialty Orders */}
        {astronaut.role === "Engineer" && !hasTask && (
          <button
            onClick={() => {
              sounds.playClick();
              assignCrewTask(astronaut.id, {
                type: "repair_solar",
                title: "Overhaul Solar Arrays",
                description: "Calibrate tracking mounts to restore power condition to 100%.",
                targetBuildingId: "solar_array",
                targetPosition: [-9, 0, 5],
                duration: 7,
                rewardLabel: "+25% Solar Power Condition",
              });
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              Quick: Repair Solar Panels
            </span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        )}

        {astronaut.role === "Scientist" && !hasTask && (
          <button
            onClick={() => {
              sounds.playClick();
              assignCrewTask(astronaut.id, {
                type: "conduct_experiment",
                title: "Conduct NASA Lab Research",
                description: "Run fractional-gravity crystallization experiment in lab.",
                targetBuildingId: "science_lab",
                targetPosition: [0, 0, -7],
                duration: 8,
                rewardLabel: "+8 NASA Science Points",
              });
            }}
            className="w-full py-2 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              Quick: Run Lab Experiment
            </span>
            <ArrowRight className="w-3 h-3 text-purple-400" />
          </button>
        )}

        {astronaut.role === "Botanist" && !hasTask && (
          <button
            onClick={() => {
              sounds.playClick();
              assignCrewTask(astronaut.id, {
                type: "harvest_crops",
                title: "Harvest Greenhouse Food",
                description: "Harvest fresh microgreen salad trays and nutrient rations.",
                targetBuildingId: "greenhouse",
                targetPosition: [6, 0, -3],
                duration: 7,
                rewardLabel: "+15 Food Rations",
              });
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              Quick: Harvest Fresh Crops
            </span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </button>
        )}

        {/* Rest in Habitat Pod */}
        <button
          onClick={() => {
            sounds.playClick();
            restCrewMember(astronaut.id);
          }}
          disabled={astronaut.energy >= 95}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            astronaut.energy >= 95
              ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white"
          }`}
        >
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rest in Habitat Pod (+100% Energy)</span>
        </button>
      </div>

      {/* Movement Tip */}
      <div className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-2 font-mono">
        💡 Click anywhere on lunar terrain to move {astronaut.name} directly.
      </div>
    </div>
  );
}
