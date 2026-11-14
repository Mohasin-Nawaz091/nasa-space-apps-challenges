# NASA Data Sources & Scientific Grounding

Lunar Command integrates NASA open-science datasets and mission telemetry to teach children ages 7–12 real aerospace engineering principles. This document provides scientific transparency and attributes each data source.

---

## 1. NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)

- **Source:** NASA Space Weather Research Center (SWRC) / Community Coordinated Modeling Center (CCMC)
- **Official URL:** [https://ccmc.gsfc.nasa.gov/tools/DONKI/](https://ccmc.gsfc.nasa.gov/tools/DONKI/)
- **API Endpoint:** `https://api.nasa.gov/DONKI/CME`
- **In-Game Service:** Server-side route `/api/nasa/donki`
- **What It Measures:** Coronal Mass Ejections (CMEs), solar flare classifications (C, M, X-class), solar energetic particle (SEP) speed, and interplanetary trajectory vectors.
- **How It Is Used in Game:** 
  - On Day 5, an emergency space weather event triggers based on modeled CME telemetry.
  - Demonstrates that space weather can be forecasted from solar observation satellites (SOHO, STEREO, GOES).
- **Scientific Integrity Note:** 
  > [!IMPORTANT]
  > A DONKI observation of a coronal mass ejection does *not* directly yield an astronaut radiation dose measurement. Radiation dosage on the lunar surface is calculated in the simulation engine using simplified Artemis radiation risk models (~25 mSv for acute unshielded exposure vs ~1.5 mSv inside 2 meters of sintered regolith).

---

## 2. NASA RadLab (Radiation Laboratory Data & Analysis Platform)

- **Source:** NASA Open Science Data Repository (OSDR) / GeneLab
- **Official URL:** [https://visualization.osdr.nasa.gov/radlab/gui/data-api/](https://visualization.osdr.nasa.gov/radlab/gui/data-api/)
- **What It Measures:** Ionizing radiation telemetry from active dosimeters aboard the International Space Station (ISS) in Low Earth Orbit (LEO).
- **How It Is Used in Game:**
  - Educational reference in the Science Glossary and mission reports.
- **Scientific Integrity Note:**
  > [!NOTE]
  > RadLab dosimeter data reflects radiation *inside Low Earth Orbit*, where Earth's magnetosphere absorbs the majority of cosmic rays. On the Moon's surface, there is no magnetosphere; astronauts face both Galactic Cosmic Rays (GCRs) and direct Solar Particle Events (SPEs), requiring heavy regolith shielding.

---

## 3. NASA Open Science Data Repository (OSDR) & Space Biology

- **Source:** NASA Biological and Physical Sciences Division
- **Official URL:** [https://osdr.nasa.gov/bio/repo/](https://osdr.nasa.gov/bio/repo/)
- **What It Measures:** Plant growth kinetics, microgreens nutrition, LED photosynthetic action spectrums, and root zone moisture in the Veggie and Advanced Plant Habitat (APH) systems.
- **How It Is Used in Game:**
  - Calibrates the Bio-Regenerative Greenhouse facility simulation (water recycling, O2 replenishment, and purple/magenta LED spectrum grow lighting).
  - Demonstrates that space agriculture produces fresh vitamins and psychologically boosts astronaut morale while recycling carbon dioxide.

---

## 4. Lunar Reconnaissance Orbiter (LRO) & LCROSS

- **Source:** NASA Goddard Space Flight Center / NASA Ames
- **Official URL:** [https://www.nasa.gov/mission_pages/LRO/main/index.html](https://www.nasa.gov/mission_pages/LRO/main/index.html)
- **What It Measures:** Lunar South Pole topographical maps (LOLA instrument), surface thermal profiles (Diviner instrument), and volatile ice signatures (LAMP / LCROSS impactor).
- **How It Is Used in Game:**
  - South Pole terrain modeling: Shackleton crater rim topography with high sunlit ridges and permanently shadowed interior cold traps (-230°C) containing water ice.
  - Rover ice-drilling excursion mechanics on Day 2.

---

## 5. Scientific Labeling System in UI

Every piece of data in Lunar Command is strictly categorized into one of five transparent labels:
1. **Live NASA Data:** Retrieved directly from active NASA API feeds.
2. **Historical NASA Data:** Recorded from past missions (Apollo, LCROSS, SOHO).
3. **Curated Scientific Reference:** Grounded in peer-reviewed aerospace studies.
4. **Fictional Simulation Event:** Game scenario created for dramatic decision-making.
5. **Simplified Simulation Parameter:** Numerical game values tuned for kid-friendly learning rather than spacecraft flight certification.
