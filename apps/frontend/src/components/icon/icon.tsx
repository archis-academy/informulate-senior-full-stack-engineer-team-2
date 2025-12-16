interface IconProps {
  name: "arrow-right" | "arrow-left" | "check";
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

    case "arrow-left":
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
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );

    case "check":
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
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );

    default:
      return null;
  }
}
