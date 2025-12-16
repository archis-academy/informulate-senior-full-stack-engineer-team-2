import React from "react";

interface IconProps {
  name: "arrow-right" | "arrow-left" | "check" | string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className, size = 24 }: IconProps) {
  switch (name) {
    case "arrow-right":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    // Add other icons here as needed
    default:
      return null;
  }
}
