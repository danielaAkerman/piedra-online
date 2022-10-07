import { state } from "../../state";

export function initPageRoomUp(container) {
  const roomId = state.getState().roomId;

  const div = document.createElement("div");
  div.innerHTML = `
  <p class="titulo">Hola ${state.getState().userName}</p>
  <h1 class="titulo">Tu sala es<br>${roomId}</h1>
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
    font-size: 58px;
    text-align: center;
  }
`;
  div.appendChild(style);
  return div;
}
