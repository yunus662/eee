import { Doctrines } from "./doctrine.js";
import { Governments } from "./government.js";
import { logEvent } from "./notification.js";
import { LoadCities } from "./cities-global.js";
import { getCombatStats } from "./combat.js";
import { createUnit, moveUnitTo } from "./units.js";
import { createFogLayer } from "./fog.js";
import { StartGameClock } from "./time-engine.js";
import { TradeGoods } from "./economy.js";
import { aiNations } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Attach cities
  if (typeof attachCityMarkers === "function") {
    attachCityMarkers(map);
  }

  // Fog of war
  const { reveal } = createFogLayer(map);

  // Click sound
  const clickSound = new Audio("sounds/click.mp3");
  clickSound.volume = 0.5;

  // Units
  const infantry = createUnit("infantry", [-1.3, 36.8], "icons/infantry.png", map); // Nairobi
  const aircraft = createUnit("aircraft", [30, 0], "icons/aircraft.png", map);
  const warship = createUnit("warship", [0, 30], "icons/warship.png", map);
  const tradeShip = createUnit("trade", [0, 40], "icons/trade-ship.png", map);
  const helicopter = createUnit("helicopter", [5, 35], "icons/helicopter.png", map);

  // Unit selection and global movement
  let selectedUnit = null;

  [infantry, aircraft, warship, tradeShip, helicopter].forEach(unit => {
    unit.on("click", (e) => {
      clickSound.play();
      selectedUnit = unit;
      logEvent(`🧭 Selected ${unit.unitType} for movement.`);
      e.originalEvent.stopPropagation();
    });
  });

  map.on("click", (e) => {
    if (selectedUnit) {
      const dest = [e.latlng.lat, e.latlng.lng];
      moveUnitTo(selectedUnit, dest, selectedUnit.unitType, map);
      logEvent(`🛰️ ${selectedUnit.unitType} moving to [${dest[0].toFixed(2)}, ${dest[1].toFixed(2)}].`);
      selectedUnit = null;
    }
  });

  // Reveal fog around infantry every few seconds
  setInterval(() => {
    reveal(infantry.getLatLng());
  }, 5000);

  // Doctrine and government
  const doctrine = getDoctrine("aggressive");
  const government = getGovernment("republic");
  logEvent(`📜 Doctrine: ${doctrine.name}`);
  logEvent(`🏛️ Government: ${government.name}`);

  // AI
  initAI(map);

  // Game clock and economy
  startGameClock((gameMinutes) => {
    if (gameMinutes % 1440 === 0) {
      produceResources();
      logEvent("📆 A new in-game day has begun.");
    }
  });

  // Hide loading screen
  const loading = document.getElementById("loading-screen");
  if (loading) loading.style.display = "none";
});
