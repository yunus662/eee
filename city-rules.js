export const cityRules = {
  rich: {
    countries: [
      "US", "DE", "JP", "GB", "FR", "CA", "AU", "KR", "NL", "SE",
      "CH", "NO", "FI", "AT", "BE", "IE", "SG", "IS", "LU", "DK",
      "NZ", "AE", "QA", "SA", "IL", "TW", "CZ", "SI", "EE", "LT",
      "LV", "MT", "CY"
    ],
    rules: {
      infrastructureLevel: 4,
      hasRealRoads: true,
      roadDensity: 4,
      economicMultiplier: 1.6
    }
  },
  middle: {
    countries: [
      "CN", "IN", "BR", "MX", "ID", "TR", "RU", "TH", "MY", "PH",
      "PL", "AR", "CL", "CO", "PE", "KZ", "EG", "ZA", "DZ", "IR",
      "MA", "VN", "RO", "UA", "SR", "GE", "AM", "AZ", "BO", "EC",
      "UY", "TN", "LB", "JO", "AL", "RS", "BA", "ME", "MK", "MD",
      "GH", "NG", "KE", "TZ", "PK", "BD", "LK", "MM", "KH", "LA",
      "MN", "FJ", "PG", "VU", "SB", "NA", "BW", "ZM", "ZW", "GN",
      "GA", "BJ", "CM", "SN", "ML", "BF", "TD", "NE", "CI", "RW",
      "MG", "LS", "SZ", "GT", "HN", "SV", "NI", "PA", "DO", "PY",
      "GY", "TT", "JM", "MU", "CV", "PS", "BI"
    ],
    rules: {
      infrastructureLevel: 2,
      hasRealRoads: true,
      roadDensity: 2,
      economicMultiplier: 1.2
    }
  },
  poor: {
    countries: [
      "AF", "HT", "YE", "SD", "SS", "CD", "CF", "SO", "ER", "SL",
      "LR", "GM", "MR", "DJ", "MW", "MZ", "UG", "TG", "GW", "KM",
      "NP", "BT", "CG", "GQ", "TO", "TV", "KI", "FM", "MH", "NR",
      "ST", "TL", "MG", "ET", "NG", "ML", "NE"
    ],
    rules: {
      infrastructureLevel: 1,
      hasRealRoads: false,
      roadDensity: 1,
      economicMultiplier: 0.8
    }
  }
};

