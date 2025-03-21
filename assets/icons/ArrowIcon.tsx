import { SVGProps } from "react";

interface ArrowIconProps extends SVGProps<SVGSVGElement> {
  direction: "top" | "down" | "right" | "left";
  size?: number;
}
export const ArrowIcon = ({
  direction,
  size = 20,
  ...otherProps
}: ArrowIconProps) => {
  const directions = {
    right: "rotate(0)",
    down: "rotate(90)",
    left: "rotate(180)",
    top: "rotate(270)",
  };
  return (
    <svg
      fill="currentColor"
      version="1.1"
      id="XMLID_287_"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={size}
      width={size}
      transform={directions[direction]}
      {...otherProps}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g id="next">
          {" "}
          <g>
            {" "}
            <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};
