"use client";

import React, { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Circle,
  HelpCircle,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function NovaMissionGuide() {
  const [isMinimized, setIsMinimized] = useState(false);

  const gameStage = useGameStore((s) => s.gameStage);
  const setGameStage = useGameStore((s) => s.setGameStage);
  const stageProgress = useGameStore((s) => s.stageProgress);
  const missionStars = useGameStore((s) => s.missionStars);
  const awardStar = useGameStore((s) => s.awardStar);
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const resources = useGameStore((s) => s.resources);
  const activeEvent = useGameStore((s) => s.activeEvent);

  // Stage 2 Progress: Habitat, Solar Array, Life Support inspected?
  const stage2InspectedCount =
    (stageProgress.habitat ? 1 : 0) +
    (stageProgress.solar_array ? 1 : 0) +
    (stageProgress.life_support ? 1 : 0);

  // Stage 4 Progress: Greenhouse, Shelter, Science Lab inspected?
  const stage4InspectedCount =
    (stageProgress.greenhouse ? 1 : 0) +
    (stageProgress.shelter ? 1 : 0) +
    (stageProgress.science_lab ? 1 : 0);

  // Auto-advance Stage 2 -> Stage 3 once core 3 inspected
  const handleStage2Next = () => {
    sounds.playSuccess();
    awardStar();
    setGameStage(3);
    selectBuilding("solar_array");
  };

  // Auto-advance Stage 4 -> Stage 5
  const handleStage4Next = () => {
    sounds.playSuccess();
    awardStar();
    setGameStage(5);
  };

  if (isMinimized) {
    return (
      <aside className="absolute left-4 top-24 z-30 pointer-events-auto">
        <button
          onClick={() => {
            sounds.playClick();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-cyan-400 text-slate-900 dark:text-white shadow-xl font-black text-xs hover:scale-105 transition"
        >
          <span className="text-xl">👩‍🚀</span>
          <span>NOVA: MISSION GUIDE</span>
          <ChevronRight className="w-4 h-4 text-cyan-500" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="absolute left-4 top-24 w-80 md:w-88 z-30 pointer-events-auto flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-400/80 rounded-3xl shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-6 duration-300 select-none">
      {/* Friendly Guide Header */}
      <div className="p-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center text-xl shadow-md ring-2 ring-white/50">
            👩‍🚀
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black tracking-wide leading-none">NOVA</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 uppercase">
                Mission Assistant
              </span>
            </div>
            <p className="text-[10px] text-cyan-100 font-medium">
              Artemis Base Alpha Guide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mission Stars */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-yellow-300 font-black text-xs">
            <Star className="w-3.5 h-3.5 fill-yellow-300" />
            <span>{missionStars}</span>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg hover:bg-white/20 transition text-white"
            title="Minimize Assistant"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narrative Dialogue Body */}
      <div className="p-4 space-y-3.5 text-xs">
        {/* STAGE 1: Welcome to the Moon */}
        {gameStage === 1 && (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                STAGE 1 • WELCOME TO THE MOON
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Touchdown Confirmed, Commander!
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 leading-relaxed text-slate-700 dark:text-cyan-100">
              "Welcome to humanity's permanent outpost at the Lunar South Pole!
              Your mission is simple but crucial: <strong>keep our 3 astronauts safe, fed, and healthy</strong> for 10 simulated Sols."
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                Meet Your 3 Artemis Astronauts:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div className="text-lg">👩‍🚀</div>
                  <strong className="block text-slate-800 dark:text-slate-200">Sarah</strong>
                  <span className="text-slate-500 text-[9px]">Commander</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div className="text-lg">👨‍🚀</div>
                  <strong className="block text-slate-800 dark:text-slate-200">Hiroshi</strong>
                  <span className="text-slate-500 text-[9px]">Engineer</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div className="text-lg">👩‍🔬</div>
                  <strong className="block text-slate-800 dark:text-slate-200">Maya</strong>
                  <span className="text-slate-500 text-[9px]">Botanist</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                awardStar();
                setGameStage(2);
                selectBuilding("habitat");
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-98"
            >
              <span>START BASE TOUR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* STAGE 2: Learn Core Colony */}
        {gameStage === 2 && (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                STAGE 2 • LEARN YOUR COLONY ({stage2InspectedCount}/3)
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Inspect 3 Core Facilities
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Click on each building to discover what it does. Astronauts need shelter, power, and air to survive!
            </p>

            <div className="space-y-2">
              <button
                onClick={() => selectBuilding("habitat")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>🏠</span> Habitat (Living Quarters)
                </span>
                {stageProgress.habitat ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => selectBuilding("solar_array")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>⚡</span> Solar Array (Electricity)
                </span>
                {stageProgress.solar_array ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => selectBuilding("life_support")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>💨</span> Life Support (ECLSS Air)
                </span>
                {stageProgress.life_support ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            {stage2InspectedCount === 3 && (
              <button
                onClick={handleStage2Next}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition active:scale-98 animate-bounce"
              >
                <span>ALL 3 INSPECTED! CONTINUE →</span>
              </button>
            )}
          </>
        )}

        {/* STAGE 3: First Mission Challenge */}
        {gameStage === 3 && (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                STAGE 3 • FIRST MISSION CHALLENGE
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Powering Up the Base!
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 leading-relaxed text-slate-700 dark:text-amber-100">
              "Look at our <strong>Solar Array</strong>! At the Moon's South Pole, the sun skims the horizon.
              Our solar panels track the sun to generate <strong>+145 kWh</strong> of clean power. Make sure our batteries stay charged!"
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              ⚡ Current Battery: <strong>{resources.power} kWh</strong> (Target: &gt; 100 kWh)
            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                awardStar();
                setGameStage(4);
                selectBuilding("greenhouse");
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-98"
            >
              <span>POWER LOOKS GOOD! NEXT STAGE →</span>
            </button>
          </>
        )}

        {/* STAGE 4: Advanced Systems */}
        {gameStage === 4 && (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                STAGE 4 • ADVANCED MODULES ({stage4InspectedCount}/3)
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Food, Shelter & Science!
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Now meet our specialized facilities: Greenhouse for food, Storm Shelter for solar radiation, and Science Lab for NASA discoveries!
            </p>

            <div className="space-y-2">
              <button
                onClick={() => selectBuilding("greenhouse")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>🌿</span> Bio-Greenhouse (Food)
                </span>
                {stageProgress.greenhouse ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => selectBuilding("shelter")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>🛡️</span> Regolith Storm Shelter
                </span>
                {stageProgress.shelter ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => selectBuilding("science_lab")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span>🔬</span> Science Lab (Discoveries)
                </span>
                {stageProgress.science_lab ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            {stage4InspectedCount === 3 && (
              <button
                onClick={handleStage4Next}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition active:scale-98 animate-bounce"
              >
                <span>READY FOR FULL 10-SOL MISSION! 🚀</span>
              </button>
            )}
          </>
        )}

        {/* STAGE 5: Full 10-Sol Expedition */}
        {gameStage === 5 && (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPEDITION IN PROGRESS • SOL {currentDay} / {maxDays}</span>
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {currentDay === 1
                  ? "Base Systems Initialized!"
                  : currentDay === 3
                  ? "Solar Storm Warning!"
                  : `Sol ${currentDay} Objectives`}
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 leading-relaxed text-slate-700 dark:text-slate-200 text-xs">
              {currentDay === 1 &&
                "Great work Commander! Check your battery power and life support. When satisfied, click Advance Sol at the bottom."}
              {currentDay === 2 &&
                "We found water ice in Faustini Crater! Monitor our water recycling and keep the Science Lab powered."}
              {currentDay === 3 &&
                "A solar proton flare is incoming! Make sure the crew can shelter in the underground regolith bunker."}
              {currentDay >= 4 &&
                "Keep base resources balanced. Watch out for worn-out equipment and aim for 60 Science Points to certify the mission!"}
            </div>

            {/* Science Goal Progress Bar */}
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-purple-700 dark:text-purple-300">NASA Science Goal</span>
                <span className="font-mono text-purple-900 dark:text-purple-200">
                  {resources.researchPoints} / 60 PTS
                </span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-900/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 dark:bg-purple-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (resources.researchPoints / 60) * 100)}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
