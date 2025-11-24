import { CandlestickData, HistogramData, UTCTimestamp } from "lightweight-charts";

export const toSec = (t: number) => Math.floor(t / 1000);

export const calculateMA = (data: CandlestickData<UTCTimestamp>[], period: number) => {
  const ma: { time: UTCTimestamp; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += Number(data[j].close);
    }
    ma.push({ time: data[i].time as UTCTimestamp, value: sum / period });
  }
  return ma;
};

export const calculateVolMA = (data: HistogramData<UTCTimestamp>[], period: number) => {
  const ma: { time: UTCTimestamp; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += Number(data[j].value);
    }
    ma.push({ time: data[i].time as UTCTimestamp, value: sum / period });
  }
  return ma;
};

export const formatTime = (t?: number) => {
  if (!t) return "";
  const d = new Date(t * 1000);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const formatNumber = (n: number | undefined, dec = 1) => {
  if (n === undefined) return "";
  return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
};

export const formatVol = (v: number | undefined) => {
  if (v === undefined) return "";
  if (v >= 1e6) return (v / 1e6).toFixed(3) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(3) + "K";
  return v.toFixed(2);
};
