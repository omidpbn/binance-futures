"use client";
import { useEffect, useState } from 'react';
import {
  subscribeToKline,
  KlineMessage,
} from '@/modules/futures/services/binanceSocket';
import { fetchKlines } from '@/modules/futures/services/binanceApi';
import { CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts';
import { DEFAULT_INTERVAL, Interval } from '@/modules/futures/constants/tradeDefaults';

const useLiveKline = (symbol: string) => {
  const [interval, setInterval] = useState<Interval>(DEFAULT_INTERVAL);
  const [candles, setCandles] = useState<CandlestickData[]>([]);
  const [volumes, setVolumes] = useState<HistogramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(false);
    fetchKlines(symbol, interval.toLowerCase(), 200)
      .then((res) => {
        const c = res.data.map((k) => ({
          time: Math.floor(k[0] / 1000) as UTCTimestamp,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        const v = res.data.map((k) => ({
          time: Math.floor(k[0] / 1000) as UTCTimestamp,
          value: parseFloat(k[5]),
          color: parseFloat(k[4]) >= parseFloat(k[1]) ? '#10b981' : '#ef4444',
        }));
        setCandles(c);
        setVolumes(v);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });

    const ws = subscribeToKline(symbol, interval.toLowerCase(), (msg: KlineMessage) => {
      const k = msg.k;
      setCandles((prev) => {
        const bar = {
          time: Math.floor(k.t / 1000) as UTCTimestamp,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };
        const last = prev[prev.length - 1];
        if (last && last.time === bar.time) {
          return [...prev.slice(0, -1), bar];
        }
        return [...prev.slice(-199), bar];
      });
      setVolumes((prev) => {
        const vol = {
          time: Math.floor(k.t / 1000) as UTCTimestamp,
          value: parseFloat(k.v),
          color: parseFloat(k.c) >= parseFloat(k.o) ? '#10b981' : '#ef4444',
        };
        const last = prev[prev.length - 1];
        if (last && last.time === vol.time) {
          return [...prev.slice(0, -1), vol];
        }
        return [...prev.slice(-199), vol];
      });
    });
    ws.onopen = () => setError(false);
    ws.onerror = () => setError(true);
    return () => ws.close();
  }, [symbol, interval, retry]);

  const retryConnect = () => setRetry((c) => c + 1);

  return {
    interval,
    setInterval,
    candles,
    volumes,
    loading,
    error,
    retryConnect,
  };
};

export default useLiveKline;
