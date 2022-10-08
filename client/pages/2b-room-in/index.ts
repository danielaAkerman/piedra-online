import { state } from "../../state";

export function initPageRoomIn(params) {
  const div = document.createElement("div");
  div.innerHTML = `
  <p class="titulo">Hola ${state.getState().userName}</p>
  <h1 class="titulo">Ingresá el número <br> de tu sala</h1>
  <br>
  <input-comp label="numero de sala" type="number" name="number" class="input"></input-comp>
  <br>
  <button-comp class="button">IR AL JUEGO</button-comp>
  `;

  const input = div.querySelector(".input") as HTMLElement;
  const button = div.querySelector(".button") as HTMLElement;

  button.addEventListener("click", () => {
    const roomId = input.shadowRoot!.querySelector("input")!.value;
    state.entrarSala(roomId, params);

    // params.goTo("/instructions");
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
