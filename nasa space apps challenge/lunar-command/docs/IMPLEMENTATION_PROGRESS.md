# Lunar Command — Implementation Progress

Update this file after every phase. Do not mark a phase complete until its acceptance criteria have been verified.

| Phase | Name | Status | Verification / Notes |
|---|---|---|---|
| 0 | Repository inspection and foundation | Completed | Next.js 16.4.6, React 19, TypeScript, Tailwind CSS, Three.js, R3F, Drei, Zustand, GSAP, Motion, Postprocessing, Howler, Zod verified. Build succeeds. |
| 1 | Game design and simulation specification | Completed | Game design docs, mathematical simulation rules, data definitions, and 10-day mission configs created. |
| 2 | 3D lunar world foundation | Completed | Full-screen R3F canvas, procedural crater terrain, starfield, rotating Earth, sun shadows, landing pad, and OrbitControls. |
| 3 | Building models and colony layout | Completed | All 6 functional buildings implemented with stable IDs, conditions, and custom 3D geometries. |
| 4 | Hybrid camera and interaction | Completed | Colony, Inspection, and Interior modes implemented with smooth raycasting, camera lerp, and hotkeys. |
| 5 | HUD and building panels | Completed | Real-time resource meters, Sol counter, operational trade-off controls, repair mechanics, and drawers. |
| 6 | Simulation engine | Completed | Deterministic calculations for daily power, oxygen, water, food, crew health, and radiation dose; 6/6 tests passing. |
| 7 | Astronauts and behavior | Completed | 3 astronauts with distinct roles, animated walking patrols, PLSS backpacks, and emergency shelter response. |
| 8 | Events and cinematic effects | Completed | Coronal mass ejection, dust storms, equipment leaks, and emergency lighting/strobes verified. |
| 9 | NASA data integration | Completed | Server routes for DONKI CME and RadLab/OSDR datasets with Zod validation and transparent labeling. |
| 10 | Educational experience | Completed | Junior Astronaut Science Glossary and age 7–12 plain-language decision debriefs implemented. |
| 11 | Mission progression and scoring | Completed | 10-day mission, victory/abort conditions, scoring algorithm, Houston debrief, and seeded replays. |
| 12 | Audio, animation, and visual polish | Completed | Web Audio API procedural synthesizer, cinematic landing briefing with skip option, and UI transitions. |
| 13 | Performance optimization | Completed | Instanced boulders/rocks, precomputed terrain normals, frame-loop local animations, and dynamic canvas loading. |
| 14 | Complete QA and testing | Completed | `npx tsc --noEmit` passed (0 errors), `npm test` passed (6/6 tests), `npm run build` compiled cleanly. |
| 15 | Deployment and final submission | Completed | Production build verified, Vercel instructions prepared, and all documentation authored. |

---

## Phase Reports

### Phase 0 — Repository inspection and foundation
- **Status:** Completed
- **Features implemented:**
  - Complete repository inspection and verification of environment.
  - Aligned dependencies in `lunar-command/package.json` with master plan specification (Three.js, R3F, Drei, Zustand, GSAP, Motion, Howler, Zod, Lucide React, Postprocessing).
  - Verified TypeScript configuration and module path aliases (`@/*`).
  - Tested production build (`npm run build`) with Turbopack, successfully passing compilation and static route generation.
  - Created initial documentation structure including `docs/IMPLEMENTATION_PROGRESS.md`.
- **Files created:**
  - `docs/IMPLEMENTATION_PROGRESS.md`
- **Files modified:**
  - `package.json`
- **Tests performed:**
  - Node module resolution check across all dependencies.
  - Production build execution: `npm run build` completed successfully with zero errors.

