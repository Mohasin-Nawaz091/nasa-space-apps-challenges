import trimesh, numpy as np, os, json, math, zipfile, shutil
from PIL import Image, ImageDraw
ROOT='/mnt/data/lunar_command_asset_pack'

def matmesh(mesh, color):
    c=np.array(color,dtype=np.uint8)
    mesh.visual.face_colors=np.tile(c,(len(mesh.faces),1))
    return mesh

def box(extents, pos, color):
    m=trimesh.creation.box(extents=extents); m.apply_translation(pos); return matmesh(m,color)
def cyl(radius,height,pos,color,sections=16):
    m=trimesh.creation.cylinder(radius=radius,height=height,sections=sections); m.apply_translation(pos); return matmesh(m,color)
def sphere(radius,pos,color,sub=2):
    m=trimesh.creation.icosphere(subdivisions=sub,radius=radius); m.apply_translation(pos); return matmesh(m,color)
def cone(r1,r2,height,pos,color,sections=16):
    m=trimesh.creation.cone(radius=r1,height=height,sections=sections)
    # cone tip at +z; taper orientation is adequate for props
    m.apply_translation(pos); return matmesh(m,color)
def export(name, meshes, folder):
    scene=trimesh.Scene()
    for i,m in enumerate(meshes): scene.add_geometry(m,geom_name=f'{name}_{i}')
    path=os.path.join(ROOT,'models',folder,name+'.glb')
    scene.export(path)
    return path
# palette
stone=(112,112,119,255); light=(180,183,190,255); dark=(47,57,72,255); white=(224,229,235,255)
cyan=(70,190,205,255); blue=(48,94,145,255); green=(91,166,112,255); orange=(238,157,69,255); yellow=(247,205,82,255)
# lunar terrain heightfield
N=72; xs=np.linspace(-12,12,N); ys=np.linspace(-12,12,N); xx,yy=np.meshgrid(xs,ys); z=np.zeros_like(xx)
for cx,cy,r,depth in [(-5,-3,3.0,1.0),(4,4,2.5,.8),(5,-5,1.4,.5),(-2,7,1.8,.45)]:
    d=np.sqrt((xx-cx)**2+(yy-cy)**2); z-=depth*np.exp(-((d/r)**2)*2); z+=.16*np.exp(-(((d-r*1.12)/(r*.22))**2))
rng=np.random.default_rng(7); z+=rng.normal(0,.045,z.shape)
verts=np.column_stack([xx.ravel(),yy.ravel(),z.ravel()]); faces=[]
for j in range(N-1):
 for i in range(N-1):
  a=j*N+i;b=a+1;c=a+N;d=c+1;faces.extend([[a,b,d],[a,d,c]])
terrain=trimesh.Trimesh(vertices=verts,faces=np.array(faces),process=False)
fc=np.zeros((len(faces),4),dtype=np.uint8)
for i,f in enumerate(faces):
 h=float(np.mean(verts[f,2])); v=int(np.clip(115+h*18+rng.integers(-8,9),75,155)); fc[i]=[v,v-2,v+4,255]
terrain.visual.face_colors=fc
export('lunar_terrain_tile',[terrain],'environment')
# rocks grouped pack
rocks=[]
for i in range(12):
 p=rng.uniform(-1,1,3); s=rng.uniform(.25,.9,3); m=trimesh.creation.icosphere(subdivisions=1,radius=1); m.apply_scale(s); m.apply_translation([p[0]*2,p[1]*2,abs(p[2])*.25]); rocks.append(matmesh(m,(118+rng.integers(-15,16),119,128,255)))
export('rock_cluster_pack',rocks,'environment')
# landing pad
ms=[cyl(4,.22,(0,0,0),dark,32),cyl(3.55,.08,(0,0,.15),light,32)]
for a in range(8):
 ang=a*math.pi/4; ms.append(box((.18,1.1,.025),(math.cos(ang)*2.7,math.sin(ang)*2.7,.21),yellow))
