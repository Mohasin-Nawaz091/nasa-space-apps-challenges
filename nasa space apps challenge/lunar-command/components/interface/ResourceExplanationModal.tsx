"use client";

import React from "react";
import { useGameStore } from "../../store/gameStore";
import {
  Zap,
  Wind,
  Droplet,
  Utensils,
  Wrench,
  FlaskConical,
  X,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { sounds } from "../../utils/audio";

interface ResourceInfo {
  name: string;
  simpleName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  whatItDoes: string;
  howWeGetIt: string;
  howWeUseIt: string;
  dailyProduction: number;
  dailyConsumption: number;
  unit: string;
}

export function ResourceExplanationModal() {
  const resourceExplanationKey = useGameStore((s) => s.resourceExplanationKey);
  const setResourceExplanationKey = useGameStore((s) => s.setResourceExplanationKey);
  const resources = useGameStore((s) => s.resources);
  const buildings = useGameStore((s) => s.buildings);
  const astronauts = useGameStore((s) => s.astronauts);

  if (!resourceExplanationKey) return null;

  // Real-time rates
  const solarGen = Math.round(145 * (buildings.solar_array?.condition || 100) / 100);
  const powerUsed = Object.values(buildings).reduce(
    (acc, b) => acc + (b.isActive ? b.powerConsumption : 0),
    0
  );

  const o2Made = Math.round(15 * (buildings.life_support?.condition || 100) / 100);
  const o2Used = astronauts.length * 3;

  const waterRecycled = Math.round((astronauts.length * 4 + 8) * 0.9);
  const waterUsed = astronauts.length * 4 + (buildings.greenhouse?.isActive ? 8 : 0);

  const foodMade = buildings.greenhouse?.isActive ? 9 : 0;
  const foodEaten = astronauts.length * 3;

  const resourceData: Record<string, ResourceInfo> = {
    power: {
      name: "Electricity (Power)",
      simpleName: "Colony Power",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/60",
      borderColor: "border-amber-200 dark:border-amber-700/60",
      whatItDoes: "Electricity keeps lights, oxygen pumps, heaters, and lab computers running.",
      howWeGetIt: "Our tall solar panels catch sunlight streaming across the Moon's South Pole.",
      howWeUseIt: "Every active building draws electricity from our base batteries every day.",
      dailyProduction: solarGen,
      dailyConsumption: powerUsed,
      unit: "kWh",
    },
    oxygen: {
      name: "Breathable Oxygen",
      simpleName: "Air to Breathe",
      icon: <Wind className="w-8 h-8 text-cyan-500" />,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/60",
      borderColor: "border-cyan-200 dark:border-cyan-700/60",
      whatItDoes: "Astronauts need clean oxygen inside their spacesuits and base habitats to stay alive.",
      howWeGetIt: "The Life Support module (ECLSS) extracts and recycles oxygen continuously.",
      howWeUseIt: "Each astronaut breathes about 3 kg of oxygen every Sol.",
      dailyProduction: o2Made,
      dailyConsumption: o2Used,
      unit: "kg",
    },
    water: {
      name: "Purified Water",
      simpleName: "Fresh Water",
      icon: <Droplet className="w-8 h-8 text-blue-500" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/60",
      borderColor: "border-blue-200 dark:border-blue-700/60",
      whatItDoes: "Water is needed for astronaut drinking and watering greenhouse strawberry and wheat crops.",
      howWeGetIt: "Our closed-loop filtration system recycles 90% of moisture from showers and breath humidity.",
      howWeUseIt: "Astronauts drink water daily, and greenhouse aeroponic misters spray plant roots.",
      dailyProduction: waterRecycled,
      dailyConsumption: waterUsed,
      unit: "L",
    },
    food: {
      name: "Nutritious Food Packs",
      simpleName: "Fresh Crops & Rations",
      icon: <Utensils className="w-8 h-8 text-emerald-500" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/60",
      borderColor: "border-emerald-200 dark:border-emerald-700/60",
      whatItDoes: "Nutritious meals give our 3 astronauts energy and boost their immune health.",
      howWeGetIt: "Grown right here in the Greenhouse bio-dome using tailored pink LED grow lights.",
      howWeUseIt: "Each astronaut eats 3 healthy meal packs every single Sol.",
      dailyProduction: foodMade,
      dailyConsumption: foodEaten,
      unit: "packs",
    },
    materials: {
      name: "Spare Tech Parts",
      simpleName: "Repair Kits",
      icon: <Wrench className="w-8 h-8 text-indigo-500" />,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/60",
      borderColor: "border-indigo-200 dark:border-indigo-700/60",
      whatItDoes: "Spare tools, filters, and motors used to fix equipment worn out by sharp lunar dust.",
      howWeGetIt: "Brought from Earth on the Artemis Cargo Lander and stored in habitat cargo bays.",
      howWeUseIt: "Clicking 'Repair' on a building uses 4 spare parts to restore it to 100% health.",
      dailyProduction: 0,
      dailyConsumption: 0,
      unit: "parts",
    },
    science: {
      name: "NASA Science Research",
      simpleName: "Moon Discoveries",
      icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/60",
      borderColor: "border-purple-200 dark:border-purple-700/60",
      whatItDoes: "Scientific data sent to NASA to prove humans can thrive permanently on the Moon.",
      howWeGetIt: "The Science Lab studies lunar rock samples, core drills, and space weather.",
      howWeUseIt: "Collect 60 points by Sol 10 to certify your mission and earn the Gold Artemis Laurel!",
      dailyProduction: buildings.science_lab?.isActive ? 8 : 1,
      dailyConsumption: 0,
      unit: "points",
    },
  };

  const info = resourceData[resourceExplanationKey] || resourceData.power;
  const netDaily = info.dailyProduction - info.dailyConsumption;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className={`relative w-full max-w-md ${info.bgColor} border-2 ${info.borderColor} rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-100 overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
              {info.icon}
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400">
                RESOURCE GUIDE
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {info.simpleName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              setResourceExplanationKey(null);
            }}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* What it does */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 mb-3 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            Why It Matters:
          </p>
          <p>{info.whatItDoes}</p>
        </div>

        {/* Daily Production vs Use */}
        {resourceExplanationKey !== "materials" && resourceExplanationKey !== "science" && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80">
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Made Per Sol
              </span>
              <span className="text-lg font-black font-mono">
                +{info.dailyProduction} {info.unit}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {info.howWeGetIt}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[11px] mb-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> Used Per Sol
              </span>
              <span className="text-lg font-black font-mono">
                -{info.dailyConsumption} {info.unit}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {info.howWeUseIt}
              </p>
            </div>
          </div>
        )}

        {/* Net Status Tag */}
        <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Daily Balance:
          </span>
          <span
            className={`font-black font-mono text-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              netDaily >= 0
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300"
            }`}
          >
            {netDaily >= 0 ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {netDaily >= 0 ? `+${netDaily} ${info.unit} (Surplus 👍)` : `${netDaily} ${info.unit} (Deficit ⚠️)`}
          </span>
        </div>

        {/* Got it button */}
        <button
          onClick={() => {
            sounds.playClick();
            setResourceExplanationKey(null);
          }}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-sm uppercase tracking-wider transition active:scale-98 shadow-lg"
        >
          Got It, Commander!
        </button>
      </div>
    </div>
  );
}
