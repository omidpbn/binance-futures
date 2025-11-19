import { SVGProps } from "react";

export const TechnicalIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.932 8.802a.9.9 0 011.266 1.266l-.061.069-5.647 5.646a1.4 1.4 0 01-1.874.096l-.106-.096-2.51-2.51-5.363 5.364a.9.9 0 01-1.274-1.274l5.647-5.646.106-.096a1.4 1.4 0 011.768 0l.106.096 2.51 2.51 5.363-5.364.069-.061z"
        fill="currentColor"
      ></path>
      <path
        d="M1.6 2.5a.9.9 0 011.8 0v18.1h18.1l.092.005a.9.9 0 010 1.79l-.092.005H3A1.4 1.4 0 011.6 21V2.5zM8.726 6.742a.3.3 0 01-.452 0L5.435 3.498A.3.3 0 015.661 3h5.678a.3.3 0 01.226.498l-2.84 3.244z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
