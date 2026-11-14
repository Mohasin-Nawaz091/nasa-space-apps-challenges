# Lunar Command — System Architecture

This document describes the software architecture, rendering pipeline, simulation state flow, and data integration for **Lunar Command**.

---

## 1. High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER / CLIENT                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────┐            ┌──────────────────────────┐   │
│   │   2D Interface Layer   │            │   3D WebGL Canvas Layer  │   │
│   │  (Next.js / Tailwind)  │            │  (Three.js / R3F / Drei) │   │
│   ├────────────────────────┤            ├──────────────────────────┤   │
│   │ - TopNavBar HUD        │            │ - LunarSky & Earth       │   │
│   │ - BuildingDetailsPanel │   Action   │ - LunarTerrain & Rocks   │   │
│   │ - EventModal           │ ─────────> │ - Colony Infrastructure  │   │
│   │ - CrewStatusDrawer     │            │ - 6 Interactive Modules  │   │
│   │ - MissionLogDrawer     │ <───────── │ - 3 Astronaut Characters │   │
│   │ - GlossaryModal        │   State    │ - 2 Interior Scenes      │   │
│   │ - MissionReportModal   │            │ - Hybrid Camera System   │   │
│   └───────────┬────────────┘            └─────────────┬────────────┘   │
│               │                                       │                │
│               ▼                                       ▼                │
│   ┌───────────────────────────────────────────────────────────────┐    │
│   │              ZUSTAND SHARED CLIENT STORE                      │    │
│   │  - Resources (Power, O2, Water, Food, Parts, Science)         │    │
│   │  - Building States, Conditions, & Engineering Settings        │    │
│   │  - Astronaut Vitals, Waypoints, & Shelter Protocol            │    │
│   │  - Active Events, Sol Counter, & Simulation Log               │    │
│   └───────────────────────────────┬───────────────────────────────┘    │
│                                   │                                    │
│                                   ▼                                    │
│   ┌───────────────────────────────────────────────────────────────┐    │
│   │              DETERMINISTIC SIMULATION ENGINE                  │    │
│   │  - Advance Day Equations (Solar, ECLSS, Bio-Dome, Health)     │    │
│   │  - Seeded Event Pipeline & Consequence Evaluator              │    │
│   │  - Victory / Abort Condition Check                            │    │
│   └───────────────────────────────────────────────────────────────┘    │
│                                   │                                    │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTP Fetch
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS SERVER ROUTES                           │
├────────────────────────────────────────────────────────────────────────┤
│   - `/api/nasa/donki`: Validated space weather proxy & fallback        │
│   - `/api/nasa/science-data`: Curated RadLab, OSDR, & LRO metadata     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
lunar-command/
├── app/
│   ├── layout.tsx             # Root HTML, fonts, and dark theme metadata
│   ├── page.tsx               # Main game page with dynamic WebGL canvas & HUD
│   └── api/
│       └── nasa/
│           ├── donki/route.ts        # NASA DONKI CME proxy with Zod validation
│           └── science-data/route.ts # Curated RadLab, OSDR, & LRO reference data
│
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx     # Client-only R3F Canvas with shadows & loader
│   │   ├── LunarWorld.tsx     # Root scene graph assembling all 3D layers
│   │   └── CameraController.tsx # Smooth hybrid camera controller (Modes A, B, C)
│   │
│   ├── environment/
│   │   ├── LunarSky.tsx       # Starfield, rotating Earth globe, and sun lighting
│   │   ├── LunarTerrain.tsx   # Procedural crater terrain, landing pad, and rocks
│   │   └── ColonyInfrastructure.tsx # Lander, rover, comms dish, and conduits
│   │
│   ├── buildings/
│   │   ├── HabitatModule.tsx        # Pressurized crew living dome
│   │   ├── LifeSupportFacility.tsx  # ECLSS Sabatier reactors and cryogenic tanks
│   │   ├── GreenhouseFacility.tsx   # Geodesic bio-dome with aeroponic LED racks
│   │   ├── SolarArrayFacility.tsx   # Sun-tracking vertical solar masts
│   │   ├── RadiationShelter.tsx     # Sintered regolith storm bunker
│   │   ├── ScienceLaboratory.tsx    # Geological core drill spectrometer facility
│   │   ├── BuildingHighlight.tsx    # Floating holographic reticle & nameplate
│   │   └── interiors/
│   │       ├── GreenhouseInterior.tsx # Mode C close-up growth room
│   │       └── ShelterInterior.tsx    # Mode C close-up storm bunker
│   │
│   ├── astronauts/
│   │   └── AstronautCrew.tsx        # 3 animated astronaut characters with waypoints
│   │
│   ├── interface/
│   │   ├── TopNavBar.tsx            # Resource meters, Sol counter, and audio toggle
│   │   ├── BuildingDetailsPanel.tsx # Interactive controls & engineering trade-offs
│   │   ├── EventModal.tsx           # Daily incident alert and tactical choices
│   │   ├── CrewStatusDrawer.tsx     # Astronaut vitals, radiation, and shelter alert
│   │   ├── MissionLogDrawer.tsx     # Chronological telemetry history
│   │   ├── GlossaryModal.tsx        # Kid-friendly NASA science dictionary
│   │   ├── MissionReportModal.tsx   # Day 10 scoring and certification report
│   │   └── InteriorExitOverlay.tsx  # Mode C interior exit header
│   │
│   └── menus/
│       └── CinematicIntro.tsx       # Landing briefing with skip option
│
├── constants/
│   ├── buildings.ts           # Building coordinates, baselines, and interactions
│   └── simulation.ts          # Initial resources, consumption rates, and constants
│
├── data/
│   ├── missions.ts            # 10-day scripted event sequence with branching choices
│   └── glossary.ts            # 8 core aerospace terms defined for ages 7–12
│
├── engine/
│   ├── simulation.test.ts     # TypeScript test definitions
│   └── runTests.mjs           # Zero-dependency deterministic test runner
│
├── store/
│   └── gameStore.ts           # Central Zustand store governing all state mutations
│
├── utils/
│   └── audio.ts               # Procedural Web Audio API sound synthesizer
│
└── docs/
    ├── GAME_DESIGN.md
    ├── SIMULATION_RULES.md
    ├── ARCHITECTURE.md
    ├── NASA_DATA_SOURCES.md
    ├── ASSET_ATTRIBUTION.md
    └── IMPLEMENTATION_PROGRESS.md
