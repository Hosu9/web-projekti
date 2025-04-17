
import React, {useState} from "react";
import { Layout } from "../components/layout";
import { Button } from "../components/button";

export const Rules = () => {
  const [language, setLanguage] = useState("en");

  const rules = {
    fi: `
• Pelaaja heittää palloa rataa pitkin yrittäen kaataa kaikki 10 keilaa.

• Jokainen ruutu koostuu kahdesta heitosta, joiden tavoitteena on kaataa kaikki keilat.

• Kaikki keilat kaatuvat yhdellä heitolla = STRIKE.

• Kaikki keilat kaatuvat kahdella heitolla = SPARE.

• Jokainen peli koostuu kymmenestä ruudusta. 
 Jos saat striken kymmenennessä ruudussa, saat kaksi lisäheittoa. Jos saat sparen, saat yhden lisäheiton.

• Avoin ruutu tarkoittaa ruutua, jossa ei ole strikea eikä sparea.

• Pisteytys perustuu siihen, kuinka monta keilaa kaadat. Jos saat sparen, saat seuraavan heiton keilat lisäpisteiksi sille ruudulle. Jos saat striken, saat seuraavien kahden heiton keilat lisäpisteiksi.

• Pelissä pelataan yleensä kolmen sarjan keskiarvo. 
 Tämä lasketaan yhteenlaskemalla kaikki kolme pistemäärää ja jakamalla ne kolmella.

• Tarkat ennakkopisteet ovat tärkeitä reilua sarjajakoa varten.

• Raja on käytössä: jos astut rajan yli, heiton kaatamat keilat eivät vaikuta pistemäärään.

• Ramppilaitteita saavat käyttää pelaajat, jotka eivät fyysisesti pysty heittämään palloa. 
 Ramppi on tarkoitettu liikuntarajoitteisille, ei pelkän pistemäärän nostamiseen.

• Reunasuojia (bumpereita) ei ole sallittu.

`,

    en: `
• A player rolls a ball down the lane trying to knock down all 10 pins.

• Each frame consists of throwing the ball twice to knock down all the pins

• All pins down in one roll = STRIKE.

• All pins down in two rolls = SPARE.

• Each games consists of ten frames. If you bowl a strike in the tenth frame, you get
  two more balls. If you throw a spare, you get one more ball.

• Open frames are frames without a strike or spare

• Scoring is based on the number of pins you knock down. However, if you bowl a
  spare, you get to add the pins in your next ball to that frame. For strikes, you get
  the next two balls. 

• An average of three games is played. You determine a 3 game average by adding
  all 3 scores and then dividing that number by 3.

• Accurate preliminary scores are essential for fair divisioning. 

• Foul line is in effect. If you step over the foul line, any pins knocked down will not
  count towards your score.

• Ramp Bowling is allowed for those athletes that are not physically capable of
  rolling a bowling ball. The ramp is for physical disabilities and not to be used to
  just increase a score.

• Bumpers are not allowed.`
  };
  
  return (
    <Layout>
      <div className="BowlingRules">
        <div className="Rules">
          <h1 className="Rules-header">Bowling rules</h1>
          <Button onClick={() => setLanguage("en")} className={`rules-en-btn ${language === "en" ? "active" : ""}`} value="EN English" />
          <Button onClick={() => setLanguage("fi")}  className={`rules-fi-btn ${language === "fi" ? "active" : ""}`} value="FI Suomi" /> 
          <div className="rules-text-container">
            <p className="rules-text">{rules[language]}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};