### Phase 1 — Game design and simulation specification
- **Status:** Completed
- **Features implemented:**
  - Authored comprehensive `docs/GAME_DESIGN.md` establishing target demographic (ages 7–12), core game loop, building roles, supporting objects, and educational philosophy.
  - Authored mathematical `docs/SIMULATION_RULES.md` specifying deterministic equations for power balance, oxygen recycling, water loop, food growth, crew health, and radiation dose accumulation.
  - Defined strict TypeScript contracts in `types/building.ts`, `types/astronaut.ts`, `types/events.ts`, and `types/game.ts`.
  - Created initial configurations in `constants/buildings.ts`, `constants/simulation.ts`, and educational content in `data/glossary.ts`.
  - Authored the complete 10-day mission event sequence with branching tactical choices in `data/missions.ts`.
- **Files created:**
  - `docs/GAME_DESIGN.md`
  - `docs/SIMULATION_RULES.md`
  - `types/building.ts`
  - `types/astronaut.ts`
  - `types/events.ts`
  - `types/game.ts`
  - `constants/buildings.ts`
  - `constants/simulation.ts`
  - `data/missions.ts`
  - `data/glossary.ts`
- **Tests performed:**
  - Ran `npx tsc --noEmit` — passed with 0 errors.

### Phase 2 — 3D lunar world foundation
- **Status:** Completed
- **Features implemented:**
  - Dynamic full-screen 3D WebGL Canvas (`components/game/GameCanvas.tsx`) with client-side loading fallback.
  - Procedural lunar terrain (`components/environment/LunarTerrain.tsx`) with mathematical crater displacement, mountain ridges, and sintered circular landing pad with hazard lighting.
  - Starfield and rotating Earth globe (`components/environment/LunarSky.tsx`) with atmosphere rim and realistic axial tilt.
  - Low-angle harsh directional sunlight casting long shadows across craters.
  - Instanced rocks and boulders using `@react-three/drei` Instances.
  - Base colony infrastructure (`components/environment/ColonyInfrastructure.tsx`): Artemis Cargo Lander, Pressurized Lunar Rover (SEV), Earth communications dish, and glowing power conduits.

### Phase 3 — Building models and colony layout
- **Status:** Completed
- **Features implemented:**
  - All six functional buildings implemented with custom 3D geometries and dynamic visual states:
    1. `HabitatModule.tsx` (Living quarters, cupola, and airlock).
    2. `LifeSupportFacility.tsx` (ECLSS cryogenic tanks, animated scrubber fan, and pipes).
    3. `GreenhouseFacility.tsx` (Geodesic bio-dome, aeroponic crop trays, and dynamic grow lights).
    4. `SolarArrayFacility.tsx` (Sun-tracking photovoltaic masts and inverters).
    5. `RadiationShelter.tsx` (2-meter compacted regolith mound with reinforced blast door).
    6. `ScienceLaboratory.tsx` (Spectrometer sensor, clean airlock, and core drill sample bay).
  - Floating holographic selection reticle (`BuildingHighlight.tsx`).

### Phase 4 — Hybrid camera and interaction
- **Status:** Completed
- **Features implemented:**
  - Hybrid camera system in `components/game/CameraController.tsx`:
    - Mode A: Colony View (full orbital navigation, polar angle clamped above horizon).
    - Mode B: Inspection View (smooth camera lerp focusing on clicked building).
    - Mode C: Interior View (interactive close-up inside Greenhouse and Shelter).
  - Two dedicated interior 3D environments:
    - `components/buildings/interiors/GreenhouseInterior.tsx` (vertical growth towers, leaf misting, botanist terminal).
    - `components/buildings/interiors/ShelterInterior.tsx` (emergency bunks, dosimeter monitors, blast doors).
  - Keyboard hotkeys: `Escape` (deselect / exit interior), `F` (enter/exit interior), `Space` (pause/resume).

### Phase 5 — HUD and building panels
- **Status:** Completed
- **Features implemented:**
  - `TopNavBar.tsx`: Real-time meters for Power (kWh), Oxygen (kg), Water (L), Food (rations), Spare Parts, Sol counter, and audio toggle.
  - `BuildingDetailsPanel.tsx`: Contextual building panel with condition bar, power draw, interactive engineering trade-offs, repair button, and NASA science notes.
  - `CrewStatusDrawer.tsx`: Crew roster with astronaut vitals, radiation exposure, and emergency shelter toggle.
  - `MissionLogDrawer.tsx`: Chronological mission telemetry log.
  - `InteriorExitOverlay.tsx`: Floating header when exploring interiors.