```

---

## 3. The Hybrid Camera System

The camera controller implements three distinct camera states driven by `useGameStore`:

1. **Mode A — Colony View (Default):**
   - High oblique view (`position: [26, 22, 26]`, `target: [0, 0, 0]`).
   - Full orbit rotation, panning, and zoom enabled via OrbitControls.
   - Polar angle locked above the lunar horizon (`maxPolarAngle = π/2 - 0.04`) so the camera never clips below terrain.

2. **Mode B — Inspection View:**
   - Triggered when the player clicks any building.
   - Camera smoothly transitions to position 7.5 units back and 5.5 units above the target building.
   - Orbit controls smoothly orbit around the selected facility.

3. **Mode C — Interior View:**
   - Triggered via the "INSPECT INTERIOR" button or pressing `F`.
   - Replaces exterior colony rendering with dedicated, high-detail indoor modules (`GreenhouseInterior` or `ShelterInterior`).
   - Camera is positioned inside the facility (`[0, 2.4, 5.5]`).
   - Smooth exit back to exterior via `Escape`, `F`, or UI button.

---

## 4. Performance Optimizations

1. **Instanced Rendering (`@react-three/drei` Instances):**
   - Boulders and rocks are rendered as a single instanced draw call across the terrain.
2. **Procedural Geometry with Precomputed Normals:**
   - Terrain elevation is computed once in `useMemo` with customized crater mathematics, avoiding expensive runtime recalculations.
3. **Decoupled Three.js Animation Loop:**
   - Rotating elements (fans, dish, Earth globe, solar gimbal) animate purely inside Three.js frame loops using direct refs, avoiding unnecessary React component re-renders.
4. **Dynamic Client-Only Canvas (`ssr: false`):**
   - Canvas is lazy loaded on the client side, preventing server-side rendering crashes with WebGL contexts.
