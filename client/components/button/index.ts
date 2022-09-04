customElements.define(
  "button-comp",
  class extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      var shadow = this.attachShadow({ mode: "open" });
      const button = document.createElement("button");
      button.textContent = this.textContent;
      button.classList.add("root");

      const style = document.createElement("style");
      style.textContent = `
              .root{
                width: 300px;
                height: 55px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: auto;            
                border: none;
                background-color: #f4a261;
                font-size: 32px;     
                border-radius: 41% 48% 43% 39% / 7% 0% 5% 10%; 
                color: #fcffb0;     
                cursor: pointer;
                font-family: "Delius", cursive; 
              }
              .root:active{
                background-color: #f5bd8f;
                transition: 0.5s;
              }
              *::selection{
                background-color: #f4a261;
              }

            `;
      shadow.appendChild(button);
      shadow.appendChild(style);
    }
  }
);
