interface OrderRowProps {
  color?: "green" | "red";
  price: number;
  value: number;
  totalOrTime: string;
  decimalCount?: number;
  isOpen?: boolean;
  maxSum?: number;
}

const OrderRow = ({ color, price, value, totalOrTime, decimalCount = 5, isOpen = true, maxSum = 1 }: OrderRowProps) => {
  const widthPercent = Math.min((Number(totalOrTime) / maxSum) * 100, 100);

  return (
    <div className="relative w-full h-5">
      {isOpen && (
        <div
          className={`absolute top-0 h-full ${
            color === "green" ? "bg-green-700 dark:bg-green-800" : "bg-red-700 dark:bg-red-800"
          } z-0 transition-all duration-100 ease-linear`}
          style={{ width: `${widthPercent}%`, right: 0 }}
        />
      )}
      <div className="relative grid grid-cols-3 gap-1 text-[10px] leading-[18px] z-10">
        <p className={color === "green" ? "text-green-900" : "text-red-900"}>
          {price.toLocaleString("en-US", { maximumFractionDigits: decimalCount })}
        </p>
        <p className="text-center">{value.toLocaleString("en-US", { maximumFractionDigits: decimalCount })}</p>
        <p className="text-end">{Number(totalOrTime).toLocaleString("en-US", { maximumFractionDigits: decimalCount })}</p>
      </div>
    </div>
  );
};

export default OrderRow;
