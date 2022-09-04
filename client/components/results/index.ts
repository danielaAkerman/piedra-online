import { state } from "../../state";

customElements.define(
  "results-comp",
  class extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
      state.subscribe(()=>this.render())
    }
    render() {
      const resultado = state.getState().resultadoParcial;
      const div = document.createElement("div");
      div.innerHTML = `

    <h2 class="result">${resultado}</h2>

    `;

    var backGroundResult
    if(resultado=="GANASTE"){
      backGroundResult="#18b43f"
    }else if(resultado=="PERDISTE"){
      backGroundResult="#b42218"
    }else{
      backGroundResult="#f3da4e"
    }

      div.classList.add("root");

      const style = document.createElement("style");
      style.textContent = `
  .root{
    width: 250px;
    height: 250px;
    border-radius: 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}% / 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}% 
    ${Math.trunc(Math.random() * 100)}%;
    background-color: ${backGroundResult};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  .result{
    color:black;
  }
  *::selection{
    background-color: #f4a261;
  }

`;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
