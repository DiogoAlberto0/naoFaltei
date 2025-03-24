import { DetailedHTMLProps, HTMLAttributes } from "react";

interface IHourTextProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  hour: number;
  minute: number;
}
export const HourText = ({ hour, minute, ...otherProps }: IHourTextProps) => {
  return (
    <p {...otherProps}>
      {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
    </p>
  );
};
