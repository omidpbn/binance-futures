import Tables from "@/modules/futures/components/organisms/tables";
import Account from "@/modules/futures/components/organisms/account";

const Page = () => {
  return (
    <div className="grid grid-cols-12 gap-1">
      <div className="col-span-10 bg-white dark:bg-slate-900 rounded-md">
        <Tables />
      </div>
      <div className="col-span-2 bg-white dark:bg-slate-900 rounded-md">
        <Account />
      </div>
    </div>
  );
};

export default Page;
