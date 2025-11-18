import Image from "next/image";
import loading from "@/assets/image/svg/‌BNB.svg";

const LoadingSvg = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image src={loading} alt="Binance" width={60} height={60} className="animate-pulse" />
    </div>
  );
};

export default LoadingSvg;
