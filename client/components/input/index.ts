customElements.define(
  "input-comp",
  class extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
    }
    render() {
      const label = this.getAttribute("label");
      const name = this.getAttribute("name");
      const type = this.getAttribute("type");

      const div = document.createElement("label");
      // Para que quede como un form, vinculado span e input

      div.innerHTML = `
          <span class="span">Para continuar, ingresá tu ${label}:</span>
          <input placeholder=${
            label[0].toUpperCase() + label.slice(1)
          } type=${type} name=${name} class="input">
      `;

      div.classList.add("root");

      const style = document.createElement("style");
      style.textContent = `
              .root{
                width: 312px;
                display: flex;
                flex-direction: column;
                align-items: initial;
                margin: auto;
              }
              @media (min-width: 470px){
                .root{
                    width: 353px;
                }
              }
              .span{
                font-size: 24px;

              }
              .input{
                width: 300px;
                height: 55px;
                font-size: 32px;
                font-family: "Delius", cursive;
                text-align: center;
                margin: 15px auto 0 auto;
                cursor: pointer;
                border-radius: 41% 48% 43% 10% / 17% 0% 13% 10% ;
                border: none;
                background-color: #f4a261;
              }
              .input:active, .input:focus{
                outline: none;
                background-color: #f5bd8f;
                transition: 0.5s;
              }
              *::selection{
                background-color: #f4a261;
            }
            `;

      this.shadow.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
);
