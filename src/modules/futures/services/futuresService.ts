import { WebService } from "@/shared/services/webService";

export class OrderBookAPI {
  static async getSnapshot(pair: string) {
    return WebService.get<BinanceOrderBookSnapshot>("/fapi/v1", `/depth?symbol=${pair.toUpperCase()}&limit=1000`);
  }
}
