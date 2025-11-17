import { SVGProps } from "react";

export const Features = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.14 8.04v7.92L12 19.92l6.86-3.96V8.04L12 4.077 5.14 8.04zm15.52 8.094l-.012.199a1.5 1.5 0 01-.738 1.1l-7.16 4.134-.179.088c-.365.15-.777.15-1.142 0l-.179-.088-7.16-4.134a1.5 1.5 0 01-.737-1.1l-.013-.2V7.867a1.5 1.5 0 01.75-1.299l7.16-4.134a1.5 1.5 0 011.5 0l7.16 4.134a1.5 1.5 0 01.75 1.3v8.267z"
        fill="currentColor"
      ></path>
      <path d="M12 8.82l3.182 3.182L12 15.184l-3.182-3.182L12 8.82z" fill="currentColor"></path>
    </svg>
  );
};
