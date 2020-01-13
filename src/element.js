import { render as r } from "/web_modules/lit-html.js";
import { PROPS, DISPATCH, SINK_NAME, SELECT_SINK_PROP } from "./constants.js";

export function element(tag, config) {
  const { properties = {}, view, actionHandlers = {}, styles = "" } = config;
  const propKeys = Object.keys(properties);

  customElements.define(
    tag,
    class extends HTMLElement {
      static get observedAttributes() {
        return propKeys;
      }

      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      createShadowRoot() {
        this.attachShadow({ mode: "open" });
      }

      createStyles() {
        if (!styles || styles === "") {
          return;
        }
        const css = new CSSStyleSheet();
        styles
          .trim()
          .split(/\}\n/)
          .forEach(rule => {
            css.insertRule(rule);
          });
        this.shadowRoot.adoptedStyleSheets = [css];
      }

      createProps() {
        this[PROPS] = {};
        propKeys.forEach(
          function(key) {
            const that = this;
            this[PROPS][key] =
              this[key] || this.getAttribute(key) || properties[key].default;
            Object.defineProperty(this, key, {
              get() {
                return that[PROPS][key] === undefined
                  ? that.getAttribute(key)
                  : that[PROPS][key];
              },
              set(val) {
                that[PROPS][key] = val;
                that.render();
              }
            });
            if (typeof this[key] === "string" && this[key].startsWith("@")) {
              // Attempt to select prop from sink above it
              this[PROPS][key] = properties[key].default;
              setTimeout(
                function() {
                  const [sinkName, propName] = this.getAttribute(key)
                    .slice(1)
                    .split("/");
                  let parent = this.parentElement;
                  while (parent.tagName.toLowerCase() !== "body") {
                    if (parent[SINK_NAME] && parent[SINK_NAME] === sinkName) {
                      const init = parent[SELECT_SINK_PROP](
                        propName,
                        function(val) {
                          this[PROPS][key] = val;
                          this.render();
                        }.bind(this)
                      );
                      this[PROPS][key] =
                        init === undefined ? properties[key].default : init;
                      this.render();
                      break;
                    } else {
                      parent = parent.parentElement;
                    }
                  }
                }.bind(this),
                0
              );
            }
          }.bind(this)
        );
      }

      createDispatch() {
        this[DISPATCH] = function(type, payload) {
          console.log("DISPATCH", type);
          const event = new CustomEvent(type, {
            detail: payload,
            bubbles: true,
            composed: true
          });
          this.dispatchEvent(event);
        }.bind(this);
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (propKeys.indexOf(name) > 0 && oldValue !== newValue) {
          this[name] = newValue;
        }
        this.render();
      }

      connectedCallback() {
        // this.createShadowRoot();
        this.createStyles();
        this.createProps();
        this.createDispatch();
        this.render();
      }

      render() {
        r(view(this[PROPS] || {}, this[DISPATCH]), this.shadowRoot);
      }
    }
  );
}
