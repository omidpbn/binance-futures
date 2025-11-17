"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import TabSwitcher from "../../atoms/tabSwitcher";
import TradeRow from "../../atoms/tradesRow";
import { TRADE_TABS } from "@/modules/futures/constants/tabs";
import { MonitorWindowIcon } from "../../atoms/illustrators/monitorWindowIcon";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Trades = () => {
  const [activeTab, setActiveTab] = useState("0");
  const { pair } = useParams<{ pair: string }>();
  const separatedPair = useMemo(() => pair?.split("-"), [pair]);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-md">
      <div className="flex flex-row items-center justify-between border-b border-b-slate-800 px-4 py-2">
        <TabSwitcher
          tabs={TRADE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="gap-4"
          ActiveClassName="absolute -bottom-2 left-1/2 w-4 h-[3px] bg-yellow-950 dark:bg-yellow-900 -translate-x-1/2 rounded z-30"
        />
        <div className="flex flex-row items-center gap-2">
          <MonitorWindowIcon className="text-gray-700 w-4 h-4" />
          <HiOutlineDotsHorizontal className="text-gray-700" />
        </div>
      </div>

      <div className="h-full flex flex-col justify-between gap-2 px-4">
        <div className="grid grid-cols-3 items-center text-[10px] text-gray-700">
          <p className="text-start">
            <span>Price</span>
            <span>({separatedPair[1].toUpperCase()})</span>
          </p>
          <p className="text-center">
            <span className="block pt-2">Amount</span>
            <span>({separatedPair[0].toUpperCase()})</span>
          </p>
          <p className="text-end">
            <span>Time</span>
          </p>
        </div>

        <div className="w-full h-full flex flex-col pb-2">
          <TradeRow color="red" price={1100000} amount={0.001} time={"16:01:20"} />
          <TradeRow color="red" price={1100000} amount={0.001} time={"16:01:20"} />
          <TradeRow color="green" price={1100000} amount={0.001} time={"16:01:20"} />
          <TradeRow color="green" price={1100000} amount={0.019} time={"16:01:20"} />
          <TradeRow color="green" price={1100000} amount={0.019} time={"16:01:20"} />
          <TradeRow color="green" price={1100000} amount={0.019} time={"16:01:20"} />
          <TradeRow color="green" price={1100000} amount={0.019} time={"16:01:20"} />
        </div>
      </div>
    </div>
  );
};

export default Trades;
