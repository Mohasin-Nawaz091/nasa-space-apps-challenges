# LUNAR COMMAND

## Master AI Agent Execution Blueprint

### NASA Space Apps Challenge 2026 --- Build a Junior Astronaut Mission Trainer

**Project:** Lunar Command\
**Platform:** Browser-based 3D game\
**Audience:** Children ages 7--12\
**Experience:** Hybrid isometric colony management + close-up
inspection/interior exploration\
**Primary objective:** Teach real space-mission engineering trade-offs
through an engaging, playable lunar-outpost survival game.

------------------------------------------------------------------------

# 1. Mission and product vision

You are the lead game developer, 3D environment artist, UI/UX engineer,
simulation engineer, software architect, and QA engineer responsible for
implementing Lunar Command.

Build the actual application in the existing repository. Do not merely
provide plans, mockups, or code snippets. Inspect the project, implement
features, run tests, fix errors, and continue through every phase.

The player is the commander of a lunar research outpost. They must keep
a small crew alive, maintain the habitat, manage power and life support,
grow food, protect astronauts from radiation, and complete research
objectives.

Every important decision must involve a meaningful trade-off. Examples:

-   Increasing greenhouse production yields more food but consumes more
    electricity and water.
-   Turning off nonessential equipment conserves power but may slow
    research.
-   Increasing life-support output consumes additional energy.
-   Activating or improving a shelter requires resources but helps
    protect the crew during hazardous events.
-   Repairing equipment costs materials and time.
-   Continuing outdoor research during a radiation warning may increase
    simulated crew exposure risk.

The 3D world is the primary gameplay experience. HUD panels and menus
support the world; they must not replace it with a generic admin
dashboard.

## Product principles

1.  Make a genuinely playable game, not a static 3D website.
2.  Keep the experience understandable for children ages 7--12.
3.  Make visual features connect to actual gameplay systems.
4.  Distinguish real NASA information from simplified game mechanics.
5.  Make failure educational rather than merely punitive.
6.  Prioritize a complete, polished vertical slice over a large number
    of unfinished features.

------------------------------------------------------------------------

# 2. Existing project and fixed technology stack

The repository has already been initialized with `create-next-app`.
Several dependencies have already been installed. Inspect the current
repository and reuse its setup. Do not recreate the project or overwrite
configuration unnecessarily.

## Core stack

  -------------------------------------------------------------------------------
  Area                    Technology                      Responsibility
  ----------------------- ------------------------------- -----------------------
  Application             Next.js + React                 App framework, routing,
                                                          UI

  Language                TypeScript                      Game logic, types,
                                                          simulation

  Styling                 Tailwind CSS                    Responsive interface

  3D rendering            Three.js                        Browser-based 3D
                                                          rendering

  React 3D integration    React Three Fiber               Declarative 3D scene
                                                          components

  3D utilities            Drei                            Controls, loaders,
                                                          helpers

  State                   Zustand                         Shared game state

  Cinematic animation     GSAP                            Camera and world
                                                          transitions

  UI animation            Motion for React                Menus, panels,
                                                          transitions

  Post-processing         `@react-three/postprocessing`   Bloom and selected
                                                          visual effects

  3D authoring            Blender                         Custom models and
                                                          animations

  Asset format            GLB/GLTF                        Runtime 3D assets

  Audio                   Howler                          Music and sound effects

  Validation              Zod                             Validate external data

  Icons                   lucide-react                    Interface icons

  NASA data               NASA open APIs and datasets     Science-grounded events
                                                          and lessons

  Hosting                 Vercel                          Public deployment
  -------------------------------------------------------------------------------

## Existing dependencies to verify

-   `three`
-   `@react-three/fiber`
-   `@react-three/drei`
-   `zustand`
-   `gsap`
-   `motion`
-   `@react-three/postprocessing`
-   `postprocessing`
-   `lucide-react`
-   `howler`
-   `zod`
-   `@types/three`
-   `@types/howler`

Do not install duplicate libraries or introduce Unity, Unreal, Redux,
Firebase, MongoDB, Redis, Kubernetes, or microservices for the initial
MVP without a demonstrated need.

## Next.js rendering requirement

