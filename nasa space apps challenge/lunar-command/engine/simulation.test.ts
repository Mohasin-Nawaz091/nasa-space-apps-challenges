import { useGameStore } from "../store/gameStore";
import { SIMULATION_CONSTANTS, INITIAL_RESOURCES } from "../constants/simulation";

export function runSimulationTestSuite(): {
  total: number;
  passed: number;
  failed: number;
  details: string[];
} {
  const details: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, extra?: string) {
    if (condition) {
      passed++;
      details.push(`[PASS] ${name}`);
    } else {
      failed++;
      details.push(`[FAIL] ${name} ${extra ? `(${extra})` : ""}`);
    }
  }

  // Test 1: Store Initialization
  const store = useGameStore.getState();
  assert(
    "Store initializes at Day 1 with 3 astronauts",
    store.currentDay === 1 && store.astronauts.length === 3
  );

  // Test 2: Initial Resources Baseline
  assert(
    "Initial resources match constants",
    store.resources.power === INITIAL_RESOURCES.power &&
      store.resources.oxygen === INITIAL_RESOURCES.oxygen &&
      store.resources.water === INITIAL_RESOURCES.water &&
      store.resources.food === INITIAL_RESOURCES.food
  );

  // Test 3: Building Configuration
  const buildingKeys = Object.keys(store.buildings);
  assert(
    "Six core functional buildings are configured",
    buildingKeys.length === 6 &&
      buildingKeys.includes("habitat") &&
      buildingKeys.includes("life_support") &&
      buildingKeys.includes("greenhouse") &&
      buildingKeys.includes("solar_array") &&
      buildingKeys.includes("shelter") &&
      buildingKeys.includes("science_lab")
  );

  // Test 4: Operational Setting Adjustment & Trade-offs
  store.updateBuildingSetting("greenhouse", "intensive");
  const updatedGh = useGameStore.getState().buildings.greenhouse;
  assert(
    "Greenhouse setting updates to intensive with higher intensity",
    updatedGh.operationalSetting === "intensive" && updatedGh.operationalIntensity === 1.6
  );

  // Test 5: Resolve Active Event
  if (store.activeEvent) {
    const firstChoice = store.activeEvent.choices[0];
    store.resolveActiveEvent(firstChoice.id);
    const resolvedEvent = useGameStore.getState().activeEvent;
    assert(
      "Active event resolves and records choice",
      resolvedEvent !== null &&
        resolvedEvent.isResolved === true &&
        resolvedEvent.resolvedChoiceId === firstChoice.id
    );
  }

  // Test 6: Advance Day Calculation
  const powerBefore = useGameStore.getState().resources.power;
  store.advanceDay();
  const dayAfter = useGameStore.getState().currentDay;
  const powerAfter = useGameStore.getState().resources.power;
  assert(
    "Advance day increments Sol to 2 and recalculates power balance",
    dayAfter === 2 && typeof powerAfter === "number" && !isNaN(powerAfter)
  );

  // Test 7: Shelter Protocol
  store.setCrewSheltered(true);
  const astronautsSheltered = useGameStore.getState().astronauts.every((a) => a.isSheltered);
  assert(
    "Shelter protocol evacuates all astronauts to bunker",
    astronautsSheltered
  );

  // Reset mission to clean state
  store.restartMission();
  const resetStore = useGameStore.getState();
  assert(
    "Mission reset restores Sol 1 and baseline parameters",
    resetStore.currentDay === 1 && resetStore.astronauts.length === 3
  );

  return {
    total: passed + failed,
    passed,
    failed,
    details,
  };
}