### Phase 6 — Simulation engine
- **Status:** Completed
- **Features implemented:**
  - Deterministic daily simulation sequence in `store/gameStore.ts`.
  - Mathematical equations for solar generation, power consumption, oxygen recycling, water loop, food harvest, crew health degradation, and radiation dose accumulation.
  - Automated test suite in `engine/runTests.mjs` verifying 6/6 test cases.

### Phase 7 — Astronauts and behavior
- **Status:** Completed
- **Features implemented:**
  - 3 animated astronauts (`AstronautCrew.tsx`): Commander Sarah Walker, Dr. Hiroshi Tanaka, Dr. Maya Patel.
  - Procedural humanoid meshes with PLSS backpacks, oxygen cylinders, and gold-reflective bubble visors.
  - Waypoint patrol navigation between base facilities with animated walking limb swings.
  - Dynamic shelter evacuation: astronauts relocate to the storm bunker during solar emergencies.

### Phase 8 — Events and cinematic effects
- **Status:** Completed
- **Features implemented:**
  - `EventModal.tsx`: Daily event modal with severity badges (info/warning/danger/critical), narrative context, and educational consequence debriefs.
  - Scripted 10-day scenarios: Solar Coronal Mass Ejections, lunar dust electrostatic clinging, water ice prospecting, regolith microwave sintering, and water loop leaks.
  - Visual reactions: Flashing red radiation strobes on shelter, greenhouse UV grow lights dimming in eco-mode, dusty solar panel shading, and emergency alarms.

### Phase 9 — NASA data integration
- **Status:** Completed
- **Features implemented:**
  - Next.js API route `/api/nasa/donki`: Server-side proxy for NASA DONKI CME space weather with Zod schema validation and reliable curated fallback data.
  - Next.js API route `/api/nasa/science-data`: Curated references from NASA RadLab (ISS dosimetry vs lunar surface distinction), OSDR space agriculture, and LRO polar ice discoveries.
  - `services/nasaService.ts`: Typed client service layer.
  - Scientific labeling system in UI distinguishing Live NASA Data, Historical Records, Curated References, and Simulation Parameters.

### Phase 10 — Educational experience
- **Status:** Completed
- **Features implemented:**
  - `GlossaryModal.tsx`: Junior Astronaut Science Glossary explaining 8 essential aerospace terms (*Regolith*, *CME*, *ECLSS*, *ISRU*, *Radiation*, *PSR*, *Photovoltaic*, *Hydroponics*) in age 7–12 language with real NASA facts.
  - Plain-language engineering trade-off explanations following every commander decision.

### Phase 11 — Mission progression and scoring
- **Status:** Completed
- **Features implemented:**
  - Full 10-day survival campaign.
  - Deterministic scoring equation evaluating survival days, crew health, research points, and resource conservation.
  - `MissionReportModal.tsx`: Houston certification debrief showing final score, Artemis rank laurels (Master Commander, Senior Engineer, Junior Astronaut), and lessons learned.
  - Replay system supporting randomized or custom mission seeds.

### Phase 12 — Audio, animation, and visual polish
- **Status:** Completed
- **Features implemented:**
  - `CinematicIntro.tsx`: Three-slide illustrated mission briefing explaining the landing at Shackleton Crater with a "Skip" option.
  - `utils/audio.ts`: Web Audio API procedural synthesizer generating futuristic UI chimes, alarm klaxons, airlock whooshes, and victory fanfares without external audio dependencies.
  - Tailwind CSS dark-mode theme, smooth transitions, and glowing indicator accents.

### Phase 13 — Performance optimization
- **Status:** Completed
- **Features implemented:**
  - Instanced rendering for 90+ boulders across the lunar landscape.
  - Single-calculation procedural geometry with precomputed normals for terrain.
  - Animation loops localized to Three.js frame callbacks to avoid unnecessary React re-renders.
  - Dynamic client loading for the WebGL canvas preventing server-side rendering overhead.

