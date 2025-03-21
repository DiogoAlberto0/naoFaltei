import { SVGProps } from "react";

interface IdentityIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}
export const IdentityIcon = ({
  size = 20,
  ...otherProps
}: IdentityIconProps) => {
  return (
    <svg
      viewBox="-0.5 0 25 25"
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
        {" "}
        <path
          d="M21 18.5H3C2.72 18.5 2.5 18.28 2.5 18V7C2.5 6.72 2.72 6.5 3 6.5H21C21.28 6.5 21.5 6.72 21.5 7V18C21.5 18.28 21.28 18.5 21 18.5Z"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
        <path
          d="M15.2201 12.74C16.2419 12.74 17.0701 11.9028 17.0701 10.87C17.0701 9.83722 16.2419 9 15.2201 9C14.1984 9 13.3701 9.83722 13.3701 10.87C13.3701 11.9028 14.1984 12.74 15.2201 12.74Z"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
        <path
          d="M18.5901 14.01C18.9001 14.54 19.0901 15.14 19.1201 15.78C19.1301 15.9 19.0301 16 18.9101 16H11.5201C11.4001 16 11.3101 15.9 11.3101 15.78C11.3501 15.14 11.5401 14.54 11.8401 14.01"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
        <path
          d="M4.5 12.5H8.92999"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
        <path
          d="M4.5 10.5H7.92999"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
        <path
          d="M4.5 14.5H6.92999"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};
