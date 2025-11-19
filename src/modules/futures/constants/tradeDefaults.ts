export const TIMEFRAMES = ["1s", "15m", "1H", "4H", "1D", "1W"] as const;
export type Interval = typeof TIMEFRAMES[number];
export const DEFAULT_INTERVAL: Interval = '1H';
