import { state } from "../../state";

export function initPageTimeOut(params) {
  const div = document.createElement("div");
  div.innerHTML = `
  <h1 class="titulo">Se te acabó el tiempo</h1>
  <br>
  <button-comp class="button">JUGAR AHORA</button-comp>

  `;
  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 36px;
  }

`;

  div.appendChild(style);

  const button = div.querySelector(".button");
  button!.addEventListener("click", () => {
    state.setStatus(params, 'ok', "/game")
    // params.goTo("/game");
  });
  return div;
}
