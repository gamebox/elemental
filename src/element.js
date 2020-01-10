import { render as r } from '/web_modules/lit-html.js';
import {PROPS, DISPATCH, SINK_NAME, SELECT_SINK_PROP} from './constants.js';

export function element(tag, config) {
    const { properties = {}, view, actionHandlers = {}, styles = '' } = config;
    const propKeys = Object.keys(properties);
  
    customElements.define(
      tag,
      class extends HTMLElement {
        static get observedAttributes() {
          return propKeys;
        }
  
        constructor() {
          super();
        }
  
        createShadowRoot() {
          this.attachShadow({ mode: "open" });
        }
  
        createStyles() {
          const css = new CSSStyleSheet();
          css.insertRule(styles);
          this.shadowRoot.adoptedStyleSheets = [css];
        }
  
        createProps() {
          this[PROPS] = {};
          propKeys.forEach(
            function(key) {
              const that = this;
              Object.defineProperty(this, key, {
                get() {
                  return that[PROPS][key] === undefined ? that.getAttribute(key) : that[PROPS][key];
                },
                set(val) {
                  that.setAttribute(key, val);
                  this.render();
                }
              });
              this[PROPS][key] = this.getAttribute(key) || properties[key].default;
              if (typeof this[key] === 'string' && this[key].startsWith('@')) {
                // Attempt to select prop from sink above it
                this[PROPS][key] = properties[key].default;
                setTimeout(function() {
                  const [sinkName, propName] = this.getAttribute(key).slice(1).split('/');
                  let parent = this.parentElement;
                  while (parent.tagName.toLowerCase() !== 'body') {
                    if (parent[SINK_NAME] && parent[SINK_NAME] === sinkName) {
                      const init = parent[SELECT_SINK_PROP](propName, function(val) {
                        this[PROPS][key] = val;
                        this.render();
                      }.bind(this));
                      this[PROPS][key] = init === undefined ? properties[key].default : init;
                      this.render();
                      break;
                    } else {
                      parent = parent.parentElement;
                    }
                  }
                }.bind(this), 0);
              }
            }.bind(this)
          );
        }
  
        createDispatch() {
          this[DISPATCH] = function(type, payload) {
            const event = new CustomEvent(type, { detail: payload, bubbles: true });
            this.dispatchEvent(event);
            if (actionHandlers[type]) {
              const result = actionHandlers[type](this, this[DISPATCH]);
              const resultKeys = Object.keys(result);
              resultKeys.forEach(key => {
                this[key] = result[key];
              });
            } else {
            }
          }.bind(this);
        }
  
        attributeChangedCallback(name, oldValue, newValue) {
          if (propKeys.indexOf(name) > 0 && oldValue !== newValue) {
            this[name] = newValue;
          }
          this.render();
        }
  
        connectedCallback() {
          this.createShadowRoot();
          this.createStyles();
          this.createProps();
          this.createDispatch();
          this.render();
        }
  
        render() {
          r(view(this[PROPS], this[DISPATCH]), this.shadowRoot);
        }
      }
    );
  }