The 3D canvas depends on browser APIs and WebGL. Keep the 3D experience
in client components and load the game canvas dynamically with
server-side rendering disabled where required. Avoid importing
browser-only 3D code into server components.

------------------------------------------------------------------------

# 3. Game experience and visual direction

## Visual style

Create a polished stylized semi-realistic 3D game. Aim for the visual
quality of a modern space exploration or colony-management game while
keeping models readable and performance reasonable on ordinary laptops.

The world should include:

-   Varied lunar terrain, not a flat grey plane.
-   Craters, rocks, boulders, and distant mountains.
-   A dark space sky with stars.
-   Earth visible in the sky, positioned consistently with the chosen
    lunar viewpoint.
-   A landing zone and colony construction area.
-   Directional sunlight and deliberate shadows.
-   Habitat windows and emissive building lights.
-   Paths, cables, equipment, storage containers, and a rover.
-   Animated astronauts and functioning facilities.

Use custom Blender assets for prominent buildings and characters where
feasible. Use appropriately licensed ready-made assets for supporting
objects. Keep an asset attribution record. Procedural geometry is
acceptable during early development, but replace crude placeholder
shapes for important final assets.

## Hybrid gameplay camera

Implement three connected camera modes.

### Mode A --- Colony View

-   View the whole colony.
-   Rotate, pan, and zoom.
-   Select buildings by clicking.
-   See astronauts and facility activity.
-   Keep camera movement within sensible boundaries.

### Mode B --- Inspection View

When a building is selected:

-   Resolve the building ID from the clicked mesh.
-   Highlight the selected building.
-   Smoothly move the camera toward it.
-   Open the correct contextual building panel.
-   Allow the player to inspect status and controls.

### Mode C --- Interior View

-   Enter a building interior.
-   Inspect machinery, plants, equipment, or crew facilities.
-   Activate meaningful controls.
-   Exit back to the exterior view.

Use separate interior scenes if this is more reliable and performant
than physically opening exterior geometry.

## Controls

Desktop: - Mouse wheel: zoom. - Right mouse drag: rotate. - Middle mouse
drag: pan, if supported by the chosen controller. - Left click: select
building or object. - Double click: focus selected building. - WASD:
movement in any close-up exploration mode that supports movement. - E:
interact. - F: enter or exit. - Escape: return to the previous view or
close the active panel. - Space: pause or resume the simulation, with a
visible UI alternative.

Tablet: - Touch drag to rotate/pan. - Pinch to zoom. - Tap to select. -
Visible touch-friendly controls for actions that cannot be performed by
gestures.

Do not make keyboard controls the only way to use an important feature.

------------------------------------------------------------------------

# 4. Colony buildings and facilities

The initial colony contains six primary structures.

## 4.1 Habitat Module

Purpose: - Crew living and sleeping quarters. - Crew occupancy and
status. - Basic environmental support.

Visual elements: - Futuristic habitat structure. - Windows, airlock,
exterior lighting, entry points.

Gameplay: - Show crew occupancy and habitat conditions. - Reflect power
and life-support availability. - Support sheltering or crew-status
information where appropriate.

## 4.2 Life Support Facility

Purpose: - Oxygen management. - Water recycling. - Environmental
support.

Visual elements: - Tanks, pipes, ventilation, industrial equipment,
status lights.

Gameplay: - Manage oxygen production and water recycling. - Show energy
consumption and equipment condition. - Allow operational settings to
affect simulation calculations.

## 4.3 Greenhouse

Purpose: - Food production and plant-growth experiments.

Visual elements: - Transparent greenhouse. - Visible plants and
hydroponic equipment. - Grow lights and water systems.

Gameplay: - Adjustable production intensity. - Food production. - Water
and power consumption. - Production stops or slows when disabled or
under-resourced.

## 4.4 Solar Array

Purpose: - Electrical power generation.

Visual elements: - Multiple solar panels. - Support structures, cables,
energy indicators.

Gameplay: - Show modeled sunlight availability. - Generate energy
according to configurable game rules. - Support panel condition and
maintenance. - Animate panel orientation where appropriate.

## 4.5 Radiation Shelter

Purpose: - Provide a protected area for crew during hazardous events.

