"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, LineStyle, UTCTimestamp } from "lightweight-charts";

import { CandlestickData, HistogramData } from "lightweight-charts";
import { TIMEFRAMES } from "@/modules/futures/constants/tradeDefaults";
import useLiveKline from "@/modules/futures/hook/useLiveKline";

import TabSwitcher from "../../atoms/tabSwitcher";
import { CHART_TABS } from "@/modules/futures/constants/tabs";
import { ChartFullScreenIcon } from "../../atoms/illustrators/chartFullScreenIcon";

import { IoMdArrowDropdown } from "react-icons/io";
import { TimeToolsIcon } from "../../atoms/illustrators/timeToolsIcon";
import { MultiChartIcon } from "../../atoms/illustrators/multiChartIcon";
import { TechnicalIcon } from "../../atoms/illustrators/TechnicalIcon";
import { CandleIcon } from "../../atoms/illustrators/candleIcon";
import { ChartStyleIcon } from "../../atoms/illustrators/chartStyleIcon";
import { FastOrderIcon } from "../../atoms/illustrators/fastOrderIcon";

interface CrosshairData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  ma7: number;
  ma25: number;
  ma99: number;
  volMa5: number;
  volMa10: number;
}

const symbol = "BTCUSDT";
const intervals = TIMEFRAMES;

