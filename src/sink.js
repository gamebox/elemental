import { SINK_NAME, SELECT_SINK_PROP, PROPS, WATCHERS} from './constants.js';
import {kebabCase} from './util.js';

export function sink(tag, config) {
    const { properties = {}, actionHandlers = {}, mapPropsToState} = config;
    const propKeys = Object.keys(properties);
  
    customElements.define(tag, class extends HTMLElement {
      static get observedAttributes() {
        return propKeys;
      }
  
      constructor() {
        super();
        this[SINK_NAME] = this.getAttribute('name');
      }
  
      connectedCallback() {
        this[WATCHERS] = [];
        
        this.createProps();
        const props = {};
        const keys = Object.keys(properties);
        for (let x = 0; x < keys.length; x = x + 1) {
          props[keys[x]] = this[keys[x]] || this.getAttribute(keys[x]) || this.getAttribute(kebabCase(keys[x]));
        }
        this.state = mapPropsToState(props);
        this.setupActionHandlers();
      }
  
      createProps() {
        this[PROPS] = {};
        propKeys.forEach(
          function(key) {
            const that = this;
            Object.defineProperty(this, key, {
              get() {
                return that[PROPS][key];
              },
              set(val) {
                that.setAttribute(key, val);
              }
            });
            this[PROPS][key] = this.getAttribute(key) || this.getAttribute(kebabCase(key)) || properties[key].default;
            if (typeof this[key] === 'string' && this[key].startsWith('@')) {
              // Attempt to select prop from sink above it
              this[PROPS][key] = properties[key].default;
              setTimeout(function() {
                const [sinkName, propName] = this.getAttribute(key).slice(1).split('/');
                let parent = this.parentElement;
                while (parent.tagName.toLowerCase() !== 'body') {
                  if (parent[SINK_NAME] && parent[SINK_NAME] === sinkName) {
                    const init = parent[SELECT_SINK_PROP](propName, function(val) {
                      this.setAttribute(key, val);
                      this.render();
                    }.bind(this));
                    this[key] = init === undefined ? properties[key].default : init;
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
  
      setState(result) {
        this.state = {
          ...this.state,
          ...result
        };
        const resultKeys = Object.keys(result);
        resultKeys.forEach(key => {
          this[WATCHERS][key].forEach(fn => fn(this.state[key]));
        });
      }
  
      setupActionHandlers() {
        const actionTypes = Object.keys(actionHandlers || {});
        actionTypes.forEach(type => {
          this.addEventListener(type, e => {
            actionHandlers[type]({state: this.state, setState: this.setState.bind(this)});
            e.preventDefault();
          });
        });
      }
  
  
      [SELECT_SINK_PROP](propName, fn) {
        if (!this.state[propName]) {
          return undefined;
        }
  
        if (this[WATCHERS][propName] === undefined) {
          this[WATCHERS][propName] = [];
        }
  
        this[WATCHERS][propName].push(fn);
  
        return this.state[propName];
      }
    });
  }