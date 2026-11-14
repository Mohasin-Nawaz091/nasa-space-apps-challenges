# Lunar Command — Simulation Rules & Mathematical Model

This document defines the mathematical, deterministic rules driving the daily simulation engine in **Lunar Command**.

> [!NOTE]
> All parameters are calibrated for a balanced, educational 10-day survival loop for ages 7–12. While grounded in NASA technical studies (Artemis Foundation, Lunar Surface Innovation Initiative, and ISS life support metrics), gameplay values are simplified simulation parameters.

---

## 1. State Variables & Units

| Resource | Unit | Starting Value | Max Capacity | Critical Threshold |
|---|---|---|---|---|
| **Power (Battery)** | Kilowatt-hours (kWh) | 250 | 500 | < 20 (Brownout) / 0 (Blackout) |
| **Oxygen** | Kilograms ($O_2$) | 150 | 300 | < 25 (Hypoxia risk) |
| **Water** | Liters ($H_2O$) | 200 | 400 | < 30 (Dehydration risk) |
| **Food** | Rations (Nutrient Packs) | 90 | 200 | < 15 (Malnutrition risk) |
| **Spare Materials**| Tech Modules / Regolith Mix | 35 | 100 | < 5 (Cannot repair) |
| **Research Progress**| Science Discovery Points | 0 | 100 | Target: $\ge 60$ for certification |

### Crew Health & Risk Tracking
- **Crew Count:** 3 Astronauts
- **Health per Astronaut:** 0% to 100% (Starts at 100%)
- **Cumulative Radiation Exposure:** Millisieverts ($mSv$) (Modeled simulation risk metric; Safe: < 20 mSv, Caution: 20–50 mSv, Danger: > 50 mSv)
- **Sheltered Status:** Boolean (True / False)

---

## 2. Daily Calculation Equations

Each simulated day progresses in discrete deterministic execution steps:

### 2.1 Power Balance
$$\text{Generation} = \text{BaseSolar} \times \text{SunlightFactor} \times (\text{Condition}_{\text{solar}} / 100) \times \text{DustMultiplier}$$
Where:
- $\text{BaseSolar} = 140\text{ kWh/day}$
- $\text{SunlightFactor} = 1.0$ (South Pole peak illuminated hill), drops to $0.4$ if shadow or solar dust event occurs
- $\text{DustMultiplier} = 1.0 - (\text{DustAccumulation} \times 0.25)$

$$\text{Consumption} = \sum \text{BuildingPowerConsumption}$$
- Habitat: $25\text{ kWh}$
- Life Support: $35\text{ kWh} \times \text{IntensityFactor}$
- Greenhouse: $20\text{ kWh} \times \text{GrowLightSetting}$
- Science Lab: $25\text{ kWh}$ (if active research is on)
- Shielding/Shelter: $10\text{ kWh}$ ($25\text{ kWh}$ when sealed in lockdown mode)

$$\text{Power}_{t+1} = \text{clamp}(\text{Power}_t + \text{Generation} - \text{Consumption}, 0, \text{MaxCapacity})$$

### 2.2 Oxygen Balance
$$\text{OxygenProduced} = \text{LifeSupportRate} \times (\text{Condition}_{\text{LS}} / 100) \times \text{IntensityFactor} + \text{GreenhouseO2Bonus}$$
- Base $\text{LifeSupportRate} = 15\text{ kg/day}$
- $\text{GreenhouseO2Bonus} = 3\text{ kg/day}$ (photosynthesis by algae & plants)
$$\text{OxygenConsumed} = \text{CrewCount} \times 3.0\text{ kg/person/day} = 9.0\text{ kg/day}$$
$$\text{Oxygen}_{t+1} = \text{clamp}(\text{Oxygen}_t + \text{Produced} - \text{Consumed}, 0, \text{MaxCapacity})$$

### 2.3 Water Balance
$$\text{WaterRecycled} = \text{RecycleEfficiency} \times \text{WaterConsumedLastDay}$$
- $\text{RecycleEfficiency} = 0.90$ (90% closed loop recycling efficiency with filtration)
$$\text{WaterConsumed} = (\text{CrewCount} \times 4.0\text{ L/day}) + \text{GreenhouseIrrigation}$$
- $\text{GreenhouseIrrigation} = 8\text{ L/day} \times \text{GrowIntensity}$
$$\text{Water}_{t+1} = \text{clamp}(\text{Water}_t + \text{WaterRecycled} - \text{WaterConsumed}, 0, \text{MaxCapacity})$$

