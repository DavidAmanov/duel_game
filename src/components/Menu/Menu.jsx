import MenuModule from "./Menu.module.css";

const Menu = ({ chooseColor, refInput }) => {
  return (
    <div className={MenuModule.menu}>
      <span>Choose the spell color:</span>
      <input ref={refInput} type="color"></input>
      <button onClick={chooseColor}>Choose</button>
    </div>
  );
};

export default Menu;
