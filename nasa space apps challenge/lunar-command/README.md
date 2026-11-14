# 🌕 LUNAR COMMAND
### NASA Space Apps Challenge 2026 — Junior Astronaut Mission Trainer

**Lunar Command** is an interactive, browser-based 3D lunar colony survival simulation built for the **NASA Space Apps Challenge 2026**. Designed for children aged 7–12, educators, and space enthusiasts, the game teaches real space-mission engineering trade-offs through an engaging, playable 10-day lunar surface expedition at the Moon's South Pole.

---

## 🌟 Key Features

1. **Detailed 3D Lunar Environment:**
   - Shackleton Crater rim terrain with natural crater bowls, rolling hills, and distant mountain ridges.
   - Sintered landing pad with hazard beacons, Artemis cargo lander, and pressurized 6-wheel rover (SEV).
   - Earth rotating high in the lunar sky with atmospheric glow.
   - Low-angle harsh lunar sunlight and dynamic shadows.
   - Instanced regolith boulders and glowing power conduits.

2. **Six Recognizable Functional Buildings:**
   - **Artemis Habitat Module:** Crew living quarters, airlock, and observation cupola.
   - **ECLSS Life Support Facility:** Sabatier oxygen synthesis, cryogenic tanks, and CO2 scrubbers.
   - **Bio-Regenerative Greenhouse:** Geodesic dome with aeroponic trays and dynamic UV grow lights.
   - **Photovoltaic Solar Array:** Sun-tracking vertical solar masts designed for the polar horizon sun.
   - **Regolith Radiation Shelter:** 2-meter thick compacted lunar soil bunker for solar storms.
   - **Geological Science Laboratory:** Core drilling analysis and spectrometer research station.

3. **Hybrid Camera System:**
   - **Mode A (Colony View):** Smooth orbit, pan, and zoom overview of the entire outpost.
   - **Mode B (Inspection View):** Smooth camera focus on clicked buildings with engineering panels.
   - **Mode C (Interior View):** Enter the Greenhouse and Radiation Shelter interiors with interactive consoles.

4. **Three Animated Astronauts:**
   - **Commander Sarah Walker:** Mission specialist & operations.
   - **Dr. Hiroshi Tanaka:** Chief engineer & life support.
   - **Dr. Maya Patel:** Lead botanist & bio-regenerative agriculture.
   - Astronauts walk between waypoints, conduct repairs, and evacuate to the storm shelter during alerts.

5. **Deterministic Simulation Engine & 10-Day Mission:**
   - Real interconnected resources: Power (kWh), Oxygen (kg), Water (L), Food (rations), Spare Parts, and Research Points.
   - Meaningful trade-offs: More food requires more power and water; cleaning solar panels costs crew time and parts; emergency shelter protects health but halts outdoor science.
   - Scripted events across all 10 simulated Sols including Coronal Mass Ejections, water ice drilling, regolith dust clinging, and microwave sintering.

6. **NASA Open Data Integration:**
   - **NASA DONKI:** Space weather alerts with CME tracking and solar flare detection.
   - **NASA RadLab & OSDR:** Scientific references for radiation shielding and space crop biology.
   - Clear distinction between live NASA data, historical records, curated science, and simplified simulation parameters.

7. **Educational Experience (Ages 7–12):**
   - In-game Junior Astronaut Science Glossary explaining terms like *Regolith*, *CME*, *ECLSS*, *ISRU*, and *PSR* in child-friendly language.
   - Plain-language decision debriefs after every tactical choice.
   - Non-punitive learning with comprehensive 10-day mission reports and replayability.

---

## 🎮 Game Controls

### Desktop
| Action | Control |
|---|---|
| **Rotate Camera** | Right Mouse Drag / Left Mouse Drag (Colony View) |
| **Pan Camera** | Middle Mouse Drag / Shift + Left Drag |
| **Zoom In / Out** | Mouse Wheel / Pinch Trackpad |
| **Select Building** | Left Click on any facility mesh |
| **Enter Interior View** | Click "INSPECT INTERIOR" or press `F` |
| **Exit Interior / Deselect**| Press `Escape` or `F` |
| **Pause / Resume** | Press `Spacebar` or click Pause button in HUD |

### Touch / Tablet
- **One-Finger Drag:** Rotate camera.
- **Two-Finger Pinch:** Zoom camera.
- **Tap:** Select buildings and interact with HUD controls.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **3D Graphics:** Three.js, React Three Fiber (R3F), `@react-three/drei`
- **State Management:** Zustand
- **Data Validation:** Zod
- **Icons:** `lucide-react`
- **Audio:** Web Audio API Procedural Synthesizer
- **NASA APIs:** NASA DONKI, RadLab, and OSDR

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ or v26+
- npm v10+

### Installation & Local Run

1. Navigate to the project directory:
   ```bash
   cd lunar-command
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the automated simulation test suite:
   ```bash
   npm test
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🧪 Verification & Testing

Run all quality checks:
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run unit tests on the simulation engine
npm test

# Run production build
npm run build
```

---

## 🚢 Vercel Deployment Guide

To deploy Lunar Command on Vercel:

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Configure the Root Directory to `lunar-command`.
4. (Optional) Set the environment variable `NASA_API_KEY` with your free key from [api.nasa.gov](https://api.nasa.gov). If omitted, the game automatically uses the built-in curated NASA space weather archive.
5. Click **Deploy**.

---

## 🏆 Judge Demonstration Walkthrough (3-Minute Tour)

1. **Launch:** Open the game and experience the **Cinematic Briefing** explaining the Shackleton Crater landing. Click **Command Lunar Base Alpha**.
2. **Explore the 3D World:** Orbit, pan, and zoom around the lunar south pole. Notice the rotating Earth in the black sky, long sun shadows, the Artemis cargo lander, and the lunar rover.
3. **Inspect Facilities:** Click the **Bio-Regenerative Greenhouse**. Notice the camera smoothly focusing on the dome. Click **INSPECT INTERIOR [F]** to explore the hydroponic growth racks and glowing purple LED arrays. Press **Exit Interior [Esc]**.
4. **Engineering Trade-offs:** Click the **ECLSS Life Support Facility**. Toggle setting to *Overdrive Filtration*—notice that oxygen output rises while battery draw increases.
5. **Space Weather Event:** Click **ADVANCE SOL** until reaching Sol 5. When the **Space Weather Alert** pops up with NASA DONKI data, choose **SOUND EMERGENCY: All Crew into Regolith Shelter!** Watch the astronauts take cover in the 2-meter regolith bunker and notice the strobe beacon flashing.
6. **Science Glossary:** Click the book icon in the top right to explore the Junior Astronaut Science Glossary explaining real aerospace concepts in kid-friendly terms.
7. **Certification Report:** Advance to Sol 10 to receive the final NASA Houston Flight Certification Report with your overall mission score, laurels badge, and lessons learned!
