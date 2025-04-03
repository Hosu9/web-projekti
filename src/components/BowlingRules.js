import React, { useState } from "react";
import { Button } from "../ui/button.js";

const BowlingRules = () => {
  const [language, setLanguage] = useState("EN");

  const rules = {
    fi: "Keilauksen säännöt suomeksi...",
    en: "Bowling rules in english..."
    };

  return (
    <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h2>Bowling Rules</h2>
      <Button onClick={() => setLanguage("en")}>EN English</Button>
      <Button onClick={() => setLanguage("fi")}>FI Suomi</Button>
      <p>{rules[language]}</p>
    </div>
  );
};

export default BowlingRules;