### Phase 14 — Complete QA and testing
- **Status:** Completed
- **Features implemented:**
  - TypeScript validation: `npx tsc --noEmit` passed with 0 errors.
  - Simulation engine unit tests: `npm test` passed 6/6 tests.
  - Production build: `npm run build` compiled successfully in 2.4s generating all static and dynamic API routes.

### Phase 15 — Deployment and final submission
- **Status:** Completed
- **Features implemented:**
  - Authored comprehensive `README.md` with features, controls, installation instructions, test commands, Vercel deployment guide, and a 3-minute judge demonstration walkthrough.
  - Authored `docs/ARCHITECTURE.md`, `docs/NASA_DATA_SOURCES.md`, and `docs/ASSET_ATTRIBUTION.md`.
  - Updated `docs/IMPLEMENTATION_PROGRESS.md` with complete phase records.

### Asset Pack Integration — 3D Asset Pack (Balanced Edition)
- **Status:** Completed
- **Features implemented:**
  - Integrated all 14 GLB models and 3 PNG textures from `public/assets/` into their respective game components.
  - Implemented reusable `components/game/AssetModel.tsx` loader using `useGLTF` with scene cloning, shadow enablement, and central Z-up to Y-up orientation normalization (`rotation: [-Math.PI / 2, 0, 0]`).
  - Replaced primitive building placeholders with `habitat_module.glb`, `life_support_station.glb`, `greenhouse_dome.glb`, `power_station_solar.glb`, `radiation_shelter.glb`, and `research_lab.glb`.
  - Integrated `lunar_rover.glb`, `communication_antenna.glb`, `oxygen_tank_rack.glb`, and `solar_array.glb` into colony infrastructure.
  - Integrated `lunar_terrain_tile.glb`, `landing_pad.glb`, `rock_cluster_pack.glb`, and `lunar_regolith.png` texture map into terrain.
  - Integrated `astronaut_stylized.glb` for all 3 crew members with role markers, waypoint patrols, bobbing movement, and shelter response.
  - Maintained dedicated high-detail Mode C interactive interior environments for the Greenhouse and Shelter.
  - Verified local HTTP server responses (GLBs 200, textures 200, API 200) and ran tests (`npm test` 6/6 passed, `npx tsc --noEmit` 0 errors, `npm run build` compiled cleanly).

---

## Blockers and Decisions

- **Architectural Decision:** Maintained root-level directories (`app/`, `components/`, `engine/`, `store/`, etc.) with `@/*` path mapping matching the Next.js setup.
- **Audio Architecture:** Built a procedural Web Audio API synthesizer (`utils/audio.ts`) providing zero-bandwidth, instant-start sound effects (clicks, alarms, airlocks, fanfares) that work reliably offline and in all modern browsers.
- **NASA Data Integrity:** Added explicit educational badges and documentation strictly separating ISS Low Earth Orbit radiation from true unshielded lunar surface radiation.


---

### Critical Gameplay and Controls Overhaul (Phases 1–8)
- **Status:** Completed
- **Root Cause Analysis:**
  1. *Per-frame camera lerp loop:* `CameraController.tsx` was running `camera.position.lerp()` indefinitely every frame, constantly dragging the camera back and overpowering `OrbitControls` mouse drag / wheel zoom / pan.
  2. *Raycasting & pointer miss:* Raycasts on raw GLB primitives lacked an interactive bounding hit box; furthermore, `<group onPointerMissed={() => selectBuilding(null)}>` in `LunarWorld.tsx` triggered on every OrbitControls drag release, accidentally clearing building selection.
  3. *Unclosable Event Modal:* In earlier builds, `EventModal.tsx` did not feature a dismiss action after tactical choices were executed, permanently trapping the user behind a full-screen backdrop.
  4. *Visual Obstruction:* `RadiationShelter.tsx` had a procedural black dome with radius 4.4 that engulfed the camera inspection viewport.
