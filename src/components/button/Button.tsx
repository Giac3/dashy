import React from "react";

type TButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "success" | "error" | "default";
  outlined?: boolean;
};

const Button = ({
  children,
  onClick,
  onMouseDown,
  disabled,
  outlined = true,
  type,
}: TButtonProps) => {
  return (
    <button
      className={`p-2 w-full ${
        disabled
          ? "opacity-50 cursor-none"
          : "active:scale-95 hover:bg-surface cursor-pointer"
      } rounded-md flex items-center justify-center ${
        outlined ? "border-[1px] shadow-md" : ""
      } ${
        type === "success"
          ? "bg-green"
          : type === "error"
          ? "bg-red"
          : "bg-tertiary"
      }  transition duration-100 cursor-pointer border-border flex gap-2`}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
};

export { Button };