Visual elements: - Reinforced structure, heavy entrance, emergency
indicators, interior.

Gameplay: - Show protection status and capacity. - Allow crew to move
inside during appropriate events. - Model protection using clearly
labeled simplified game parameters.

## 4.6 Science Laboratory

Purpose: - Research activities and mission objectives.

Visual elements: - Research equipment, screens, workstations, laboratory
interior.

Gameplay: - Run experiments. - Consume power and possibly other
resources. - Generate research progress and mission points.

## Supporting objects

Add a lunar rover, landing/cargo vehicle, communications antenna,
storage containers, cables, pathways, lights, and environmental props.

Every building must have a stable ID and a data definition separate from
its React component.

Suggested building fields:

``` ts
type Building = {
  id: string;
  type: string;
  name: string;
  position: [number, number, number];
  level: number;
  condition: number;
  isActive: boolean;
  powerConsumption: number;
};
```

Extend this type as needed. Keep game balance values configurable rather
than scattered through UI components.

------------------------------------------------------------------------

# 5. Game simulation design

Create a deterministic, independently testable simulation engine. The
simulation must not depend on React rendering or Three.js frame updates.

## Core resources

Track at least:

-   Electrical energy.
-   Oxygen.
-   Water.
-   Food.
-   Construction materials.
-   Crew health/status.
-   Radiation exposure or a clearly labeled simplified exposure-risk
    measure.

Keep the main HUD focused on three understandable categories:

1.  Life Support.
2.  Power.
3.  Crew Safety.

Show food, water, materials, and detailed values in relevant panels.

## Example resource calculations

``` text
New Power =
Previous Power
+ Energy Generated
- Energy Consumed

New Water =
Previous Water
+ Water Recycled
- Water Consumed

New Food =
Previous Food
+ Food Produced
- Crew Food Consumption
```

Oxygen and crew-safety calculations must also be implemented and
documented.

These are game mechanics, not validated engineering equations. All game
balance values must be labeled as simulation parameters. Do not present
fictional numbers as NASA measurements.

## Daily simulation sequence

When the player advances one simulated day:

1.  Evaluate environmental conditions.
2.  Calculate solar generation.
3.  Calculate power consumption.
4.  Calculate life-support production.
5.  Calculate food production.
6.  Calculate water recycling.
7.  Calculate crew consumption.
8.  Calculate modeled crew exposure and safety effects.
9.  Update building condition.
10. Trigger eligible events.
11. Evaluate objectives and failure conditions.
12. Produce a short explanation of the day's consequences.

Use a deterministic calculation order. Use seeded randomness for
replayable scenarios. Avoid uncontrolled random values that make bugs
impossible to reproduce.

## Resource trade-offs

Greenhouse: - Higher intensity produces more food. - Higher intensity
consumes more power and water.

Life support: - Higher production consumes more energy. - Reduced
production can create shortages.

Solar array: - Generation changes with modeled sunlight availability and
equipment condition.

Shelter: - Requires an operational facility and suitable capacity. -
Provides modeled protection during appropriate events.

Science laboratory: - Research consumes energy. - Research progress
contributes to mission objectives.

## Failure and recovery

Mission failure may occur when critical life support is unavailable,
crew safety reaches a critical threshold, or objectives become
unrecoverable.

Do not make failure arbitrary. Provide warnings, explain the causes, and
allow recovery when the game state reasonably permits it.

------------------------------------------------------------------------

# 6. Astronauts and colony activity

Create three astronauts for the MVP.

Each astronaut should have: - Name. - Role. - Character model. -
Health/status. - Current activity. - Assigned location. - Movement
state.

Required animations: - Idle. - Walking. - Working. - Inspecting. -
Repairing. - Emergency movement.

Behavior: - Move between predefined colony waypoints. - Visit the
greenhouse, laboratory, and habitat as appropriate. - Respond to
emergency events. - Move toward the shelter when the player orders or
the scenario requires it.

Use waypoint-based movement initially. Avoid adding a complex AI
navigation framework unless needed.

The characters must visibly respond to game events; they must not be
static decorations.

------------------------------------------------------------------------

# 7. Events and cinematic world reactions

Implement at least these playable events.

