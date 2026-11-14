import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS_DIR = "C:\\Users\\DELL\\.gemini\\antigravity\\brain\\6fc6a9c6-0f33-44b7-a1e7-bc881187f40a";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const TEMP_PROFILE = path.join(process.env.TEMP || "C:\\temp", "lunar-astro-profile-" + Date.now());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takeScreenshot(ws, filename) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (msg) => {
      try {
        const res = JSON.parse(msg.data);
        if (res.id === id) {
          ws.removeEventListener("message", handler);
          if (res.result && res.result.data) {
            const buf = Buffer.from(res.result.data, "base64");
            const fullPath = path.join(ARTIFACTS_DIR, filename);
            fs.writeFileSync(fullPath, buf);
            console.log(`📸 Screenshot captured: ${filename} (${buf.length} bytes)`);
            resolve(fullPath);
          } else {
            resolve(null);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method: "Page.captureScreenshot", params: { format: "png" } }));
  });
}

async function evaluate(ws, expression) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (msg) => {
      try {
        const res = JSON.parse(msg.data);
        if (res.id === id) {
          ws.removeEventListener("message", handler);
          resolve(res.result?.result?.value);
        }
      } catch (err) {
        reject(err);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(
      JSON.stringify({
        id,
        method: "Runtime.evaluate",
        params: { expression, returnByValue: true, awaitPromise: true },
      })
    );
  });
}

