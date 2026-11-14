# Lunar Command — Stylized 3D Asset Pack (Balanced)

This pack contains original, procedurally generated GLB models and PNG texture assets for the Lunar Command browser game. It is a starter asset library, not a complete production art set.

## Included models

- Environment: lunar terrain tile, rock cluster pack, landing pad
- Buildings: habitat, greenhouse, research lab, radiation shelter, life-support station, power station/solar structure
- Character: stylized astronaut base model (use as a starting point for three crew variants)
- Vehicle: lunar rover
- Equipment: communication antenna, oxygen tank rack, standalone solar array
- Textures: lunar regolith, metal panels, greenhouse glass

## Integration

Copy the `models/` and `textures/` directories into your Next.js project's `public/assets/` directory. Load GLB files with `useGLTF` from `@react-three/drei`. Example:

```tsx
import { useGLTF } from '@react-three/drei';

function AssetModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} />;
}

// <AssetModel path="/assets/models/buildings/greenhouse_dome.glb" />
```

For repeated rocks, clone the scene or convert geometry to instanced meshes. Use Draco/Meshopt compression only after validating the deployment pipeline.

## Coordinate and scale notes

Models are authored with Z-up geometry and approximate meter-like scale. Three.js uses Y-up conventions by default. Normalize orientation and scale in a shared asset wrapper (or in Blender) before final placement. The terrain tile spans approximately 24 x 24 units.

## Important limitations

- The astronaut is a static stylized model; rigging and animation clips are not included. Add a rigged character model or animate a custom skeleton in Blender.
- Interior room sets and detailed interactive equipment are not included yet; building models are exterior/blockout-to-mid-detail assets.
- Models use vertex colors and simple geometry. Apply the supplied textures or upgrade materials for final art direction.
- The terrain is a single tile. Add neighboring tiles, scatter props, and LODs for a larger world.

## License and credits

All included meshes and textures in this pack were generated procedurally for this project during this session. No third-party model or texture downloads are included, so there are no external asset creators to credit for these files. You may adapt these original pack assets for Lunar Command. Review any separately added third-party assets under their own licenses.

See `ASSET_MANIFEST.json` for machine-readable inventory and `ASSET_CREDITS.md` for the source/credit record.
