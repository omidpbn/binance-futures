interface OrderRowType {
  price: number;
  qty: number;
  sum: number;
}

interface BinanceDepth {
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
}

interface BinanceOrderBookSnapshot {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}
