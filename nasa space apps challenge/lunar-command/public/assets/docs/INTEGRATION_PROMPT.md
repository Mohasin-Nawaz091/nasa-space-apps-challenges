# AI Agent Integration Instructions

Integrate this asset pack into the existing Lunar Command Next.js project.

1. Copy `models/` and `textures/` into `public/assets/` without renaming files.
2. Read `ASSET_MANIFEST.json` and use it as the source of truth for asset paths.
3. Create a reusable GLB loader using `useGLTF` from Drei. Clone scenes before rendering multiple instances.
4. These assets are authored Z-up. Convert them to the project's Y-up convention in one shared wrapper (typically rotate the model group by -Math.PI / 2 around X), then verify every model's orientation and scale in the scene. Do not apply the conversion twice.
5. Integrate the terrain tile, landing pad, rock cluster, six building models, astronaut, rover, antenna, oxygen rack, and solar array into their corresponding game systems.
6. The astronaut model is static and is not rigged. Do not claim it has animation clips. Implement simple waypoint movement only if it looks acceptable, or add a properly licensed rigged character asset and document its license.
7. Building GLBs are exterior starter models, not complete interiors. Build interior rooms and interactive equipment separately using custom components or additional assets.
8. Add loading/error fallbacks, preload frequently used GLBs, and use instancing for repeated rocks where practical.
9. Test each asset in the running game and adjust scale, orientation, material appearance, and placement. Do not mark integration complete until visually verified.
10. Preserve `ASSET_CREDITS.md` and update it for every additional third-party asset.
