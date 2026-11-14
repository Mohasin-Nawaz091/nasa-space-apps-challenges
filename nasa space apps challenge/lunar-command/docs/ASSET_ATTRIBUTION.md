# Lunar Command — Asset Attribution & Third-Party Credits

This document logs all 3D GLB assets, procedural geometries, UI icon libraries, fonts, audio synthesizers, and scientific datasets utilized in **Lunar Command**.

---

## 1. Lunar Command 3D Asset Pack (Balanced Edition)

All primary 3D models and surface textures were authored for Lunar Command and are located in `public/assets/`.

| Asset ID | File Path | Format | In-Game System / Component |
|---|---|---|---|
| `habitat-module` | `models/buildings/habitat_module.glb` | GLB | Artemis Habitat Module living quarters |
| `life-support-station` | `models/buildings/life_support_station.glb` | GLB | ECLSS Life Support Facility |
| `greenhouse-dome` | `models/buildings/greenhouse_dome.glb` | GLB | Bio-Regenerative Greenhouse dome |
| `power-station-solar` | `models/buildings/power_station_solar.glb` | GLB | Photovoltaic Solar Power station |
| `radiation-shelter` | `models/buildings/radiation_shelter.glb` | GLB | 2-meter Regolith Radiation Shelter |
| `research-lab` | `models/buildings/research_lab.glb` | GLB | Geological Science Research Laboratory |
| `astronaut-stylized` | `models/characters/astronaut_stylized.glb` | GLB | 3 Astronauts (Commander, Engineer, Botanist) |
| `landing-pad` | `models/environment/landing_pad.glb` | GLB | Sintered Artemis landing pad |
| `lunar-terrain-tile` | `models/environment/lunar_terrain_tile.glb` | GLB | Lunar South Pole core terrain tile |
| `rock-cluster-pack` | `models/environment/rock_cluster_pack.glb` | GLB | Geological rock clusters scattered across craters |
| `lunar-rover` | `models/vehicles/lunar_rover.glb` | GLB | 6-wheel pressurized Lunar Rover (SEV) |
| `communication-antenna` | `models/equipment/communication_antenna.glb` | GLB | High-gain Earth communication tower |
| `oxygen-tank-rack` | `models/equipment/oxygen_tank_rack.glb` | GLB | Cryogenic oxygen storage bay |
| `solar-array` | `models/equipment/solar_array.glb` | GLB | Standalone sun-tracking solar arrays |
| `lunar-regolith` | `textures/lunar_regolith.png` | PNG | High-albedo regolith surface texture map |
| `metal-panels` | `textures/metal_panels.png` | PNG | Modular hull surface texture |
| `greenhouse-glass` | `textures/greenhouse_glass.png` | PNG | Translucent bio-dome glazing |

- **Asset Source:** Original procedural models authored for Lunar Command (`ASSET_MANIFEST.json`).
- **Coordinate Conversion:** Z-up to Three.js Y-up conversion applied centrally in `components/game/AssetModel.tsx`.

---

## 2. Interactive Interior Scenes

Mode C interior spaces are built with specialized high-detail Three.js procedural environments:
- **Greenhouse Interior:** Aeroponic vertical growth towers, leaf misting nozzles, and botanist telemetry console.
- **Radiation Shelter Interior:** Emergency survival bunks, dosimeter monitors, medical racks, and reinforced blast doors.

---

## 3. Audio & Sound Design

- **Synthesizer Engine:** Custom Web Audio API Procedural Synthesizer (`utils/audio.ts`)
- **License:** MIT (Zero external audio file bandwidth, instant offline responsiveness)
- **Sound Effects:**
  - UI Navigation & Confirmation Chimes
  - Emergency Alert / Space Weather Klaxon
  - Mechanical Airlock Depressurization Whoosh
  - Sol Advancement & Mission Success Fanfare

---

## 4. Fonts & Iconography

- **UI Icons:** `lucide-react` (ISC License)
- **Typography:** Geist & Geist Mono by Vercel (SIL Open Font License 1.1)

---

## 5. NASA Open Science & Telemetry

- **NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)** — NASA CCMC / SWRC (Public Domain / Open Data)
- **NASA Open Science Data Repository (OSDR) / RadLab** — NASA Biological & Physical Sciences (Public Domain / Open Data)
- **NASA Lunar Reconnaissance Orbiter (LRO) & LCROSS** — NASA GSFC / Ames (Public Domain / Open Data)
