import { SVGProps } from "react";

interface FullScreenIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}
export const FullScreenIcon = ({
  size = 20,
  ...otherProps
}: FullScreenIconProps) => {
  return (
    <svg
      viewBox="0 0 512 512"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="currentColor"
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
        {" "}
        <title>full-screeen</title>{" "}
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g
            id="drop"
            fill="currentColor"
            transform="translate(64.000000, 64.000000)"
          >
            {" "}
            <path
              d="M42.6666667,-4.26325641e-14 L-4.26325641e-14,-4.26325641e-14 L-4.26325641e-14,42.6666667 L-4.26325641e-14,128 L42.6666667,128 L42.6666667,42.6666667 L128,42.6666667 L128,-4.26325641e-14 L42.6666667,-4.26325641e-14 Z M42.6666667,256 L-4.26325641e-14,256 L-4.26325641e-14,341.333333 L-4.26325641e-14,384 L42.6666667,384 L128,384 L128,341.333333 L42.6666667,341.333333 L42.6666667,256 Z M256,-4.26325641e-14 L256,42.6666667 L341.333333,42.6666667 L341.333333,128 L384,128 L384,42.6666667 L384,-4.26325641e-14 L341.333333,-4.26325641e-14 L256,-4.26325641e-14 Z M341.333333,341.333333 L256,341.333333 L256,384 L341.333333,384 L384,384 L384,341.333333 L384,256 L341.333333,256 L341.333333,341.333333 Z"
              id="Combined-Shape"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};
