import { element } from "../../src/element.js";
import { html } from "/web_modules/lit-html.js";
import { bind } from "../../src/index.js";

const properties = {
  countExclamations: { default: 1 },
  ref: { default: null }
};

const view = ({ countExclamations, ref }, dispatch) => html`
  <div
    @click=${() => dispatch("SOME_ELEMENT#CLICK")}
    ref=${ref ? bind(ref) : null}
  >
    Hello <slot>World</slot>${new Array(parseInt(countExclamations))
      .fill("!")
      .join("")}
  </div>
`;

const styles = `
* {
  color: ${Math.random() > 0.5 ? "red" : "blue"};
}
`;

element("some-element", { styles, properties, view });
