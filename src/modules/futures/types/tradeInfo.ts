interface PremiumIndexResponse {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
}

interface OpenInterestResponse {
  openInterest: string;
}

interface TickerData {
  priceChange: string;
  changePercent: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  volume24hUSDT: string;
}

interface MarketData {
  markPrice: string;
  indexPrice: string;
  fundingRate: string;
  nextFundingTime: number;
  openInterestUSDT: string;
}
