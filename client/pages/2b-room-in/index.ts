import { state } from "../../state";

export function initPageRoomIn(root) {
  const currentState = state.getState();
  if (currentState.userName == ""){
    root.goTo("/")
  }

  const div = document.createElement("div");
  div.innerHTML = `
  <p class="titulo">HOLA ${state.getState().userName.toUpperCase()}</p>
  <h1 class="titulo">INGRESÁ EL ID<br>DE TU SALA</h1>
  <br>
  <input-comp label="numero de sala" name="number" class="input"></input-comp>
  <br>
  <br>
  <button-comp class="button">IR AL JUEGO</button-comp>
  `;

  const input = div.querySelector(".input") as HTMLElement;
  const button = div.querySelector(".button") as HTMLElement;

  button.addEventListener("click", () => {
    const roomId = input.shadowRoot!.querySelector("input")!.value;
    currentState.roomId = roomId;
    state.setState(currentState);
    state.getInRoom(roomId, root);

    // root.goTo("/instructions");
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
