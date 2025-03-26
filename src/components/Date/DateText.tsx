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
  isFullDate?: boolean;
  locale?: Intl.LocalesArgument;
}
export const DateText = ({
  date,
  isFullDay = false,
  isFullMonth = false,
  isFullYear = false,
  isFullDate = false,
  locale = "pt-br",
  ...otherProps
}: IDateTextProps) => {
  return (
    <p {...otherProps}>
      {date.toLocaleDateString(locale, {
        day: isFullDay || isFullDate ? "numeric" : "2-digit",
        month: isFullMonth || isFullDate ? "long" : "2-digit",
        year: isFullYear || isFullDate ? "numeric" : "2-digit",
      })}
    </p>
  );
};