## Solar activity / radiation warning

-   Show an alert and explain the source of the information.
-   Display a solar-event visualization.
-   Show the modeled crew risk.
-   Let the player order crew into the shelter or choose another action.
-   Calculate the consequences.
-   Explain the decision afterward.

Important: A DONKI solar event does not directly provide the radiation
dose received by a fictional lunar crew. Do not make that claim.

## Power shortage or failure

-   Reduce available power.
-   Switch off nonessential systems according to game rules.
-   Activate emergency lighting.
-   Let the player prioritize systems.

## Equipment malfunction

-   Disable or reduce the affected facility.
-   Show a visual warning.
-   Let the player repair it using materials and time.

## Greenhouse problem

-   Reduce food production.
-   Let the player allocate resources to recover the facility.

## Lunar environmental context

Represent lunar conditions accurately. The Moon does not have Earth-like
atmospheric weather. Do not describe lunar dust as an ordinary
atmospheric dust storm. Lunar dust hazards, solar activity, equipment
failures, lighting conditions, and other environmental factors must be
described correctly.

## Visual effects

Use selected effects: - Particles. - Emergency lights. - Bloom. -
Emissive indicators. - Solar-event visualization. - Sparks or smoke for
equipment failure where suitable. - Camera transitions. - Sound effects.

Do not overuse post-processing or particles at the expense of
performance.

------------------------------------------------------------------------

# 8. NASA open data and scientific integrity

NASA data is a core differentiator. Use a small, reliable integration
rather than attempting every dataset.

## NASA DONKI

Source: https://ccmc.gsfc.nasa.gov/tools/DONKI/

Use relevant information about: - Solar flares. - Coronal mass
ejections. - Space-weather events.

Retrieve data through a Next.js server-side route where appropriate. Do
not expose secret API credentials in client-side code. Validate
responses and handle rate limits, network failures, missing fields, and
unavailable services.

## NASA RadLab

Source: https://visualization.osdr.nasa.gov/radlab/gui/data-api/

Use ISS dosimetry measurements as educational reference material. Do not
represent ISS measurements as direct lunar surface measurements.

## NASA Open Science Data Repository

Source: https://osdr.nasa.gov/bio/repo/

Use relevant research findings to create short educational lessons about
spaceflight and astronaut health.

## Lunar surface and imagery resources

Use relevant NASA planetary data and imagery for visual and geographic
context. Keep the selected data source and its usage documented.

## Data rules

For every data item, record: - Source. - Retrieval date/time, if
retrieved dynamically. - Whether it is live, historical, or curated. -
What it actually measures. - How it is used in the game.

Clearly label: - Live NASA data. - Historical NASA data. - Curated
scientific reference. - Fictional gameplay event. - Simplified
simulation value.

Never invent a NASA measurement. Never imply NASA endorses the project.

Provide a Science Sources section in the game and document all data
sources.

If NASA APIs are unavailable, use a clearly labeled fallback scenario
and keep the game playable.

------------------------------------------------------------------------

# 9. Educational experience

The game must teach children ages 7--12.

After important decisions, show a short explanation in plain language.

Example:

"You increased greenhouse production. Your crew may grow more food, but
the greenhouse now needs more electricity and water."

Example:

"Your astronauts entered the shelter. They paused outdoor research to
reduce their exposure risk during this event."

Implement: - Contextual science tips. - Building explanations. -
Resource explanations. - Event explanations. - Decision consequences. -
Mission lessons. - A simple science glossary.

Explain terms such as radiation, solar flare, coronal mass ejection,
life support, regolith, and water recycling in age-appropriate language.

Do not overwhelm children with too many simultaneous metrics.

------------------------------------------------------------------------

# 10. Mission progression and scoring

The MVP should include one complete 10-day lunar survival mission.

Objectives: - Survive 10 simulated days. - Keep crew health above the
critical threshold. - Maintain life-support availability. - Respond
appropriately to hazardous events. - Complete at least one research
objective.

Scoring should consider: - Crew survival. - Resource efficiency. - Crew
safety. - Infrastructure condition. - Research progress. - Mission
completion.

## Final mission report

