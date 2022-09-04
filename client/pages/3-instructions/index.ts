import { state } from "../../state";

export function initPageInstructions(container) {
  const div = document.createElement("div");
  div.innerHTML = `
    <h1 class="titulo">Instrucciones:</h1>
    <br>
    <p class="text">Tenés 3 segundos<br>para seleccionar<br>"piedra", "papel"<br>o "tijeras"</p>
    <br>
    <br>
    <button-comp class="button">JUGAR AHORA</button-comp>
    `;
    
      const button = div.querySelector(".button") as HTMLElement;
    
      button.addEventListener("click", () => {
        // LISTO PARA JUGAR
        // container.goTo("/waiting-for");
        container.goTo("/game");
      });

  const style = document.createElement("style");
  style.textContent = `
  .titulo{
    font-size: 48px;
  }
  .text{
    font-size: 24px;
  }
`;

  div.appendChild(style);
  return div;
}
