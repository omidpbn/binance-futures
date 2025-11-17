interface OrderListProps {
  color?: "green" | "red";
  price: number;
  value: number;
  totalOrTime: string;
  decimalCount?: number;
  isOpen?: boolean;
}

const OrderRow = ({ color, price, value, totalOrTime, decimalCount = 5, isOpen = true }: OrderListProps) => {
  return (
    <div className="relative">
      {isOpen ? (
        <div
          className={`w-full h-full absolute left-0 top-0 ${color === "green" ? "bg-green-700 dark:bg-green-800" : "bg-red-700 dark:bg-red-800"} z-0`}
        ></div>
      ) : (
        ""
      )}
      <div className="relative grid grid-cols-3 gap-1 text-[10px] leading-[18px] z-10">
        <p className={color === "green" ? "text-green-900" : "text-red-900"}>
          {price.toLocaleString("en-US", {
            maximumFractionDigits: decimalCount,
            minimumFractionDigits: 0,
          })}
        </p>

        <p className="text-center">
          {value.toLocaleString("en-US", {
            maximumFractionDigits: decimalCount,
            minimumFractionDigits: 0,
          })}
        </p>

        <p className="text-end">
          {isOpen
            ? Number(totalOrTime).toLocaleString("en-US", {
                maximumFractionDigits: decimalCount,
                minimumFractionDigits: 0,
              })
            : totalOrTime}
        </p>
      </div>
    </div>
  );
};

export default OrderRow;
