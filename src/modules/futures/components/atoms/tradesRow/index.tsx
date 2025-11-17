interface OrderListProps {
  color?: "green" | "red";
  price: number;
  amount: number;
  time: string;
  decimalCount?: number;
}

const TradeRow = ({ color, price, amount, time, decimalCount = 3 }: OrderListProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 text-[10px] leading-[18px] z-10">
      <p className={color === "green" ? "text-green-900" : "text-red-900"}>
        {price.toLocaleString("en-US", {
          maximumFractionDigits: decimalCount,
          minimumFractionDigits: 0,
        })}
      </p>

      <p className="text-center">
        {amount.toLocaleString("en-US", {
          maximumFractionDigits: decimalCount,
          minimumFractionDigits: 0,
        })}
      </p>

      <p className="text-end">{time}</p>
    </div>
  );
};

export default TradeRow;
