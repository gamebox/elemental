import { SINK_NAME, SELECT_SINK_PROP, PROPS, WATCHERS } from "./constants.js";
import { kebabCase } from "./util.js";

/**
 * @callback SinkConfig~mapPropsToState
 * @param {Object} properties
 * @returns {Object}
 */

/**
 * Sink Config
 * @typedef {Object} SinkConfig
 * @property {Object} properties
 * @property {Object} actionHandlers
 * @property {SinkConfig~mapPropsToState} mapPropsToState
 */

/**
 * Creates a new sink element.
 * @param {string} tag
 * @param {SinkConfig} config
 */
export function sink(tag, config) {
  const { properties = {}, actionHandlers = {}, mapPropsToState } = config;
  const propKeys = Object.keys(properties);

  customElements.define(
    tag,
    class extends HTMLElement {
      static get observedAttributes() {
        return propKeys;
      }

      constructor() {
        super();
        this[SINK_NAME] = this.getAttribute("name");
      }

      connectedCallback() {
        this[WATCHERS] = [];
        this.createProps();
        const props = {};
        const keys = propKeys;
        console.log("keys", keys, this.initialValue);
        for (let x = 0; x < keys.length; x = x + 1) {
          props[keys[x]] =
            this[keys[x]] ||
            this[PROPS][keys[x]] ||
            this.getAttribute(keys[x]) ||
            this.getAttribute(kebabCase(keys[x]));
        }
        this.state = mapPropsToState(props);
        this.setupActionHandlers();
      }

      createProps() {
        this[PROPS] = {};
        propKeys.forEach(
          function(key) {
            const that = this;
            this[PROPS][key] =
              this[key] ||
              this.getAttribute(key) ||
              this.getAttribute(kebabCase(key)) ||
              properties[key].default;
            Object.defineProperty(this, key, {
              get() {
                return that[PROPS][key];
              },
              set(val) {
                console.log("set", key, val);
                that.setAttribute(key, val);
                that[PROPS][key] = val;
              }
            });
          }.bind(this)
        );
      }

      setState(result) {
        this.state = {
          ...this.state,
          ...result
        };
        console.dir(this.state);
        const resultKeys = Object.keys(result);
        resultKeys.forEach(key => {
          console.log(
            `Notifying ${(this[WATCHERS][key] || []).length} watchers of ${key}`
          );
          (this[WATCHERS][key] || []).forEach(fn => fn(this.state[key]));
        });
      }

      setupActionHandlers() {
        const actionTypes = Object.keys(actionHandlers || {});
        actionTypes.forEach(type => {
          console.log(tag, "setting up action handler for ", type);
          this.addEventListener(type, e => {
            console.log("Handling", type);
            actionHandlers[type]({
              state: this.state,
              setState: this.setState.bind(this),
              action: { type: e.type, payload: e.detail }
            });
            e.stopPropagation();
          });
        });
      }

      [SELECT_SINK_PROP](propName, fn) {
        if (this[WATCHERS][propName] === undefined) {
          this[WATCHERS][propName] = [];
        }

        this[WATCHERS][propName].push(fn);

        if (!this.state[propName]) {
          return undefined;
        }

        return this.state[propName];
      }
    }
  );
}
