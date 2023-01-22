import { state } from "../../state";

export function initPageSalaLlena(params) {
  const currentState = state.getState()
  const roomId = currentState.roomId
  const div = document.createElement("div");
  div.innerHTML = `
    <h1 class="titulo">SALA LLENA</h1>
    <br>
    <p class="text">La sala ${roomId} ya está llena</p>
    <br>
    <br>
    <button-comp class="button">VOLVER AL INICIO</button-comp>
    `;
    
      const button = div.querySelector(".button") as HTMLElement;
    
      button.addEventListener("click", () => {

        params.goTo("/");
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
