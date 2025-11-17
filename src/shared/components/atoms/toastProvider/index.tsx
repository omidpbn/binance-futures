"use client";

import { ToastContainer } from "react-toastify";
import { useThemeStore } from "@/shared/store/useThemeStore";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  const { dark } = useThemeStore();

  return <ToastContainer theme={dark ? "dark" : "light"} />;
};

export default ToastProvider;
