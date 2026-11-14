import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    references: [
      {
        id: "radlab_iss_dosimetry",
        dataset: "NASA RadLab / GeneLab",
        sourceUrl: "https://visualization.osdr.nasa.gov/radlab/gui/data-api/",
        title: "ISS Active Dosimetry Benchmarks",
        scientificDistinction:
          "Educational reference only. ISS astronauts are inside low Earth orbit within the magnetosphere (~0.5-0.8 mSv/day). The Moon has NO magnetosphere, where galactic cosmic ray surface flux ranges ~0.8-1.5 mSv/day and solar particle events can reach hundreds of mSv.",
        keyFinding:
          "Active shielding (water walls or sintered regolith) is critical for lunar habitats beyond Earth's magnetic bubble.",
      },
      {
        id: "osdr_space_crop_genetics",
        dataset: "NASA Open Science Data Repository (OSDR)",
        sourceUrl: "https://osdr.nasa.gov/bio/repo/",
        title: "Microgravity Crop Physiology & Nutrient Dynamics",
        scientificDistinction:
          "Studies from Veggie, APH (Advanced Plant Habitat), and spaceflight Arabidopsis experiments.",
        keyFinding:
          "Aeroponic nutrient delivery reduces water consumption by up to 95% compared to conventional soil agriculture.",
      },
      {
        id: "lro_diviner_water_ice",
        dataset: "NASA Lunar Reconnaissance Orbiter (LRO) Diviner / LCROSS",
        sourceUrl: "https://www.nasa.gov/mission_pages/LRO/main/index.html",
        title: "Permanently Shadowed Polar Cold Traps",
        scientificDistinction:
          "Direct planetary satellite measurements of thermal temperatures down to 25 Kelvin in South Pole craters.",
        keyFinding:
          "Billions of kilograms of water ice exist near the lunar south pole, extractable for life support and LOX/LH2 propellant.",
      },
    ],
  });
}
