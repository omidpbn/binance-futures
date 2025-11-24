"use client";

import React from "react";

interface ChartCanvasProps {
  chartWrapperRef: React.RefObject<HTMLDivElement | null>;
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
  mainHeight: number;
  onDividerMouseDown: (e: React.MouseEvent) => void;
  volumeContainerRef: React.RefObject<HTMLDivElement | null>;
  volumeHeight: number;
  crosshair: any;
  formatTime: (t?: number) => string;
  formatNumber: (n: number | undefined, dec?: number) => string;
  volumeTop: number;
  formatVol: (v: number | undefined) => string;
}

const ChartCanvas = ({
  chartWrapperRef,
  chartContainerRef,
  mainHeight,
  onDividerMouseDown,
  volumeContainerRef,
  volumeHeight,
  crosshair,
  formatTime,
  formatNumber,
  volumeTop,
  formatVol,
}: ChartCanvasProps) => {
  return (
    <div className="h-full bg-[#14151A] text-white overflow-hidden">
      <div ref={chartWrapperRef} className="relative flex flex-col h-[calc(100%-48px)]">
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
              <div className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit">
                <span>{formatTime(crosshair.time)}</span>
                <span>O {formatNumber(crosshair.open)}</span>
                <span>H {formatNumber(crosshair.high)}</span>
                <span>L {formatNumber(crosshair.low)}</span>
                <span>C {formatNumber(crosshair.close)}</span>
                <span className={crosshair.close! >= crosshair.open! ? "text-green-400" : "text-red-400"}>
                  {(((crosshair.close! - crosshair.open!) / (crosshair.open || 1)) * 100).toFixed(2)}%
                </span>
              </div>

              <div className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit">
                <span className="text-yellow-500">MA7 {formatNumber(crosshair.ma7)}</span>
                <span className="text-orange-500">MA25 {formatNumber(crosshair.ma25)}</span>
                <span className="text-purple-400">MA99 {formatNumber(crosshair.ma99)}</span>
              </div>
            </div>

            <div className="absolute z-30 flex gap-2 left-1" style={{ top: volumeTop + 6 }}>
              <div className="bg-[#181A20]/80 backdrop-blur rounded px-3 py-2 text-xs flex items-center gap-3 hover:border hover:border-[#2B3139] cursor-pointer w-fit">
                <span>Vol {formatVol(crosshair.volume)}</span>
                <span className="text-cyan-400">{formatVol(crosshair.volMa5)}</span>
                <span className="text-pink-500">{formatVol(crosshair.volMa10)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartCanvas;
