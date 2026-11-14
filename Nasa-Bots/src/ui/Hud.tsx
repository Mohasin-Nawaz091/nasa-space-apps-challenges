/**
 * LUNAR COMMAND — ARTEMIS BASE ALPHA
 * src/ui/Hud.tsx
 * Professional NASA-inspired Mission Control HUD layer assembling MissionBar, ResourceDashboard, LeftNavPanel, ContextPanel, AstronautRoster, and NotificationTray.
 */

import React from 'react';
import { MissionBar } from './MissionBar.tsx';
import { ResourceDashboard } from './ResourceDashboard.tsx';
import { LeftNavPanel } from './LeftNavPanel.tsx';
import { ContextPanel } from './ContextPanel.tsx';
import { AstronautRoster } from './AstronautRoster.tsx';
import { NotificationTray } from './NotificationTray.tsx';
import { InteractionPrompt } from './InteractionPrompt.tsx';
import { useGameStore } from '../store/store.ts';

export const Hud: React.FC = () => {
  const hudVisible = useGameStore((s) => s.hudVisible);
  const toggleHudVisible = useGameStore((s) => s.toggleHudVisible);
  const cameraMode = useGameStore((s) => s.cameraMode);

  if (!hudVisible) {
    return (
      <div className="absolute top-3 right-4 z-50 pointer-events-auto font-mono">
        <button
          onClick={toggleHudVisible}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 border border-sky-400 text-sky-400 text-xs font-bold shadow-2xl backdrop-blur-md hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
          title="Restore Full Mission HUD (Hotkey: H)"
        >
          <span>👁️</span>
          <span>SHOW HUD [H]</span>
        </button>
      </div>
    );
  }

  // In first-person astronaut eye view, keep the viewport clear and atmospheric
  if (cameraMode === 'eye') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between overflow-hidden z-10">
        <MissionBar />
        <InteractionPrompt />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between overflow-hidden z-10 animate-fadeIn">
      {/* Top Mission Control Cluster */}
      <div className="w-full flex flex-col">
        <MissionBar />
        <ResourceDashboard />
      </div>

      {/* Left Navigation Icon Rail & Drawers */}
      <LeftNavPanel />

      {/* Right Contextual Inspection Panel */}
      <ContextPanel />

      {/* Notification and Space Weather Banner */}
      <NotificationTray />

      {/* Physical Proximity Interaction Prompt [E] */}
      <InteractionPrompt />

      {/* Unified Bottom Astronaut Expedition Dock */}
      <AstronautRoster />
    </div>
  );
};
