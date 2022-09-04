customElements.define(
  "countdown-comp",
  class extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.timer();
    }
    timer() {
      let counter = 3;
      const intervalId = setInterval(() => {
        this.render(counter);
        counter--;
        if (counter < 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    }
    render(c) {
      this.shadowRoot.replaceChildren();
      const div = document.createElement("div");
      div.innerHTML = `
      <h2 class="counter">${c}</h2>`;

      div.classList.add("root");
      const style = document.createElement("style");
      style.textContent = `
        .root{
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .counter{
          font-size: 120px;
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
