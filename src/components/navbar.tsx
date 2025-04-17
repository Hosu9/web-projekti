import React from "react";
import { useLocation } from "@tanstack/react-router";

export const Navbar = () => {
  // Gets the current location from the router
  const location = useLocation();

  // Links and their names to be displayed in the navbar
  const links = [
    { url: "/", name: "Home" },
    { url: "/score-keeper", name: "Score Keeper" },
    { url: "/rules", name: "Rules" },
  ];

  return (
    <nav className="nav">
      <div className="logo-container">
        <a href="/">
          <img src="/src/assets/icon.png" alt="Logo" className="logo" />
        </a>
        <a href="/">
          <h1>Score Keeper</h1>
        </a>
      </div>

      <div className="links">
        <ul>
          {/* If current location matches the link, add active class to it (and highlight it via styling) */}
          {links.map((link, index) => (
            <li
              key={index}
              className={location.pathname === link.url ? "active" : ""}
            >
              <a href={link.url} style={{ display: "block" }}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
