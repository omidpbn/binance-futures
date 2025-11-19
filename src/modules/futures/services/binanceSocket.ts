export interface MiniTickerData {
  e: string;
  E: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
}

/**
 * Subscribe to mini ticker updates for the provided symbols.
 * Returns the WebSocket instance so callers can close the connection.
 */
export const subscribeToMiniTicker = (
  symbols: string[],
  onMessage: (data: MiniTickerData) => void,
): WebSocket => {
  const streams = symbols.map((s) => `${s.toLowerCase()}@miniTicker`).join('/');
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${streams}`,
  );

  ws.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);
      const data: MiniTickerData = json.data;
      onMessage(data);
    } catch (err) {
      console.error('WebSocket Message Error:', err);
    }
  };

  ws.onerror = (event) => {
    console.error('WebSocket Error:', event);
  };

  ws.onclose = () => {
    console.warn('WebSocket Closed.');
  };

  return ws;
};

export interface TradeData {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
}

export const subscribeToTrade = (
  symbol: string,
  onMessage: (data: TradeData) => void,
): WebSocket => {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`,
  );
  ws.onmessage = (event) => {
    try {
      const data: TradeData = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('WebSocket Message Error:', err);
    }
  };
  ws.onerror = () => {
    console.error('WebSocket connection failed');
  };
  ws.onclose = () => console.warn('WebSocket Closed.');
  return ws;
};

export interface KlineMessage {
  e: string;
  E: number;
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: string;
    f: number;
    L: number;
    o: string;
    c: string;
    h: string;
    l: string;
    v: string;
    n: number;
    x: boolean;
    q: string;
    V: string;
    Q: string;
    B: string;
  };
}

export const subscribeToKline = (
  symbol: string,
  interval: string,
  onMessage: (data: KlineMessage) => void,
): WebSocket => {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`,
  );
  ws.onmessage = (event) => {
    try {
      const data: KlineMessage = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('WebSocket Message Error:', err);
    }
  };
  ws.onerror = () => {
    console.error('WebSocket connection failed');
  };
  ws.onclose = () => console.warn('WebSocket Closed.');
  return ws;
};

export interface DepthMessage {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
}

export const subscribeToDepth = (
  symbol: string,
  onMessage: (data: DepthMessage) => void,
): WebSocket => {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`,
  );
  ws.onmessage = (event) => {
    try {
      const data: DepthMessage = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('WebSocket Message Error:', err);
    }
  };
  ws.onerror = () => {
    console.error('WebSocket connection failed');
  };
  ws.onclose = () => console.warn('WebSocket Closed.');
  return ws;
};
