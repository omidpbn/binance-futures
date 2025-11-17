import OrderBook from "@/modules/futures/components/organisms/orderBook";
import Trades from "@/modules/futures/components/organisms/trades";

const Page = () => {
  return (
    <div className="space-y-1">
      <OrderBook />
      <Trades />
    </div>
  );
};

export default Page;
