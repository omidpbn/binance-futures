"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CrosshairMode,
  LineStyle,
  CandlestickData,
  HistogramData,
  UTCTimestamp,
} from "lightweight-charts";

import { KlineAPI } from "@/modules/futures/services/futuresService";
import TradingChartHeader from "../../molecules/tradingChartHeader";
import ChartCanvas from "../../molecules/ChartCanvas";
import { calculateMA, calculateVolMA, formatNumber, formatTime, formatVol, toSec } from "@/modules/futures/utils/chart";

const symbol = "BTCUSDT";
const intervals = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"];

const TradingChart: React.FC = () => {
  const [interval, setInterval] = useState("1m");
  const [activeTab, setActiveTab] = useState("0");

  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);

  const seriesRef = useRef<{
    candle?: ISeriesApi<"Candlestick">;
    volume?: ISeriesApi<"Histogram">;
    ma7?: ISeriesApi<"Line">;
    ma25?: ISeriesApi<"Line">;
    ma99?: ISeriesApi<"Line">;
    volMa5?: ISeriesApi<"Line">;
    volMa10?: ISeriesApi<"Line">;
  }>({});

  const dataRef = useRef<{
    candles: CandlestickData<UTCTimestamp>[];
    volumes: HistogramData<UTCTimestamp>[];
  }>({ candles: [], volumes: [] });

  const maRef = useRef<{
    ma7: { time: UTCTimestamp; value: number }[];
    ma25: { time: UTCTimestamp; value: number }[];
    ma99: { time: UTCTimestamp; value: number }[];
    volMa5: { time: UTCTimestamp; value: number }[];
    volMa10: { time: UTCTimestamp; value: number }[];
  }>({ ma7: [], ma25: [], ma99: [], volMa5: [], volMa10: [] });

  const crosshairRef = useRef<{
    time?: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    ma7?: number;
    ma25?: number;
    ma99?: number;
    volMa5?: number;
    volMa10?: number;
  }>({});

  const [crosshair, setCrosshair] = useState<typeof crosshairRef.current | null>(null);

  // layout heights & dragging
  const initialRatio = 0.75;
  const [mainHeight, setMainHeight] = useState<number>(600);
  const [volumeHeight, setVolumeHeight] = useState<number>(200);
  const [volumeTop, setVolumeTop] = useState<number>(400);
  const draggingRef = useRef(false);

  // expose a stable updateCrosshair to avoid stale closures
  const updateCrosshairRef = useRef<(param: any) => void>(() => {});
  useEffect(() => {
    updateCrosshairRef.current = (param: any) => {
      const candles = dataRef.current.candles;
      const volumes = dataRef.current.volumes;
      if (!param?.time) {
        const lastCandle = candles[candles.length - 1];
        const lastVol = volumes[volumes.length - 1];
        if (lastCandle && lastVol) {
          const obj = {
            time: lastCandle.time as number,
            open: Number(lastCandle.open),
            high: Number(lastCandle.high),
            low: Number(lastCandle.low),
            close: Number(lastCandle.close),
            volume: Number(lastVol.value),
            ma7: maRef.current.ma7.find((m) => m.time === lastCandle.time)?.value || 0,
            ma25: maRef.current.ma25.find((m) => m.time === lastCandle.time)?.value || 0,
            ma99: maRef.current.ma99.find((m) => m.time === lastCandle.time)?.value || 0,
            volMa5: maRef.current.volMa5.find((m) => m.time === lastVol.time)?.value || 0,
            volMa10: maRef.current.volMa10.find((m) => m.time === lastVol.time)?.value || 0,
          };
          crosshairRef.current = obj;
          setCrosshair(obj);
        }
        return;
      }

      const t = param.time;
      const candle = candles.find((c) => c.time === t);
      const vol = volumes.find((v) => v.time === t);
      if (candle && vol) {
        const obj = {
          time: t,
          open: Number(candle.open),
          high: Number(candle.high),
          low: Number(candle.low),
          close: Number(candle.close),
          volume: Number(vol.value),
          ma7: maRef.current.ma7.find((m) => m.time === t)?.value || 0,
          ma25: maRef.current.ma25.find((m) => m.time === t)?.value || 0,
          ma99: maRef.current.ma99.find((m) => m.time === t)?.value || 0,
          volMa5: maRef.current.volMa5.find((m) => m.time === t)?.value || 0,
          volMa10: maRef.current.volMa10.find((m) => m.time === t)?.value || 0,
        };
        crosshairRef.current = obj;
        setCrosshair(obj);
      }
    };
  }, []);

  // chart creation (once)
  useEffect(() => {
    if (!chartContainerRef.current || !volumeContainerRef.current || !chartWrapperRef.current) return;

    const totalH = chartWrapperRef.current.clientHeight || 800;
    const mainH = Math.max(80, Math.round(totalH * initialRatio));
    const volH = Math.max(40, totalH - mainH);
    setMainHeight(mainH);
    setVolumeHeight(volH);
    setVolumeTop(mainH);

    // main chart
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "#14151A" }, textColor: "#D1D4DC" },
      grid: { vertLines: { color: "#2A2E39" }, horzLines: { color: "#2A2E39" } },
      width: chartContainerRef.current.clientWidth,
      height: mainH,
      rightPriceScale: { borderColor: "#2A2E39", scaleMargins: { top: 0.15, bottom: 0.2 }, visible: true },
      leftPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: "#758696", style: LineStyle.Solid, labelBackgroundColor: "#363A45" },
        horzLine: { width: 1, color: "#758696", style: LineStyle.Solid, labelBackgroundColor: "#363A45" },
      },
    });
    chartRef.current = chart;

    // volume chart
    const vChart = createChart(volumeContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "#14151A" }, textColor: "#D1D4DC" },
      grid: { vertLines: { color: "#2A2E39" }, horzLines: { color: "#2A2E39" } },
      width: volumeContainerRef.current.clientWidth,
      height: volH,
      rightPriceScale: { visible: true, borderColor: "#2A2E39", scaleMargins: { top: 0.2, bottom: 0 } },
      leftPriceScale: { visible: false },
      timeScale: { visible: true, borderColor: "#2A2E39", timeVisible: true, secondsVisible: false },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#758696", width: 1, style: LineStyle.Solid, labelBackgroundColor: "#363A45" },
        horzLine: { visible: false },
      },
    });
    volumeChartRef.current = vChart;

    // series
    seriesRef.current.candle = chart.addCandlestickSeries({
      upColor: "#26A69A",
      downColor: "#EF5350",
      borderVisible: false,
      wickUpColor: "#26A69A",
      wickDownColor: "#EF5350",
      priceLineVisible: true,
      priceLineWidth: 1,
      lastValueVisible: true,
    });

    seriesRef.current.volume = vChart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "" });

    seriesRef.current.ma7 = chart.addLineSeries({ color: "#F0B90B", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    seriesRef.current.ma25 = chart.addLineSeries({ color: "#FF9F40", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    seriesRef.current.ma99 = chart.addLineSeries({ color: "#AF47D2", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });

    seriesRef.current.volMa5 = vChart.addLineSeries({ color: "#5FC3D7", lineWidth: 1 });
    seriesRef.current.volMa10 = vChart.addLineSeries({ color: "#D63864", lineWidth: 1 });

    // sync visible range
    const visibleChangedHandler = () => {
      const range = chart.timeScale().getVisibleRange();
      if (range && volumeChartRef.current) {
        try {
          volumeChartRef.current.timeScale().setVisibleRange(range);
        } catch {}
      }
    };
    chart.timeScale().subscribeVisibleTimeRangeChange(visibleChangedHandler);

    // crosshair move subscription (both charts)
    const onCrosshair = (param: any) => {
      updateCrosshairRef.current(param);
    };
    chart.subscribeCrosshairMove(onCrosshair);
    vChart.subscribeCrosshairMove(onCrosshair);

    // resize observer to keep charts responsive and heights consistent
    const handleResize = () => {
      if (!chartWrapperRef.current || !chartContainerRef.current || !volumeContainerRef.current) return;
      const total = chartWrapperRef.current.clientHeight;
      const ratio = mainHeight / Math.max(1, mainHeight + volumeHeight);
      const newMain = Math.max(80, Math.round(total * ratio));
      const newVol = Math.max(40, total - newMain);
      chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: newMain });
      vChart.applyOptions({ width: volumeContainerRef.current.clientWidth, height: newVol });
      setMainHeight(newMain);
      setVolumeHeight(newVol);
      setVolumeTop(newMain);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(chartWrapperRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      chart.remove();
      vChart.remove();
      chartRef.current = null;
      volumeChartRef.current = null;
    };
  }, []);

  // fetch historical klines
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await KlineAPI.getKlines(symbol, interval, 500);
        if (!active) return;
        const mappedCandles = res.data.map((d) => ({
          time: toSec(d[0]) as UTCTimestamp,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        const mappedVols = res.data.map((d) => ({
          time: toSec(d[0]) as UTCTimestamp,
          value: parseFloat(d[5]),
          color: parseFloat(d[1]) <= parseFloat(d[4]) ? "#26A69A" : "#EF5350",
        }));

        dataRef.current.candles = mappedCandles;
        dataRef.current.volumes = mappedVols;

        // compute MA
        maRef.current.ma7 = calculateMA(mappedCandles, 7);
        maRef.current.ma25 = calculateMA(mappedCandles, 25);
        maRef.current.ma99 = calculateMA(mappedCandles, 99);
        maRef.current.volMa5 = calculateVolMA(mappedVols, 5);
        maRef.current.volMa10 = calculateVolMA(mappedVols, 10);

        // set to series
        seriesRef.current.candle?.setData(mappedCandles);
        // apply color with some alpha for bars if desired (hex + '40' = ~25% opacity)
        seriesRef.current.volume?.setData(mappedVols.map((v) => ({ ...v, color: v.color + "40" })));
        seriesRef.current.ma7?.setData(maRef.current.ma7);
        seriesRef.current.ma25?.setData(maRef.current.ma25);
        seriesRef.current.ma99?.setData(maRef.current.ma99);
        seriesRef.current.volMa5?.setData(maRef.current.volMa5);
        seriesRef.current.volMa10?.setData(maRef.current.volMa10);

        // update crosshair to last
        updateCrosshairRef.current(null);
      } catch (e) {
        console.error("Failed to load klines", e);
      }
    })();

    return () => {
      active = false;
    };
  }, [interval]);

  // divider dragging between main & volume
  const onDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    const startY = e.clientY;
    const startMain = mainHeight;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY;
      if (!chartWrapperRef.current) return;
      const total = chartWrapperRef.current.clientHeight;
      let newMain = startMain + delta;
      newMain = Math.max(80, Math.min(newMain, total - 40));
      const newVol = total - newMain;
      if (chartRef.current && volumeChartRef.current && chartContainerRef.current && volumeContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: newMain });
        volumeChartRef.current.applyOptions({ width: volumeContainerRef.current.clientWidth, height: newVol });
        setMainHeight(newMain);
        setVolumeHeight(newVol);
        setVolumeTop(newMain);
      }
    };

    const onUp = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <>
      <TradingChartHeader activeTab={activeTab} setActiveTab={setActiveTab} interval={interval} setInterval={setInterval} intervals={intervals} />
      <ChartCanvas
        chartWrapperRef={chartWrapperRef}
        chartContainerRef={chartContainerRef}
        mainHeight={mainHeight}
        onDividerMouseDown={onDividerMouseDown}
        volumeContainerRef={volumeContainerRef}
        volumeHeight={volumeHeight}
        crosshair={crosshair}
        formatTime={formatTime}
        formatNumber={formatNumber}
        volumeTop={volumeTop}
        formatVol={formatVol}
      />
    </>
  );
};

export default TradingChart;
