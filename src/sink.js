import { SINK_NAME, SELECT_SINK_PROP, PROPS, WATCHERS } from "./constants.js";
import BaseElement from "./base.js";

/**
 * @callback SinkConfig~mapPropsToState
 * @param {Object} properties
 * @returns {Object}
 */

/**
 * Sink Config
 * @typedef {Object} SinkConfig
 * @property {Object<string, *>} properties
 * @property {Object<string, function>} actionHandlers
 * @property {SinkConfig~mapPropsToState} mapPropsToState
 */

/**
 * Creates a new sink element.
 * @param {string} tag
 * @param {SinkConfig} config
 */
export function sink(tag, config) {
  const { properties = {}, actionHandlers = {}, mapPropsToState } = config;

  customElements.define(
    tag,
    class extends BaseElement {
      constructor() {
        super(properties);
        this[SINK_NAME] = this.getAttribute("name");
      }

      connectedCallback() {
        this[WATCHERS] = [];
        this.createProps(false);
        this.state = mapPropsToState(this[PROPS]);
        this.setupActionHandlers();
      }

      setState(result) {
        this.state = {
          ...this.state,
          ...result
        };
        Object.keys(result).forEach(key => {
          (this[WATCHERS][key] || []).forEach(fn => {
            console.log(
              `${this.tagName}[${this.componentId}] Calling watcher for ${key}`,
              this.state[key]
            );
            fn(this.state[key]);
          });
        });
      }

      setupActionHandlers() {
        const actionTypes = Object.keys(actionHandlers || {});
        actionTypes.forEach(type => {
          this.addEventListener(type, e => {
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

        return this.state[propName];
      }
    }
  );
}
