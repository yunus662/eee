// fog.js

let fogLayer;
let revealed = new Set();

export function createFogLayer(map) {
  fogLayer = L.tileLayer("", {
    pane: "overlayPane"
  }).addTo(map);

  return {
    reveal: (latlng) => revealFogAt(latlng)
  };
}

export function revealFogAt([lat, lng]) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  if (!revealed.has(key)) {
    revealed.add(key);
    // Optional: add visual fog-clearing logic here
    console.log(`🌫️ Fog revealed at ${key}`);
  }
}

