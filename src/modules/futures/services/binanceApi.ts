import axiosClient from './axiosClient';

export interface SymbolPriceResponse {
  symbol: string;
  price: string;
}

export interface AveragePriceResponse {
  mins: number;
  price: string;
}

/** Fetch the latest price for a trading pair. */
export const fetchSymbolPrice = (symbol: string) =>
  axiosClient.get<SymbolPriceResponse>(`/ticker/price?symbol=${symbol}`);

/** Fetch the average price for a trading pair over the last five minutes. */
export const fetchAveragePrice = (symbol: string) =>
  axiosClient.get<AveragePriceResponse>(`/avgPrice?symbol=${symbol}`);

export interface Ticker24hrResponse {
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

/** Fetch 24 hour statistics for a trading pair. */
export const fetchTicker24hr = (symbol: string) =>
  axiosClient.get<Ticker24hrResponse>(`/ticker/24hr?symbol=${symbol}`);

export type KlineData = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

/**
 * Fetch historical candlestick data for a trading pair and interval.
 * limit defaults to 500.
 */
export const fetchKlines = (
  symbol: string,
  interval: string,
  limit = 500,
) =>
  axiosClient.get<KlineData[]>(
    `/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  );

export async function fetchAllTickers() {
  try {
    const response = await axiosClient.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return [];
  }
}
