# Lunar Command — Game Design Document

**Target Audience:** Children ages 7–12, educators, and space enthusiasts  
**Platform:** Modern Web Browser (Three.js / React Three Fiber / Next.js)  
**Genre:** 3D Colony Management Simulation & Junior Astronaut Mission Trainer  
**Setting:** Shackleton Crater rim, Lunar South Pole (Region of permanent sunlight & deep cold traps with water ice)

---

## 1. Executive Summary

In **Lunar Command**, players step into the boots of the Moonbase Commander. Stationed at the lunar south pole, the player commands an outpost of 3 specialized astronauts:
- **Commander Sarah Walker** (Mission Specialist & Navigation)
- **Dr. Hiroshi Tanaka** (Chief Engineer & Power Systems)
- **Dr. Maya Patel** (Botanist & Life Support Biologist)

Over a 10-day mission, players balance four critical life pillars: **Energy**, **Oxygen**, **Water**, and **Food**, while safeguarding crew health against the harsh lunar environment (vacuum, extreme temperatures, solar radiation, and abrasive lunar regolith).

The simulation teaches children real-world aerospace engineering principles:
1. Every engineering decision is an intentional trade-off.
2. The Moon has no atmosphere or magnetic shield, requiring protective shelters.
3. Closed-loop life support (recycling water and air) is essential for deep space survival.
4. Solar power requires storage batteries to survive shadow periods and dust coverage.

---

## 2. Core Game Loop

```
┌─────────────────────────────────────────────────────────────┐
│                       PLANNING PHASE                        │
│  - Inspect building status & crew condition                │
│  - Review space weather telemetry (DONKI solar forecast)    │
│  - Adjust facility production levels & priorities           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       EXECUTION STEP                        │
│  - Advance Day (or step simulation tick)                    │
│  - Calculate Solar Generation - Base Consumption            │
│  - Calculate Oxygen & Water Recycling                       │
│  - Calculate Food Production & Crew Consumption             │
│  - Astronauts move along waypoints performing assigned tasks│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      INCIDENT & REACTION                    │
│  - Random/Scripted event triggers (e.g. Solar CME warning)  │
│  - Visual world reaction (emergency lights, solar flare)    │
│  - Player chooses tactical response (Shelter vs Continue)   │
│  - Educational consequence explanation displayed            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DAY EVALUATION                        │
│  - Check victory & critical failure conditions              │
│  - Update daily mission log & science discovery cards       │
│  - Prepare for next day until Day 10 Certification          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The Six Core Colony Buildings

### 3.1 Habitat Module (`habitat`)
- **Function:** Living quarters, sleep pods, galley, and medical bay.
- **Controls:** Comfort level (Normal vs Low Power Survival), Airlock Status.
- **Trade-off:** Lowering habitat power saves energy but degrades crew rest and morale.
- **Interior View:** Crew bunks, command station, and medical diagnostic screen.

### 3.2 Life Support Facility (`life_support`)
- **Function:** Sabatier oxygen generator, CO2 scrubbers, and urine/graywater distillation processor.
- **Controls:** Production Intensity (Conservation 80%, Standard 100%, Overdrive 130%).
- **Trade-off:** Overdrive generates extra oxygen/water buffers but consumes 50% more energy and causes faster wear on filters.

### 3.3 Hydroponic Greenhouse (`greenhouse`)
- **Function:** Aeroponic and LED-driven crops (spirulina, dwarf wheat, lunar radishes).
- **Controls:** Grow Light Intensity (Off, Eco 50%, Balanced 100%, Intensive 150%).
- **Trade-off:** High intensity doubles food harvest speed but heavily drains power and irrigation water.
- **Interior View:** Hydroponic trays, purple/pink UV LED grow lights, misting nozzles.

### 3.4 Photovoltaic Solar Array (`solar_array`)
- **Function:** High-efficiency multi-junction solar tracking panels with lithium-ion battery banks.
- **Controls:** Panel Tracking Angle, Dust Cleaning Cycle (costs materials/crew time).
- **Trade-off:** Cleaning panels requires astronaut EVA time and repair materials, but restores full 100% electrical output.

### 3.5 Regolith Radiation Shelter (`shelter`)
- **Function:** Underground/regolith-shielded bunker with 2-meter thick sintered lunar soil walls.
- **Controls:** Alarm Protocol (All Hands to Shelter / Standby).
- **Trade-off:** Sheltering astronauts protects them from solar particle events (SPE) but halts outdoor research and maintenance tasks.

### 3.6 Science Laboratory (`science_lab`)
- **Function:** Spectrometer, regolith core sampling analysis, plant biology experiments.
- **Controls:** Active Research Project (Regolith 3D Printing, Ice Core Extraction, Space Botany).
- **Trade-off:** Active research earns mission points needed for certification but consumes 30 kW continuous power.

---

## 4. Supporting Infrastructure & Environment

- **Lunar Rover (SEV):** Used for sample collection, deployable sensor networks, and emergency crew retrieval.
- **Cargo Lander (Artemis-class):** The touchdown craft that brought the crew and initial supply crates.
- **High-Gain Comms Dish:** Maintains continuous communications link with Mission Control on Earth.
- **Regolith Pathways & Power Conduits:** Visible glowing cables carrying power between solar arrays and base facilities.
- **Lunar Landscape:** South pole craters with sharp shadow contrasts, realistic gray albedo, starfield, and the blue Earth suspended in the dark sky.

---

## 5. Audience & Educational Philosophy (Ages 7–12)

1. **Clear visual metaphors:** Color-coded meters (Green = Safe, Yellow = Warning, Red = Critical).
2. **"Why did that happen?" popups:** Plain language explanations whenever a resource drops or an event occurs.
3. **No gory or traumatizing failure:** If life support runs out, the mission triggers an emergency automated Earth evacuation abort, showing a debrief of what to adjust on the next attempt.
4. **Interactive 3D engagement:** Clicking any building smoothly flies the camera to inspect its operation, with sound effects (airlocks, humming solar inverters, bubbling hydroponics).
