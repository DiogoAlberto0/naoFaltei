import { SVGProps } from "react";

interface HamburguerMenuIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}
export const HamburguerMenuIcon = ({
  size = 20,
  ...otherProps
}: HamburguerMenuIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      {...otherProps}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M4 6H20M4 12H20M4 18H20"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};
