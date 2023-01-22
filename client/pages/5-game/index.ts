import { state } from "../../state";
const piedra = require("../../img/piedra.png");
const papel = require("../../img/papel.png");
const tijeras = require("../../img/tijera.png");

export function initPageGame(container) {
  let counter = 3;
  const intervalId = setInterval(() => {
    counter--;
    if (counter < 0) {
      clearInterval(intervalId);
      state.setStatus(container, "busy", "/score")

    }
  }, 1000);

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
      <div class="one-hand" type="tijeras">
      <img class="hand-img tijeras" src=${tijeras}></div>
      <br>
    </div>
  
  `;
  const hands = div.querySelector(".hands-container")!.children;
  for (const h of hands) {
    h.addEventListener("click", (e: any) => {
      clearInterval(intervalId);
      const mySelection = h.getAttribute("type");
      state.move(mySelection);
      
      const oponentSelection = false
      const opciones = [piedra, papel, tijeras];

      div.innerHTML = `

          <img class="hand-selected" style="transform: rotate(180deg); height: 40%; display: block; margin: 0 auto" src=${opciones.find(
            (o) => o.includes(oponentSelection)
          )}></div>
          <div style="height: 20%">
          </div>
          <img class="hand-selected" style="height: 40%; display: block; margin: 0 auto" src=${opciones.find((o) =>
            o.includes(mySelection)
          )}></div>
      `;

      let counterB = 1;
      const intervalIdB = setInterval(() => {
        counterB--;
        if (counterB < 0) {
          clearInterval(intervalIdB);
          container.goTo("/score");
        }
      }, 1000);
    });
  }

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
    bottom: -10px;
    position: relative;
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
  `;
  div.appendChild(style);
  return div;
}
