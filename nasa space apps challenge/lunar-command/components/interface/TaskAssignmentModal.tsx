"use client";

import React, { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import { X, Wrench, FlaskConical, Sprout, Home, Zap, Clock, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { sounds } from "../../utils/audio";
import { TaskType } from "../../types/astronaut";

interface TaskOption {
  type: TaskType;
  title: string;
  description: string;
  targetBuildingId: string;
  targetPosition: [number, number, number];
  duration: number;
  energyCost: number;
  rewardLabel: string;
  nasaFact: string;
  role: "Engineer" | "Scientist" | "Botanist" | "All";
}

const ALL_TASKS: TaskOption[] = [
  // Alex — Engineer Tasks
  {
    type: "repair_solar",
    title: "Overhaul Photovoltaic Solar Arrays",
    description: "Inspect tracking motors, wipe abrasive lunar dust from panels, and realign mounts.",
    targetBuildingId: "solar_array",
    targetPosition: [-9, 0, 5],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+25% Solar Array Condition (Maximum kWh)",
    nasaFact: "Sharp lunar regolith dust clings electrostatically to solar arrays, drastically cutting power generation.",
    role: "Engineer",
  },
  {
    type: "repair_life_support",
    title: "Service ECLSS Life-Support Air Scrubbers",
    description: "Replace lithium hydroxide canisters and check oxygen pressure regulators.",
    targetBuildingId: "life_support",
    targetPosition: [-5, 0, -4],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+25% Life-Support Condition (+O2 Flow)",
    nasaFact: "NASA ECLSS systems recycle over 90% of astronaut exhalations and humidity into breathable air.",
    role: "Engineer",
  },
  {
    type: "inspect_habitat",
    title: "Reinforce Habitat Airlock Pressure Seals",
    description: "Test dual-chamber airlock seals against the vacuum of space and micro-meteoroid impacts.",
    targetBuildingId: "habitat",
    targetPosition: [0, 0, 3],
    duration: 6,
    energyCost: 15,
    rewardLabel: "+20% Habitat Condition & +5 Science",
    nasaFact: "Lunar habitats must withstand a full 14.7 psi atmospheric pressure difference against the vacuum outside.",
    role: "Engineer",
  },

  // Mia — Scientist Tasks
  {
    type: "conduct_experiment",
    title: "Conduct NASA Microgravity Lab Experiment",
    description: "Run advanced crystallographic and biological growth experiments inside the Science Lab.",
    targetBuildingId: "science_lab",
    targetPosition: [0, 0, -7],
    duration: 8,
    energyCost: 15,
    rewardLabel: "+8 NASA Science Points",
    nasaFact: "Lunar research produces breakthroughs in materials science, pharmacology, and planetary geology.",
    role: "Scientist",
  },
  {
    type: "collect_soil",
    title: "Extract Regolith Core Samples from Crater",
    description: "Trek to the rim of Shackleton Crater and core-drill through sintered volcanic regolith.",
    targetBuildingId: "crater_rim",
    targetPosition: [-16, 0, 10],
    duration: 8,
    energyCost: 15,
    rewardLabel: "+6 Science Points & +4 Spare Parts",
    nasaFact: "South pole lunar regolith holds trapped volatile gases, water molecules, and valuable metals.",
    role: "Scientist",
  },
  {
    type: "analyze_sample",
    title: "Analyze Spectrometer Ice & Mineral Data",
    description: "Feed extracted samples into the mass spectrometer to detect sub-surface water ice concentrations.",
    targetBuildingId: "science_lab",
    targetPosition: [1, 0, -8],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+10 NASA Science Points",
    nasaFact: "NASA LCROSS proved that water ice is trapped in permanently shadowed craters at the lunar poles.",
    role: "Scientist",
  },

  // Leo — Botanist Tasks
  {
    type: "harvest_crops",
    title: "Harvest Hydroponic Salad Packs",
    description: "Harvest mature dwarf tomatoes, radishes, and leafy greens from the aeroponic growing beds.",
    targetBuildingId: "greenhouse",
    targetPosition: [6, 0, -3],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+15 Fresh Food Rations",
    nasaFact: "Fresh produce provides potassium, vitamin C, and vital morale boosters during long deep-space stays.",
    role: "Botanist",
  },
  {
    type: "maintain_crops",
    title: "Calibrate Nutrient Pumps & LED Spectrum",
    description: "Flush water circulation lines, adjust nitrogen-potassium levels, and optimize LED wavelengths.",
    targetBuildingId: "greenhouse",
    targetPosition: [6, 0, -1],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+25% Greenhouse Facility Integrity",
    nasaFact: "Aeroponic plants grow suspended in air while roots are misted with nutrient solution, saving 95% water.",
    role: "Botanist",
  },
  {
    type: "plant_seeds",
    title: "Sow Fast-Cycle Dwarf Wheat Germination",
    description: "Plant fresh seed pods in germination racks for ongoing closed-loop food replenishment.",
    targetBuildingId: "greenhouse",
    targetPosition: [5, 0, -4],
    duration: 7,
    energyCost: 15,
    rewardLabel: "+10 Food Packs & +3 Science Points",
    nasaFact: "NASA scientists engineer dwarf wheat to produce higher edible grain biomass in compact space racks.",
    role: "Botanist",
  },

  // Universal Rest Task
  {
    type: "rest_in_habitat",
    title: "Rest Cycle in Habitat Sleep Pod",
    description: "Return to the pressurized living module to sleep, hydrate, and fully recover stamina.",
    targetBuildingId: "habitat",
    targetPosition: [-1.5, 0, 1.5],
    duration: 5,
    energyCost: 0,
    rewardLabel: "Restores Stamina to 100% (+10 Health)",
    nasaFact: "Astronauts sleep in vertical soundproof sleep pods with eye masks and airflow fans to prevent CO2 pooling.",
    role: "All",
  },
];

export function TaskAssignmentModal() {
  const isTaskPickerOpen = useGameStore((s) => s.isTaskPickerOpen);
  const setTaskPickerOpen = useGameStore((s) => s.setTaskPickerOpen);
  const selectedAstronautId = useGameStore((s) => s.selectedAstronautId);
  const astronauts = useGameStore((s) => s.astronauts);
  const assignCrewTask = useGameStore((s) => s.assignCrewTask);

  const astronaut = astronauts.find((a) => a.id === selectedAstronautId);

  // Close on Escape
  useEffect(() => {
    if (!isTaskPickerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sounds.playClick();
        setTaskPickerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isTaskPickerOpen, setTaskPickerOpen]);

  if (!isTaskPickerOpen || !astronaut) return null;

  const availableTasks = ALL_TASKS.filter(
    (t) => t.role === astronaut.role || t.role === "All"
  );

  return (
    <div
      onClick={() => {
        sounds.playClick();
        setTaskPickerOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/70 rounded-3xl p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
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
                <h2 className="text-lg md:text-xl font-black text-white">
                  Mission Order Dispatch
                </h2>
                <span
                  className="text-xs font-black px-2 py-0.5 rounded text-white font-mono uppercase tracking-wider"
                  style={{ backgroundColor: astronaut.accentColor }}
                >
                  {astronaut.name} • {astronaut.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Select a specialized engineering, science, or agricultural duty
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setTaskPickerOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/70 text-red-200 hover:text-white font-black text-xs transition active:scale-95 cursor-pointer"
            title="Close [Esc]"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
          {availableTasks.map((task) => {
            const hasEnoughEnergy =
              task.energyCost === 0 || astronaut.energy >= task.energyCost;

            return (
              <div
                key={task.type}
                className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 transition-all duration-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-black text-sm md:text-base text-cyan-200 flex items-center gap-2">
                      {task.role === "Engineer" && (
                        <Wrench className="w-4 h-4 text-amber-400" />
                      )}
                      {task.role === "Scientist" && (
                        <FlaskConical className="w-4 h-4 text-purple-400" />
                      )}
                      {task.role === "Botanist" && (
                        <Sprout className="w-4 h-4 text-emerald-400" />
                      )}
                      {task.role === "All" && (
                        <Home className="w-4 h-4 text-cyan-400" />
                      )}
                      <span>{task.title}</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Dispatch Order Button */}
                  <button
                    onClick={() => {
                      sounds.playClick();
                      assignCrewTask(astronaut.id, {
                        type: task.type,
                        title: task.title,
                        description: task.description,
                        targetBuildingId: task.targetBuildingId,
                        targetPosition: task.targetPosition,
                        duration: task.duration,
                        rewardLabel: task.rewardLabel,
                      });
                    }}
                    disabled={!hasEnoughEnergy}
                    className={`shrink-0 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-lg ${
                      hasEnoughEnergy
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/50"
                        : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    }`}
                  >
                    <span>{hasEnoughEnergy ? "ORDER MISSION" : "EXHAUSTED"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Specs: Duration, Cost, Outcome */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Duration: {task.duration}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Cost: {task.energyCost > 0 ? `-${task.energyCost}% Stamina` : "Free"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold truncate">
                    <Award className="w-3.5 h-3.5" />
                    <span className="truncate">{task.rewardLabel}</span>
                  </div>
                </div>

                {/* NASA Science Fact Note */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300/90 leading-snug flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider block font-mono">
                      NASA Science Reference:
                    </span>
                    {task.nasaFact}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
