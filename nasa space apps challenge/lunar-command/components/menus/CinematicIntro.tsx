"use client";

import React, { useState } from "react";
import { Rocket, ChevronRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";

interface CinematicIntroProps {
  onStartGame: () => void;
}

export function CinematicIntro({ onStartGame }: CinematicIntroProps) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "TOUCHDOWN AT SHACKLETON CRATER",
      subtitle: "The Artemis Program reaches the Lunar South Pole",
      icon: <Rocket className="w-10 h-10 text-cyan-400" />,
      content:
        "Welcome to the high frontier, Commander! You are leading humanity's permanent outpost at the rim of Shackleton Crater. Here, peaks of eternal light offer solar power, while dark freezing crater floors trap billions of tons of water ice.",
      badge: "MISSION OBJECTIVE: SURVIVE 10 SOLS",
    },
    {
      title: "MEET YOUR CREW & FACILITIES",
      subtitle: "Three astronauts, six interconnected base systems",
      icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
      content:
        "Commander Sarah Walker navigates operations, Dr. Hiroshi Tanaka manages power and life support, and Dr. Maya Patel tends the bio-regenerative greenhouse. Every action has an engineering trade-off: more food costs more water and power!",
      badge: "CLOSED-LOOP LIFE SUPPORT",
    },
    {
      title: "REAL SPACE WEATHER HAZARDS",
      subtitle: "Telemetry backed by NASA Open Science & DONKI",
      icon: <Zap className="w-10 h-10 text-amber-400" />,
      content:
        "The Moon has no atmosphere or global magnetic field. Watch for solar flares and coronal mass ejections from NASA space weather data, and protect your crew inside the 2-meter regolith storm shelter when alarms sound!",
      badge: "REAL-WORLD SPACE SCIENCE",
    },
  ];

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl shadow-2xl p-6 md:p-8 text-white text-center overflow-hidden">
        {/* Glow ambient background aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800">
            {current.badge}
          </span>
          <button
            onClick={onStartGame}
            className="text-xs text-slate-400 hover:text-white transition font-medium underline underline-offset-4"
          >
            Skip Briefing →
          </button>
        </div>

        {/* Center Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 shadow-inner">
          {current.icon}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl md:text-2xl font-black tracking-wide text-white mb-2">
          {current.title}
        </h2>
        <p className="text-xs md:text-sm text-cyan-300 font-medium mb-4">
          {current.subtitle}
        </p>

        {/* Story Text */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
          {current.content}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${
                slide === i ? "w-8 bg-cyan-400" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {slide < slides.length - 1 ? (
            <button
              onClick={() => setSlide(slide + 1)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition active:scale-98"
            >
              <span>NEXT BRIEFING</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartGame}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>COMMAND LUNAR BASE ALPHA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
