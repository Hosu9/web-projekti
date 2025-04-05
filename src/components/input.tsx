import React from "react";

interface Props {
  type: string;
  value: string;
  // Event handler for input change
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  // Optional props
  className?: string;
}

export const Input = ({
  type,
  value,
  onChange,
  placeholder,
  // Default class if no specific class is provided
  className = "default-input",
}: Props) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    // className prop for more specific styling
    className={className}
  />
);
