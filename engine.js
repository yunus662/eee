// Import your game modules
import { loadCities, attachCityMarkers } from "./cities-global.js";
import { logEvent } from "./notification.js";
import { UnitTypes } from "./units.js";
import { getDoctrine } from "./doctrine.js";
import { getGovernment } from "./government.js";
// Optional future modules
// import { resolveCombat } from "./combat.js";
// import { updateEconomy } from "./economy.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Engine loaded");

  // Initialize map
  const map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Load and place cities
  try {
    const cities = await loadCities();
    attachCityMarkers(map, cities);
    logEvent(`🌆 Loaded ${cities.length} cities`);
  } catch (err) {
    console.error("Failed to load cities:", err);
    logEvent("❌ Failed to load cities");
  }

  // Create player unit
  const unitEl = document.getElementById("unit1");
  const unit = new Unit(unitEl, map);
  unit.setPosition([30, 0]); // Starting position

  // Click sound
  const clickSound = document.getElementById("click-sound");
  unitEl.addEventListener("click", () => {
    if (clickSound) clickSound.play();
    logEvent("🪖 Unit clicked");
  });

  // Doctrine and government
  const doctrine = getDoctrine("aggressive");
  const government = getGovernment("republic");
  logEvent(`📜 Doctrine: ${doctrine.name}`);
  logEvent(`🏛️ Government: ${government.name}`);

  // AI loop (placeholder)
  setInterval(() => {
    logEvent("🤖 AI is thinking...");
    // Future AI logic here
  }, 5000);

  // Hide loading screen
  const loading = document.getElementById("loading-screen");
  if (loading) loading.style.display = "none";
});
