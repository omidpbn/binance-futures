"use client";

import { useState } from "react";
import TabSwitcher from "../../atoms/tabSwitcher";
import { TABLE_TABS } from "../../../constants/tabs";
import Link from "next/link";

const Tables = () => {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <div>
      <TabSwitcher
        tabs={TABLE_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="gap-4  px-4 py-2"
        btnClassName=""
        ActiveClassName="absolute -bottom-2 left-1/2 w-4 h-[3px] bg-yellow-950 dark:bg-yellow-900 -translate-x-1/2 rounded z-30"
        NotActiveClassName=""
      />
      <div className="border-t border-t-gray-200 dark:border-t-slate-800 h-full">
        {activeTab === "0" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "1" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "2" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "3" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "4" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "5" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "6" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}

        {activeTab === "7" && (
          <>
            <div className="text-xs font-normal text-black dark:text-white text-center my-52">
              <Link href="#" className="text-yellow-950 dark:text-yellow-900">
                Log In
              </Link>
              <span className="mx-2">or</span>
              <Link href="#" className=" text-yellow-950 dark:text-yellow-900">
                Register Now
              </Link>
              <span className="mx-2">to trade</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tables;
