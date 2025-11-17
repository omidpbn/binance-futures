"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import OrderRow from "../../atoms/ordersRow";
import { SellBoxIcon } from "../../atoms/illustrators/sellBoxIcon";
import { BuyBoxIcon } from "../../atoms/illustrators/buyIcon";
import { SellAndBuyBoxIcon } from "../../atoms/illustrators/sellAndBuyBoxIcon";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const OrderBook = () => {
  const { pair } = useParams<{ pair: string }>();
  const [showSell, setShowSell] = useState(true);
  const [showBuy, setShowBuy] = useState(true);

  const separatedPair = useMemo(() => pair?.split("-"), [pair]);
  console.log(separatedPair);
  const handleShowSellAndBuy = () => {
    setShowSell(true);
    setShowBuy(true);
  };

  const handleShowSell = () => {
    setShowSell(true);
    setShowBuy(false);
  };

  const handleShowBuy = () => {
    setShowSell(false);
    setShowBuy(true);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-md">
      <div className="flex flex-row items-center justify-between border-b border-b-slate-800 px-4 py-2">
        <p className="text-sm font-medium">Order Book</p>
        <HiOutlineDotsHorizontal className="text-gray-700" />
      </div>

      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-row items-center justify-start gap-1">
          <button className={showBuy && showSell ? "opacity-100" : "opacity-50"} onClick={handleShowSellAndBuy}>
            <SellAndBuyBoxIcon className="w-4 h-4" />
          </button>
          <button className={showSell && !showBuy ? "opacity-100" : "opacity-50"} onClick={handleShowSell}>
            <BuyBoxIcon className="w-4 h-4" />
          </button>
          <button className={!showSell && showBuy ? "opacity-100" : "opacity-50"} onClick={handleShowBuy}>
            <SellBoxIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-row items-center gap-1 text-[10px] font-medium">
          <p>0.1</p>
          <FaCaretDown className="text-gray-700" />
        </div>
      </div>

      <div className="h-full flex flex-col justify-between gap-2 px-4">
        <div className="grid grid-cols-3 text-[10px] text-gray-700">
          <p className="text-start">
            <span>Price</span>
            <span>({separatedPair[1].toUpperCase()})</span>
          </p>
          <p className="text-center">
            <span>Size</span>
            <span>({separatedPair[0].toUpperCase()})</span>
          </p>
          <p className="text-end">
            <span>Sum</span>
            <span>({separatedPair[0].toUpperCase()})</span>
          </p>
        </div>

        {showBuy ? (
          <div className="w-full h-full flex flex-col">
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="red" price={1100000} value={0.00019} totalOrTime={"20951834"} />
          </div>
        ) : (
          ""
        )}

        <p className="flex flex-row text-red-400 justify-start items-center text-lg leading-8">
          <span>11,019,797,974</span>
          <span>
            <FaCaretDown />
          </span>
        </p>

        {showSell ? (
          <div className="w-full h-full flex flex-col pb-1">
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
            <OrderRow color="green" price={1100000} value={0.00019} totalOrTime={"20951834"} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default OrderBook;
