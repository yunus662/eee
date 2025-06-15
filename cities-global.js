export async function loadCities() {
  const res = await fetch("data/cities.json");
  const cities = await res.json();
  return cities;
}

export function attachCityMarkers(map, cities) {
  cities.forEach(city => {
    const icon = L.divIcon({
      className: city.type === "capital" ? "capital-icon" : "city-icon",
      iconSize: [22, 22]
    });

    const marker = L.marker([city.lat, city.lon], { icon }).addTo(map);

    marker.on("click", () => {
      const pop = Number(city.population).toLocaleString();
      const info = `🏙️ <strong>${city.name}</strong><br>
        Country: ${city.country}<br>
        Type: ${city.type}<br>
        Population: ${pop}`;
      const infoBox = document.getElementById("infoBox");
      infoBox.innerHTML = info;
    });
  });
}
