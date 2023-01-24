import { state } from "../../state";

export function initPageScore(root) {
  const currentState = state.getState();
  if (currentState.userName == "") {
    root.goTo("/");
  }

  // const myName = state.getState().userName.toUpperCase();
  // const rivalName = (state.getState().rivalName || "compu").toUpperCase();
  // const myScore = state.getState().historyScore.myPlay;
  // const pcScore = state.getState().historyScore.pcPlay;
  const div = document.createElement("div");

  div.innerHTML = `<h1>SCORE</h1>
    <button-comp class="button">SEGUIR JUGANDO</button-comp>
  
  `


  // div.innerHTML = `
  //   <results-comp></results-comp>
  //   <br>
  //   <br>
  //   <div class="score">
  //   <p class="my-score"> ${myName}: ${myScore}</p>
  //   <p class="pc-score"> ${rivalName}: ${pcScore}</p>
  //   </div>
  //   <br>
  //   <button-comp class="button">SEGUIR JUGANDO</button-comp>

  //   `;

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
    // root.goTo("/waiting-for");
  });
  return div;
}