Show: - Mission result. - Days survived. - Crew status. - Resources
remaining. - Research achievements. - Major decisions. - Mistakes and
their consequences. - Lessons learned. - Final score.

Provide a replay button. Use seeded scenarios so a player can experience
different but reproducible event sequences.

------------------------------------------------------------------------

# 11. Application architecture and folder structure

Adapt this structure to the repository's actual setup. Do not create
duplicate `app` or `src` trees.

``` text
src/
├── app/
│   ├── page.tsx
│   ├── game/
│   │   └── page.tsx
│   ├── api/
│   │   └── nasa/
│   └── globals.css
│
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx
│   │   ├── LunarWorld.tsx
│   │   ├── CameraController.tsx
│   │   ├── SelectionManager.tsx
│   │   └── Lighting.tsx
│   ├── environment/
│   ├── buildings/
│   ├── astronauts/
│   ├── interface/
│   ├── menus/
│   └── effects/
│
├── engine/
│   ├── simulation/
│   ├── resources/
│   ├── events/
│   ├── missions/
│   └── scoring/
│
├── store/
├── services/
├── data/
├── hooks/
├── types/
├── utils/
└── constants/

public/
├── models/
├── textures/
├── images/
├── audio/
└── animations/

docs/
├── GAME_DESIGN.md
├── SIMULATION_RULES.md
├── ARCHITECTURE.md
├── NASA_DATA_SOURCES.md
├── ASSET_ATTRIBUTION.md
└── IMPLEMENTATION_PROGRESS.md
```

## State management

Use Zustand as the shared source of truth for: - Selected building. -
Camera mode. - Mission day. - Resources. - Building state. - Crew
state. - Active events. - Mission objectives. - Pause/resume state.

Do not put high-frequency Three.js animation state into Zustand if it
would cause unnecessary React re-renders. Use refs and frame-loop-local
state for purely visual updates.

## Building selection flow

``` text
Player clicks a building mesh
        ↓
Raycasting identifies the mesh
        ↓
Mesh resolves to a stable building ID
        ↓
Selection manager updates the game store
        ↓
Selected building highlight appears
        ↓
Camera smoothly focuses the building
        ↓
Correct building panel opens
```

## Simulation synchronization

The simulation determines the game state. The 3D world visualizes that
state.

Examples: - Power shortage: lights dim or switch off. - Greenhouse
disabled: grow lights turn off and production stops. - Solar array
active: panels animate toward the modeled sunlight direction. -
Radiation alert: warning indicators activate and crew respond. -
Building damaged: visible status changes appear.

Do not implement visual effects that falsely imply the simulation
changed when it did not.

------------------------------------------------------------------------

# 12. Performance and accessibility

Target a stable 60 FPS on capable desktop hardware, with graceful
quality reduction on lower-performance devices. Treat this as a target,
not a guarantee.

Implement: - Instanced meshes for repeated rocks and props. - Geometry
optimization. - Texture compression where practical. - Lazy-loaded
interior scenes. - LOD for distant objects. - Baked lighting for static
environment objects where appropriate. - Limited real-time shadow
casters. - Efficient React state updates. - Proper Three.js resource
disposal. - Adaptive graphics quality. - A loading screen with real
asset progress.

Use mostly 1K textures and selective 2K textures. Keep initial downloads
reasonable.

Provide: - Readable text. - Clear icons and labels. - Color plus text
for warnings; never rely on color alone. - Keyboard and touch
alternatives. - Pause controls. - Sound controls. - Reduced-motion
consideration for interface transitions.

------------------------------------------------------------------------

# 13. Required phased execution

Execute phases sequentially. Each phase must be implemented and verified
before moving on. Do not stop after producing a plan.

## Phase 0 --- Repository inspection and foundation

Tasks: 1. Inspect the complete repository. 2. Inspect package.json,
Next.js config, TypeScript config, Tailwind setup, and existing app
files. 3. Verify installed dependencies. 4. Confirm whether the project
uses `src/`. 5. Run the development server and existing checks. 6. Fix
genuine configuration problems. 7. Create the project structure without
duplicating existing folders.

Deliverables: - Working project. - Verified dependencies. - Clean
structure. - Initial progress report.

