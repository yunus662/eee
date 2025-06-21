// econ-fixed.js

// Import our notification helper (using dynamic import so that dependencies aren’t tangled at startup).
// (You can also import it statically if you prefer, as long as your module loader setup supports it.)
import { logEvent } from './notifications.js';

/**
 * EconomyManager simulates an advanced economic system.
 * It models resource production, consumption, and market fluctuations.
 */
export class EconomyManager {
  constructor() {
    // Initial resource stocks.
    this.resources = {
      gold: 1000,
      food: 500,
      wood: 300,
    };

    // Market prices and inflation.
    this.market = {
      goldPrice: 1.0,
      foodPrice: 1.0,
      woodPrice: 1.0,
      inflationRate: 0.02, // base inflation rate per tick
    };

    // Base production and consumption rates per tick.
    this.production = {
      food: 10,
      wood: 5,
    };

    this.consumption = {
      food: 8,
      wood: 2,
    };

    // Multipliers to simulate temporary boosts or slowdowns.
    this.multipliers = {
      productionBoost: 1.0,
      consumptionFactor: 1.0,
    };

    // Time management for the simulation loop.
    this.tickInterval = 1000; // 1 second per simulation tick (adjust as needed)
    this.lastTick = Date.now();
  }

  // Log an economic event using our notification system.
  logEconomyEvent(message, importance = 1) {
    logEvent(message, { type: 'info', duration: 5000, importance });
  }

  // Simulate one tick of the economy.
  tick() {
    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    // Food: Increase by production and decrease by consumption.
    const foodProduced = this.production.food * this.multipliers.productionBoost;
    const foodConsumed = this.consumption.food * this.multipliers.consumptionFactor;
    this.resources.food += foodProduced - foodConsumed;

    // Wood: Similarly process wood production and consumption.
    const woodProduced = this.production.wood * this.multipliers.productionBoost;
    const woodConsumed = this.consumption.wood * this.multipliers.consumptionFactor;
    this.resources.wood += woodProduced - woodConsumed;

    // Gold changes according to a simple trade surplus/deficit model.
    const tradeBalance = (foodProduced - foodConsumed) * 0.1 +
                         (woodProduced - woodConsumed) * 0.2;
    this.resources.gold += tradeBalance;

    // Update market prices based on resource availability.
    // The less of a resource, the higher its price (and vice versa).
    this.market.foodPrice = 1.0 + (500 - this.resources.food) / 1000;
    this.market.woodPrice = 1.0 + (300 - this.resources.wood) / 1000;
    // Simulate inflation: gold becomes relatively more expensive over time.
    this.market.goldPrice *= (1 + this.market.inflationRate * (delta / 1000));

    // Log an economic event if the trade balance is dramatically positive or negative.
    if (Math.abs(tradeBalance) > 5) {
      this.logEconomyEvent(`Economic shift: trade balance of ${tradeBalance.toFixed(2)} units.`, 2);
    }
  }

  // Start the economy simulation running continuously.
  startSimulation() {
    this.simulationInterval = setInterval(() => this.tick(), this.tickInterval);
  }

  // Stop the simulation.
  stopSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
  }

  // Retrieve current economic status for display or further processing.
  getStatus() {
    return {
      resources: this.resources,
      market: this.market,
    };
  }
}

// Create a singleton instance for easy access.
export const economyManager = new EconomyManager();
