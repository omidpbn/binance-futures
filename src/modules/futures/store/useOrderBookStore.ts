import { create } from "zustand";
import { calcSum, mapOrders } from "../utils/orderBook";
import { BinanceDepth, OrderRowType } from "../types/orderBook";

interface OrderBookState {
  bids: OrderRowType[];
  asks: OrderRowType[];
  midPrice: number;
  lastUpdateId: number;
  snapshotQueue: BinanceDepth[];
  setSnapshot: (snapshot: BinanceDepth) => void;
  pushDepth: (depth: BinanceDepth) => void;
  processQueue: () => void;
}

export const useOrderBookStore = create<OrderBookState>((set, get) => ({
  bids: [],
  asks: [],
  midPrice: 0,
  lastUpdateId: 0,
  snapshotQueue: [],

  // Set initial snapshot from REST API
  setSnapshot: (snapshot) => {
    const bids = calcSum(mapOrders(snapshot.b), true);
    const asks = calcSum(mapOrders(snapshot.a), false);

    set({
      bids,
      asks,
      midPrice: (bids[0]?.price + asks[0]?.price) / 2 || 0,
      lastUpdateId: snapshot.u,
    });

    // console.log(`[Store] Snapshot set. Mid price: ${(bids[0]?.price + asks[0]?.price) / 2 || 0}`);
  },

  // Push depth updates into queue
  pushDepth: (depth) => {
    set((state) => ({ snapshotQueue: [...state.snapshotQueue, depth] }));
    // console.log(`[Store] Depth pushed to queue. Last update ID: ${depth.u}`);
  },

  // Process queued depth updates and update state
  processQueue: () => {
    const { snapshotQueue, bids, asks, lastUpdateId } = get();
    if (!snapshotQueue.length) return;

    let newBids = [...bids];
    let newAsks = [...asks];
    let updatedLastId = lastUpdateId;

    snapshotQueue.forEach((depth) => {
      if (depth.u <= updatedLastId) return;

      const mergeSide = (side: OrderRowType[], updates: [string, string][]) => {
        const map = new Map(side.map((o) => [o.price, o.qty]));
        updates.forEach(([p, q]) => {
          const price = Number(p),
            qty = Number(q);
          if (qty === 0) map.delete(price);
          else map.set(price, qty);
        });
        return [...map.entries()].map(([price, qty]) => ({ price, qty, sum: 0 }));
      };

      newBids = mergeSide(newBids, depth.b);
      newAsks = mergeSide(newAsks, depth.a);
      updatedLastId = depth.u;
    });

    const calcSum = (list: OrderRowType[], isBids: boolean) => {
      let sum = 0;
      const sorted = isBids ? list.sort((a, b) => b.price - a.price) : list.sort((a, b) => a.price - b.price);
      return sorted.map((r) => ({ ...r, sum: (sum += r.qty) }));
    };

    set({
      bids: calcSum(newBids, true),
      asks: calcSum(newAsks, false),
      midPrice: ((newBids[0]?.price || 0) + (newAsks[0]?.price || 0)) / 2,
      lastUpdateId: updatedLastId,
      snapshotQueue: [],
    });

    // console.log(`[Store] Queue processed. Mid price: ${((newBids[0]?.price || 0) + (newAsks[0]?.price || 0)) / 2}`);
  },
}));