### 2.4 Food Balance
$$\text{FoodProduced} = \text{BaseYield} \times \text{GrowIntensity} \times (\text{Condition}_{\text{greenhouse}} / 100)$$
- $\text{BaseYield} = 9\text{ rations/day}$
$$\text{FoodConsumed} = \text{CrewCount} \times 3\text{ rations/day} = 9\text{ rations/day}$$
$$\text{Food}_{t+1} = \text{clamp}(\text{Food}_t + \text{FoodProduced} - \text{FoodConsumed}, 0, \text{MaxCapacity})$$

### 2.5 Crew Health & Radiation Calculations
If any resource is depleted:
- Zero Power: $-10\%$ health/day (heating systems fail, emergency heaters only)
- Zero Oxygen: $-35\%$ health/day (hypoxia emergency)
- Zero Water: $-20\%$ health/day (severe dehydration)
- Zero Food: $-10\%$ health/day (starvation weakness)

During a Solar Radiation Event:
- If astronauts are in **Radiation Shelter**: Exposure increase $= +1.5\text{ mSv/day}$ (well shielded by 2m regolith). Health penalty: $0\%$.
- If astronauts are **Outside / In Habitat**: Exposure increase $= +25.0\text{ mSv/day}$. Health penalty: $-15\%$ from acute radiation nausea.

---

## 3. Seeded Random Events Sequence

To ensure reproducibility in scientific challenges while supporting variable replays, scenarios use a deterministic pseudo-random seed (default: `MISSION-ARTEMIS-2026`).

| Day | Event Key | Description | Player Decision | Trade-off / Consequence |
|---|---|---|---|---|
| 1 | `ARRIVAL_POWER_UP` | Initial base activation | Power routing priority | Safe start vs quick research push |
| 2 | `ICE_PROSPECTING` | Water ice detected in crater | Deploy rover or conserve energy | $+15\text{ L } H_2O$ vs $20\text{ kWh}$ battery |
| 3 | `REGOLITH_DUST_STORM`| Electrostatic levitated dust coatings | EVA brush panels vs Delay | Consumes 5 materials + crew time vs -40% solar power |
| 4 | `DEEP_CORE_EXPERIMENT`| Breakthrough lunar geology sample | High-power mass spectrometer | Earn 25 science vs risk battery depletion |
| 5 | `SOLAR_CME_ALERT` | DONKI detects coronal mass ejection | Evacuate crew to Bunker vs Continue | Crew safe (100% health) vs 1 day research lost |
| 6 | `FILTER_MEMBRANE_TEAR`| Life support water loop leaks | Fast patch with spare parts | Cost 8 materials vs lose 30 L water |
| 7 | `HYDROPONIC_BLIGHT` | Algae nutrient imbalance in greenhouse | Flush system or isolate tray | Temporary food drop vs heavy water expenditure |
| 8 | `ROVER_SURVEY_MISSION`| Deep crater exploration | Send Dr. Tanaka & Sarah | +20 Research, discover rare titanium regolith |
| 9 | `BATTERY_CELL_OVERHEAT`| High thermal load on inverters | Throttle non-critical base systems | Slows operations vs prevents catastrophic battery loss |
| 10| `CERTIFICATION_DAY` | Mission completion & NASA telemetry | Transmit all findings to Houston | Final score calculation & evaluation badge |

---

## 4. Victory, Failure & Scoring Model

### Victory Conditions:
- Survive Day 10 with all 3 astronauts alive and base operational.
- Reach at least 60 Research Progress points.

### Failure (Emergency Abort):
- Any astronaut health drops to $0\%$.
- Total oxygen reaches $0$ for $> 1$ full day.
- Total power reaches $0$ with battery depleted for $> 1$ full day during sub-zero thermal night.

### Mission Score Equation (Max 1000 pts):
$$\text{Score} = (\text{DaysSurviving} \times 50) + (\text{AvgCrewHealth} \times 2) + (\text{ResearchPoints} \times 2.5) + (\text{ResourceEfficiencyBonus}) + (\text{SafetyProtocolsFollowedBonus})$$

- **Rankings:**
  - **900 – 1000:** Master Lunar Commander (Gold Artemis Laurel)
  - **750 – 899:** Senior Lunar Outpost Engineer (Silver Wing)
  - **600 – 749:** Certified Junior Astronaut (Bronze Pin)
  - **< 600:** Needs Flight Simulation Retest (Simulator Debrief)
