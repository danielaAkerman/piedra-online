import { state } from "../../state";

export function initPageWelcome(params) {
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

  buttonNuevo.addEventListener("click", () => {
    const userName = input
      .shadowRoot!.querySelector("input")!
      .value.toUpperCase();
    state.setUserName(userName);
    state.setNewRoom(params);
    // params.goTo("/room-up");
  });

  buttonIngresar.addEventListener("click", () => {
    const userName =
      input.shadowRoot!.querySelector("input")!.value[0].toUpperCase() +
      input.shadowRoot!.querySelector("input")!.value.slice(1);
    state.setUserName(userName);
    params.goTo("/room-in");
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
