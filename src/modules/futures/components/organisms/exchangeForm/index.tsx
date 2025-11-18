"use client";

import { ArithmeticIcon } from "@/modules/futures/components/atoms/illustrators/arithmeticIcon";
import CustomRangeSlider from "@/modules/futures/components/atoms/rangeSlider";
import TabSwitcher from "@/modules/futures/components/atoms/tabSwitcher";
import { EXCHANGE_TABS } from "@/modules/futures/constants/tabs";
import Button from "@/shared/components/atoms/button";
import Input from "@/shared/components/atoms/input";
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";

const ExchangeForm = () => {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="w-full flex flex-row items-center gap-2">
          <Button color="gray" size="xs" className="px-5">
            Cross
          </Button>
          <Button color="gray" size="xs" className="px-5">
            20x
          </Button>
          <Button color="gray" size="xs" className="px-2.5">
            s
          </Button>
        </div>
        <HiOutlineDotsHorizontal className="text-gray-700" />
      </div>

      <div className="flex flex-row items-center justify-between border-b border-b-gray-200 dark:border-b-slate-800 pb-2 my-4">
        <TabSwitcher
          tabs={EXCHANGE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="gap-4"
          ActiveClassName="absolute -bottom-2 left-1/2 w-4 h-[3px] bg-yellow-950 dark:bg-yellow-900 -translate-x-1/2 rounded z-30"
        />

        <PiWarningCircle className="text-gray-700" />
      </div>

      <div className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-row items-center text-xs font-normal">
          <p className="text-gray-700 ms-1">Avbl</p>
          <span className="dark:text-white">- USDT</span>
        </div>
        <ArithmeticIcon className="w-4 h-4 text-gray-700" />
      </div>

      <form>
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <label className="text-xs font-normal text-gray-700">Price</label>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-10">
                <Input
                  label=""
                  name="price"
                  defaultValue="93,560.2"
                  className="dark:border-slate-800 hover:border-yellow-900 dark:hover:border-yellow-900 focus:hover:!border-yellow-900"
                  firstIcon={<span className="text-xs font-medium dark:text-white ps-2">USDT</span>}
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  className="w-full h-full text-xs font-normal rounded-md border border-gray-300 dark:border-slate-800 hover:border-black dark:hover:border-white focus:hover:border-white"
                >
                  BBO
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <label className="text-xs font-normal text-gray-700 pb-1">Size</label>
            <Input
              label=""
              name="price1"
              className="dark:border-slate-800 hover:border-yellow-900 dark:hover:border-yellow-900 focus:hover:border-yellow-900"
              firstIcon={
                <span className="flex flex-row items-center gap-1 text-xs font-medium dark:text-white ps-2">
                  BTC
                  <IoMdArrowDropdown className="text-gray-700" />
                </span>
              }
            />
          </div>
        </div>

        <div className="px-2">
          <CustomRangeSlider />
        </div>

        <div className="space-y-2">
          <Button color="yellow" size="sm" fullSized className="h-9">
            Resister Now
          </Button>
          <Button color="gray" size="sm" fullSized className="h-9">
            Log In
          </Button>
        </div>
      </form>
    </>
  );
};

export default ExchangeForm;
