// I moved this out of the score keeper component,
// because i think this is going to be a separate page (?)
// lmk if you need help routing it or with anything else in general :) -Karita

import React, { useState } from "react";
import { Button } from "../components/button";

const BowlingRules = () => {
  const [language, setLanguage] = useState("EN");

  const rules = {
    fi: "Keilauksen säännöt suomeksi...",
    en: "Bowling rules in english...",
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>Bowling Rules</h2>
      <Button onClick={() => setLanguage("en")} value="EN English" />
      <Button onClick={() => setLanguage("fi")} value="FI Suomi" />
      <p>{rules[language]}</p>
    </div>
  );
};

export default BowlingRules;
