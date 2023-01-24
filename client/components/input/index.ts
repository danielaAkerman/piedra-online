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
<label class="inp" for="inp">
  <input placeholder="${label}" id="inp" type=${type} name=${name} autofocus>
</label>

      `;





      div.classList.add("root");

      const style = document.createElement("style");

// height
      style.textContent = `
    .inp {
  position: relative;
  margin: auto;
  width: 200px;
  max-width: 190px;
  border-radius: 3px;
  overflow: hidden;
  font-size: 14px;
}

.inp input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 200px;
  border: 0;
  font-family: inherit;
  height: 30px;
  font-size: 16px;
  font-weight: 400;
  box-shadow: inset 0 -2px 0 #000;
  color: #000;
  transition: all 0.15s ease;
  letter-spacing: 4px;
  text-align: center;
}

.inp input:hover {
  background: rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 -2px 0 #000;
}



.inp input:focus {
  background: rgba(0, 0, 0, 0.05);
  outline: none;
  box-shadow: inset 0 -2px 0 #000;
}



            `;

      this.shadow.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
);
