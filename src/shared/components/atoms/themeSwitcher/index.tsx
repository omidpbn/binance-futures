"use client";

import { useEffect } from "react";
import Button from "../button";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useThemeStore } from "@/shared/store/useThemeStore";

const ThemeSwitcher = () => {
  const { dark, setDark, toggle } = useThemeStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
    } else if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button color="" size="xs" onClick={() => toggle()}>
      {!dark ? <LuSunMedium className="w-5 h-5 hover:text-yellow-900" /> : <IoMoonOutline className="w-5 h-5 hover:text-yellow-900" />}
    </Button>
  );
};

export default ThemeSwitcher;