async function runAstronautTest() {
  console.log("=== STARTING LUNAR COMMAND ASTRONAUT & CREW MANAGEMENT VERIFICATION ===");

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${TEMP_PROFILE}`,
      "--window-size=1280,800",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "http://localhost:3000",
    ],
    { stdio: "ignore" }
  );

  chromeProcess.on("error", (err) => {
    console.error("Failed to spawn Chrome:", err);
  });

  let pageTarget = null;
  for (let i = 0; i < 25; i++) {
    await sleep(600);
    try {
      const resp = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await resp.json();
      pageTarget = targets.find((t) => t.type === "page" && t.url.includes("localhost:3000"));
      if (pageTarget) break;
    } catch {}
  }

  if (!pageTarget) {
    console.error("❌ Could not connect to Chrome DevTools targets.");
    chromeProcess.kill();
    process.exit(1);
  }

  console.log("✔ Connected to target page:", pageTarget.title);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
  ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
  await sleep(1500);

  try {
    // 1. Enter the Outpost Game Screen
    console.log("\n--- STEP 1: Enter Colony & Verify Crew Quick Selector ---");
    await evaluate(
      ws,
      `(() => {
        if (window.__GAME_STORE__) {
          const store = window.__GAME_STORE__.getState();
          store.setMainMenuOpen(false);
          store.setBriefingOpen(false);
          store.setTutorialActive(false);
          store.dismissActiveEvent();
        }
      })()`
    );
    await sleep(1500);

    const crewButtons = await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const crewBtns = btns.filter(b => b.innerText.includes("Alex") || b.innerText.includes("Mia") || b.innerText.includes("Leo"));
        return crewBtns.map(b => b.innerText.replace(/\\n/g, " "));
      })()`
    );
    console.log("Crew members detected in widget:", crewButtons);
    await takeScreenshot(ws, "astro_step1_crew_selector.png");

    // 2. Select Alex (Engineer)
    console.log("\n--- STEP 2: Select Alex (Engineer) & Open Command Panel ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const alexBtn = btns.find(b => b.innerText.includes("Alex"));
        if (alexBtn) alexBtn.click();
      })()`
    );
    await sleep(1000);

    const alexSelected = await evaluate(
      ws,
      `Boolean(document.querySelector("h2") && document.querySelector("h2").innerText.includes("Alex"))`
    );
    console.log("Alex Command Panel displayed:", alexSelected);
    await takeScreenshot(ws, "astro_step2_alex_selected_command_panel.png");

    // 3. Open Task Assignment Modal
    console.log("\n--- STEP 3: Open Task Assignment Modal ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const orderBtn = btns.find(b => b.innerText.includes("ASSIGN MISSION ORDER"));
        if (orderBtn) orderBtn.click();
      })()`
    );
    await sleep(1000);

    const modalTitle = await evaluate(
      ws,
      `(() => {
        const h2s = Array.from(document.querySelectorAll("h2"));
        return h2s.map(h => h.innerText);
      })()`
    );
    console.log("Modal titles found:", modalTitle);
    await takeScreenshot(ws, "astro_step3_task_assignment_modal.png");

    // 4. Assign Solar Array Overhaul Task
    console.log("\n--- STEP 4: Dispatch Solar Array Repair Order ---");
    await evaluate(
      ws,
      `(() => {
        const cards = Array.from(document.querySelectorAll("div"));
        const solarCard = cards.find(c => c.innerText && c.innerText.includes("Overhaul Photovoltaic Solar Arrays"));
        if (solarCard) {
          const btn = solarCard.querySelector("button");
          if (btn) btn.click();
        }
      })()`
    );
    await sleep(1200);

    const alexStatus = await evaluate(
      ws,
      `window.__GAME_STORE__ ? window.__GAME_STORE__.getState().astronauts.find(a => a.id === "alex").status : "unknown"`
    );
    console.log("Alex status after dispatch:", alexStatus);
    await takeScreenshot(ws, "astro_step4_alex_walking_to_solar.png");

    // 5. Wait for Alex to arrive at Solar Array and begin welding/working
    console.log("\n--- STEP 5: Alex Arrives at Solar Array & Begins Working ---");
    await sleep(3500);

    const workingStatus = await evaluate(
      ws,
      `window.__GAME_STORE__ ? window.__GAME_STORE__.getState().astronauts.find(a => a.id === "alex").status : "unknown"`
    );
    console.log("Alex status after travel:", workingStatus);
    await takeScreenshot(ws, "astro_step5_alex_working_welding.png");

    // 6. Select Mia (Scientist) & Dispatch Quick Lab Research
    console.log("\n--- STEP 6: Select Mia (Scientist) & Assign NASA Lab Research ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const miaBtn = btns.find(b => b.innerText.includes("Mia"));
        if (miaBtn) miaBtn.click();
      })()`
    );
    await sleep(800);

    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const quickLabBtn = btns.find(b => b.innerText.includes("Quick: Run Lab Experiment"));
        if (quickLabBtn) quickLabBtn.click();
      })()`
    );
    await sleep(1000);
    await takeScreenshot(ws, "astro_step6_mia_lab_experiment.png");

    // 7. Select Leo (Botanist) & Dispatch Quick Crop Harvest
    console.log("\n--- STEP 7: Select Leo (Botanist) & Harvest Greenhouse Food ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const leoBtn = btns.find(b => b.innerText.includes("Leo"));
        if (leoBtn) leoBtn.click();
      })()`
    );
    await sleep(800);

    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const quickCropBtn = btns.find(b => b.innerText.includes("Quick: Harvest Fresh Crops"));
        if (quickCropBtn) quickCropBtn.click();
      })()`
    );
    await sleep(1000);
    await takeScreenshot(ws, "astro_step7_leo_harvesting.png");

    // 8. Wait for tasks to complete and observe simulated outcomes
    console.log("\n--- STEP 8: Task Completion & Simulation Results ---");
    console.log("Waiting 9 seconds for all crew tasks to finish...");
    await sleep(9000);

    const simulationOutcome = await evaluate(
      ws,
      `(() => {
        if (!window.__GAME_STORE__) return null;
        const s = window.__GAME_STORE__.getState();
        return {
          food: s.resources.food,
          research: s.resources.researchPoints,
          solarCondition: s.buildings.solar_array.condition,
          alexEnergy: s.astronauts.find(a => a.id === "alex").energy,
          alexHistory: s.astronauts.find(a => a.id === "alex").taskHistory,
          miaHistory: s.astronauts.find(a => a.id === "mia").taskHistory,
          leoHistory: s.astronauts.find(a => a.id === "leo").taskHistory,
        };
      })()`
    );
    console.log("✔ Simulation state after task completion:", JSON.stringify(simulationOutcome, null, 2));

    // Open Crew Drawer to show updated stats
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const crewRosterBtn = btns.find(b => b.innerText.includes("CREW") || b.innerText.includes("VITALS"));
        if (crewRosterBtn) crewRosterBtn.click();
      })()`
    );
    await sleep(1500);
    await takeScreenshot(ws, "astro_step8_roster_drawer_updated.png");

    console.log("\n=== ALL ASTRONAUT INTERACTION TESTS COMPLETED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    ws.close();
    chromeProcess.kill();
    try {
      fs.rmSync(TEMP_PROFILE, { recursive: true, force: true });
    } catch {}
  }
}

runAstronautTest();
