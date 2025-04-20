"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

interface ToggleItemProps {
  href: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}

export const ToggleItem = ({
  href,
  children,
  className = "",
  isActive = false,
}: ToggleItemProps) => {
  const router = useRouter();

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
      href={href}
      className={clsx(
        `
        block cursor-pointer px-3 py-2 rounded text-sm font-medium
        truncate overflow-hidden whitespace-nowrap text-ellipsis
        max-w-full min-h-10 transition-colors
        `,
        isActive
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-foreground hover:bg-default-100",
        className,
      )}
    >
      {children}
    </a>
  );
};
