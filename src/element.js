import { render as r } from "/web_modules/lit-html.js";
import { PROPS, DISPATCH } from "./constants.js";
import BaseElement from "./base.js";

export function element(tag, config) {
  const { properties = {}, view, styles = "" } = config;

  const css = new CSSStyleSheet();
  if (styles.length > 0) {
    styles
      .trim()
      .split(/\}\n/)
      .forEach(rule => {
        css.insertRule(rule);
      });
  }

  customElements.define(
    tag,
    class extends BaseElement {
      constructor() {
        super(properties);
      }

      createStyles() {
        this.shadowRoot.adoptedStyleSheets = [css];
      }

      connectedCallback() {
        this.createShadowRoot();
        this.createStyles();
        this.createProps(true);
        this.render();
      }

      render() {
        console.log("render", this.componentId);
        r(view(this[PROPS] || {}, this[DISPATCH].bind(this)), this.shadowRoot);
      }
    }
  );
}
