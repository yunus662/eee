// packed-features.js
import { fullCountryData } from "./countries.js";
import { logEvent } from "./notification.js";

let currentNation = null;
const nations = {};

export function initCountrySystem(map) {
  createNationMenu();

  fullCountryData.forEach(c => {
    const income = estimateIncome(c.gdp);
    const treasury = estimateStartingTreasury(c.gdp);
    const cityCount = estimateCityCount(c);
    nations[c.name] = {
      ...c,
      treasury,
      dailyIncome: income,
      infraLevel: 1,
      atWarWith: [],
      cities: Array.from({ length: cityCount }, (_, i) => `City ${i + 1}`),
      units: []
    };
  });

  setInterval(() => {
    if (currentNation) {
      const nation = nations[currentNation];
      nation.treasury += nation.dailyIncome * nation.infraLevel;
    }
  }, 10000);
}

function createNationMenu() {
  const menu = document.createElement("select");
  menu.id = "country-selector";
  fullCountryData.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    menu.appendChild(opt);
  });

  const go = document.createElement("button");
  go.textContent = "Start Game";
  go.onclick = () => {
    const pick = menu.value;
    currentNation = pick;
    logEvent(`🌍 You are now leading ${pick}`);
    showNationPortfolio(pick);
  };
  document.body.append(menu, go);
}

export function upgradeInfrastructure() {
  const nation = nations[currentNation];
  if (!nation) return;
  const cost = nation.infraLevel * 500000;
  if (nation.treasury >= cost) {
    nation.treasury -= cost;
    nation.infraLevel += 1;
    logEvent(`🛠️ ${nation.name} upgraded infrastructure to level ${nation.infraLevel}`);
  } else {
    logEvent(`⚠️ Not enough funds`);
  }
}

export function declareWar(targetName) {
  const nation = nations[currentNation];
  const target = nations[targetName];
  if (!nation || !target) return;
  if (!nation.atWarWith.includes(targetName)) {
    nation.atWarWith.push(targetName);
    logEvent(`⚔️ ${nation.name} declared war on ${targetName}`);
  }
}

export function makePeace(targetName) {
  const nation = nations[currentNation];
  nation.atWarWith = nation.atWarWith.filter(name => name !== targetName);
  logEvent(`🕊️ ${nation.name} made peace with ${targetName}`);
}

export function showNationPortfolio(nationName) {
  const stats = nations[nationName];
  if (!stats) return;
  const box = document.createElement("div");
  box.id = "nation-portfolio";
  box.style.position = "absolute";
  box.style.top = "10px";
  box.style.right = "10px";
  box.style.background = "#fff";
  box.style.padding = "10px";
  box.style.border = "1px solid black";

  box.innerHTML = `
    <h3>${stats.name} Portfolio</h3>
    <p>Population: ${stats.population.toLocaleString()}</p>
    <p>GDP: $${stats.gdp.toFixed(2)}B</p>
    <p>Daily Income: $${stats.dailyIncome.toLocaleString()}</p>
    <p>Treasury: $${stats.treasury.toLocaleString()}</p>
    <p>Infrastructure Level: ${stats.infraLevel}</p>
    <p>Cities: ${stats.cities.length}</p>
  `;

  document.body.appendChild(box);
}

export function getNationData(name) {
  return nations[name];
}

export function getAllCities() {
  return Object.values(nations).flatMap(n =>
    n.cities.map((c, i) => ({
      name: c,
      nation: n.name,
      latlng: [Math.random() * 140 - 70, Math.random() * 360 - 180] // placeholder
    }))
  );
}

function estimateIncome(gdp) {
  if (gdp > 10000) return 20000000;
  if (gdp > 1000) return 5000000;
  if (gdp > 100) return 1000000;
  return 100000;
}

function estimateStartingTreasury(gdp) {
  if (gdp > 10000) return 1000000000;
  if (gdp > 1000) return 300000000;
  if (gdp > 100) return 80000000;
  return 20000000;
}

function estimateCityCount(c) {
  const { gdp, population } = c;
  if (gdp > 15000 || population > 500000000) return 90;
  if (gdp > 1000) return 60;
  if (gdp > 100) return 30;
  return 10;
}