ms += [box((.3,.3,.05),(0,0,.23),orange)]
export('landing_pad',ms,'environment')
# common modular buildings: dome-ish rounded habitat built from cylinder + half sphere
# habitat
ms=[cyl(2.1,2.1,(0,0,1.05),light,24),sphere(2.1,(0,0,2.0),white,2),box((1.05,.18,1.45),(0,-2.04,1.0),blue),box((.9,.08,.18),(0,-2.15,1.72),cyan)]
for x in [-.8,.8]: ms.append(box((.12,.08,.75),(x,-2.1,.85),dark))
for x in [-1.2,1.2]: ms.append(box((.5,.08,.6),(x,-2.02,1.2),cyan))
export('habitat_module',ms,'buildings')
# greenhouse
ms=[cyl(2.2,.35,(0,0,.25),dark,24),trimesh.creation.icosphere(subdivisions=2,radius=2.15)]
ms[1].apply_scale([1,1,.72]); ms[1].apply_translation([0,0,1.55]); matmesh(ms[1],(100,194,207,110))
for x in [-1.1,-.4,.4,1.1]:
 ms += [box((.34,.55,.18),(x,0,.72),green),box((.34,.55,.18),(x,0,1.15),green)]
ms += [cyl(.08,1.1,(0,0,.8),orange,10)]
export('greenhouse_dome',ms,'buildings')
# lab
ms=[box((4,3,2.3),(0,0,1.15),light),box((4.2,3.2,.22),(0,0,2.4),dark),box((1.1,.12,1.25),(0,-1.56,.8),blue)]
for x in [-1.25,0,1.25]: ms.append(box((.75,.07,.55),(x,-1.58,1.45),cyan))
ms += [cyl(.55,.7,(1.5,.7,2.8),orange),cyl(.3,.18,(1.5,.7,3.24),yellow)]
export('research_lab',ms,'buildings')
# radiation shelter
ms=[box((4.2,3.8,1.7),(0,0,.85),dark),box((4.4,4,.22),(0,0,1.82),orange),box((1.1,.14,1.25),(0,-1.96,.65),light),box((.7,.05,.3),(0,-2.05,1.45),orange)]
for x in [-1.4,1.4]: ms.append(box((.22,.18,1.35),(x,-1.95,.72),yellow))
export('radiation_shelter',ms,'buildings')
# life support
ms=[box((3.8,3,2.2),(0,0,1.1),light),box((4,3.2,.2),(0,0,2.3),blue)]
for x in [-1.2,0,1.2]:
 ms += [cyl(.42,1.5,(x,-1.58,.95),cyan,16),cyl(.46,.12,(x,-1.58,1.72),dark,16)]
ms += [box((.65,.16,.65),(0,-1.7,1.85),orange)]
export('life_support_station',ms,'buildings')
# power station
ms=[box((3.4,2.4,1.35),(0,0,.7),dark),box((3.5,2.5,.2),(0,0,1.48),light)]
for x in [-1.3,-.45,.45,1.3]: ms.append(box((.62,.08,.8),(x,-1.25,.9),cyan))
# panel banks on angled supports
for side in [-1,1]:
 for i in range(3):
  p=box((1.25,.07,.75),(side*2.5,i*.95-0.95,1.25),blue); p.apply_transform(trimesh.transformations.rotation_matrix(-.22,[1,0,0])); ms.append(p)
export('power_station_solar',ms,'buildings')
# astronaut stylized body/head/backpack/limbs
ms=[sphere(.48,(0,0,2.05),white,2),cyl(.42,.85,(0,0,1.25),white,12),box((.68,.42,.72),(0,.43,1.28),blue),sphere(.34,(0,-.42,2.05),cyan,2)]
for x in [-.25,.25]:
 ms += [cyl(.13,.75,(x,0,.55),white,10),sphere(.15,(x,0,.16),dark,1),cyl(.12,.68,(x*1.8,0,1.35),white,10),sphere(.14,(x*1.8,0,1.0),orange,1)]
ms += [box((.22,.12,.12),(0,-.54,2.04),dark)]
export('astronaut_stylized',ms,'characters')
# rover
ms=[box((2.5,1.55,.55),(0,0,.85),orange),box((1.4,1.05,.45),(0,0,1.32),light),box((.95,.05,.45),(0,-.55,1.38),cyan)]
for x in [-1.0,1.0]:
 for y in [-.85,.85]: ms += [cyl(.38,.22,(x,y,.43),dark,16),cyl(.18,.24,(x,y,.43),light,12)]
