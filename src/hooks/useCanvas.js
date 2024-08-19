import { useEffect } from "react";
const useCanvas = (hero1, hero2, ref, setHero, setShowMenu) => {
  useEffect(() => {
    let isDragging = false; //flag drag the slide or not
    let activeHero = null; //to define hero 1 or 2
    let activeSlider = null; //to define slider what we change
    const heroSize = 20;
    //canvas field properties
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = 900);
    const h = (canvas.height = 500);

    //mouse and set mouse position on screen
    const mouse = { x: 0, y: 0 };
    function setPos(x, y) {
      const rect = canvas.getBoundingClientRect();
      [mouse.x, mouse.y] = [x - rect.left, y - rect.top];
    }

    const heroes = [hero1, hero2];
    let animationFrameId;

    //define the intervals
    let shootInterval;
    let shootInterval2;

    //draw the all object on the field
    const drawHero = (hero) => {
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, heroSize, 0, Math.PI * 2);
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

    const drawScore = (score1, score2) => {
      ctx.font = "30px Arial";
      ctx.fillStyle = "blueviolet";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(`${score1}:${score2}`, 450, 20);
    };

    const drawPlayerSpeedRegulator = (slider) => {
      if (!slider) return;

      ctx.fillStyle = slider.color;
      ctx.fillRect(slider.x, slider.y, slider.width, slider.height);

      const knobY = slider.y + (slider.height * slider.value) / 100;

      ctx.beginPath();
      ctx.arc(
        slider.x + slider.width / 2,
        knobY,
        slider.knobRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    };

    //spell object
    const shootSpell = (hero, direction) => {
      hero.spells.push({
        x: hero.x,
        y: hero.y,
        direction: direction,
        speed: 4,
        color: hero.colorSpell,
      });
    };

    //functions to update propirties of objects
    const updateHeroPosition = (hero) => {
      hero.y += hero.direction * hero.speed;
      if (hero.y > h - heroSize || hero.y < heroSize) {
        hero.direction *= -1;
      }
      const distance = Math.sqrt(
        (hero.x - mouse.x) ** 2 + (hero.y - mouse.y) ** 2
      );
      if (distance < heroSize) {
        hero.direction *= -1;
      }
    };

    const updateSpeedRegulator = (mouseY, hero, slider) => {
      const rect = canvas.getBoundingClientRect();
      const relativeY = mouseY - rect.top;

      const newValue = ((relativeY - slider.y) / slider.height) * 100;
      slider.value = Math.max(0, Math.min(100, newValue));

      if (slider === hero.speedSlider) {
        hero.speed = 5 + (slider.value / 100) * 10;
      } else if (slider === hero.spellFrequancySlider) {
        hero.spellFrequancy = 1000 - (slider.value / 100) * 900;
        updateShootIntervals();
      }

      drawPlayerSpeedRegulator(slider);
    };

    //function isCollision check hero hit the target or not
    const isCollision = (spell, hero) => {
      const dx = spell.x - hero.x;
      const dy = spell.y - hero.y;
      if (Math.sqrt(dx * dx + dy * dy) < heroSize) {
        if (hero.player === "first") {
          hero2.score += 1;
        } else {
          hero1.score += 1;
        }
        return true;
      }
      return false;
    };

    //check spells on the Field or not
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

    //mouse event functions
    const handleMouseDown = (e) => {
      isDragging = true;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      activeHero = heroes.find((hero) => {
        const isSpeedSlider =
          mouseX >= hero.speedSlider.x &&
          mouseX <= hero.speedSlider.x + hero.speedSlider.width;
        const isSpellFrequancySlider =
          mouseX >= hero.spellFrequancySlider.x &&
          mouseX <=
            hero.spellFrequancySlider.x + hero.spellFrequancySlider.width;
        if (isSpeedSlider) {
          activeSlider = hero.speedSlider;
          return true;
        } else if (isSpellFrequancySlider) {
          activeSlider = hero.spellFrequancySlider;
          return true;
        }
        return false;
      });

      if (activeHero) {
        updateSpeedRegulator(mouseY, activeHero, activeSlider);
      }
    };

    const handleMouseMove = (e) => {
      setPos(e.clientX, e.clientY);
      if (isDragging && activeHero && activeSlider) {
        updateSpeedRegulator(e.clientY, activeHero, activeSlider);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      activeHero = null;
      activeSlider = null;
    };

    //click the hero call the Menu comp
    const handleHeroClick = (e, hero) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX > hero.x - heroSize &&
        mouseX < hero.x + heroSize &&
        mouseY > hero.y - heroSize &&
        mouseY < hero.y + heroSize
      ) {
        if (hero.player === "first") {
          setHero("first");
        } else {
          setHero("second");
        }
        setShowMenu(true);
      }
    };

    //start the interval of shooting or clear the interval
    const updateShootIntervals = () => {
      if (shootInterval) clearInterval(shootInterval);
      if (shootInterval2) clearInterval(shootInterval2);

      shootInterval = setInterval(() => {
        shootSpell(hero1, 1);
      }, hero1.spellFrequancy);

      shootInterval2 = setInterval(() => {
        shootSpell(hero2, -1);
      }, hero2.spellFrequancy);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("click", (e) => {
      handleHeroClick(e, hero1);
      handleHeroClick(e, hero2);
    });

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      heroes.forEach((hero) => {
        drawHero(hero);
        drawPlayerSpeedRegulator(hero.speedSlider);
        drawPlayerSpeedRegulator(hero.spellFrequancySlider);
        hero.spells.forEach(drawSpell);
        updateHeroPosition(hero);
      });
      drawScore(hero1.score, hero2.score);
      updateSpells();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    updateShootIntervals();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootInterval);
      clearInterval(shootInterval2);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("click", (e) => {
        handleHeroClick(e, hero1);
        handleHeroClick(e, hero2);
      });
    };
  }, []);
};
export default useCanvas;
