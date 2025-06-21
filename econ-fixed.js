// econ-fixed.js

import { logEvent } from "./notification.js";

export class EconomyManager {
  constructor() {
    this.resources = {
      gold: 1000,
      food: 500,
      wood: 300,
      iron: 200,
      copper: 150,
      uranium: 20,
      oil: 300,
      fuel: 150,
      diamonds: 5,
      supplies: 200,
      tickets: 0
    };

    this.productionRates = {
      food: 5,
      wood: 3,
      iron: 2,
      copper: 1.5,
      uranium: 0.1,
      oil: 2,
      fuel: 1,
      diamonds: 0.02,
      supplies: 3
    };

    this.consumptionRates = {
      food: 3,
      wood: 1.5,
      fuel: 0.8,
      supplies: 1
    };

    this.prices = {
      gold: 1,
      food: 1,
      wood: 1,
      iron: 1,
      copper: 1,
      uranium: 5,
      oil: 2,
      fuel: 2.5,
      diamonds: 20,
      supplies: 1.2
    };

    this.inflationRate = 0.01;
    this.tickInterval = 1000;
  }

  tick() {
    for (const res in this.productionRates) {
      const amount = this.productionRates[res];
      this.resources[res] += amount;
    }

    for (const res in this.consumptionRates) {
      const amount = this.consumptionRates[res];
      this.resources[res] = Math.max(0, this.resources[res] - amount);
    }

    this.handleTradeBalance();
    this.updateMarketPrices();
    this.checkTicketEarnings();
  }

  handleTradeBalance() {
    const surplus = this.resources.food + this.resources.wood + this.resources.iron + this.resources.oil;
    const deficit = this.resources.supplies < 50 || this.resources.fuel < 30;

    if (surplus > 1000 && !deficit) {
      const goldGain = surplus * 0.002;
      this.resources.gold += goldGain;
      logEvent(`💰 Trade surplus generated $${goldGain.toFixed(2)} gold`);
    }
  }

  updateMarketPrices() {
    for (const res in this.prices) {
      const scarcity = Math.max(0.01, 1000 - this.resources[res]);
      this.prices[res] = 1 + scarcity / 1000 + Math.random() * 0.1;
    }
    this.prices.diamonds = 20 + Math.random() * 5;
    this.prices.uranium = 5 + Math.random();
  }

  checkTicketEarnings() {
    if (this.resources.diamonds > 10) {
      this.resources.tickets += 1;
      this.resources.diamonds -= 10;
      logEvent("🎟️ Bonus ticket earned from excess diamond holdings!", { type: "success", importance: 2 });
    }
  }

  start() {
    setInterval(() => this.tick(), this.tickInterval);
  }

  getResourceStats() {
    return this.resources;
  }

  getPrice(resource) {
    return this.prices[resource] || 1;
  }

  purchase(resource, quantity, ticketMode = false) {
    const totalCost = this.getPrice(resource) * quantity;
    if (ticketMode) {
      const ticketCost = Math.ceil(totalCost / 5);
      if (this.resources.tickets >= ticketCost) {
        this.resources.tickets -= ticketCost;
        this.resources[resource] = (this.resources[resource] || 0) + quantity;
        logEvent(`🎟️ Purchased ${quantity} ${resource} with ${ticketCost} ticket(s)!`, { type: "success" });
        return true;
      } else {
        logEvent(`❌ Not enough tickets to buy ${resource}`, { type: "error" });
        return false;
      }
    } else if (this.resources.gold >= totalCost) {
      this.resources.gold -= totalCost;
      this.resources[resource] = (this.resources[resource] || 0) + quantity;
      logEvent(`🛒 Purchased ${quantity} ${resource} for $${totalCost.toFixed(2)} gold`);
      return true;
    } else {
      logEvent(`❌ Not enough gold to buy ${resource}`, { type: "error" });
      return false;
    }
  }
}

export const economyManager = new EconomyManager();
