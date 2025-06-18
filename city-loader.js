import cities from './cities.json' assert { type: 'json' };
import { cityRules } from './city-rules.js';

function getRulesForCountry(code) {
  for (const tier in cityRules) {
    if (cityRules[tier].countries.includes(code)) {
      return cityRules[tier].rules;
    }
  }
  return {
    infrastructureLevel: 1,
    hasRealRoads: false,
    roadDensity: 1,
    economicMultiplier: 1.0
  };
}

export function getCitiesWithRules() {
  return cities.map(country => {
    const rules = getRulesForCountry(country.code);
    return {
      ...country,
      cities: country.cities.map(city => ({ ...city, ...rules }))
    };
  });
}
