"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, LineStyle } from "lightweight-charts";
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

interface TradingViewProps {
  data: { time: string; value: number }[];
  height?: number;
}

const TradingView = ({ data, height = 400 }: TradingViewProps) => {
  const [activeTab, setActiveTab] = useState("0");
  const [selected, setSelected] = useState("1D");
  const [selectedChart, setSelectedChart] = useState("Original");
  const times = ["1s", "15m", "1H", "4H", "1D", "1W"];
  const chart = ["Original", "Trading", "Depth"];

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height,
    });

    const lineSeries: ISeriesApi<"Line"> = chart.addLineSeries({
      color: "#2196f3",
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
    });

    lineSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, height]);

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

        <div className="flex flex-row items-center justify-between px-4 py-2">
          <div className="flex flex-row items-center gap-2 py-1">
            <p className="text-xs font-medium text-gray-700">Time</p>
            {times.map((time) => (
              <span
                key={time}
                onClick={() => setSelected(time)}
                className={`cursor-pointer  rounded text-xs font-medium ${selected === time ? "text-black dark:text-white" : "text-gray-700"}`}
              >
                {time}
              </span>
            ))}

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

          <div className="flex flex-row items-center gap-2">
            {chart.map((item) => (
              <span
                key={item}
                onClick={() => setSelectedChart(item)}
                className={`cursor-pointer  rounded text-xs font-medium ${selectedChart === item ? "text-black dark:text-white" : "text-gray-700"}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div ref={chartContainerRef} style={{ width: "100%", height, borderRadius: "6px" }} />
    </>
  );
};

export default TradingView;
