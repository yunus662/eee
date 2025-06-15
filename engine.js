console.log("Engine loaded");
import { loadCities, attachCityMarkers } from "./cities-global.js";
import { UnitTypes } from "./units.js";
import { Doctrines } from "./doctrine.js";
import { Governments } from "./government.js";

const map = L.map("map").setView([20, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const infoBox = document.getElementById("infoBox");
const unit = document.getElementById("unit1");

let countries = {};
let geoLayer;

// Load world borders
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then((res) => res.json())
  .then((data) => {
    geoLayer = L.geoJSON(data, {
      style: () => ({
        color: "#999",
        weight: 1,
        fillColor: "#4fa",
        fillOpacity: 0.5
      }),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        countries[name] = {
          name,
          capital: name + " City",
          population: Math.floor(Math.random() * 150_000_000 + 5_000_000),
          owner: name,
          color: "#4fa",
          ai: {
            aggression: Math.random(),
            diplomacy: Math.random(),
            fear: 0,
            alliances: [],
            enemies: [],
            instability: Math.random(),
            ideology: ["Capitalist", "Socialist", "Nationalist", "Religious", "Green", "Globalist"][
              Math.floor(Math.random() * 6)
            ]
          },
          doctrine: Object.values(Doctrines)[Math.floor(Math.random() * 4)],
          government: Object.values(Governments)[Math.floor(Math.random() * 7)]
        };
        layer.on("click", () => {
          const c = countries[name];
          infoBox.innerHTML = `
            <strong>${c.name}</strong><br>
            Capital: ${c.capital}<br>
            Pop: ${c.population.toLocaleString()}<br>
            Gov: ${c.government.name}<br>
            Ideology: ${c.ai.ideology}<br>
            Stability: ${(1 - c.government.corruption - c.ai.instability).toFixed(2)}
          `;
        });
      }
    }).addTo(map);
  });

// Position player unit
map.whenReady(() => {
  const center = map.latLngToContainerPoint([10, 20]);
  unit.style.left = `${center.x - 18}px`;
  unit.style.top = `${center.y - 18}px`;

  // Load cities after map is ready
  loadCities().then((cities) => {
    attachCityMarkers(map, cities);

    // Add tooltips and flags to city icons
    setTimeout(() => {
      document.querySelectorAll(".city-icon, .capital-icon").forEach((el) => {
        const name = el.getAttribute("data-name");
        if (name) {
          const tooltip = document.createElement("div");
          tooltip.className = "tooltip";
          tooltip.textContent = name;
          el.appendChild(tooltip);
        }

        const flag = document.createElement("div");
        flag.className = "city-flag";
        flag.style.backgroundImage = "url('flags/default.png')";
        el.appendChild(flag);
      });
    }, 500);
  });
});

// Drag unit
unit.addEventListener("dragend", (e) => {
  const rect = map.getContainer().getBoundingClientRect();
  const x = e.pageX - rect.left;
  const y = e.pageY - rect.top;
  unit.style.left = `${x - 18}px`;
  unit.style.top = `${y - 18}px`;
});

// AI Tick Loop
setInterval(() => {
  for (const name in countries) {
    const c = countries[name];
    const ai = c.ai;
    if (c.owner !== "PlayerNation") {
      const roll = Math.random();
      if (roll < ai.aggression * 0.03) {
        const rivals = Object.values(countries).filter((t) => t.owner !== c.name);
        const target = rivals[Math.floor(Math.random() * rivals.length)];
        if (target) {
          ai.enemies.push(target.name);
          logEvent(`${c.name} declares war on ${target.name}`);
        }
      }
      if (roll > 0.95 && ai.diplomacy > 0.5) {
        const allies = Object.values(countries).filter((t) => !ai.alliances.includes(t.name));
        const ally = allies[Math.floor(Math.random() * allies.length)];
        if (ally) {
          ai.alliances.push(ally.name);
          logEvent(`${c.name} allies with ${ally.name}`);
        }
      }
      if (ai.instability > 0.6 && Math.random() < 0.1) {
        logEvent(`🚨 Insurgency outbreak in ${c.name}!`);
      }
    }
  }
}, 10_000);

// Optional: click sound
document.addEventListener("click", () => {
  const audio = document.getElementById("click-sound");
  if (audio) audio.play();
});
