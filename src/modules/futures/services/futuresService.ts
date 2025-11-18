import { WebService } from "@/shared/services/webService";

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
