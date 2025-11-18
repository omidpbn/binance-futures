import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

export const MenuLink = () => {
  return (
    <div>
      <ul className="flex items-center gap-6 text-sm font-medium">
        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            Futures
            <IoIosArrowDown />
          </li>
        </Link>

        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            Optins
            <IoIosArrowDown />
          </li>
        </Link>

        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            Trading Bots
            <IoIosArrowDown />
          </li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Copy Trading</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Smart Money</li>
        </Link>

        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            Campaigns
            <IoIosArrowDown />
          </li>
        </Link>

        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            Data
            <IoIosArrowDown />
          </li>
        </Link>

        <Link href="#">
          <li className="flex flex-row items-center gap-1 hover:text-yellow-900 cursor-pointer">
            More
            <IoIosArrowDown />
          </li>
        </Link>
      </ul>
    </div>
  );
};
