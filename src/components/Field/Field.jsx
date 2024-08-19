import { useEffect, useRef, useState } from "react";
import Menu from "../Menu/Menu";
import FieldModule from "./Field.module.css";
import useCanvas from "../../hooks/useCanvas";

const Field = () => {
  const [colorSpell, setColorSpell] = useState("red");
  const [colorSpell2, setColorSpell2] = useState("blue");
  const [hero, setHero] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef(null);
  const refInput = useRef(null);

  const hero1 = useRef({
    player: "first",
    x: 90,
    y: 50,
    direction: 1,
    speed: 5,
    speedSlider: {
      x: 5,
      y: 100,
      width: 12,
      height: 220,
      knobRadius: 10,
      value: 0,
      color: "yellow",
    },
    spellFrequancy: 1000,
    spellFrequancySlider: {
      x: 30,
      y: 100,
      width: 12,
      height: 220,
      knobRadius: 10,
      value: 0,
      color: "orange",
    },
    color: "red",
    spells: [],
    colorSpell: colorSpell,
    score: 0,
  }).current;

  const hero2 = useRef({
    player: "second",
    x: 810,
    y: 450,
    direction: -1,
    speed: 5,
    speedSlider: {
      x: 880,
      y: 100,
      width: 12,
      height: 220,
      knobRadius: 10,
      value: 0,
      color: "yellow",
    },
    spellFrequancy: 1000,
    spellFrequancySlider: {
      x: 855,
      y: 100,
      width: 12,
      height: 220,
      knobRadius: 10,
      value: 0,
      color: "orange",
    },
    color: "blue",
    spells: [],
    colorSpell: colorSpell2,
    score: 0,
  }).current;

  const updateHeroSpellsColor = () => {
    hero1.colorSpell = colorSpell;
    hero2.colorSpell = colorSpell2;
  };

  const chooseColor = () => {
    if (hero === "first") {
      setColorSpell(refInput.current.value);
    } else {
      setColorSpell2(refInput.current.value);
    }
    setShowMenu(false);
  };

  useCanvas(hero1, hero2, ref, setHero, setShowMenu);

  useEffect(updateHeroSpellsColor, [colorSpell, colorSpell2]);

  return (
    <div>
      <canvas ref={ref} className={FieldModule.field}></canvas>
      {showMenu && <Menu chooseColor={chooseColor} refInput={refInput} />}
    </div>
  );
};

export default Field;
