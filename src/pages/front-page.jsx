import React from "react";
import { Layout } from "../components/layout";
import bowlingImage from "../assets/bowling-ball-and-pins.png";

export const FrontPage = () => {
  return (
    <Layout>
      <div className="frontpage">
        <div className="fp-content">
          <div className="home-header">
            <h1>Welcome to the</h1>
            <h1 className="orange-header">Bowling Score Keeper!</h1>
          </div>
          <p>
            Here you can keep track of your bowling scores for up to 4 players.
            <br /> <br />
            Monitor your progress, calculate your three-round average score, and
            compare your resultst with your bowling pals to see who's leading
            the scoreboard!
          </p>

          <div className="start-catchphrase">
            <a href="/scoreboard" className="btn btn-primary">
              Start tracking!
            </a>
            <a href="/scoreboard" className="btn btn-primary">
              <img src={bowlingImage} alt="bowling ball and pins" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
