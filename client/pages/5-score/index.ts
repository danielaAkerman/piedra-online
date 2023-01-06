import { state } from "../../state";

export function initPageScore(container) {
  const myName = state.getState().userName;
  const rivalName = (state.getState().rivalName || "compu").toUpperCase() ;
  const myScore = state.getState().historyScore.myPlay;
  const pcScore = state.getState().historyScore.pcPlay;
  const div = document.createElement("div");

  div.innerHTML = `
    <results-comp></results-comp>
    <br>
    <br>
    <div class="score">
    <p class="my-score"> ${myName}: ${myScore}</p>
    <p class="pc-score"> ${rivalName}: ${pcScore}</p>
    </div>
    <br>
    <button-comp class="button">SEGUIR JUGANDO</button-comp>

    `;

  const style = document.createElement("style");
  style.textContent = `
    p{
      font-size: 32px;
      margin: 10px;
      text-align: center;
      font-weight: lighter;
    }
  `;

  div.appendChild(style);
  const button = div.querySelector(".button") as HTMLElement;
  button.addEventListener("click", () => {
    container.goTo("/game");
  });
  return div;
}
