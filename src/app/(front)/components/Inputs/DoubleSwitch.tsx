import { Switch, SwitchProps } from "@heroui/switch";

interface IDoubleSwitchProps extends SwitchProps {
  leftLabel: string;
  rightLabel: string;
  title?: string;
}

export const DoubleSwitch = ({
  leftLabel,
  rightLabel,
  className = "",
  title,
  ...otherProps
}: IDoubleSwitchProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl w-full shadow-sm border border-zinc-200 dark:border-zinc-700 ${className}`}
    >
      {title && (
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
      )}

      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex-wrap">
        <span>{leftLabel}</span>
        <Switch name="Clockin" color="success" {...otherProps} />
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};
