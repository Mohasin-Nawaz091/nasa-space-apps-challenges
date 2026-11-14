"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { LunarWorld } from "./LunarWorld";

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-10">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-xl font-bold tracking-widest text-cyan-400">CALIBRATING LUNAR TELEMETRY...</div>
      <div className="text-sm text-slate-400 mt-2">Loading South Pole Terrain & Artemis Modules</div>
    </div>
  );
}

export default function GameCanvas() {
  return (
    <div className="relative w-full h-full bg-slate-950 select-none overflow-hidden">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          shadows
          camera={{ position: [26, 22, 26], fov: 45, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={["#030712"]} />
          <LunarWorld />
        </Canvas>
      </Suspense>
    </div>
  );
}
