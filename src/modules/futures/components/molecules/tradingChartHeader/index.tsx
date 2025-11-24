"use client";

import React from "react";
import TabSwitcher from "../../atoms/tabSwitcher";
import { CHART_TABS } from "@/modules/futures/constants/tabs";
import { TechnicalIcon } from "@/modules/futures/components/atoms/illustrators/TechnicalIcon";
import { ChartFullScreenIcon } from "@/modules/futures/components/atoms/illustrators/chartFullScreenIcon";
import { MultiChartIcon } from "@/modules/futures/components/atoms/illustrators/multiChartIcon";
import { TimeToolsIcon } from "@/modules/futures/components/atoms/illustrators/timeToolsIcon";
import { CandleIcon } from "@/modules/futures/components/atoms/illustrators/candleIcon";
import { ChartStyleIcon } from "@/modules/futures/components/atoms/illustrators/chartStyleIcon";
import { FastOrderIcon } from "@/modules/futures/components/atoms/illustrators/fastOrderIcon";
import { IoMdArrowDropdown } from "react-icons/io";

interface TradingChartHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  interval: string;
  setInterval: (interval: string) => void;
  intervals: string[];
}

const TradingChartHeader = ({ activeTab, setActiveTab, interval, setInterval, intervals }: TradingChartHeaderProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-md">
      <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-slate-800">
        <TabSwitcher
          tabs={CHART_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="gap-4 px-4 py-2"
          btnClassName=""
          ActiveClassName="absolute -bottom-2 left-1/2 w-4 h-[3px] bg-yellow-950 dark:bg-yellow-900 -translate-x-1/2 rounded z-30"
          NotActiveClassName=""
        />
        <div className="flex flex-row items-center gap-4 px-4 py-2">
          <ChartFullScreenIcon className="w-4 h-4 text-gray-700 cursor-pointer" />
          <MultiChartIcon className="w-4 h-4 text-gray-700 cursor-pointer" />
        </div>
      </div>

      <div className="h-12 border-b border-[#2A2E39] flex items-center px-4 justify-between text-xs">
        <div className="flex items-center gap-4">
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
              Last Price <IoMdArrowDropdown className="w-4 h-4" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <span>Original</span>
          <span className="text-gray-600">TradingView</span>
          <span className="text-gray-600">Depth</span>
        </div>
      </div>
    </div>
  );
};

export default TradingChartHeader;
