import { state } from "../../state";

export function initPageInstructions(root) {
  // state.escucharCambios()
  const currentState = state.getState();
  if (currentState.userName == "") {
    root.goTo("/");
  }

  const div = document.createElement("div");
  div.innerHTML = `
    <h1 class="titulo">INSTRUCCIONES</h1>
    <br>
    <p class="text">TENÉS 3 SEGUNDOS<br>PARA SELECCIONAR<br>PIEDRA, PAPEL<br>O TIJERA</p>
    <br>
    <br>
    <button-comp class="button">JUGAR AHORA</button-comp>
    `;

  const button = div.querySelector(".button") as HTMLElement;
  button.addEventListener("click", () => {
    if (currentState.rivalStatus == "ok") {
      state.setMyStatus(root, "ok", "/game");
    } else {
      state.setMyStatus(root, "ok", "/waiting-for");
    }
  });

  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 32px;
    text-align: center;
    font-weight: lighter;
  }
  .text{
    font-size: 24px;
    text-align: center;
    font-weight: lighter;
  }
`;

  div.appendChild(style);
  return div;
}
