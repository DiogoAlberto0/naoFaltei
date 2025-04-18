import { Switch, SwitchProps } from "@heroui/switch";

interface IDoubleSwitchProps extends SwitchProps {
  leftLabel: string;
  rightLabel: string;
}
export const DoubleSwitch = ({
  leftLabel,
  rightLabel,
  className,
  title,
  ...otherProps
}: IDoubleSwitchProps) => {
  return (
    <div
      className={`flex items-center gap-3 bg-content2 p-2 rounded-lg h-max w-max ${className}`}
    >
      <h1>{title}</h1>
      <span className="text-sm font-medium ">{leftLabel}</span>
      <Switch name="Clockin" color="success" {...otherProps} />
      <span className="text-sm font-medium ">{rightLabel}</span>
    </div>
  );
};