ms += [cyl(.08,1.4,(.75,.4,2.0),light,10),sphere(.22,(.75,.4,2.72),cyan,1)]
export('lunar_rover',ms,'vehicles')
# antenna
ms=[cyl(.12,2.4,(0,0,1.2),light,12),sphere(.85,(0,0,2.5),cyan,2),cyl(.18,.35,(0,0,2.5),orange,12)]
for a in range(4):
 ang=a*math.pi/2; ms.append(box((.08,1.2,.08),(math.cos(ang)*.4,math.sin(ang)*.4,2.5),white))
export('communication_antenna',ms,'equipment')
# oxygen tanks
ms=[]
for x in [-.55,0,.55]:
 ms += [cyl(.24,1.25,(x,0,.65),cyan,16),sphere(.24,(x,0,1.27),light,1),cyl(.08,.22,(x,0,1.38),orange,10)]
export('oxygen_tank_rack',ms,'equipment')
# solar array standalone
ms=[box((.18,3.8,.18),(0,0,.5),light),cyl(.09,1.5,(0,0,-.2),dark,10)]
for i in range(4):
 p=box((2.0,.06,1.05),(0,(i-1.5)*1.05,1.05),blue); p.apply_transform(trimesh.transformations.rotation_matrix(-.35,[1,0,0])); ms.append(p)
for x in [-.65,0,.65]: ms.append(box((.025,3.3,.015),(x,0,1.62),cyan))
export('solar_array',ms,'equipment')
# create texture tiles procedural
from PIL import ImageFilter
for name,base,noise in [('lunar_regolith',(119,118,126),18),('metal_panels',(66,91,116),8),('greenhouse_glass',(85,165,184),5)]:
 w=h=512; rr=np.random.default_rng(sum(map(ord,name))); arr=np.zeros((h,w,3),dtype=np.uint8)
 n=rr.normal(0,noise,(h,w,1));
 for k in range(3): arr[:,:,k]=np.clip(base[k]+n[:,:,0],0,255)
 im=Image.fromarray(arr,'RGB')
 d=ImageDraw.Draw(im)
 if name=='lunar_regolith':
  for _ in range(240):
   x=int(rr.integers(w));y=int(rr.integers(h));r=int(rr.integers(1,5));d.ellipse((x-r,y-r,x+r,y+r),fill=tuple(int(max(0,min(255,c+int(rr.integers(-22,23))))) for c in base))
 im.save(os.path.join(ROOT,'textures',name+'.png'))
# manifest
assets=[]
for dp,_,files in os.walk(os.path.join(ROOT,'models')):
 for f in sorted(files):
  if f.endswith('.glb'):
   p=os.path.join(dp,f); rel=os.path.relpath(p,ROOT).replace('\\','/')
   assets.append({'id':f[:-4].replace('_','-'),'path':rel,'format':'glb','source':'Original procedural model generated for Lunar Command','license':'Original project asset; no third-party source asset used','status':'included','notes':'Stylized low-to-mid polygon model; inspect scale and materials in the game scene.'})
for dp,_,files in os.walk(os.path.join(ROOT,'textures')):
 for f in sorted(files): assets.append({'id':f[:-4].replace('_','-'),'path':os.path.relpath(os.path.join(dp,f),ROOT).replace('\\','/'),'format':'png','source':'Procedurally generated texture for Lunar Command','license':'Original project asset','status':'included'})
