import { DetailedHTMLProps, HTMLAttributes } from "react";

interface IHourTextProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  hour: number;
  minute: number;
  seconds?: number;
}
export const HourText = ({
  hour,
  minute,
  seconds,
  ...otherProps
}: IHourTextProps) => {
  return (
    <p {...otherProps}>
      {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
      {seconds && ":" + seconds.toString().padStart(2, "0")}
    </p>
  );
};
