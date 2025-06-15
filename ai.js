// ai.js
import { logEvent } from "./notification.js";
import { createUnit, moveUnitTo } from "./units.js";

const aiNations = [
  {
    name: "Zarovia",
    color: "red",
    units: [],
    resources: { money: 800, materials: 500 },
    aggression: 0.6,
    territory: [[10, 30], [12, 32], [14, 34]],
  }
];

export function initAI(map) {
  aiNations.forEach(nation => {
    const unit = createUnit("infantry", nation.territory[0], "icons/ai-infantry.png", nation.color, map);
    nation.units.push(unit);
    logEvent(`🤖 ${nation.name} deployed a unit.`);
  });

  setInterval(() => {
    aiNations.forEach(nation => {
      const decision = Math.random();

      if (decision < nation.aggression) {
        const unit = nation.units[0];
        const target = nation.territory[Math.floor(Math.random() * nation.territory.length)];
        moveUnitTo(unit, target, "infantry");
        logEvent(`⚔️ ${nation.name} is repositioning forces.`);
      } else if (nation.resources.money > 500) {
        nation.resources.money -= 200;
        logEvent(`🏗️ ${nation.name} invested in infrastructure.`);
      }
    });
  }, 10000);
}
