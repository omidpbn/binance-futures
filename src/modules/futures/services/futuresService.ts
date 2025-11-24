import { WebService } from "@/shared/services/webService";
import { BinanceOrderBookSnapshot } from "../types/orderBook";
import { OpenInterestResponse, PremiumIndexResponse } from "../types/tradeInfo";
import { KlineDataREST } from "@/modules/futures/types/chart";

export class OrderBookAPI {
  static async getSnapshot(pair: string) {
    return WebService.get<BinanceOrderBookSnapshot>("/fapi/v1", `/depth?symbol=${pair.toUpperCase()}&limit=1000`);
  }
}
export class TradeInfoAPI {
  static async getPremiumIndex(symbol: string): Promise<PremiumIndexResponse> {
    const response = await WebService.get<PremiumIndexResponse>("/fapi/v1", `/premiumIndex?symbol=${symbol.toUpperCase()}`);
    return response.data;
  }

  static async getOpenInterest(symbol: string): Promise<OpenInterestResponse> {
    const response = await WebService.get<OpenInterestResponse>("/fapi/v1", `/openInterest?symbol=${symbol.toUpperCase()}`);
    return response.data;
  }
}

export class KlineAPI {
  static async getKlines(symbol: string, interval: string, limit = 500) {
    return WebService.get<KlineDataREST[]>("/fapi/v1", `/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`);
  }
}
