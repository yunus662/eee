import { logEvent } from "./notification.js";
export const TradeGoods = ["Fuel", "Supplies", "Rare Metals", "Consumer Goods"];

export function generateMarketOffers() {
  return TradeGoods.map(good => ({
    good,
    price: Math.floor(Math.random() * 100 + 50),
    quantity: Math.floor(Math.random() * 1000 + 100)
    export const economy = {
    
  money: 1000,
  food: 500,
  materials: 300,
  population: 100
};

export function produceResources() {
  economy.food += 5;
  economy.materials += 3;
  economy.money += 10;
}

  }));
}
