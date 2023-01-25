import { state } from "../../state";
const piedra = require("../../img/piedra.png");
const papel = require("../../img/papel.png");
const tijera = require("../../img/tijera.png");
const ninguna = require("../../img/ninguna.png");

export function initPageGame(root) {
  const currentState = state.getState();
  if (currentState.userName == "") {
    root.goTo("/");
  }

  const div = document.createElement("div");

  div.innerHTML = `
    <scorebar-comp></scorebar-comp>
    <countdown-comp></countdown-comp>
    <div class="hands-container">
      <div class="one-hand" type="piedra">
      <img class="hand-img piedra" src=${piedra}></div>
      <br>
      <div class="one-hand" type="papel">
      <img class="hand-img papel" src=${papel}></div>
      <br>
      <div class="one-hand" type="tijera">
      <img class="hand-img tijera" src=${tijera}></div>
      <br>
    </div>
  
  `;

  var mySelection = "ninguna";
  state.setMyGame(mySelection);
  const hands = div.querySelector(".hands-container")!.children;
  for (const h of hands) {
    h.addEventListener("click", (e: any) => {
      mySelection = h.getAttribute("type")!.toString();
      state.setMyGame(mySelection);
      h.classList.add("selected");
    });
  }

  const opciones = [piedra, papel, tijera, ninguna];

  let counter = 3;
  const intervalId = setInterval(() => {
    counter--;
    if (counter < 1) {
      clearInterval(intervalId);
      state.getRivalGame();

      let counterC = 1;
      const intervalIdC = setInterval(() => {
        counterC--;
        if (counterC < 1) {
          clearInterval(intervalIdC);

          div.innerHTML = `
        <div class="container">
          <div class="hand-selected-container">
            <img 
            class="hand-selected" 
            style="transform: rotate(180deg); height: 200px;" 
            src=${opciones.find((o) => o.includes(currentState.rivalChoise))}>
          </div>
    
          <div style="height: 100px;"></div>
    
          <div class="hand-selected-container">
            <img 
            class="hand-selected"
            style= "height: 200px;"
            src=${opciones.find((o) => o.includes(mySelection))}>
          <div>
        </div>
                  `;

          let counterB = 1;
          const intervalIdB = setInterval(() => {
            counterB--;
            if (counterB < 0) {
              clearInterval(intervalIdB);
              state.getWinner(root);
              // state.setMyStatus(root, "busy");
            }
          }, 1000);
        }
      }, 1000);
    }
  }, 1000);

  div.classList.add("container");

  const style = document.createElement("style");
  style.textContent = `
  *{
    box-sizing: border-box;
  }
  .container{
    margin: 0px;
    width: 100%;
    height: 100vh;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    bottom: -10px;
  }
  .counter, countdown-comp{
    flex-grow: 1;
  }
  .hands-container{
    width: 100%;
    display: flex;
    align-item: center;
    justify-content: space-between;
    bottom: -10px;
  }
  .hand-img{
    height: 100px;
  }
  .one-hand{
    width: 30%;
    height: min-content;
    display: flex;
    align-item: center;
    justify-content: center;
    cursor: pointer;
  }
  .selected{
    box-shadow: 0 0 24px #5e5beb;
  }
  `;
  div.appendChild(style);
  return div;
}
