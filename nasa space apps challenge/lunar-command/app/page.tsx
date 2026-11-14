"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGameStore } from "../store/gameStore";
import { KidTopNavBar } from "../components/interface/KidTopNavBar";
import { NovaMissionGuide } from "../components/interface/NovaMissionGuide";
import { KidBuildingPanel } from "../components/interface/KidBuildingPanel";
import { KidBottomBar } from "../components/interface/KidBottomBar";
import { StoryEventModal } from "../components/interface/StoryEventModal";
import { ResourceExplanationModal } from "../components/interface/ResourceExplanationModal";
import { CrewStatusDrawer } from "../components/interface/CrewStatusDrawer";
import { MissionLogDrawer } from "../components/interface/MissionLogDrawer";
import { GlossaryModal } from "../components/interface/GlossaryModal";
import { MissionReportModal } from "../components/interface/MissionReportModal";
import { InteriorExitOverlay } from "../components/interface/InteriorExitOverlay";
import { HowToPlayModal } from "../components/interface/HowToPlayModal";
import { CrewSelectorWidget } from "../components/interface/CrewSelectorWidget";
import { CrewCommandPanel } from "../components/interface/CrewCommandPanel";
import { TaskAssignmentModal } from "../components/interface/TaskAssignmentModal";
import { MainMenuModal } from "../components/menus/MainMenuModal";
import { MissionBriefingModal } from "../components/menus/MissionBriefingModal";
import { InteractiveTutorial } from "../components/menus/InteractiveTutorial";
import { sounds } from "../utils/audio";

// Dynamically import the 3D WebGL Canvas with SSR disabled
const GameCanvas = dynamic(() => import("../components/game/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-xl font-bold tracking-widest text-cyan-300">
        PREPARING ARTEMIS BASE ALPHA...
      </div>
      <div className="text-sm text-slate-400 mt-2">
        Rendering Shackleton Crater 3D Lunar Environment
      </div>
    </div>
  ),
});

export default function LunarCommandGamePage() {
  const [isCrewDrawerOpen, setIsCrewDrawerOpen] = useState(false);
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const isMainMenuOpen = useGameStore((s) => s.isMainMenuOpen);
  const isBriefingOpen = useGameStore((s) => s.isBriefingOpen);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const isMissionCompleted = useGameStore((s) => s.isMissionCompleted);
  const isMissionFailed = useGameStore((s) => s.isMissionFailed);

  // Sync sound manager with store
  useEffect(() => {
    sounds.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Expose store for test automation
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__GAME_STORE__ = useGameStore;
    }
  }, []);

  // Play alarm sound if dangerous event pops up
  useEffect(() => {
    if (activeEvent && !activeEvent.isResolved && activeEvent.severity === "danger") {
      sounds.playAlarm();
    }
  }, [activeEvent]);

  // Play victory / defeat sounds
  useEffect(() => {
    if (isMissionCompleted) {
      sounds.playSuccess();
    } else if (isMissionFailed) {
      sounds.playAlarm();
    }
  }, [isMissionCompleted, isMissionFailed]);

  const isGameUIVisible = !isMainMenuOpen && !isBriefingOpen;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D Lunar Colony Canvas */}
      <main className="w-full h-full">
        <GameCanvas />
      </main>

      {/* Screen 1: Main Menu */}
      <MainMenuModal
        onOpenHowToPlay={() => {
          sounds.playClick();
          setIsHowToPlayOpen(true);
        }}
      />

      {/* Screen 2: Mission Briefing */}
      <MissionBriefingModal />

      {/* Screen 3: Interactive Flight Tutorial */}
      <InteractiveTutorial />

      {/* Primary Child-Friendly 4-Panel Gameplay Interface */}
      {isGameUIVisible && cameraMode !== "interior" && (
        <>
          {/* Top Bar: Friendly Simplified Resource Meters & Crew Health */}
          <KidTopNavBar
            onOpenHowToPlay={() => {
              sounds.playClick();
              setIsHowToPlayOpen(true);
            }}
            onOpenCrewDrawer={() => {
              sounds.playClick();
              setIsCrewDrawerOpen(true);
            }}
          />

          {/* Left Panel: Nova the Mission Guide (Story & Objectives) */}
          <NovaMissionGuide />

          {/* Right Panel: Contextual Building Details & Simple Mode Buttons */}
          <KidBuildingPanel />

          {/* Persistent On-Screen Crew Quick Selector */}
          <CrewSelectorWidget />

          {/* Interactive Astronaut Command Panel (When Selected) */}
          <CrewCommandPanel />

          {/* Bottom Bar: Radio Chatter, Crew Summary, Big Advance Sol Button */}
          <KidBottomBar
            onOpenCrewDrawer={() => {
              sounds.playClick();
              setIsCrewDrawerOpen(true);
            }}
            onOpenLogsDrawer={() => {
              sounds.playClick();
              setIsLogsDrawerOpen(true);
            }}
          />
        </>
      )}

      {/* Interactive Astronaut Task Assignment Modal */}
      <TaskAssignmentModal />

      {/* Interior Mode Overlay (Greenhouse / Shelter) */}
      {isGameUIVisible && cameraMode === "interior" && <InteriorExitOverlay />}

      {/* Story-Driven Daily Incident Modal */}
      {isGameUIVisible && <StoryEventModal />}

      {/* Single-Click Resource Explanation Popup */}
      <ResourceExplanationModal />

      {/* Astronaut Crew Drawer */}
      <CrewStatusDrawer
        isOpen={isCrewDrawerOpen}
        onClose={() => setIsCrewDrawerOpen(false)}
      />

      {/* Mission Telemetry Logs Drawer */}
      <MissionLogDrawer
        isOpen={isLogsDrawerOpen}
        onClose={() => setIsLogsDrawerOpen(false)}
      />

      {/* Junior Astronaut Science Glossary */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* How to Play & Controls Manual Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Final 10-Day Evaluation Report Modal */}
      <MissionReportModal />
    </div>
  );
}
