import TradeInfo from "@/modules/futures/components/organisms/tradeInfo";
import TradingChart from "@/modules/futures/components/organisms/tradingChart";

const Page = () => {
  return (
    <div className="w-full h-full space-y-1">
      <div className="flex flex-row items-center gap-4 bg-white dark:bg-slate-900 rounded-md px-4 py-2">
        <div className="flex flex-row items-center gap-1 text-xs font-medium">
          <p>BTCUSDT</p>
          <span className="text-red-900">-0.17%</span>
        </div>

        <div className="flex flex-row items-center gap-1 text-xs font-medium">
          <p>ETHUSDT</p>
          <span className="text-green-900">-0.88%</span>
        </div>

        <div className="flex flex-row items-center gap-1 text-xs font-medium">
          <p>BNBUSDT</p>
          <span className="text-green-900">-0.05%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-md px-4 py-2">
        <TradeInfo />
      </div>

      <div className="relative h-[461px] bg-white !rounded-md dark:!bg-slate-900">
        <TradingChart />
      </div>
    </div>
  );
};

export default Page;
