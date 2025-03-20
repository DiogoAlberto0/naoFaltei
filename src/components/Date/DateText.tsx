import { DetailedHTMLProps, HTMLAttributes } from "react";

interface IDateTextProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  date: Date;
  isFullDay?: boolean;
  isFullMonth?: boolean;
  isFullYear?: boolean;
  locale?: Intl.LocalesArgument;
}
export const DateText = ({
  date,
  isFullDay = false,
  isFullMonth = false,
  isFullYear = false,
  locale = "pt-br",
  ...otherProps
}: IDateTextProps) => {
  return (
    <p {...otherProps}>
      {date.toLocaleDateString(locale, {
        day: isFullDay ? "numeric" : "2-digit",
        month: isFullMonth ? "long" : "2-digit",
        year: isFullYear ? "numeric" : "2-digit",
      })}
    </p>
  );
};
