import { state } from "../../state";

export function initPageTimeOut(params) {
  const div = document.createElement("div");
  div.innerHTML = `
  <h1 class="titulo">SE TE ACABÓ<br>EL TIEMPO</h1>
  <br>
  <button-comp class="button">JUGAR AHORA</button-comp>

  `;
  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 36px;
    text-align: center;
    font-weight: lighter;
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
