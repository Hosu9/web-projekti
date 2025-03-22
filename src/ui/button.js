import React from "react";

export const Button = ({ onClick, children }) => (
  <button onClick={onClick} style={{ margin: "5px", padding: "10px 15px", cursor: "pointer" }}>
    {children}
  </button>
);

export const Input = ({ value, onChange, placeholder }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{ margin: "5px", padding: "10px", width: "200px" }}
  />
);
