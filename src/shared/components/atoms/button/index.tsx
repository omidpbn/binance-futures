import { type ReactNode } from "react";
import { Button as FlowbiteButton, ButtonProps as FlowbiteButtonProps } from "flowbite-react";
import { CustomFlowbiteTheme } from "flowbite-react/types";

interface ButtonProps extends FlowbiteButtonProps {
  children: ReactNode;
  color: FlowbiteButtonProps["color"];
}

const customTheme: CustomFlowbiteTheme["button"] = {
  base: "relative flex items-center justify-center text-center focus:outline-none focus:ring-0 rounded cursor-pointer",
  fullSized: "w-full",
  color: {
    yellow: "bg-yellow-900 text-black  hover:bg-yellow-900 dark:bg-yellow-900 dark:hover:bg-yellow-900",
    gray: "bg-gray-800 hover:bg-gray-800 text-black dark:bg-gray-950 dark:hover:bg-gray-950 dark:text-white disabled:!bg-gray-500 disabled:!text-gray-600 disabled:dark:!bg-slate-800 disabled:dark:!text-slate-700 disabled:!opacity-100",
  },
  size: {
    sm: "text-sm font-medium px-[10px] py-1",
    xs: "text-xs font-medium px-0 py-1",
  },
};

const Button = ({ children, color, outline, pill, ...props }: ButtonProps) => {
  return (
    <FlowbiteButton theme={customTheme} color={color} outline={outline} pill={pill} {...props} className="">
      {children}
    </FlowbiteButton>
  );
};

export default Button;
