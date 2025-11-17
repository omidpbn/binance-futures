"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../../atoms/button";
import ThemeSwitcher from "../../atoms/themeSwitcher";
import { MenuLink } from "../../atoms/menuLink/menuLink";
import { useThemeStore } from "@/shared/store/useThemeStore";
import logo from "@/assets/image/image.png";
import logo1 from "@/assets/image/image2.png";
import { Earth } from "../../atoms/illustrators/Earth";
import { HelpCenter } from "../../atoms/illustrators/HelpCenter";
import { Features } from "../../atoms/illustrators/Features";
import { GoHomeFill } from "react-icons/go";

const Header = () => {
  const { dark } = useThemeStore();

  return (
    <>
      <header className="flex items-center justify-between bg-white text-black dark:bg-slate-900 dark:text-white px-4">
        <div className="flex items-center md:gap-4 gap-1">
          <Link href="#">
            <GoHomeFill className="w-6 h-6" />
          </Link>

          {dark ? (
            <Link href="#">
              <Image src={logo} alt="" width={88} height={64} />
            </Link>
          ) : (
            <Link href="#">
              <Image src={logo1} alt="" width={88} height={64} />
            </Link>
          )}

          <MenuLink />
        </div>

        <div className="flex items-center md:gap-4 gap-2">
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm">
              Log In
            </Button>

            <Button color="yellow" size="sm">
              Sign Up
            </Button>
          </div>

          <Earth className="w-5 h-5 hover:text-yellow-900 cursor-pointer" />
          <HelpCenter className="w-5 h-5 hover:text-yellow-900 cursor-pointer" />
          <Features className="w-5 h-5 hover:text-yellow-900 cursor-pointer" />
          <ThemeSwitcher />
        </div>
      </header>
    </>
  );
};
export default Header;
