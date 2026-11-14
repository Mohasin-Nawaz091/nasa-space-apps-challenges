"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { sounds } from "../../utils/audio";

interface BuildingFloatingBadgeProps {
  position: [number, number, number];
  heightOffset: number;
  emoji: string;
  name: string;
  isSelected: boolean;
  isObjective?: boolean;
  condition: number;
  onSelect: () => void;
}

export function BuildingFloatingBadge({
  position,
  heightOffset,
  emoji,
  name,
  isSelected,
  isObjective,
  condition,
  onSelect,
}: BuildingFloatingBadgeProps) {
  return (
    <Html
      position={[position[0], position[1] + heightOffset, position[2]]}
      center
      distanceFactor={22}
      zIndexRange={[10, 0]}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          sounds.playClick();
          onSelect();
        }}
        className={`cursor-pointer px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl border-2 transition-all select-none hover:scale-105 active:scale-95 whitespace-nowrap ${
          isSelected
            ? "bg-cyan-500 text-white border-white scale-110 ring-4 ring-cyan-400/50"
            : isObjective
            ? "bg-amber-400 text-slate-900 border-white ring-4 ring-amber-300/70 animate-bounce"
            : "bg-slate-900/90 text-white border-slate-700/90 hover:border-cyan-400"
        }`}
      >
        <span className="text-base">{emoji}</span>
        <span>{name}</span>

        {/* Condition Dot */}
        <span
          className={`w-2 h-2 rounded-full ${
            condition >= 85
              ? "bg-emerald-400"
              : condition >= 50
              ? "bg-amber-400"
              : "bg-red-400"
          }`}
          title={`Health: ${condition}%`}
        />

        {isObjective && (
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-red-500 text-white animate-pulse">
            GOAL
          </span>
        )}
      </div>
    </Html>
  );
}
