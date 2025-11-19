import { SVGProps } from "react";

export const ChartStyleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.4 12.608v5.283l4.6 2.645 4.6-2.645v-5.283L16 9.963l-4.6 2.645zm11 5.524c0 .497-.267.954-.696 1.201l-5.01 2.882a1.392 1.392 0 01-1.387 0l-5.011-2.882a1.386 1.386 0 01-.696-1.201v-5.764c0-.497.267-.954.696-1.201l5.01-2.882a1.391 1.391 0 011.221-.08l.166.08 5.011 2.882c.43.247.696.704.696 1.201v5.764z"
        fill="currentColor"
      ></path>
      <path
        fill="currentColor"
        d="M13.5 15.5l2.475-2.475L18.45 15.5l-2.475 2.475zM21.5 3.1a.9.9 0 010 1.8h-19a.9.9 0 010-1.8h19zM7 11.1a.9.9 0 010 1.8H2.5a.9.9 0 010-1.8H7zM7 19.1a.9.9 0 010 1.8H2.5a.9.9 0 010-1.8H7z"
      ></path>
    </svg>
  );
};
