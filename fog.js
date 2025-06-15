export function createFogLayer(map) {
  const fog = L.layerGroup().addTo(map);
  const revealed = new Set();

  function reveal(latlng, radius = 2) {
    const key = `${latlng.lat.toFixed(2)}:${latlng.lng.toFixed(2)}`;
    if (revealed.has(key)) return;
    revealed.add(key);

    const circle = L.circle(latlng, {
      radius: radius * 100000,
      color: "#000",
      fillColor: "#000",
      fillOpacity: 0.6,
      interactive: false
    });
    fog.addLayer(circle);
  }

  return { fog, reveal };
}