const ChartTabs: React.FC = () => {
  const { interval, setInterval, candles, volumes } = useLiveKline(symbol);

  const [activeTab, setActiveTab] = useState("0");
  const [crosshair, setCrosshair] = useState<CrosshairData | null>(null);
  const [ocExpanded, setOcExpanded] = useState(true);
  const [maExpanded, setMaExpanded] = useState(true);
  const [volExpanded, setVolExpanded] = useState(true);

  const initialRatio = 0.75;
  const [mainHeight, setMainHeight] = useState<number>(600);
  const [volumeHeight, setVolumeHeight] = useState<number>(200);
  const [volumeTop, setVolumeTop] = useState<number>(400);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const ma7SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ma25SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ma99SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const volMa5SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volMa10SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const ma7DataRef = useRef<{ time: UTCTimestamp; value: number }[]>([]);
  const ma25DataRef = useRef<{ time: UTCTimestamp; value: number }[]>([]);
  const ma99DataRef = useRef<{ time: UTCTimestamp; value: number }[]>([]);
  const volMa5DataRef = useRef<{ time: UTCTimestamp; value: number }[]>([]);
  const volMa10DataRef = useRef<{ time: UTCTimestamp; value: number }[]>([]);

  const draggingRef = useRef(false);

  const calculateMA = (data: CandlestickData[], period: number) => {
    const ma: { time: UTCTimestamp; value: number }[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
      ma.push({ time: data[i].time as UTCTimestamp, value: sum / period });
    }
    return ma;
  };

  const calculateVolMA = (data: HistogramData[], period: number) => {
    const ma: { time: UTCTimestamp; value: number }[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.value, 0);
      ma.push({ time: data[i].time as UTCTimestamp, value: sum / period });
    }
    return ma;
  };

  // Chart creation and setup (runs once on mount)
  useEffect(() => {
    if (!chartContainerRef.current || !volumeContainerRef.current || !chartWrapperRef.current) return;

    const chartEl = chartContainerRef.current;
    const volEl = volumeContainerRef.current;

    const totalH = chartWrapperRef.current.clientHeight;
    const mainH = Math.max(80, Math.round(totalH * initialRatio));
    const volH = Math.max(40, totalH - mainH);

    setMainHeight(mainH);
    setVolumeHeight(volH);
    setVolumeTop(mainH);

    chartEl.innerHTML = "";
    const chart = createChart(chartEl, {
      layout: { background: { type: ColorType.Solid, color: "#14151A" }, textColor: "#D1D4DC" },
      grid: { vertLines: { color: "#2A2E39" }, horzLines: { color: "#2A2E39" } },
      width: chartEl.clientWidth,
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

    const cs = chart.addCandlestickSeries({
      upColor: "#26A69A",
      downColor: "#EF5350",
      borderVisible: false,
      wickUpColor: "#26A69A",
      wickDownColor: "#EF5350",
      priceLineVisible: true,
      priceLineWidth: 1,
      lastValueVisible: true,
    });
    candlestickSeriesRef.current = cs;

    volEl.innerHTML = "";
    const vChart = createChart(volEl, {
      layout: { background: { type: ColorType.Solid, color: "#14151A" }, textColor: "#D1D4DC" },
      grid: { vertLines: { color: "#2A2E39" }, horzLines: { color: "#2A2E39" } },
      width: volEl.clientWidth,
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

    const vs = vChart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "" });
    volumeSeriesRef.current = vs;

    const visibleChangedHandler = () => {
      const range = chart.timeScale().getVisibleRange();
      if (range) {
        try {
          vChart.timeScale().setVisibleRange(range);
        } catch (e) {}
      }
    };
    chart.timeScale().subscribeVisibleTimeRangeChange(visibleChangedHandler);

    const updateCrosshair = (param: any) => {
      if (!param?.time) {
        const lastCandle = candles[candles.length - 1];
        const lastVol = volumes[volumes.length - 1];
        if (lastCandle && lastVol) {
          setCrosshair({
            time: lastCandle.time as number,
            open: lastCandle.open,
            high: lastCandle.high,
            low: lastCandle.low,
            close: lastCandle.close,
            volume: lastVol.value,
            quoteVolume: 0,
            ma7: ma7DataRef.current.find((m) => m.time === lastCandle.time)?.value || 0,
            ma25: ma25DataRef.current.find((m) => m.time === lastCandle.time)?.value || 0,
            ma99: ma99DataRef.current.find((m) => m.time === lastCandle.time)?.value || 0,
            volMa5: volMa5DataRef.current.find((m) => m.time === lastVol.time)?.value || 0,
            volMa10: volMa10DataRef.current.find((m) => m.time === lastVol.time)?.value || 0,
          });
        }
        return;
      }

      const candle = candles.find((c) => c.time === param.time);
      const vol = volumes.find((v) => v.time === param.time);
      if (candle && vol) {
        setCrosshair({
          time: candle.time as number,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: vol.value,
          quoteVolume: 0,
          ma7: ma7DataRef.current.find((m) => m.time === param.time)?.value || 0,
          ma25: ma25DataRef.current.find((m) => m.time === param.time)?.value || 0,
          ma99: ma99DataRef.current.find((m) => m.time === param.time)?.value || 0,
          volMa5: volMa5DataRef.current.find((m) => m.time === param.time)?.value || 0,
          volMa10: volMa10DataRef.current.find((m) => m.time === param.time)?.value || 0,
        });
      }
    };

    chart.subscribeCrosshairMove(updateCrosshair);
    vChart.subscribeCrosshairMove(updateCrosshair);

    const handleResize = () => {
      if (!chartWrapperRef.current || !chartContainerRef.current || !volumeContainerRef.current) return;
      const newTotalH = chartWrapperRef.current.clientHeight;
      const ratio = mainHeight / Math.max(1, mainHeight + volumeHeight);
      const newMainH = Math.max(80, Math.round(newTotalH * ratio));
      const newVolH = Math.max(40, newTotalH - newMainH);
      chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: newMainH });
      vChart.applyOptions({ width: volumeContainerRef.current.clientWidth, height: newVolH });
      setMainHeight(newMainH);
      setVolumeHeight(newVolH);
      setVolumeTop(newMainH);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(chartWrapperRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (volumeChartRef.current) {
        volumeChartRef.current.remove();
        volumeChartRef.current = null;
      }
    };
  }, []);

  // Data update (runs on data changes)
  useEffect(() => {
    if (candles.length === 0 || !chartRef.current || !volumeChartRef.current) return;

    candlestickSeriesRef.current?.setData(candles);

    const ma7 = calculateMA(candles, 7);
    const ma25 = calculateMA(candles, 25);
    const ma99 = calculateMA(candles, 99);
    ma7DataRef.current = ma7;
    ma25DataRef.current = ma25;
    ma99DataRef.current = ma99;

    if (!ma7SeriesRef.current)
      ma7SeriesRef.current = chartRef.current.addLineSeries({ color: "#F0B90B", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    if (!ma25SeriesRef.current)
      ma25SeriesRef.current = chartRef.current.addLineSeries({ color: "#FF9F40", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    if (!ma99SeriesRef.current)
      ma99SeriesRef.current = chartRef.current.addLineSeries({ color: "#AF47D2", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });

    ma7SeriesRef.current?.setData(ma7);
    ma25SeriesRef.current?.setData(ma25);
    ma99SeriesRef.current?.setData(ma99);

    volumeSeriesRef.current?.setData(volumes.map((v) => ({ ...v, color: v.color + "40" })));

    const volMa5 = calculateVolMA(volumes, 5);
    const volMa10 = calculateVolMA(volumes, 10);
    volMa5DataRef.current = volMa5;
    volMa10DataRef.current = volMa10;

    if (!volMa5SeriesRef.current) volMa5SeriesRef.current = volumeChartRef.current.addLineSeries({ color: "#5FC3D7", lineWidth: 1 });
    if (!volMa10SeriesRef.current) volMa10SeriesRef.current = volumeChartRef.current.addLineSeries({ color: "#D63864", lineWidth: 1 });

    volMa5SeriesRef.current?.setData(volMa5);
    volMa10SeriesRef.current?.setData(volMa10);

    // Update crosshair to last bar after data update
    const updateCrosshair = (param: any) => {}; // Placeholder, actual is in creation effect
    updateCrosshair(null); // But call the function from creation (it's closed over)
  }, [candles, volumes]);

  useEffect(() => {
    if (!chartRef.current || !volumeChartRef.current || !chartContainerRef.current || !volumeContainerRef.current) return;
    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: mainHeight });
    volumeChartRef.current.applyOptions({ width: volumeContainerRef.current.clientWidth, height: volumeHeight });
    setVolumeTop(mainHeight);
  }, [mainHeight, volumeHeight]);

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

  const formatTime = (t: number) => {
    const d = new Date(t * 1000);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const formatNumber = (n: number, dec: number = 1) => n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const formatVol = (v: number) => {
    if (v >= 1e6) return (v / 1e6).toFixed(3) + "M";
    if (v >= 1e3) return (v / 1e3).toFixed(3) + "K";
    return v.toFixed(2);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-md">
        <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-slate-800">
          <TabSwitcher
            tabs={CHART_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="gap-4  px-4 py-2"
            btnClassName=""
            ActiveClassName="absolute -bottom-2 left-1/2 w-4 h-[3px] bg-yellow-950 dark:bg-yellow-900 -translate-x-1/2 rounded z-30"
            NotActiveClassName=""
          />

          <div className="flex flex-row items-center gap-4 px-4 py-2">
            <div>
              <ChartFullScreenIcon className="w-4 h-4 text-gray-700 cursor-pointer" />
            </div>
            <div>
              <MultiChartIcon className="w-4 h-4 text-gray-700 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="h-12 border-b border-[#2A2E39] flex items-center px-4 justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Time</span>
              <div className="flex items-center gap-1">
                {intervals.map((t) => (
                  <div
                    key={t}
                    onClick={() => setInterval(t)}
                    className={`px-2 py-1 rounded ${t === interval ? "bg-[#1E2329] text-white" : "text-gray-500"} cursor-pointer hover:text-white`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="flex flex-row items-center gap-4">
                <IoMdArrowDropdown className="w-4 h-4 text-gray-700" />
                <TimeToolsIcon className="w-4 h-4 text-gray-700" />
                <TechnicalIcon className="w-4 h-4 text-gray-700" />
                <CandleIcon className="w-4 h-4 text-gray-700" />
                <ChartStyleIcon className="w-4 h-4 text-gray-700" />
                <FastOrderIcon className="w-4 h-4 text-gray-700" />
                <p className="text-xs font-normal text-gray-700 flex flex-row items-center">
                  Last Price
                  <span>
                    <IoMdArrowDropdown className="w-4 h-4" />
                  </span>
                </p>
              </div>
            </div>
            <div className="w-px h-6 bg-[#2A2E39]" />
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Original</span>
            <span className="text-gray-600">TradingView</span>
            <span className="text-gray-600">Depth</span>
          </div>
        </div>
      </div>

      <div className="h-full bg-[#14151A] text-white overflow-hidden">
        <div ref={chartWrapperRef} className="relative flex flex-col h-[calc(100%-48px)]" >
          <div ref={chartContainerRef} className="w-full" style={{ height: mainHeight }} />

          <div className="z-20 flex items-center justify-center w-full h-2 cursor-ns-resize" onMouseDown={onDividerMouseDown}>
            <div className="mx-auto w-full h-1 bg-[#2A2E39] relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#363A45]" />
            </div>
          </div>

          <div ref={volumeContainerRef} className="w-full" style={{ height: volumeHeight }} />

          {crosshair && (
            <>
              <div className="absolute z-30 flex flex-col gap-2 top-1 left-1">
                <div
                  className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit"
                  onClick={() => setOcExpanded(!ocExpanded)}
                >
                  <svg className="w-4 h-4 text-gray-400 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.432 15.698a.9.9 0 001.205-.061l6-6 .061-.069a.9.9 0 00-1.266-1.266l-.069.061L12 13.727 6.637 8.363a.9.9 0 00-1.274 1.274l6 6 .069.061z" />
                  </svg>
                  {ocExpanded && (
                    <>
                      <span>{formatTime(crosshair.time)}</span>
                      <span>O {formatNumber(crosshair.open)}</span>
                      <span>H {formatNumber(crosshair.high)}</span>
                      <span>L {formatNumber(crosshair.low)}</span>
                      <span>C {formatNumber(crosshair.close)}</span>
                      <span className={crosshair.close >= crosshair.open ? "text-green-400" : "text-red-400"}>
                        {(((crosshair.close - crosshair.open) / crosshair.open) * 100).toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>

                <div
                  className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit"
                  onClick={() => setMaExpanded(!maExpanded)}
                >
                  <svg className="w-4 h-4 text-gray-400 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.432 15.698a.9.9 0 001.205-.061l6-6 .061-.069a.9.9 0 00-1.266-1.266l-.069.061L12 13.727 6.637 8.363a.9.9 0 00-1.274 1.274l6 6 .069.061z" />
                  </svg>
                  {maExpanded && (
                    <>
                      <span className="text-yellow-500">MA7 {formatNumber(crosshair.ma7)}</span>
                      <span className="text-orange-500">MA25 {formatNumber(crosshair.ma25)}</span>
                      <span className="text-purple-400">MA99 {formatNumber(crosshair.ma99)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="absolute z-30 flex gap-2 left-1" style={{ top: volumeTop + 6 }}>
                <div
                  className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit"
                  onClick={() => setVolExpanded(!volExpanded)}
                >
                  <svg className="w-4 h-4 text-gray-400 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.432 15.698a.9.9 0 001.205-.061l6-6 .061-.069a.9.9 0 00-1.266-1.266l-.069.061L12 13.727 6.637 8.363a.9.9 0 00-1.274 1.274l6 6 .069.061z" />
                  </svg>
                  {volExpanded && (
                    <>
                      <span>Vol {formatVol(crosshair.volume)}</span>
                      <span className="text-cyan-400">{formatVol(crosshair.volMa5)}</span>
                      <span className="text-pink-500">{formatVol(crosshair.volMa10)}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChartTabs;
