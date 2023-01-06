import { state } from "../../state";

export function initPageRoomUp(container) {
  const roomId = state.getState().roomId;

  const div = document.createElement("div");
  div.innerHTML = `
  <p class="titulo">HOLA ${state.getState().userName}</p>
  <h1 class="titulo">TU SALA ES<br>${roomId}</h1>
  <br>
  <button-comp class="button">IR AL JUEGO</button-comp>
  `;

  const button = div.querySelector(".button") as HTMLElement;

  button.addEventListener("click", () => {
    container.goTo("/instructions");
  });

  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 24px;
    text-align: center;
    font-weight: lighter;
  }
`;
  div.appendChild(style);
  return div;
}
