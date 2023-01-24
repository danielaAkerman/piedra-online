import { state } from "../../state";

export function initPageWaiting(params) {
  const currentState = state.getState();
  if (currentState.userName == "") {
    params.goTo("/");
  }
  
  state.escucharCambioRival(params);
  const rivalName = state.getState().rivalName || "TU OPONENTE";
  const div = document.createElement("div");
  div.classList.add("container");
  div.innerHTML = `
    <scorebar-comp></scorebar-comp>
    <div class="text-container">
      <p class="text">ESPERANDO QUE ${rivalName} COMIENCE A JUGAR</p>
    </div>
    `;

  const style = document.createElement("style");
  style.textContent = `
  .text{
    font-size: 24px;
    text-align: center;
    font-weight: lighter;
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
  .text-container{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

  div.appendChild(style);
  return div;
}