- **Features Implemented & Fixed:**
  - **Phase 1 & 2 (Controls & Camera):**
    - Transition-based camera movement in `CameraController.tsx`: smooth interpolation executes only during active target switches (~0.45s) and immediately hands full control over to `OrbitControls`.
    - Added active WASD / Arrow key keyboard pan and Q / E horizontal orbital rotation.
    - Set explicit mouse bindings: Left Click Drag = Rotate, Scroll Wheel = Zoom, Right Click Drag = Pan.
    - Added hotkeys: [1-6] for instant facility selection, [F] for entering/exiting interior, [Esc] for deselect / return to colony view, [Space] for pause/resume.
    - Added invisible interactive hit boxes with hover pointer cursor changes (`document.body.style.cursor = 'pointer'`) and `e.stopPropagation()` on all 6 colony buildings.
    - Removed spurious `onPointerMissed` clearing so OrbitControls dragging around a selected facility is 100% stable.
  - **Phase 3 (First-Time Player Onboarding):**
    - `MainMenuModal.tsx`: Screen 1 featuring Start New Expedition, Continue Saved Mission, Interactive Flight Tutorial, How to Play Manual, and Audio/Graphics Settings.
    - `MissionBriefingModal.tsx`: Screen 2 explaining the 10-Sol survival objective, the 3 crew members, and the 6 colony facilities.
    - `InteractiveTutorial.tsx`: Screen 3 with a 7-step guided visual walkthrough teaching camera controls, building selection, integrity maintenance, operational trade-offs, resource meters, DONKI space weather events, and Sol advancement.
  - **Phase 4 (Clear 4-Panel Gameplay Interface):**
    - *Top HUD (`TopNavBar.tsx`):* Real-time Sol counter, Power (kWh), Oxygen (kg), Water (L), Food rations, Parts, and Crew Vitals.
    - *Left Panel (`LeftObjectivesPanel.tsx`):* Primary 10-Sol survival horizon, NASA research goal progress bar (/60 pts), crew health threshold, and dynamic Sol-specific daily checklists.
    - *Right Panel (`BuildingDetailsPanel.tsx`):* Selected facility integrity bar, power draw, repair action, operational trade-off mode selector, and inspection controls.
    - *Bottom Panel (`BottomControlPanel.tsx`):* Latest mission telemetry log ticker, live crew health & sheltering indicators, prominent "ADVANCE TO NEXT SOL" button with double-click guard, and compact on-screen keyboard shortcut reference.
  - **Phase 5 (Gameplay Loop):**
    - Verified complete 10-Sol simulation loop: Sol incident -> tactical choice -> building adjustments -> advancing Sol -> recalculating resources -> crew health check -> victory/defeat evaluation -> LocalStorage persistence.
  - **Phase 6 (Interior Exploration):**
    - Overhauled `InteriorExitOverlay.tsx` with clear facility title banner, engineering role narrative, 4 listed visible internal equipment subsystems, working operational mode toggles, and an unmissable "RETURN TO COLONY VIEW [ESC / F]" button.
  - **Phase 7 (Browser Verification):**
    - Executed real browser testing verifying Main Menu, Mission Briefing, Interactive Tutorial, 3D Canvas, building selection, interior transitions, event resolution, and Sol advancement.


---

