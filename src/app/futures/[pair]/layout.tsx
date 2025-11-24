import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  orderBook: ReactNode;
  exchange: ReactNode;
  tables: ReactNode;
}

const Layout = async ({ children, exchange, orderBook, tables }: LayoutProps) => {
  return (
    <>
      <div className="space-y-1 p-1">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-8">{children}</div>
          <div className="col-span-2">{orderBook}</div>
          <div className="col-span-2 bg-white dark:bg-slate-900 rounded-md px-4 py-2">{exchange}</div>
        </div>
        <div className="">{tables}</div>
      </div>
    </>
  );
};

export default Layout;
