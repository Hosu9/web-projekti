// Source: https://chrisdevcode.hashnode.dev/how-to-create-a-layout-component-react

import React from "react";
import { Navbar } from "./navbar";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className="container">
      <Navbar />
      <div className="content">{children}</div>
    </div>
  );
};
