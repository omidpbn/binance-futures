import Tables from "@/modules/futures/components/organisms/tables";
import Account from "@/modules/futures/components/organisms/account";

const Page = () => {
  return (
    <div className="w-full flex flex-row 2xl:grid 2xl:grid-cols-10 gap-1">
      <div className="w-full col-span-8 bg-white dark:bg-slate-900 rounded-md">
        <Tables />
      </div>
      <div className="min-w-[280px] col-span-2 bg-white dark:bg-slate-900 rounded-md">
        <Account />
      </div>
    </div>
  );
};

export default Page;
