"use client";

import React, { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  BookOpen,
  CheckSquare,
  Square,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Radio,
  FileText,
  Lightbulb,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function MissionJournalPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<"quests" | "intel">("quests");

  const gameStage = useGameStore((s) => s.gameStage);
  const setGameStage = useGameStore((s) => s.setGameStage);
  const stageProgress = useGameStore((s) => s.stageProgress);
  const currentDay = useGameStore((s) => s.currentDay);
  const maxDays = useGameStore((s) => s.maxDays);
  const resources = useGameStore((s) => s.resources);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const awardStar = useGameStore((s) => s.awardStar);

  // Core objectives checklist
  const objectives = [
    {
      id: "touchdown",
      title: "Touchdown at Shackleton Crater",
      completed: true,
      phase: "Phase 1: Arrival",
    },
    {
      id: "core_facilities",
      title: "Inspect Habitat & Life Support Systems",
      completed: Boolean(stageProgress.habitat && stageProgress.life_support),
      phase: "Phase 1: Life-Loop",
    },
    {
      id: "solar_power",
      title: "Calibrate Solar Tracking Masts",
      completed: Boolean(stageProgress.solar_array),
      phase: "Phase 2: Energy",
    },
    {
      id: "food_reserve",
      title: "Harvest Hydroponic Food Rations (15+)",
      completed: resources.food >= 100,
      phase: "Phase 3: Food",
    },
    {
      id: "nasa_research",
      title: `Accumulate NASA Research Points (${resources.researchPoints}/${resources.targetResearchPoints})`,
      completed: resources.researchPoints >= resources.targetResearchPoints,
      phase: "Phase 4: Science",
    },
    {
      id: "ten_sols",
      title: `Survive 10 Lunar Sols (Sol ${currentDay}/${maxDays})`,
      completed: currentDay >= 10,
      phase: "Phase 5: Expedition",
    },
  ];

  if (isMinimized) {
    return (
      <aside className="fixed left-4 top-20 z-30 pointer-events-auto select-none">
        <button
          onClick={() => {
            sounds.playClick();
            setIsMinimized(false);
          }}
          className="comic-btn flex items-center gap-2 px-3 py-2 rounded-xl bg-[#DCE5F2] text-[#101820]"
          title="Open Mission Journal"
        >
          <BookOpen className="w-4 h-4 text-[#101820]" />
          <span className="font-black text-xs tracking-wider">DIARY: QUESTS</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed left-4 top-20 z-30 pointer-events-auto w-80 md:w-88 flex flex-col select-none animate-in fade-in slide-in-from-left duration-200">
      {/* Outer Comic Card Container */}
      <div className="comic-card bg-[#DCE5F2] border-3 border-[#101820] rounded-2xl shadow-[4px_4px_0px_#101820] overflow-hidden flex flex-col">
        {/* Top Comic Hazard Stripe Accent Bar */}
        <div className="h-2.5 w-full comic-hazard-stripe border-b-2 border-[#101820]" />

        {/* Header Tabs (Inspired by Stacks:Space Diary header) */}
        <div className="p-2.5 bg-[#DCE5F2] border-b-2 border-[#101820] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("quests");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition ${
                activeTab === "quests"
                  ? "bg-[#101820] text-[#E7E0CB] border-[#101820]"
                  : "bg-white/80 hover:bg-white text-[#101820] border-[#101820]"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>DIARY: QUESTS</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("intel");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition ${
                activeTab === "intel"
                  ? "bg-[#101820] text-[#E7E0CB] border-[#101820]"
                  : "bg-white/80 hover:bg-white text-[#101820] border-[#101820]"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>INTEL</span>
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsMinimized(true);
            }}
            className="p-1 rounded-lg hover:bg-white/60 text-[#101820] transition cursor-pointer"
            title="Minimize Journal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {activeTab === "quests" ? (
          <div className="p-3.5 space-y-3 max-h-[65vh] overflow-y-auto">
            {/* Active Highlighted Order Box */}
            <div className="bg-[#E7E0CB] p-3 rounded-xl border-2 border-[#101820] shadow-[2px_2px_0px_#101820] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#101820] text-[#E7E0CB] font-mono">
                  ACTIVE DIRECTIVE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#101820]/80">
                  SOL {currentDay} OF {maxDays}
                </span>
              </div>

              <h3 className="text-xs font-black text-[#101820] uppercase leading-tight pt-0.5">
                {gameStage === 1 && "Welcome to Artemis Base Alpha"}
                {gameStage === 2 && "Inspect Core Habitat & Life Support Facilities"}
                {gameStage === 3 && "Maintain Solar Power Balance against Shadow"}
                {gameStage === 4 && "Commission Greenhouse & Radiation Storm Shelter"}
                {gameStage === 5 && "Full 10-Sol Survival Mission Deployment"}
              </h3>

              {/* Comic Speech Bubble from Nova */}
              <div className="relative mt-2 p-2 rounded-lg bg-white/95 border border-[#101820] text-[11px] text-[#101820] leading-snug font-sans shadow-sm">
                <span className="font-black text-[#101820] block font-mono text-[9px] uppercase tracking-wider mb-0.5">
                  COMMUNICATION // NOVA:
                </span>
                {gameStage === 1 &&
                  "Commander! Touchdown at Shackleton Crater is confirmed. Click any building or crew member to inspect base telemetry."}
                {gameStage === 2 &&
                  "Check your Habitat and Life Support modules. Ensure oxygen scrubbers and solar tracking inverters run without leaks."}
                {gameStage === 3 &&
                  "Solar generation is fluctuating. Send Alex to overhaul solar panel mounts, or switch to Eco-mode if batteries dip."}
                {gameStage === 4 &&
                  "Food rations must be sustained! Assign Leo to harvest fresh greenhouse crops and check shelter blast doors."}
                {gameStage === 5 &&
                  "All systems nominal! Complete daily NASA research orders and protect your astronauts until Sol 10 extraction."}
              </div>
            </div>

            {/* Main Quests Section (Stacks:Space Card Checklist) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#101820] font-mono">
                  MAIN QUESTS CHECKLIST
                </span>
                <span className="text-[10px] font-mono font-bold text-[#101820]/70">
                  {objectives.filter((o) => o.completed).length} / {objectives.length} DONE
                </span>
              </div>

              <div className="bg-white/85 rounded-xl border-2 border-[#101820] p-2 space-y-1 shadow-[2px_2px_0px_#101820]">
                {objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={`flex items-start gap-2 p-1.5 rounded-lg transition text-xs ${
                      obj.completed
                        ? "bg-[#E7E0CB]/50 text-[#101820]/60 line-through"
                        : "text-[#101820] hover:bg-[#DCE5F2]/60"
                    }`}
                  >
                    {obj.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#79966B] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#101820] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold leading-tight">{obj.title}</div>
                      <span className="text-[9px] font-mono text-[#101820]/60 block">
                        {obj.phase}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Space Weather Notice */}
            {activeEvent && !activeEvent.isResolved && (
              <div className="p-2.5 rounded-xl bg-[#F4ECE1] border-2 border-[#101820] shadow-[2px_2px_0px_#101820] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#B9544B] uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-[#B9544B]" />
                  <span>ALERT: {activeEvent.title}</span>
                </div>
                <p className="text-[11px] text-[#101820] leading-snug">
                  {activeEvent.shortStory || activeEvent.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Intel Tab */
          <div className="p-3.5 space-y-2.5 max-h-[65vh] overflow-y-auto text-xs text-[#101820]">
            <div className="bg-white/90 p-2.5 rounded-xl border-2 border-[#101820] space-y-1 shadow-[2px_2px_0px_#101820]">
              <span className="font-black text-[10px] uppercase font-mono block text-[#101820]">
                LUNAR SOUTH POLE ENVIRONMENT
              </span>
              <p className="text-[11px] text-[#101820]/80 leading-relaxed">
                Shackleton Crater features peaks of eternal sunlight where solar arrays operate, and permanently shadowed craters containing billions of tons of water ice.
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border-2 border-[#101820] space-y-1 shadow-[2px_2px_0px_#101820]">
              <span className="font-black text-[10px] uppercase font-mono block text-[#101820]">
                ASTRONAUT MANAGEMENT TIP
              </span>
              <p className="text-[11px] text-[#101820]/80 leading-relaxed">
                Select Alex to repair damaged solar arrays (+25%), Mia to run NASA lab experiments (+8 Science), and Leo to harvest crops (+15 food).
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
