import { useEffect, useState } from "react";

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  defaultOpen?: boolean;
}

const Tooltip = ({
  children,
  content,
  position = "top",

  className = "",
  defaultOpen = false,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(defaultOpen);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Get tooltip styles based on position
  const getTooltipStyles = () => {
    const baseStyles = {
      position: "absolute",
      background: "#333",
      color: "white",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.3s",
      pointerEvents: "none",
    } as const;

    switch (position) {
      case "top":
        return {
          ...baseStyles,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: "8px",
        };
      case "right":
        return {
          ...baseStyles,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: "8px",
        };
      case "bottom":
        return {
          ...baseStyles,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "8px",
        };
      case "left":
        return {
          ...baseStyles,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: "8px",
        };
      default:
        return baseStyles;
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleMouseLeave);

    return () => {
      document.removeEventListener("click", handleMouseLeave);
    };
  });

  return (
    <div
      className={`tooltip-container ${className}`}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && <div style={getTooltipStyles()}>{content}</div>}
    </div>
  );
};

export { Tooltip };
