"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useGenericSockets } from "@/shared/hooks/useGenericSockets";
import { useOrderBookStore } from "@/modules/futures/store/useOrderBookStore";
import { TradeInfoAPI } from "@/modules/futures/services/futuresService";
import btcImage from "@/assets/image/BTC.png";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoMdArrowDropdown, IoIosArrowRoundForward } from "react-icons/io";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { BinanceTicker, MarketData, TickerData } from "@/modules/futures/types/tradeInfo";


const TradeInfo = () => {
  const { pair } = useParams<{ pair: string }>();
  const { connect, disconnect, popMessages } = useGenericSockets();
  const { midPrice } = useOrderBookStore();

  const symbol = useMemo(() => pair?.replace("-", "").toLowerCase() || "btcusdt", [pair]);
  const symbolUpper = symbol.toUpperCase();
  const wsKey = `tradeinfo_${symbol}`;

  const [ticker, setTicker] = useState<TickerData>({
    priceChange: "0",
    changePercent: "0",
    high24h: "0",
    low24h: "0",
    volume24h: "0",
    volume24hUSDT: "0",
  });

  const [market, setMarket] = useState<MarketData>({
    markPrice: "0",
    indexPrice: "0",
    fundingRate: "0",
    nextFundingTime: 0,
    openInterestUSDT: "0",
  });

  const prevMidPrice = useRef(0);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const ref = scrollRef.current;
    if (!ref) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref;
    const tolerance = 1;
    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - tolerance);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -150 : 150,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    connect<BinanceTicker>({
      key: wsKey,
      path: `${symbol}@ticker`,
      onMessage: (data) => {
        const current = parseFloat(data.c);
        if (prevMidPrice.current > 0) {
          const newDirection = current > prevMidPrice.current ? "up" : current < prevMidPrice.current ? "down" : null;
          setDirection((prev) => (prev !== newDirection ? newDirection : prev));
        }
        prevMidPrice.current = current;

        setTicker({
          priceChange: data.p,
          changePercent: data.P,
          high24h: data.h,
          low24h: data.l,
          volume24h: data.v,
          volume24hUSDT: data.q,
        });
      },
    });

    const interval = setInterval(() => {
      const messages = popMessages<BinanceTicker>(wsKey);
      messages.forEach((data) => {
        const current = parseFloat(data.c);
        if (prevMidPrice.current > 0) {
          const newDirection = current > prevMidPrice.current ? "up" : current < prevMidPrice.current ? "down" : null;
          setDirection((prev) => (prev !== newDirection ? newDirection : prev));
        }
        prevMidPrice.current = current;

        setTicker({
          priceChange: data.p,
          changePercent: data.P,
          high24h: data.h,
          low24h: data.l,
          volume24h: data.v,
          volume24hUSDT: data.q,
        });
      });
    }, 100);

    return () => {
      disconnect(wsKey);
      clearInterval(interval);
    };
  }, [symbol, wsKey]);

  useEffect(() => {
    let lastMarket: MarketData | null = null;
    const updateMarketData = async () => {
      try {
        const [premium, oiData] = await Promise.all([TradeInfoAPI.getPremiumIndex(symbolUpper), TradeInfoAPI.getOpenInterest(symbolUpper)]);

        const contracts = parseFloat(oiData.openInterest);
        const markPriceNum = parseFloat(premium.markPrice);
        const openInterestUSDT = Math.round(contracts * markPriceNum).toString();

        const updatedMarket: MarketData = {
          markPrice: premium.markPrice,
          indexPrice: premium.indexPrice,
          fundingRate: premium.lastFundingRate,
          nextFundingTime: premium.nextFundingTime,
          openInterestUSDT,
        };

        if (JSON.stringify(lastMarket) !== JSON.stringify(updatedMarket)) {
          lastMarket = updatedMarket;
          setMarket(updatedMarket);
        }
      } catch (err) {
        console.error(err);
      }
    };

    updateMarketData();
    const intervalId = setInterval(updateMarketData, 2000);

    return () => clearInterval(intervalId);
  }, [symbolUpper]);

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    const handleScroll = () => checkScrollButtons();
    const handleResize = () => checkScrollButtons();

    checkScrollButtons();
    ref.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fundingCountdown = useMemo(() => {
    const diff = market.nextFundingTime - Date.now();
    if (diff <= 0) return "00:00:00";
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [market.nextFundingTime]);

  const isNegative = parseFloat(ticker.changePercent) < 0;

  return (
    <div className="flex flex-row items-center justify-between select-none gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="border dark:border-slate-800 rounded-md p-1">
          <FaStar className="w-4 h-4 text-yellow-900" />
        </div>

        <Image src={btcImage} alt="" width={24} height={24} />

        <div className="flex flex-row items-center gap-1">
          <div className="flex items-center">
            <span className="text-xl font-medium">{symbolUpper}</span>
            <span className="text-[10px] font-normal bg-gray-800 dark:bg-slate-800 rounded px-1">Perp</span>
          </div>
          <IoMdArrowDropdown />
        </div>

        <div className="min-w-24 flex flex-col me-1">
          <span className={`text-xl font-bold ${direction === "up" ? "text-green-500" : "text-red-500"}`}>
            {midPrice.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <div className={`flex flex-row items-center gap-2 text-xs font-normal ${isNegative ? "text-red-500" : "text-green-500"}`}>
            <span>{parseFloat(ticker.priceChange).toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
            <span>{parseFloat(ticker.changePercent).toLocaleString("en-US", { maximumFractionDigits: 2 })}%</span>
          </div>
        </div>

        <MdArrowBackIosNew
          className={`text-gray-700 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => scroll("left")}
        />

        <div className="max-w-[470px]">
          <div
            ref={scrollRef}
            className="flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <p className="text-xs font-normal text-gray-700 min-w-12 text-nowrap">
              Mark
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(market.markPrice).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </span>
            </p>
            <p className="text-xs font-normal text-gray-700 min-w-12 text-nowrap">
              Index
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(market.indexPrice).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </span>
            </p>
            <div className="flex flex-col min-w-36 text-nowrap">
              <p className="text-xs font-normal text-gray-700 pb-1">Funding (8h) / Countdown</p>
              <p className="flex flex-row items-center gap-1">
                <span className="text-xs font-normal text-orange-500">
                  {(parseFloat(market.fundingRate) * 100).toLocaleString("en-US", { maximumFractionDigits: 5 })} % /
                </span>
                <span className="text-xs font-normal text-black dark:text-white">{fundingCountdown}</span>
              </p>
            </div>
            <p className="text-xs font-normal text-gray-700 min-w-12 text-nowrap">
              24h High
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(ticker.high24h).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </span>
            </p>
            <p className="text-xs font-normal text-gray-700 min-w-12 text-nowrap">
              24h Low
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(ticker.low24h).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </span>
            </p>
            <p className="text-xs font-normal text-gray-700 min-w-24 text-nowrap">
              24h Volume(BTC)
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(ticker.volume24h).toLocaleString("en-US", { maximumFractionDigits: 3 })}
              </span>
            </p>
            <p className="text-xs font-normal text-gray-700 min-w-28 text-nowrap">
              24h Volume(USDT)
              <span className="block text-black dark:text-white pt-1">
                {parseFloat(ticker.volume24hUSDT).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </p>
            <div className="text-nowrap">
              <p className="text-xs font-normal text-gray-700 min-w-28 flex items-start">
                <span>Open Interest(USDT)</span>
                <IoIosArrowRoundForward className="-rotate-45 w-4 h-4" />
              </p>
              <span className="text-xs font-normal text-black dark:text-white pt-1">
                {parseFloat(market.openInterestUSDT).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        <MdArrowForwardIos
          className={`text-gray-700 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => scroll("right")}
        />
      </div>
      <HiOutlineDotsHorizontal className="text-gray-700" />
    </div>
  );
};

export default TradeInfo;
