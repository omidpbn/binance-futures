export interface OrderRowType {
  price: number;
  qty: number;
  sum: number;
}
export interface BinanceDepth {
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
}

export interface BinanceOrderBookSnapshot {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface BinanceDepthUpdate {
  e: "depthUpdate";
  E: number; // event time
  s: string; // symbol
  U: number; // first update ID in event
  u: number; // final update ID in event
  b: [string, string][]; // bids [[price, qty]]
  a: [string, string][]; // asks [[price, qty]]
}

export interface BinanceTicker {
  e: "24hrTicker";
  s: string;
  c: string; // close price
  P: string; // percent change
  p: string; // price change
  h: string; // high
  l: string; // low
  v: string; // volume
  q: string; // quote volume
}

export type BinancePayload = BinanceDepthUpdate | BinanceTicker;
