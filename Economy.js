export const TradeGoods = ["Fuel", "Supplies", "Rare Metals", "Consumer Goods"];

export function generateMarketOffers() {
  return TradeGoods.map(good => ({
    good,
    price: Math.floor(Math.random() * 100 + 50),
    quantity: Math.floor(Math.random() * 1000 + 100)
  }));
}