Acceptance: - Development server runs. - No broken imports. - No
TypeScript errors introduced. - Existing useful work preserved.

## Phase 1 --- Game design and simulation specification

Create: - `docs/GAME_DESIGN.md` - `docs/SIMULATION_RULES.md` - Mission,
building, resource, and event configuration data.

Define mission objectives, resource rules, building behavior, event
conditions, scoring, and failure/recovery rules.

Acceptance: - Mechanics are documented. - Game values are
configurable. - Scientific references are separated from fictional
balance values.

## Phase 2 --- 3D lunar world foundation

Implement: - Full-screen 3D canvas. - Lunar terrain and craters. - Rocks
and distant mountains. - Earth and starfield. - Sunlight and shadows. -
Landing area. - Initial colony layout. - Orbit, zoom, and pan controls.

Acceptance: - The world renders and can be explored smoothly. - The 3D
scene works in the browser.

## Phase 3 --- Building models and colony layout

Implement the six primary buildings and supporting objects. Create
reusable components and stable building IDs. Use polished assets for
important structures.

Acceptance: - All six structures are recognizable. - Each structure has
a matching data definition. - The colony layout is coherent.

## Phase 4 --- Hybrid camera and interaction

Implement: - Colony view. - Inspection view. - Interior view. -
Raycasting selection. - Building highlighting. - Camera focus
transitions. - Enter/exit behavior. - Desktop and touch interaction.

Acceptance: - Selecting a building opens its correct controls and
focuses the camera. - Interior entry and exit work for at least the
greenhouse and one other building.

## Phase 5 --- HUD and building panels

Implement: - Mission day and progress. - Power, life support, and crew
safety. - Crew status and alerts. - Mission objectives. -
Building-specific controls. - Mission log and notifications.

Acceptance: - Every visible control has a meaningful action. - UI
updates from actual game state.

## Phase 6 --- Simulation engine

Implement: - Resource manager. - Building manager. - Daily simulation. -
Production and consumption. - Seeded events. - Mission evaluator. -
Recovery and failure rules. - Automated tests.

Acceptance: - Player decisions measurably affect later mission
conditions. - Calculations are deterministic for a fixed state and
seed. - No impossible negative-resource or invalid-state behavior.

## Phase 7 --- Astronauts and behavior

Implement: - Three astronaut characters. - Idle, walking, working, and
emergency animations. - Waypoint movement. - Crew assignments. -
Emergency shelter behavior.

Acceptance: - Astronauts visibly react to gameplay events.

## Phase 8 --- Events and cinematic effects

Implement: - Solar activity/radiation scenario. - Power failure. -
Equipment malfunction. - Greenhouse problem. - Emergency lights,
particles, selected postprocessing, and audio feedback.

Acceptance: - At least one complete solar-event scenario is playable
from warning through player decision to consequence and explanation.

## Phase 9 --- NASA data integration

Implement: - DONKI data service. - Server-side API route where
appropriate. - Response validation. - Rate-limit and network error
handling. - Clearly labeled fallback data. - RadLab and OSDR educational
references where feasible. - In-game source attribution.

Acceptance: - NASA data is correctly described and attributed. - The
game remains playable when APIs are unavailable. - No credentials are
exposed in client bundles.

## Phase 10 --- Educational experience

Implement: - Contextual tips. - Resource explanations. - Building
lessons. - Event explanations. - Decision consequences. - Science
glossary.

Acceptance: - Important decisions explain the real concept in
child-friendly language.

## Phase 11 --- Mission progression and scoring

Implement: - Ten-day mission. - Objectives. - Scoring. - Final report. -
Replay and seeded scenarios.

Acceptance: - A player can complete or fail a mission, see an
explanation, and replay it.

## Phase 12 --- Audio, animation, and visual polish

Implement: - Cinematic introduction. - Landing sequence. - Sound
system. - Building animations. - Character animations. - UI
transitions. - Final visual polish.

Acceptance: - The experience feels cohesive and polished. - Intro can be
skipped. - Sound can be muted.

## Phase 13 --- Performance optimization

Implement: - Asset optimization. - Lazy loading. - LOD and instancing. -
Texture and geometry optimization. - Adaptive quality. - Resource
cleanup.

