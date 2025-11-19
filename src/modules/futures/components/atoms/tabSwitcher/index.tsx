import React from "react";
import { TabOption } from "@/modules/futures/types/tabSwitcher";
interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  btnClassName?: string;
  ActiveClassName?: string;
  NotActiveClassName?: string;
}

const TabSwitcher = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  btnClassName = "",
  ActiveClassName = "",
  NotActiveClassName = "",
}: TabSwitcherProps) => {
  return (
    <div className={`flex flex-row items-start justify-start ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`relative md:text-sm text-xs font-normal text-nowrap   ${
            activeTab === tab.value ? "text-black dark:text-white" : "text-gray-700 hover:text-black dark:hover:text-white"
          } ${btnClassName} `}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
          <span className={`${activeTab === tab.value ? ActiveClassName : NotActiveClassName}`} />
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
