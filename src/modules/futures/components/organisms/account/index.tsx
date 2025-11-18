import Button from "@/shared/components/atoms/button";

const Account = () => {
  return (
    <>
      <div className="border-b border-b-gray-200 dark:border-slate-800">
        <p className="text-sm font-medium px-4 py-2">Account</p>
      </div>
      <div className="px-4 py-2 leading-5">
        <p className="text-xs font-medium pb-2">Margin Ratio</p>

        <div className="flex flex-row items-center justify-between text-[10px] font-medium">
          <p className="text-gray-700">Margin Ratio</p>
          <span className="text-green-900">0.00%</span>
        </div>

        <div className="flex flex-row items-center justify-between text-[10px] font-medium">
          <p className="text-gray-700">Maintenance Margin</p>
          <span className="text-white">0.0000 USDT</span>
        </div>

        <div className="flex flex-row items-center justify-between text-[10px] font-medium border-b border-b-slate-700 pb-2">
          <p className="text-gray-700">Margin Balance</p>
          <span className="text-white">0.0000 USDT</span>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <Button color="gray" size="xs" disabled>
            Transfer
          </Button>
          <Button color="gray" size="xs" disabled>
            Buy Crypto
          </Button>
          <Button color="gray" size="xs" disabled>
            Swap
          </Button>
        </div>
      </div>
    </>
  );
};

export default Account;
