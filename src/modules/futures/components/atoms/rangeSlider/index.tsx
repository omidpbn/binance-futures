"use client";
import { useRef, useState } from "react";

const CustomRangeSlider = () => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [percent, setPercent] = useState(0); // Current percentage of the slider
  const [dragging, setDragging] = useState(false); // Track whether the user is dragging

  const markers = [0, 25, 50, 75, 100]; // Predefined marker positions

  // Update the slider position based on pointer X coordinate
  const update = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width); // Clamp between 0 and bar width
    const newPercent = Math.round((x / rect.width) * 100);
    setPercent(newPercent);
  };

  // Handle pointer down event
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId); // Capture pointer events
    update(e.clientX);
  };

  // Handle pointer move event while dragging
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    update(e.clientX);
  };

  // Handle pointer release
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId); // Release pointer capture
  };

  return (
    <div className="w-full max-w-xl relative select-none">
      <div
        ref={barRef}
        className="relative w-full h-12"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Background line */}
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 dark:bg-slate-800 -translate-y-1/2"></div>

        {/* Filled portion of the slider */}
        <div
          className="absolute left-0 top-1/2 h-0.5 bg-black dark:bg-white -translate-y-1/2 transition-all duration-0"
          style={{ width: `${percent}%` }}
        ></div>

        {/* Small diamond markers */}
        {markers.map((m, i) => {
          const active = percent >= m;
          return (
            <div key={i} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${m}%` }}>
              <div
                className={`w-1.5 h-1.5 rotate-45 transition-all duration-150 ${
                  active ? "bg-black dark:bg-white" : "border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              ></div>
            </div>
          );
        })}

        {/* Main draggable handle */}
        <div className="absolute -translate-y-1/2 top-1/2 cursor-pointer z-20" style={{ left: `calc(${percent}% - 1px)` }}>
          {/* Tooltip shown only while dragging */}
          {dragging && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs px-1 rounded-md">
              {percent}%
            </div>
          )}

          <div
            className="w-2 h-2 bg-white dark:bg-slate-900 border border-black dark:border-white rotate-45 shadow-lg transition-all duration-0"
            style={{ left: `calc(${percent}% - 1px)` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CustomRangeSlider;
