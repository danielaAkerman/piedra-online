import { state } from "../../state";

export function initPageInstructions(params) {
  const currentState = state.getState()
  const div = document.createElement("div");
  div.innerHTML = `
    <h1 class="titulo">INSTRUCCIONES</h1>
    <br>
    <p class="text">TENÉS 3 SEGUNDOS<br>PARA SELECCIONAR<br>PIEDRA, PAPEL<br>O TIJERA</p>
    <br>
    <br>
    <button-comp class="button">JUGAR AHORA</button-comp>
    `;
    
      const button = div.querySelector(".button") as HTMLElement;
    
      button.addEventListener("click", () => {
        // LISTO PARA JUGAR
        state.setStatus(params, 'ok', "/game")
        // params.goTo("/game");
      });

  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 32px;
    text-align: center;
    font-weight: lighter;
  }
  .text{
    font-size: 24px;
    text-align: center;
    font-weight: lighter;
  }
`;

  div.appendChild(style);
  return div;
}
