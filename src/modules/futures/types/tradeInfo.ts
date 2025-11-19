export interface PremiumIndexResponse {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
}

export interface OpenInterestResponse {
  openInterest: string;
}

export interface TickerData {
  priceChange: string;
  changePercent: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  volume24hUSDT: string;
}

export interface MarketData {
  markPrice: string;
  indexPrice: string;
  fundingRate: string;
  nextFundingTime: number;
  openInterestUSDT: string;
}

export interface BinanceTicker {
  e: string;
  c: string;
  p: string;
  P: string;
  h: string;
  l: string;
  v: string;
  q: string;
}
