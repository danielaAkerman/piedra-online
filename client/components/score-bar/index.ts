import { state } from "../../state";

customElements.define(
  "scorebar-comp",
  class extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
    }
    render() {
      const roomId= state.getState().roomId
      const userName= state.getState().userName
      const rivalName= state.getState().rivalName
      const myScore= state.getState().myScore || 0;
      const rivalScore= state.getState().rivalScore || 0;

      const div = document.createElement("div");
      div.classList.add("container")

      div.innerHTML = `

  <div class="room">
    <span>Room: ${roomId}</span>    
  </div>
  <div class="score">
    <span>${userName}: ${myScore}</span>
    <span>${rivalName}: ${rivalScore}</span>
  </div>
`;

      const style = document.createElement("style");
      style.textContent = `
.container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 22px;
  font-weight: lighter;
  top: 0px;
  position: relative;
}
.score{
  display: flex;
  flex-direction: column;
  text-align: right;
}

            `;

            this.shadow.appendChild(div);
            this.shadow.appendChild(style);
    }
  }
);
