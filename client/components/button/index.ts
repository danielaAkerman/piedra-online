customElements.define(
  "button-comp",
  class extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      var shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const content = this.textContent;
      div.innerHTML = `

  <button class="cta">
    <span class="hover-underline-animation">${content}</span>
    <path transform="translate(30)" d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" data-name="Path 10" id="Path_10"></path>
  </button>
`;

      const style = document.createElement("style");
      style.textContent = `
      .cta {
        border: none;
        background: none;
      }
      
      .cta span {
        padding-bottom: 7px;
        letter-spacing: 4px;
        font-size: 14px;
        padding-right: 15px;
        text-transform: uppercase;
      }
      

      
      .hover-underline-animation {
        position: relative;
        color: black;
        padding-bottom: 20px;
      }
      
      .hover-underline-animation:after {
        content: "";
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #000000;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
      }
      
      .cta:hover .hover-underline-animation:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }

            `;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
);
