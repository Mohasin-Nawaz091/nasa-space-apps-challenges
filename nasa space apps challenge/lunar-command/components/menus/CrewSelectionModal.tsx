"use client";

import React, { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { X, Wrench, FlaskConical, Sprout, Heart, Zap, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { sounds } from "../../utils/audio";

interface HeroData {
  id: string;
  name: string;
  role: string;
  archetype: string;
  avatar: string;
  accentColor: string;
  bgTint: string;
  stats: {
    strength: number;
    agility: number;
    endurance: number;
    specialtyIQ: number;
  };
  strengths: string[];
  description: string;
}

const HEROES: HeroData[] = [
  {
    id: "alex",
    name: "ALEX",
    role: "ENGINEER",
    archetype: "RESOURCEFUL BASE MECHANIC",
    avatar: "👨‍🔧",
    accentColor: "#C78C55",
    bgTint: "#F4ECE1",
    stats: {
      strength: 8,
      agility: 6,
      endurance: 8,
      specialtyIQ: 9,
    },
    strengths: [
      "Overhauls Solar Arrays (+25% power)",
      "Repairs ECLSS O2 air scrubbers",
      "Reinforces pressurized airlock seals",
    ],
    description:
      "A pragmatic space mechanic who treats the colony's generators and solar masts like trusted tools. Never backs down from a blown inverter.",
  },
  {
    id: "mia",
    name: "MIA",
    role: "SCIENTIST",
    archetype: "PLANETARY GEOLOGY SPECIALIST",
    avatar: "👩‍🔬",
    accentColor: "#7189A6",
    bgTint: "#EBF1F7",
    stats: {
      strength: 5,
      agility: 7,
      endurance: 7,
      specialtyIQ: 10,
    },
    strengths: [
      "Conducts NASA Lab research (+8 Science)",
      "Cores Shackleton crater regolith ice",
      "Calibrates Deep Space telemetry (+10)",
    ],
    description:
      "An inquisitive lunar geologist who looks at grey Moon dust and sees billions of years of cosmic history and hidden water reserves.",
  },
  {
    id: "leo",
    name: "LEO",
    role: "BOTANIST",
    archetype: "CLOSED-LOOP AGRO-ECOLOGIST",
    avatar: "🧑‍🌾",
    accentColor: "#79966B",
    bgTint: "#EDF3EA",
    stats: {
      strength: 6,
      agility: 8,
      endurance: 9,
      specialtyIQ: 9,
    },
    strengths: [
      "Harvests Hydroponic Salad (+15 food)",
      "Tunes aeroponic nutrient mist pumps",
      "Sows dwarf wheat seed racks (+10 food)",
    ],
    description:
      "A patient hydroponic botanist dedicated to feeding the crew fresh greens and balancing the biological oxygen-carbon loop.",
  },
];

export function CrewSelectionModal() {
  const isCrewSelectionOpen = useGameStore((s) => s.isCrewSelectionOpen);
  const setCrewSelectionOpen = useGameStore((s) => s.setCrewSelectionOpen);
  const selectAstronaut = useGameStore((s) => s.selectAstronaut);
  const setBriefingOpen = useGameStore((s) => s.setBriefingOpen);

  const [chosenCommanderId, setChosenCommanderId] = useState<string>("alex");

  if (!isCrewSelectionOpen) return null;

  const handleConfirm = () => {
    sounds.playSuccess();
    selectAstronaut(chosenCommanderId);
    setCrewSelectionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#101820]/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      {/* Outer Comic Card Modal Frame */}
      <div className="w-full max-w-4xl bg-[#DCE5F2] border-3 border-[#101820] rounded-2xl shadow-[6px_6px_0px_#101820] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Comic Hazard Stripe Header Accent */}
        <div className="h-4 w-full comic-hazard-stripe border-b-2 border-[#101820]" />

        {/* Modal Title Banner */}
        <div className="px-6 py-4 bg-[#DCE5F2] flex items-center justify-between border-b-2 border-[#101820]">
          <div>
            <div className="inline-block px-3 py-0.5 bg-[#101820] text-white text-[10px] font-black tracking-widest uppercase rounded">
              COLONY EXPEDITION PROTOCOL
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101820] uppercase mt-1">
              CHOOSE YOUR CREW
            </h1>
            <p className="text-xs font-mono font-bold text-[#182536]/80 mt-0.5">
              Select your initial expedition commander • All 3 specialists will deploy to Artemis Base Alpha
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setCrewSelectionOpen(false);
            }}
            className="comic-btn p-2 rounded-xl bg-[#E7E0CB] hover:bg-white text-[#101820]"
            title="Close [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Collectible Character Cards Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[68vh] bg-[#DCE5F2]">
          {HEROES.map((hero) => {
            const isSelected = chosenCommanderId === hero.id;

            return (
              <div
                key={hero.id}
                onClick={() => {
                  sounds.playClick();
                  setChosenCommanderId(hero.id);
                }}
                className={`group relative rounded-xl border-3 transition-all duration-150 p-4 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#E7E0CB] border-[#101820] shadow-[5px_5px_0px_#101820] scale-[1.02]"
                    : "bg-white/85 hover:bg-white border-[#101820] shadow-[2.5px_2.5px_0px_#101820] opacity-90 hover:opacity-100"
                }`}
              >
                {/* Active Selection Pin Stamp */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-10 px-2 py-0.5 bg-[#101820] text-white rounded-md border-2 border-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#E7E0CB]" />
                    <span>LEAD</span>
                  </div>
                )}

                {/* Card Header: Role & Name */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#101820]/40">
                    <span
                      className="px-2.5 py-0.5 rounded border border-[#101820] text-white text-[10px] font-black tracking-wider uppercase"
                      style={{ backgroundColor: hero.accentColor }}
                    >
                      {hero.role}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#101820]/70">
                      ID: #{hero.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Hero Portrait Box */}
                  <div className="my-3 flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-2xl border-2 border-[#101820] flex items-center justify-center text-4xl shadow-[2px_2px_0px_#101820]"
                      style={{ backgroundColor: hero.bgTint }}
                    >
                      {hero.avatar}
                    </div>
                    <h2 className="text-xl font-black text-[#101820] tracking-wide mt-2">
                      {hero.name}
                    </h2>
                    <p className="text-[10px] font-mono font-black text-[#101820]/75 uppercase tracking-wider text-center">
                      {hero.archetype}
                    </p>
                  </div>

                  {/* Personality Description */}
                  <p className="text-[11px] text-[#101820]/80 leading-snug p-2 rounded-lg bg-black/5 border border-[#101820]/20 mb-3">
                    "{hero.description}"
                  </p>

                  {/* RPG Stat Grid (Stacks:Space Card Style) */}
                  <div className="bg-white/80 p-2 rounded-lg border border-[#101820] space-y-1 text-[11px] font-mono mb-3">
                    <div className="flex justify-between items-center text-[#101820]">
                      <span className="font-bold">STRENGTH:</span>
                      <span className="font-black">{hero.stats.strength} / 10</span>
                    </div>
                    <div className="flex justify-between items-center text-[#101820]">
                      <span className="font-bold">AGILITY:</span>
                      <span className="font-black">{hero.stats.agility} / 10</span>
                    </div>
                    <div className="flex justify-between items-center text-[#101820]">
                      <span className="font-bold">ENDURANCE:</span>
                      <span className="font-black">{hero.stats.endurance} / 10</span>
                    </div>
                    <div className="flex justify-between items-center text-[#101820]">
                      <span className="font-bold">SPECIALTY IQ:</span>
                      <span className="font-black">{hero.stats.specialtyIQ} / 10</span>
                    </div>
                  </div>

                  {/* Primary Strengths / Actions */}
                  <div className="space-y-1 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#101820]/70 block font-mono">
                      SPECIALTY PERKS:
                    </span>
                    {hero.strengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] text-[#101820] font-bold flex items-start gap-1.5 leading-tight"
                      >
                        <span className="text-[#C78C55] font-black">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setChosenCommanderId(hero.id);
                  }}
                  className={`comic-btn w-full py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 mt-2 transition ${
                    isSelected
                      ? "bg-[#101820] text-[#E7E0CB]"
                      : "bg-[#DCE5F2] text-[#101820] hover:bg-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E7E0CB]" />
                      <span>SELECTED COMMANDER</span>
                    </>
                  ) : (
                    <span>CHOOSE {hero.name}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#DCE5F2] border-t-2 border-[#101820] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#101820]/80">
            Selected Commander: <strong className="font-black text-[#101820] uppercase">{chosenCommanderId}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setCrewSelectionOpen(false);
                setBriefingOpen(true);
              }}
              className="comic-btn px-4 py-2.5 rounded-xl bg-white hover:bg-[#E7E0CB] text-[#101820] text-xs font-black"
            >
              MISSION BRIEFING
            </button>

            <button
              onClick={handleConfirm}
              className="comic-btn flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#C78C55] hover:bg-[#d69963] text-white text-xs font-black tracking-wide flex items-center justify-center gap-2"
            >
              <span>DEPLOY OUTPOST EXPEDITION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Hazard Stripe Accent */}
        <div className="h-3 w-full comic-hazard-stripe border-t-2 border-[#101820]" />
      </div>
    </div>
  );
}
