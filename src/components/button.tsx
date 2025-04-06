import React from "react";

interface Props {
  value: string;
  onClick: () => void;
  // Optional prop for more specific styling
  className?: string;
}

export const Button = ({
  value,
  onClick,
  className = "default-btn",
}: Props) => (
  <button onClick={onClick} className={className}>
    {value}
  </button>
);
