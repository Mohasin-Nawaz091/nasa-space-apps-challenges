/**
 * LUNAR FRONTIER: THE LAST 30 DAYS
 * src/ui/TutorialOverlay.tsx
 * Friendly, interactive step-by-step onboarding walkthrough designed for junior astronauts (ages 7–12).
 */

import React from 'react';
import { useGameStore } from '../store/store.ts';

interface StepData {
  title: string;
  badge: string;
  description: string;
  tip: string;
  highlightPosition: string; // for UI focus
}

const TUTORIAL_STEPS: StepData[] = [
  {
    title: 'Welcome to Lunar Command, Commander!',
    badge: 'Step 1 of 7',
    description:
      'Congratulations on taking command of Artemis Base Alpha near the Moon’s South Pole. You and three courageous astronaut specialists must survive for 10 Sols while maintaining life support, electricity, water, and scientific research!',
    tip: 'Click Next to begin your flight orientation training.',
    highlightPosition: 'center',
  },
  {
    title: 'Monitoring Critical Base Telemetry',
    badge: 'Step 2 of 7',
    description:
      'At the top of your screen, compact indicators track Electricity, Oxygen, Water, Food, Crew Health, Radiation, Spare Parts, and Research Points. Hover your mouse over any indicator to inspect live engineering rates!',
    tip: 'Keep your oxygen and power reserves above 20% to prevent cascading life support failure.',
    highlightPosition: 'top',
  },
  {
    title: 'Operating 3D Base Modules & Click-to-Move',
    badge: 'Step 3 of 7',
    description:
      'The 3D environment shows your Artemis colony buildings. Click anywhere on the lunar surface to order the active astronaut to walk there with a holographic waypoint, or click a building to inspect its condition!',
    tip: 'Drag your mouse to orbit around the colony and mousewheel to zoom.',
    highlightPosition: 'center',
  },
  {
    title: 'Your Expedition Specialist Team',
    badge: 'Step 4 of 7',
    description:
      'At the bottom dock, your three specialists (ALEX - Systems Engineer, MIA - Research Scientist, and LEO - Botanist & Geologist) are ready for duty. Each astronaut has 8 daily stamina hours and specialized efficiency perks!',
    tip: 'Alex repairs systems faster, Mia yields +25% research data, and Leo boosts crop harvests by +25%.',
    highlightPosition: 'bottom',
  },
  {
    title: 'First-Person Helmet Eye View [V]',
    badge: 'Step 5 of 7',
    description:
      'Click the HELMET POV [V] button on the top bar or press V on your keyboard at any time to see the Moon through the astronaut’s own helmet visor! Walk with WASD and click-and-drag to look around.',
    tip: 'In Helmet POV, approach any module to see an interactive [E] Operate prompt inside your reticle!',
    highlightPosition: 'center',
  },
  {
    title: 'Space Weather & Radiation Protection',
    badge: 'Step 6 of 7',
    description:
      'Solar proton storms can strike the airless lunar South Pole! When a space-weather advisory triggers (such as during Sol 8), move all three astronauts into the underground Radiation Shelter (RAD-01) before the storm hits.',
    tip: 'The Radiation Shelter regolith berm blocks acute cosmic radiation and keeps crew safe.',
    highlightPosition: 'top',
  },
  {
    title: 'The 5-Stage Sol Loop & Advancing Time',
    badge: 'Step 7 of 7',
    description:
      'Each Sol follows 5 structured stages: Morning Briefing ➔ Colony Management ➔ Task Execution ➔ Advance Sol ➔ Daily Report. When ready, click ADVANCE SOL on the top bar to finish the day!',
    tip: 'Achieve at least 60 research points and keep all 3 astronauts alive to earn Gold Commander certification!',
    highlightPosition: 'top',
  },
];

export const TutorialOverlay: React.FC = () => {
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);

  if (tutorialStep < 0 || tutorialStep >= TUTORIAL_STEPS.length) return null;

  const current = TUTORIAL_STEPS[tutorialStep];
  const isFirst = tutorialStep === 0;
  const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto select-none bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#080E19] border-2 border-[#36C5F0] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#F4F7FC]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#293A50] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#36C5F0] block">
                {current.badge}
              </span>
              <h3 className="text-base font-black text-white">{current.title}</h3>
            </div>
          </div>
          <button
            onClick={() => setTutorialStep(-1)}
            className="text-xs text-[#A7B4C8] hover:text-white font-bold cursor-pointer"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Body */}
        <p className="text-xs text-[#A7B4C8] leading-relaxed mb-3">
          {current.description}
        </p>

        <div className="p-3 rounded-xl bg-[#111C2D] border border-[#293A50] mb-5">
          <span className="text-[#36C5F0] font-bold text-xs block mb-0.5">Commander Tip:</span>
          <span className="text-[11px] text-white">{current.tip}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          {!isFirst ? (
            <button
              onClick={() => setTutorialStep(tutorialStep - 1)}
              className="px-4 py-2 rounded-xl bg-[#17263A] hover:bg-[#293A50] text-xs font-bold text-[#A7B4C8] hover:text-white transition-colors cursor-pointer"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              if (isLast) {
                setTutorialStep(-1);
              } else {
                setTutorialStep(tutorialStep + 1);
              }
            }}
            className="px-5 py-2 rounded-xl bg-[#36C5F0] hover:bg-[#36C5F0]/80 text-[#080E19] text-xs font-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            {isLast ? 'Complete Training ➔' : 'Next Step ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};

