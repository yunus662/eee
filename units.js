// units.js

import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

import { logEvent } from "./notification.js";
import { revealFogAt } from "./fog.js";

export const allUnits = [];

export function createUnit(type, latlng, iconUrl, map, isAI = false) {
  const icon = L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const marker = L.marker(latlng, {
    icon,
    draggable: false
  }).addTo(map);

  marker.unitType = type;
  marker.health = 100;
  marker.maxHealth = 100;
  marker.isAlive = true;
  marker.isAI = isAI;

  marker.bindTooltip(`${type} (HP: ${marker.health})`, {
    permanent: false,
    direction: "top"
  });

  allUnits.push(marker);
  return marker;
}

export function moveUnitTo(unit, destination, type, map) {
  if (!unit || !destination || !map || !unit.isAlive) return;

  const duration = 1000;
  const steps = 20;
  const [startLat, startLng] = [unit.getLatLng().lat, unit.getLatLng().lng];
  const [endLat, endLng] = destination;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const lat = startLat + ((endLat - startLat) * step) / steps;
    const lng = startLng + ((endLng - startLng) * step) / steps;
    unit.setLatLng([lat, lng]);

    revealFogAt([lat, lng]);

    if (step >= steps) {
      clearInterval(interval);
      logEvent(`✅ ${type} arrived at destination.`);
    }
  }, duration / steps);
}

