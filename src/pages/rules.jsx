// I moved this out of the score keeper component,
// because i think this is going to be a separate page (?)
// lmk if you need help routing it or with anything else in general :) -Karita
import React from "react";
import { Layout } from "../components/layout";



export const Rules = () => {
  return (
    <Layout>
      <div className="BowlingRules">
        <div className="Rules">
          <h1 className="Rules-header">Rules</h1>
          <p>
            Hei <br />
            Moi <br />
          </p>
        </div>
      </div>
    </Layout>
  );
};


