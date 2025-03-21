import { SVGProps } from "react";

interface AddIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}
export const AddIcon = ({ size = 20, ...otherProps }: AddIconProps) => {
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
        {" "}
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"></circle>{" "}
        <path
          d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>{" "}
      </g>
    </svg>
  );
};
