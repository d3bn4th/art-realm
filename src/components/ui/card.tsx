import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

// CardProps extends HTMLDivElement attributes without adding new properties
type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

Card.displayName = "Card"; 