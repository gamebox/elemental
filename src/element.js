import { render as r } from "/web_modules/lit-html.js";
import { PROPS, DISPATCH, GET_CLIENT_RECT } from "./constants.js";
import BaseElement from "./base.js";

/**
 * @callback ElementConfig~view
 * @param {Object} properties
 * @param {Function} dispatch
 */

/**
 * @typedef {object} ElementConfig
 * @property {ElementConfig~view} view
 * @property {string} styles
 * @property {Object} properties
 * @property {Object} slots
 */

/**
 * Creates a new presentational element.
 * @param {string} tag
 * @param {ElementConfig} config
 */
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

      /**
       * @returns {void}
       */
      createStyles() {
        this.shadowRoot.adoptedStyleSheets = [css];
      }

      /**
       * @returns {void}
       */
      connectedCallback() {
        this.createShadowRoot();
        this.createStyles();
        this.createProps(true);
        this.render();
      }

      [GET_CLIENT_RECT]() {
        return this.getBoundingClientRect();
      }

      /**
       * @returns {void}
       */
      render() {
        super.render();
        console.log(`${this.tagName}[${this.componentId}]`, "render");
        r(
          view(
            this[PROPS] || {},
            this[DISPATCH].bind(this),
            this[GET_CLIENT_RECT].bind(this)
          ),
          this.shadowRoot
        );
      }
    }
  );
}
