"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Compass,
  MousePointer,
  Activity,
  Sliders,
  BatteryCharging,
  AlertTriangle,
  FastForward,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface TutorialStepData {
  step: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  tip: string;
  hotkey: string;
}

const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    step: 1,
    title: "CAMERA & NAVIGATION",
    subtitle: "Surveying Shackleton Base Alpha",
    icon: <Compass className="w-8 h-8 text-cyan-400" />,
    content:
      "Control your viewpoint over the lunar surface. Drag with LEFT MOUSE to orbit around the colony, SCROLL WHEEL to zoom in/out, and RIGHT MOUSE DRAG or WASD / Arrow keys to pan across the outpost. You can also press Q and E to rotate the camera horizon.",
    tip: "Use WASD to pan quickly across solar arrays and mining zones.",
    hotkey: "Mouse Drag / WASD / Q & E",
  },
  {
    step: 2,
    title: "SELECTING BUILDINGS",
    subtitle: "Inspecting Outpost Infrastructure",
    icon: <MousePointer className="w-8 h-8 text-emerald-400" />,
    content:
      "Click directly on any building with LEFT CLICK, or press number keys 1 through 6 on your keyboard. The camera will smoothly focus on the facility and open the Building Details Panel on the right.",
    tip: "Keys: 1=Habitat, 2=Life Support, 3=Greenhouse, 4=Solar Array, 5=Shelter, 6=Science Lab.",
    hotkey: "Left Click or Keys [1-6]",
  },
  {
    step: 3,
    title: "BUILDING INTEGRITY & MAINTENANCE",
    subtitle: "Combating Abrasive Lunar Dust",
    icon: <Activity className="w-8 h-8 text-amber-400" />,
    content:
      "Lunar regolith dust is razor-sharp! Over time, buildings degrade in condition. If a module falls below 50%, its efficiency drops drastically. Use spare tech parts to overhaul and repair modules before critical failures occur.",
    tip: "Maintain your Life Support and Solar Arrays above 80% integrity at all times.",
    hotkey: "Repair Button (-4 Parts)",
  },
  {
    step: 4,
    title: "OPERATIONAL TRADE-OFFS",
    subtitle: "Every Choice Has Consequences",
    icon: <Sliders className="w-8 h-8 text-purple-400" />,
    content:
      "Select a building to change its operational mode. Ramping up greenhouse crop production yields more food rations, but consumes more precious water and kilowatt-hours! Balance your colony's energy budget carefully.",
    tip: "During night cycles or dust storms, switch non-critical modules to Eco mode.",
    hotkey: "Right Inspection Panel",
  },
  {
    step: 5,
    title: "RESOURCE MANAGEMENT",
    subtitle: "Closed-Loop Life Support",
    icon: <BatteryCharging className="w-8 h-8 text-blue-400" />,
    content:
      "Keep an eye on the Top HUD meters: Power (kWh), Oxygen (kg), Water (L), and Food rations. Life Support recycles exhaled CO2 and greywater, while the Solar Array harnesses polar sunlight. If reserves drop to zero, crew health falls rapidly!",
    tip: "A green vitals badge means your crew is healthy and well-nourished.",
    hotkey: "Top Status Bar",
  },
  {
    step: 6,
    title: "NASA DONKI SPACE WEATHER",
    subtitle: "Responding to Real Solar Storms",
    icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
    content:
      "Each morning, Mission Control reports telemetry backed by NASA science. When coronal mass ejections or solar radiation storms strike, engage the Regolith Storm Shelter lockdown immediately to shield your 3 astronauts!",
    tip: "Two meters of sintered regolith stops lethal solar cosmic rays.",
    hotkey: "Daily Incident Modal",
  },
  {
    step: 7,
    title: "ADVANCING THE MISSION",
    subtitle: "The 10-Sol Survival Goal",
    icon: <FastForward className="w-8 h-8 text-teal-400" />,
    content:
      "Once you have made your daily adjustments and resolved the morning event, click 'ADVANCE SOL' or press [Space]. The simulation will advance to the next day, recalculate resources, and evaluate crew survival. Reach Sol 10 to certify Artemis Base Alpha!",
    tip: "Double-check your power surplus before ending the day.",
    hotkey: "Advance Sol Button",
  },
];

export function InteractiveTutorial() {
  const isTutorialActive = useGameStore((s) => s.isTutorialActive);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);
  const setTutorialActive = useGameStore((s) => s.setTutorialActive);

  // Allow Escape to dismiss tutorial
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTutorialActive) return;
      if (e.key === "Escape") {
        setTutorialActive(false);
      } else if (e.key === "ArrowRight") {
        if (tutorialStep < TUTORIAL_STEPS.length) {
          sounds.playClick();
          setTutorialStep(tutorialStep + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (tutorialStep > 1) {
          sounds.playClick();
          setTutorialStep(tutorialStep - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTutorialActive, tutorialStep, setTutorialActive, setTutorialStep]);

  if (!isTutorialActive) return null;

  const current = TUTORIAL_STEPS[tutorialStep - 1] || TUTORIAL_STEPS[0];
  const isLast = tutorialStep === TUTORIAL_STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/50 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-5 overflow-hidden">
        {/* Glow ambient background aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              FLIGHT TRAINING — STEP {current.step} OF {TUTORIAL_STEPS.length}
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setTutorialActive(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Skip Tutorial [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Visual & Icon */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-inner">
            {current.icon}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-wide text-white">
              {current.title}
            </h2>
            <p className="text-xs font-medium text-cyan-300">{current.subtitle}</p>
          </div>
        </div>

        {/* Core Lesson Narrative */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed">
          {current.content}
        </div>

        {/* Pro Tip Box & Shortcut */}
        <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-cyan-200 text-[11px] leading-snug">
            <strong className="text-amber-300">Commander Tip: </strong>
            {current.tip}
          </div>
          <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shrink-0 self-start sm:self-center">
            {current.hotkey}
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex justify-center gap-1.5 pt-1">
          {TUTORIAL_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                sounds.playClick();
                setTutorialStep(s.step);
              }}
              className={`h-2 rounded-full transition-all ${
                tutorialStep === s.step
                  ? "w-7 bg-cyan-400"
                  : "w-2 bg-slate-700 hover:bg-slate-600"
              }`}
              title={`Go to Step ${s.step}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            disabled={tutorialStep === 1}
            onClick={() => {
              sounds.playClick();
              setTutorialStep(tutorialStep - 1);
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-bold text-xs uppercase flex items-center gap-1.5 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setTutorialActive(false);
            }}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-medium transition"
          >
            Skip Tutorial
          </button>

          {isLast ? (
            <button
              onClick={() => {
                sounds.playSuccess();
                setTutorialActive(false);
              }}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>START PLAYING</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                setTutorialStep(tutorialStep + 1);
              }}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-cyan-950/60 transition active:scale-95"
            >
              <span>NEXT STEP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
