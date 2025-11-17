import Link from "next/link";

export const MenuLink = () => {
  return (
    <div>
      <ul className="flex items-center gap-6 text-sm font-medium">
        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Futures</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Optins</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Trading Bots</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Copy Trading</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Smart Money</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Campaigns</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">Data</li>
        </Link>

        <Link href="#">
          <li className="hover:text-yellow-900 cursor-pointer">More</li>
        </Link>
      </ul>
    </div>
  );
};
