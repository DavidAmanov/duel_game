import { useEffect, useRef } from "react";
import FieldModule from "./Field.module.css";

const Field = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext(`2d`);
    const w = (canvas.width = 900);
    const h = (canvas.height = 500);

    const hero1 = {
      x: 40,
      y: 50,
      direction: 1,
      speed: 2,
      color: "red",
      spells: [],
    };
    const hero2 = {
      x: 860,
      y: 450,
      direction: -1,
      speed: 2,
      color: "blue",
      spells: [],
    };

    let animationFrameId;

    const drawHero = (hero) => {
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = hero.color;
      ctx.fill();
      ctx.closePath();
    };

    const drawSpell = (spell) => {
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = spell.color;
      ctx.fill();
      ctx.closePath();
    };

    const updateHeroPosition = (hero) => {
      hero.y += hero.direction * hero.speed;
      if (hero.y > h - 20 || hero.y < 20) {
        hero.direction *= -1;
      }
    };

    const isCollision = (spell, hero) => {
      const dx = spell.x - hero.x;
      const dy = spell.y - hero.y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    };

    const shootSpell = (hero, direction) => {
      hero.spells.push({
        x: hero.x,
        y: hero.y,
        direction: direction,
        speed: 5,
        color: hero.color,
      });
    };

    const updateSpells = () => {
      hero1.spells = hero1.spells.filter((spell) => {
        spell.x += spell.direction * spell.speed;
        if (spell.x < 0 || spell.x > w || isCollision(spell, hero2)) {
          return false;
        }
        return true;
      });

      hero2.spells = hero2.spells.filter((spell) => {
        spell.x += spell.direction * spell.speed;
        if (spell.x < 0 || spell.x > w || isCollision(spell, hero1)) {
          return false;
        }
        return true;
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      drawHero(hero1);
      drawHero(hero2);
      hero1.spells.forEach(drawSpell);
      hero2.spells.forEach(drawSpell);
      updateHeroPosition(hero1);
      updateHeroPosition(hero2);
      updateSpells();
      animationFrameId = requestAnimationFrame(render);
    };

    const shootInterval = setInterval(() => {
      shootSpell(hero1, 1);
      shootSpell(hero2, -1);
    }, 1000);
    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootInterval);
    };
  }, []);

  return <canvas ref={ref} className={FieldModule.field}></canvas>;
};
export default Field;