Acceptance: - No obvious memory leaks. - Scene remains responsive. -
Loading behavior is reasonable on typical broadband connections.

## Phase 14 --- Complete QA and testing

Test: - Application routes and build. - 3D rendering and camera. -
Building selection and panels. - Interior transitions. - Simulation
calculations. - Resource shortages and recovery. - Events and crew
responses. - Mission completion and failure. - Replay. - NASA API
success and fallback. - Desktop and tablet interactions.

Run available lint and test scripts and:

``` bash
npm run build
```

Fix critical errors and runtime exceptions. Document any remaining known
limitations honestly.

Acceptance: - Production build succeeds. - Core gameplay tests pass. -
No critical runtime errors remain.

## Phase 15 --- Deployment and final submission

Deploy to Vercel when credentials and access are available.

Create/update: - `README.md` - `docs/ARCHITECTURE.md` -
`docs/GAME_DESIGN.md` - `docs/SIMULATION_RULES.md` -
`docs/NASA_DATA_SOURCES.md` - `docs/ASSET_ATTRIBUTION.md` -
`docs/IMPLEMENTATION_PROGRESS.md`

Prepare: - Installation instructions. - Game controls. - Gameplay
guide. - NASA source explanation. - Deployment instructions. - Short
judge demonstration sequence.

Acceptance: - Public deployment works if deployment access is
available. - The project can run locally from documented instructions. -
Source attribution and documentation are complete.

------------------------------------------------------------------------

# 14. Global execution rules

These instructions apply to every phase.

1.  **Implement, do not merely plan.** Create and modify the actual
    project files.
2.  **Inspect before changing.** Preserve working code and
    configuration.
3.  **No fake functionality.** Every visible control must work or be
    clearly marked as unavailable.
4.  **Keep concerns separated.** Rendering, simulation, UI, NASA data,
    and mission configuration must remain independently maintainable.
5.  **Maintain scientific integrity.** Distinguish real data, historical
    data, curated references, simplified simulation values, and
    fictional events.
6.  **Keep the game visually strong.** The 3D world must remain the main
    experience.
7.  **Optimize continuously.** Avoid loading unnecessary assets and
    libraries.
8.  **Handle errors.** External API failures must not crash the game.
9.  **Make sensible decisions autonomously.** Do not ask the user to
    approve every phase. If an optional asset is unavailable, use a
    suitable alternative and document it.
10. **Do not hide blockers.** If credentials, hardware, or an external
    service are genuinely required and unavailable, complete all
    independent work and report the exact blocker.
11. **Update documentation.** Record architecture and implementation
    decisions as they are made.
12. **Verify before claiming completion.** A screenshot or successful
    compilation alone does not prove a feature works.

## Progress tracking

Maintain `docs/IMPLEMENTATION_PROGRESS.md`.

For every phase record: - Status: Not started / In progress / Completed
/ Blocked. - Features implemented. - Files created. - Files modified. -
Dependencies added. - Tests performed. - Test results. - Remaining
issues. - Next phase.

Never mark a phase completed until its acceptance criteria have been
verified.

------------------------------------------------------------------------

# 15. Final definition of done

Lunar Command is complete only when:

-   A player can open the game in a browser without an account.
-   A cinematic lunar environment is displayed.
-   The player can rotate, pan, and zoom around the colony.
-   Six recognizable buildings are present.
-   Buildings can be selected and inspected.
-   At least two interiors are available.
-   Building controls change actual simulation state.
-   The player can manage life support, energy, food, water, and crew
    safety.
-   The player can advance simulated days.
-   Events create visible and mechanical consequences.
-   Astronauts respond to emergencies.
-   The mission can be completed or failed.
-   A final mission report explains the outcome.
-   The player can replay the mission.
-   NASA science is correctly attributed and distinguished from game
    simulation.
-   The production build succeeds.
-   Core tests pass.
-   Documentation is complete.
-   Deployment is completed if access is available.

The finished product must demonstrate both: 1. An engaging, visually
impressive educational game. 2. A meaningful simulation of real
space-mission engineering trade-offs.

**Final instruction: Start Phase 0 immediately. Execute all phases
through Phase 15. Build the game, test it, fix it, and deliver it.**
