import { icons } from "lucide-react";

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
}

export const Icon = ({
  name,
  color = "currentColor",
  size = 24,
  className,
}: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.error(`Icon "${name}" does not exist in lucide-react icons.`);
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};