### Complete Children's Educational UX, Gameplay & Visual Redesign (Phases 1–10)
- **Status:** Completed
- **Target Demographic:** Children aged 7–12 (intuitive, self-explanatory, friendly, and narrative-driven).
- **Core Changes Implemented:**
  1. **Phase 1 (Audit & Architecture):**
     - Authored [LUNAR_COMMAND_REDESIGN_AUDIT.md](file:///C:/Users/DELL/.gemini/antigravity/brain/6fc6a9c6-0f33-44b7-a1e7-bc881187f40a/LUNAR_COMMAND_REDESIGN_AUDIT.md) identifying cognitive overload on Sol 1, dark 3D interiors, lack of a guided assistant, and overly technical AI-dashboard glassmorphism.
  2. **Phase 2 (5-Stage Narrative Structure):**
     - Introduced gradual progression: Stage 1 (Welcome with Nova) -> Stage 2 (Core 3 Facilities) -> Stage 3 (Solar Power Challenge) -> Stage 4 (Advanced Bio/Shelter Modules) -> Stage 5 (Full 10-Sol Expedition).
     - Added `gameStage`, `stageProgress`, `missionStars`, and quest objective targeting in Zustand store.
  3. **Phase 3 & 4 (Warm, Playful Educational Art Direction & 4-Area Layout):**
     - Replaced dark glass cards and cyan glows with warm slate, solar gold, bio-emerald, and clean rounded card geometry (`rounded-3xl`).
     - **Top Area (`KidTopNavBar.tsx`):** Simplified resource meters (⚡ Power, 💨 Oxygen, 💧 Water, 🥗 Food) with plain-language status badges ("Good 👍", "Watch Out ⚠️", "Critical 🚨") and crew health face.
     - **Left Area (`NovaMissionGuide.tsx`):** Friendly astronaut assistant Nova displaying current situation, specific objective, plain explanation, and next action button.
     - **Main Area (`LunarWorld.tsx` & `BuildingFloatingBadge.tsx`):** 3D floating HTML badges above all 6 buildings with emojis, health dots, and bouncing `GOAL` badges.
     - **Right Area (`KidBuildingPanel.tsx`):** Contextual single-building panel showing simple role, health bar, repair action (-4 parts), production/consumption summary, and plain-language mode buttons (Eco, Balanced, Intensive).
     - **Bottom Area (`KidBottomBar.tsx`):** Radio chatter ticker, crew summary, and an unmistakable "FINISH TASKS & ADVANCE TO SOL X" button.
  4. **Phase 5 (Bright & Detailed 3D Interiors):**
     - **Greenhouse (`GreenhouseInterior.tsx`):** High-ambient lighting (1.1 intensity), warm sunbeams, translucent geodesic dome looking out at lunar stars, 4 multi-tiered crop beds with leafy greens and ripe fruit, vertical PVC aeroponic towers, cyan nutrient solution tanks, botanist console, and visible working astronaut (`ASSET_PATHS.ASTRONAUT`).
     - **Radiation Shelter (`ShelterInterior.tsx`):** Warm amber safety lighting (1.2 intensity), clean sintered basalt vault with hazard trim, massive steel blast door with hydraulic wheel, 3 astronaut sleeping bunks with blue quilts, multi-screen dosimeter terminal, emergency supply crates, and visible sheltered astronaut.
  5. **Phase 6 (Story-Driven Events with Accurate NASA Data):**
     - `StoryEventModal.tsx`: Rewrote technical incidents into 4-part child-friendly stories (What happened? Why dangerous? What is affected? Choice orders).
     - Accurately labeled NASA attribution tags (e.g. `Historical NASA Data (LCROSS 2009)`, `Curated Scientific Reference (NASA DONKI)`, `Educational Space Science Simulation`).
  6. **Phase 7 (Simplified Resources & Guide):**
     - `ResourceExplanationModal.tsx`: One-click plain-language popups for Electricity, Oxygen, Water, Food, Parts, and Science with production/use balance.
  7. **Phase 8 & 9 (Rewards & 100% Mouse Playability):**
     - Earnable Mission Stars (⭐) awarded upon completing objectives and making sound tactical decisions.
     - 100% playable using only the mouse; keyboard shortcuts remain optional conveniences.
  8. **Phase 10 (Automated Browser Testing & Screenshots):**
     - Executed automated browser journey via `engine/browserAutomation.mjs` directly in Chrome, testing new game start, Nova dialogue, building selection, greenhouse interior, shelter interior, and Sol advancement.
     - Captured and saved 7 full-resolution verification screenshots in artifacts directory.

---

### Interactive Astronaut Control & Crew Management
- **Status:** Completed & Verified
- **Features Implemented:**
  1. **Three Distinct, Interactive Crew Members:**
     - **Alex (Engineer 👨‍🔧, Amber `#f59e0b`):** Specializes in overhauling photovoltaic solar arrays (+25% power condition), servicing ECLSS life-support air scrubbers (+25% condition), and reinforcing habitat pressure seals (+20% condition, +5 Science).
     - **Mia (Scientist 👩‍🔬, Purple `#8b5cf6`):** Specializes in conducting microgravity lab crystallization experiments (+8 NASA Science Points), extracting crater regolith core samples (+6 Science, +4 Parts), and analyzing spectrometer data (+10 Science Points).
     - **Leo (Botanist 🧑‍🌾, Emerald `#10b981`):** Specializes in harvesting hydroponic salad packs (+15 Food Rations), calibrating nutrient pumps (+25% Greenhouse integrity), and sowing fast-cycle dwarf wheat (+10 Food, +3 Science).
     - Each crew member maintains individual Health (0-100%), Stamina/Energy (0-100%), Radiation dose (mSv), Current Task progress, Task History, and Status (`Available`, `Walking`, `Working`, `Resting`, `Needs Attention`).
  2. **Dual-Channel Selection System:**
     - **3D World Click:** Direct raycasting click on the 3D astronaut model in the lunar colony scene immediately selects them with a click confirmation sound.
     - **On-Screen Crew Selector Widget (`CrewSelectorWidget.tsx`):** Docked persistently at the bottom-left displaying Alex, Mia, and Leo with role badges, health/stamina bars, and status pills. Clicking selects and commands them instantly.
     - **Visual Selection Feedback:** When selected, a bright pulsing cyan/white selection reticle (`ringGeometry args={[0.9, 1.15, 32]}`) rotates beneath their feet, an overhead spotlight illuminates them, and their floating 3D/HTML name tag highlights.
  3. **Point-and-Click Movement System:**
     - Terrain clicking in `LunarTerrain.tsx` using Three.js raycasting with drag discrimination (`Math.hypot(dx, dy) <= 7px`) prevents accidental movement during camera orbiting or panning.
     - Emits an animated holographic ground destination marker (`DestinationMarker.tsx`) with rotating segmented reticle and vertical guidance beacon.
     - Astronaut smoothly walks to the destination at 2.4 units/sec with heading rotation lerp and procedural stride bounce.
  4. **Procedural Animations in `SingleInteractiveAstronaut.tsx`:**
     - **Idle:** Gentle procedural breathing bob (`Math.sin(t * 2.2) * 0.02`).
     - **Walking:** Forward translation, rotation facing movement vector, vertical stride bounce (`Math.abs(Math.sin(t * 9.0)) * 0.12`), and subtle roll sway (`Math.sin(t * 9.0) * 0.05`).
     - **Working:** Arrives at destination facility and begins specialized job animations:
       - Alex: Dynamic welding sparks with flickering point light and tool vibration.
       - Mia: Cyan/purple holographic scanner beam pulsing down to target module.
       - Leo: Botanical agro-mist green glow and crop inspection tending motion.
     - **Resting:** Relaxed recovery posture at Habitat.
  5. **Contextual Crew Command Panel (`CrewCommandPanel.tsx`):**
     - Pops up upon astronaut selection showing portrait, role badge, health & stamina meters, radiation dose, and active task progress bar.
     - Offers one-click specialty quick tasks, "ASSIGN MISSION ORDER" button, and "Rest in Habitat Pod" button.
  6. **Task Assignment Modal (`TaskAssignmentModal.tsx`):**
     - Dedicated order dispatch dialog presenting role-specific tasks, duration, stamina cost, real simulation outcomes, and educational NASA science reference cards.
  7. **Real Simulation Outcomes:**
     - Every completed task produces real simulation changes: Solar array repairs increase base kWh, lab research adds real NASA Science points, greenhouse harvesting adds real Food packs, tasks consume 15 stamina, and habitat rest restores stamina to 100%.
  8. **Automated Browser Verification:**
     - Executed automated browser journey in Chrome (`engine/verifyAstronautManagement.mjs`) verifying selection of all 3 astronauts, movement to facilities, task execution with welding/scan effects, task completion, and updated telemetry.
     - Captured 8 full-resolution verification screenshots in artifacts directory.