manifest={'pack':'Lunar Command Stylized 3D Asset Pack','edition':'Balanced','version':'1.0.0','units':'meters (approximate; verify per asset)','coordinate_system':'Y-up is not guaranteed; models are authored with Z-up geometry. Rotate/normalize on import if required by the renderer.','assets':assets}
with open(os.path.join(ROOT,'ASSET_MANIFEST.json'),'w') as f: json.dump(manifest,f,indent=2)
# docs
readme='''# Lunar Command — Stylized 3D Asset Pack (Balanced)\n\nThis pack contains original, procedurally generated GLB models and PNG texture assets for the Lunar Command browser game. It is a starter asset library, not a complete production art set.\n\n## Included models\n\n- Environment: lunar terrain tile, rock cluster pack, landing pad\n- Buildings: habitat, greenhouse, research lab, radiation shelter, life-support station, power station/solar structure\n- Character: stylized astronaut base model (use as a starting point for three crew variants)\n- Vehicle: lunar rover\n- Equipment: communication antenna, oxygen tank rack, standalone solar array\n- Textures: lunar regolith, metal panels, greenhouse glass\n\n## Integration\n\nCopy the `models/` and `textures/` directories into your Next.js project's `public/assets/` directory. Load GLB files with `useGLTF` from `@react-three/drei`. Example:\n\n```tsx\nimport { useGLTF } from '@react-three/drei';\n\nfunction AssetModel({ path }: { path: string }) {\n  const { scene } = useGLTF(path);\n  return <primitive object={scene.clone()} />;\n}\n\n// <AssetModel path="/assets/models/buildings/greenhouse_dome.glb" />\n```\n\nFor repeated rocks, clone the scene or convert geometry to instanced meshes. Use Draco/Meshopt compression only after validating the deployment pipeline.\n\n## Coordinate and scale notes\n\nModels are authored with Z-up geometry and approximate meter-like scale. Three.js uses Y-up conventions by default. Normalize orientation and scale in a shared asset wrapper (or in Blender) before final placement. The terrain tile spans approximately 24 x 24 units.\n\n## Important limitations\n\n- The astronaut is a static stylized model; rigging and animation clips are not included. Add a rigged character model or animate a custom skeleton in Blender.\n- Interior room sets and detailed interactive equipment are not included yet; building models are exterior/blockout-to-mid-detail assets.\n- Models use vertex colors and simple geometry. Apply the supplied textures or upgrade materials for final art direction.\n- The terrain is a single tile. Add neighboring tiles, scatter props, and LODs for a larger world.\n\n## License and credits\n\nAll included meshes and textures in this pack were generated procedurally for this project during this session. No third-party model or texture downloads are included, so there are no external asset creators to credit for these files. You may adapt these original pack assets for Lunar Command. Review any separately added third-party assets under their own licenses.\n\nSee `ASSET_MANIFEST.json` for machine-readable inventory and `ASSET_CREDITS.md` for the source/credit record.\n'''
open(os.path.join(ROOT,'README.md'),'w').write(readme)
open(os.path.join(ROOT,'ASSET_CREDITS.md'),'w').write('''# Asset credits and licenses\n\nAll 3D meshes and texture images included in this pack were procedurally generated specifically for the Lunar Command project. No third-party downloadable assets were bundled.\n\n- Source: Original procedural generation\n- Third-party creators: None for the included files\n- License: Original project assets; may be adapted within Lunar Command\n\nIf you add assets from NASA, Sketchfab, Poly Haven, Kenney, or another library, record the exact asset title, creator, source URL, license, and required attribution here before shipping. NASA branding and imagery should follow NASA's media usage guidelines.\n''')
# simple inventory preview image
im=Image.new('RGB',(1200,800),(24,31,45)); d=ImageDraw.Draw(im)
d.text((50,35),'LUNAR COMMAND  |  STYLIZED 3D ASSET PACK',fill=(240,245,250))
labels=['Lunar terrain tile','Habitat module','Greenhouse dome','Research laboratory','Radiation shelter','Life support station','Power station','Astronaut','Lunar rover','Communication antenna','Solar array','Landing pad']
for i,l in enumerate(labels):
 x=50+(i%3)*380;y=110+(i//3)*165
 d.rounded_rectangle((x,y,x+340,y+125),radius=14,fill=(44,57,76),outline=(85,116,145),width=2)
 d.text((x+18,y+48),l,fill=(225,235,245))
 d.text((x+18,y+78),'GLB / procedural starter asset',fill=(140,180,195))
im.save(os.path.join(ROOT,'ASSET_PACK_OVERVIEW.png'))
# zip
zip_path='/mnt/data/Lunar_Command_Stylized_3D_Asset_Pack.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
 for dp,_,files in os.walk(ROOT):
  for f in files:
   p=os.path.join(dp,f); z.write(p,os.path.relpath(p,ROOT))
print('created',zip_path,'assets',len(assets),'size',os.path.getsize(zip_path))
for a in assets: print(a['path'])
