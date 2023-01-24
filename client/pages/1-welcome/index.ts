import { state } from "../../state";

export function initPageWelcome(root) {
  const div = document.createElement("div");
  div.innerHTML = `
  <h1 class="titulo">PIEDRA<br>PAPEL O<br>TIJERA</h1>
  <input-comp label="TU NOMBRE" type="text" name="nombre" class="input"></input-comp>
  <br>
  <br>
  <button-comp class="nuevo-juego">NUEVO JUEGO</button-comp>
  <br>
  <button-comp class="ingresar-sala">INGRESAR A SALA</button-comp>
 
  `;
  const input = div.querySelector(".input") as HTMLElement;
  const buttonNuevo = div.querySelector(".nuevo-juego") as HTMLElement;
  const buttonIngresar = div.querySelector(".ingresar-sala") as HTMLElement;

  const currentState = state.getState();

  buttonNuevo.addEventListener("click", () => {
    const userName = input
      .shadowRoot!.querySelector("input")!
      .value.toUpperCase();
    currentState.userName = userName;
    state.setState(currentState);
    state.setUserName("room-up", root);

  });

  buttonIngresar.addEventListener("click", () => {
    const userName = input
      .shadowRoot!.querySelector("input")!
      .value.toUpperCase();
    currentState.userName = userName;
    state.setState(currentState);
    state.setUserName("room-in", root);
    root.goTo("/room-in");
  });

  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 58px;
    text-align: center;
    font-weight: lighter;
  }
`;
  div.appendChild(style);
  return div;
}
