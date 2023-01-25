import { state } from "../../state";

export function initPageScore(root) {
  const currentState = state.getState();
  if (currentState.userName == "") {
    root.goTo("/");
  }

  const userName = state.getState().userName;
  const rivalName = state.getState().rivalName;
  const userScore = state.getState().userScore;
  const rivalScore = state.getState().rivalScore;
  const div = document.createElement("div");

  div.innerHTML = `
    <results-comp></results-comp>
    <br>
    <br>
    <div class="score">
    <p class="my-score"> ${userName}: ${userScore}</p>
    <p class="pc-score"> ${rivalName}: ${rivalScore}</p>
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
    state.setMyStatus(root, "ok", "/waiting-for");
  });
  return div;
}
