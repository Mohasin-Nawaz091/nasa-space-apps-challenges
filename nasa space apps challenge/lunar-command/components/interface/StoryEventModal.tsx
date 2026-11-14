"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  AlertTriangle,
  Radio,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Info,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export function StoryEventModal() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const resolveActiveEvent = useGameStore((s) => s.resolveActiveEvent);
  const dismissActiveEvent = useGameStore((s) => s.dismissActiveEvent);
  const awardStar = useGameStore((s) => s.awardStar);

  // Allow Escape or Enter if resolved
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "Enter") && activeEvent?.isResolved) {
        dismissActiveEvent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEvent, dismissActiveEvent]);

  if (!activeEvent) return null;

  // Accurate NASA Data tag styling
  const getNasaLabel = () => {
    if (activeEvent.day === 2) {
      return { tag: "Historical NASA Data (LCROSS 2009)", color: "bg-blue-100 text-blue-800 border-blue-300" };
    }
    if (activeEvent.day === 3 || activeEvent.day === 8) {
      return { tag: "Curated Scientific Reference (NASA DONKI)", color: "bg-purple-100 text-purple-800 border-purple-300" };
    }
    return { tag: "Educational Space Science Simulation", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  };

  const nasaInfo = getNasaLabel();

  // Child-friendly story event rewriting
  const storyNarratives: Record<
    number,
    { title: string; danger: string; affected: string }
  > = {
    1: {
      title: "Touchdown & Base Initialization!",
      danger: "Landing thrusters kicked up sharp regolith dust. Pumps and solar panels need calibrating before full power.",
      affected: "Affects: Life Support and Solar Array Batteries",
    },
    2: {
      title: "Deep Crater Ice Discovered!",
      danger: "A frozen crater has water ice. Extracting it gives fresh water, but the rover battery is limited.",
      affected: "Affects: Water Reserves & Rover Power",
    },
    3: {
      title: "Warning! Sticky Lunar Dust Storm!",
      danger: "Sunlight gave tiny razor-sharp dust grains a static charge, making them cling to our solar panels.",
      affected: "Affects: Solar Power Efficiency (-30%)",
    },
    4: {
      title: "Sudden Micro-Meteorite Impact Alert!",
      danger: "A pebble-sized space rock punctured a water recycling pipe outside the habitat airlock.",
      affected: "Affects: Colony Water Reserve",
    },
    5: {
      title: "Exotic Lunar Basalt Sample Found!",
      danger: "Scientists spotted unusual volcanic beads on the crater rim. Great for science, but needs lab power.",
      affected: "Affects: NASA Science Goal",
    },
    6: {
      title: "Extreme Sub-Zero Thermal Lunar Night!",
      danger: "Temperatures plummet to -170°C in shadow. Heating habitat quarters requires major electricity.",
      affected: "Affects: Battery Power & Crew Warmth",
    },
    7: {
      title: "Greenhouse Dwarf Wheat Harvest Ready!",
      danger: "Crops are ripe! Astronauts need fresh vitamins, but picking and reseeding takes time and water.",
      affected: "Affects: Colony Food Rations",
    },
    8: {
      title: "🚨 EMERGENCY: Massive Solar Proton Flare Approaching!",
      danger: "NASA telescopes detected a coronal mass ejection heading for the Moon. Unshielded astronauts face radiation illness!",
      affected: "Affects: Astronaut Health & Survival",
    },
    9: {
      title: "Core Drill Drill-Bit Overheating!",
      danger: "Drilling into deep permafrost caused friction heat. Stop drilling or expend coolant water.",
      affected: "Affects: Science vs Water Reserves",
    },
    10: {
      title: "Final Mission Certification Evaluation!",
      danger: "Houston Flight Control is evaluating your 10-Sol performance for official NASA Artemis Certification!",
      affected: "Affects: Final Mission Score & Laurels",
    },
  };

  const story = storyNarratives[activeEvent.day] || {
    title: activeEvent.title,
    danger: activeEvent.description,
    affected: "Affects: Base Systems",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-100">
        {/* Top Header with Accurate NASA Label */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {activeEvent.severity === "danger" ? "🚨" : activeEvent.severity === "warning" ? "⚠️" : "📢"}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SOL {activeEvent.day} MISSION EVENT
            </span>
          </div>

          {/* NASA Attribution Badge */}
          <span
            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${nasaInfo.color}`}
          >
            {nasaInfo.tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
          {story.title}
        </h2>

        {/* What is happening & Why it's dangerous */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mb-3 text-xs leading-relaxed text-slate-700 dark:text-amber-100">
          <p className="font-bold text-slate-900 dark:text-white mb-1">
            What is Happening:
          </p>
          <p>{story.danger}</p>
          <div className="mt-2 pt-2 border-t border-amber-200/80 dark:border-amber-800/80 text-[11px] font-bold text-amber-800 dark:text-amber-300">
            {story.affected}
          </div>
        </div>

        {/* NASA Science Fact Note */}
        <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 mb-4 text-[11px] text-cyan-900 dark:text-cyan-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>NASA Science: </strong>
            {activeEvent.scienceBackground}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            CHOOSE YOUR ORDER, COMMANDER:
          </span>

          {activeEvent.choices.map((choice) => {
            const isResolvedChoice = activeEvent.resolvedChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                disabled={activeEvent.isResolved}
                onClick={() => {
                  sounds.playSuccess();
                  awardStar();
                  resolveActiveEvent(choice.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isResolvedChoice
                    ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/40"
                    : activeEvent.isResolved
                    ? "opacity-50 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-default"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 hover:border-cyan-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white">
                    {choice.label}
                  </span>
                  {isResolvedChoice ? (
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> EXECUTED
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Select Order →</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-snug">
                  {choice.description}
                </p>

                {/* Resource Impact Badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {choice.powerCost !== undefined && choice.powerCost !== 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold">
                      {choice.powerCost > 0 ? `-${choice.powerCost}` : `+${Math.abs(choice.powerCost)}`} kWh Power
                    </span>
                  )}
                  {choice.waterCost !== undefined && choice.waterCost !== 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-bold">
                      {choice.waterCost > 0 ? `-${choice.waterCost}` : `+${Math.abs(choice.waterCost)}`} L Water
                    </span>
                  )}
                  {choice.materialsCost !== undefined && choice.materialsCost !== 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold">
                      {choice.materialsCost > 0 ? `-${choice.materialsCost}` : `+${Math.abs(choice.materialsCost)}`} Parts
                    </span>
                  )}
                  {choice.scienceBonus !== undefined && (
                    <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 font-bold">
                      +{choice.scienceBonus} Science Pts
                    </span>
                  )}
                  {choice.shelterCrew && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      🛡️ Crew Safely in Shelter
                    </span>
                  )}
                </div>

                {isResolvedChoice && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200">
                    <strong>Outcome:</strong> {choice.educationalExplanation}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        {activeEvent.isResolved && (
          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                dismissActiveEvent();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition active:scale-98 cursor-pointer"
            >
              <span>RETURN TO LUNAR BASE VIEW</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
