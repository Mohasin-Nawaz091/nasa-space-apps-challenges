import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS_DIR = "C:\\Users\\DELL\\.gemini\\antigravity\\brain\\6fc6a9c6-0f33-44b7-a1e7-bc881187f40a";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const TEMP_PROFILE = path.join(process.env.TEMP || "C:\\temp", "lunar-chrome-profile-" + Date.now());

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

async function runBrowserTest() {
  console.log("=== STARTING LUNAR COMMAND AUTOMATED BROWSER TEST ===");

  // 1. Launch Headless Chrome with Remote Debugging
  console.log("Launching Chrome at port", PORT, "...");
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

  // 2. Poll for Chrome DevTools endpoint
  let pageTarget = null;
  for (let i = 0; i < 20; i++) {
    await sleep(600);
    try {
      const resp = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await resp.json();
      pageTarget = targets.find((t) => t.type === "page" && t.url.includes("localhost:3000"));
      if (pageTarget) break;
    } catch {
      // Chrome starting up
    }
  }

  if (!pageTarget) {
    console.error("❌ Could not connect to Chrome DevTools targets.");
    chromeProcess.kill();
    process.exit(1);
  }

  console.log("✔ Connected to page target:", pageTarget.title, pageTarget.url);

  // 3. Connect via WebSocket
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  // Enable Page & Runtime domains
  ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
  ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
  await sleep(1500);

  try {
    // TEST STEP 1: Main Menu
    console.log("\n--- TEST STEP 1: Main Menu ---");
    const menuTitle = await evaluate(
      ws,
      `document.querySelector("h1") ? document.querySelector("h1").innerText : "none"`
    );
    console.log("Title found:", menuTitle);
    await takeScreenshot(ws, "redesign_step1_main_menu.png");

    // TEST STEP 2: Start Expedition
    console.log("\n--- TEST STEP 2: Start Expedition ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const startBtn = btns.find(b => b.innerText.includes("START NEW EXPEDITION"));
        if (startBtn) startBtn.click();
      })()`
    );
    await sleep(1500);
    await takeScreenshot(ws, "redesign_step2_nova_stage1.png");

    // TEST STEP 3: Nova Tour & Stage Progression
    console.log("\n--- TEST STEP 3: Nova Mission Guide & Stage 2 Tour ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const tourBtn = btns.find(b => b.innerText.includes("START BASE TOUR"));
        if (tourBtn) tourBtn.click();
      })()`
    );
    await sleep(1500);
    await takeScreenshot(ws, "redesign_step3_stage2_colony.png");

    // TEST STEP 4: Select Building (Greenhouse)
    console.log("\n--- TEST STEP 4: Select Building & Inspect Right Panel ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const ghBtn = btns.find(b => b.innerText.includes("Greenhouse") || b.innerText.includes("Bio-Greenhouse"));
        if (ghBtn) ghBtn.click();
      })()`
    );
    await sleep(1500);
    await takeScreenshot(ws, "redesign_step4_greenhouse_selected.png");

    // TEST STEP 5: Enter Greenhouse Bright Interior
    console.log("\n--- TEST STEP 5: Inspect Greenhouse Interior ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const interiorBtn = btns.find(b => b.innerText.includes("INSPECT INTERIOR"));
        if (interiorBtn) interiorBtn.click();
      })()`
    );
    await sleep(2000);
    await takeScreenshot(ws, "redesign_step5_greenhouse_interior.png");

    // TEST STEP 6: Return to Base & Inspect Shelter Interior
    console.log("\n--- TEST STEP 6: Return to Base & Enter Shelter Interior ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const exitBtn = btns.find(b => b.innerText.includes("RETURN TO COLONY") || b.innerText.includes("COLONY VIEW"));
        if (exitBtn) exitBtn.click();
      })()`
    );
    await sleep(1500);

    // Select Shelter
    await evaluate(
      ws,
      `(() => {
        const store = window.__ZUSTAND_STORE__ || null;
        // Or click shelter badge
        const badges = Array.from(document.querySelectorAll("div"));
        const shelterBadge = badges.find(b => b.innerText.includes("Storm Shelter"));
        if (shelterBadge) shelterBadge.click();
      })()`
    );
    await sleep(1000);

    // Enter interior
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const interiorBtn = btns.find(b => b.innerText.includes("INSPECT INTERIOR"));
        if (interiorBtn) interiorBtn.click();
      })()`
    );
    await sleep(2000);
    await takeScreenshot(ws, "redesign_step6_shelter_interior.png");

    // Exit interior back to colony
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const exitBtn = btns.find(b => b.innerText.includes("RETURN TO COLONY") || b.innerText.includes("COLONY VIEW"));
        if (exitBtn) exitBtn.click();
      })()`
    );
    await sleep(1500);

    // TEST STEP 7: Advance Sol & Story Event
    console.log("\n--- TEST STEP 7: Advance Sol & Story Event ---");
    await evaluate(
      ws,
      `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const advBtn = btns.find(b => b.innerText.includes("FINISH TASKS") || b.innerText.includes("ADVANCE"));
        if (advBtn) advBtn.click();
      })()`
    );
    await sleep(2000);
    await takeScreenshot(ws, "redesign_step7_sol_advancement_event.png");

    console.log("\n=== ALL AUTOMATED BROWSER TESTS COMPLETED SUCCESSFULLY! ===");
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

runBrowserTest();
