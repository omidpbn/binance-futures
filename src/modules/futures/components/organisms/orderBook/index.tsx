"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FaCaretDown, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import OrderRow from "../../molecules/ordersRow";
import { SellBoxIcon } from "../../atoms/illustrators/sellBoxIcon";
import { BuyBoxIcon } from "../../atoms/illustrators/buyIcon";
import { SellAndBuyBoxIcon } from "../../atoms/illustrators/sellAndBuyBoxIcon";
import { OrderBookAPI } from "@/modules/futures/services/futuresService";
import { useGenericSockets } from "@/shared/hooks/useGenericSockets";
import { useOrderBookStore } from "@/modules/futures/store/useOrderBookStore";
import LoadingSvg from "@/shared/components/atoms/loadingGif";
import { BinanceDepthUpdate } from "@/modules/futures/types/orderBook";

const OrderBook = () => {
  const { pair } = useParams<{ pair: string }>();
  const { connect, disconnect, popMessages } = useGenericSockets();
  const { bids, asks, midPrice, setSnapshot, pushDepth, processQueue } = useOrderBookStore();

  const [showSell, setShowSell] = useState(true);
  const [showBuy, setShowBuy] = useState(true);
  const [midDirection, setMidDirection] = useState<"up" | "down" | null>(null);
  const lastMidRef = useRef(midPrice);

  const selectPair = useMemo(() => pair?.replace("-", "").toLowerCase(), [pair]);
  const separatedPair = useMemo(() => pair?.split("-"), [pair]);

  const handleShow = (sell: boolean, buy: boolean) => {
    setShowSell(sell);
    setShowBuy(buy);
  };

  // Detect mid price direction
  useEffect(() => {
    if (midPrice > lastMidRef.current) setMidDirection("up");
    else if (midPrice < lastMidRef.current) setMidDirection("down");
    else setMidDirection(null);
    lastMidRef.current = midPrice;
  }, [midPrice]);

  // Fetch initial snapshot
  useEffect(() => {
    if (!selectPair) return;
    OrderBookAPI.getSnapshot(selectPair)
      .then((res) => {
        setSnapshot({ U: res.data.lastUpdateId, u: res.data.lastUpdateId, b: res.data.bids, a: res.data.asks });
      })
      .catch(console.error);
  }, [selectPair, setSnapshot]);

  // Connect to WebSocket
  useEffect(() => {
    if (!selectPair) return;

    connect<BinanceDepthUpdate>({
      key: selectPair,
      path: `${selectPair}@depth@100ms`,
    });

    return () => disconnect(selectPair);
  }, [selectPair]);

  // Process messages in batches
  useEffect(() => {
    if (!selectPair) return;
    const interval = setInterval(() => {
      const messages = popMessages<BinanceDepthUpdate>(selectPair);
      if (messages.length > 0) {
        // Process only the latest N messages to avoid blocking UI
        const latestMessages = messages.slice(-20);
        latestMessages.forEach((depth) => pushDepth(depth));
        processQueue();
      }
    }, 200); // batch every 200ms for smooth UI

    return () => clearInterval(interval);
  }, [selectPair, popMessages, pushDepth, processQueue]);

  if (!bids.length && !asks.length)
    return (
      <div className="bg-white dark:bg-slate-900 rounded-md py-20">
        <LoadingSvg />
      </div>
    );

  const maxRows = showBuy && showSell ? 7 : 14;
  const displayBids = showBuy ? bids.slice(0, maxRows) : [];
  const displayAsks = showSell ? asks.slice(0, maxRows) : [];
  const maxSumBuy = Math.max(...displayBids.map((r) => r.sum), 1);
  const maxSumSell = Math.max(...displayAsks.map((r) => r.sum), 1);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-md">
      <div className="flex justify-between items-center border-b border-b-gray-200 dark:border-b-slate-800 px-4 py-2">
        <p className="text-sm font-medium">Order Book</p>
        <HiOutlineDotsHorizontal className="text-gray-700" />
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex gap-1">
          <button className={showBuy && showSell ? "opacity-100" : "opacity-50"} onClick={() => handleShow(true, true)}>
            <SellAndBuyBoxIcon className="w-4 h-4" />
          </button>
          <button className={showSell && !showBuy ? "opacity-100" : "opacity-50"} onClick={() => handleShow(true, false)}>
            <BuyBoxIcon className="w-4 h-4" />
          </button>
          <button className={!showSell && showBuy ? "opacity-100" : "opacity-50"} onClick={() => handleShow(false, true)}>
            <SellBoxIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1 items-center text-[10px] font-medium">
          <p>0.1</p>
          <FaCaretDown className="text-gray-700" />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 px-4 h-full">
        <div className="grid grid-cols-3 text-[10px] text-gray-700">
          <p className="text-start">Price ({separatedPair?.[1]?.toUpperCase()})</p>
          <p className="text-center">Size ({separatedPair?.[0]?.toUpperCase()})</p>
          <p className="text-end">Sum ({separatedPair?.[0]?.toUpperCase()})</p>
        </div>

        <div className="flex flex-col w-full h-full">
          {displayAsks.map((row, i) => (
            <OrderRow key={i} color="red" price={row.price} value={row.qty} totalOrTime={row.sum.toFixed(5)} maxSum={maxSumSell} />
          ))}
        </div>

        <p className="flex gap-1 items-center text-lg leading-8 text-red-900">
          <span className={midDirection === "up" ? "text-green-900" : midDirection === "down" ? "text-red-900" : ""}>
            {midPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </span>
          {midDirection === "up" && <FaArrowUp className="w-3 h-3 text-green-900" />}
          {midDirection === "down" && <FaArrowDown className="w-3 h-3 text-red-900" />}
        </p>

        <div className="flex flex-col w-full h-full pb-1.5">
          {displayBids.map((row, i) => (
            <OrderRow key={i} color="green" price={row.price} value={row.qty} totalOrTime={row.sum.toFixed(5)} maxSum={maxSumBuy} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
