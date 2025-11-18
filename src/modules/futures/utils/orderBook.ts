export const mapOrders = (orders: [string, string][]) => orders.map(([p, q]) => ({ price: Number(p), qty: Number(q), sum: 0 }));

export const calcSum = (list: OrderRowType[], isBids: boolean) => {
  let sum = 0;
  const sorted = isBids ? list.sort((a, b) => b.price - a.price) : list.sort((a, b) => a.price - b.price);
  return sorted.map((r) => ({ ...r, sum: (sum += r.qty) }));
};
