/** @jsx h */
const { init, h: snabbdomh, thunk } = snabbdom;
const { toVNode } = tovnode;

const propKeyRe = /^(data|on)\-([a-zA-Z\-]+)/;

const sortProps = data => {
  const newData = {
    on: {},
    data: {}
  };
  const keys = Object.keys(data);
  for (const x = 0; x < keys.length; x++) {
    const res = propKeyRe.exec(keys[x]);
    if (res && res.length === 2) {
      newData[res[0]][res[1]] = data[keys[x]];
    } else {
      // TODO: handle attributes (by constant list?)
      newData[keys[x]] = data[keys[x]];
    }
  }

  return newData;
};

const h = (sel, data = {}, ...children) => {
  const d = sortProps(data === null ? {} : data);

  return snabbdomh(
    sel,
    d,
    children && Array.isArray(children[0])
      ? [...children[0], ...children.slice(1)]
      : children
  );
};

const patch = init([
  snabbdom_class.default,
  snabbdom_props.default,
  snabbdom_eventlisteners.default
]);

const ROOT_NODE = Symbol("RootNode");
const VNODE = Symbol("Vnode");
const DISPATCH = Symbol("DISPATCH");

function createComponent(tag, config) {
  const { properties, view, actionHandlers, styles } = config;
  const propKeys = Object.keys(properties);

  customElements.define(
    tag,
    class extends HTMLElement {
      static get observedAttributes() {
        return propKeys;
      }

      constructor() {
        super();

        this.createShadowRoot();
        this.createStyles();
        this.createProps();
        this.createDispatch();
      }

      createShadowRoot() {
        this.attachShadow({ mode: "open" });
        this[ROOT_NODE] = document.createElement("div");
        this.shadowRoot.appendChild(this[ROOT_NODE]);
      }

      createStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerText = styles;
        this[ROOT_NODE].prepend(styleTag);
      }

      createProps() {
        propKeys.forEach(
          function(key) {
            const that = this;
            this[key] = this.getAttribute(key) || properties[key].default;
            Object.defineProperty(this, key, {
              get() {
                return that.getAttribute(key);
              },
              set(val) {
                that.setAttribute(key, val);
                this.render();
              }
            });
          }.bind(this)
        );
      }

      createDispatch() {
        this[DISPATCH] = function(type, payload) {
          console.log(DISPATCH);
          const event = new CustomEvent(type, { detail: payload });
          if (actionHandlers[type]) {
            const result = actionHandlers[type](this, this[DISPATCH]);
            const resultKeys = Object.keys(result);
            resultKeys.forEach(key => {
              this[key] = result[key];
            });
          } else {
            this.dispatchEvent(event);
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
        this.setupActionHandlers();
        this[VNODE] = patch(this[ROOT_NODE], view(this, this[DISPATCH]));
      }

      render() {
        const newNode = view(this, this[DISPATCH]);
        patch(this[VNODE], newNode);
      }

      setupActionHandlers() {
        const actionTypes = Object.keys(actionHandlers);
        actionTypes.forEach(type => {
          this.addEventListener(type, e => {
            const result = actionHandlers[type](this, this[DISPATCH]);
            const resultKeys = Object.keys(result);
            resultKeys.forEach(key => {
              this[key] = result[key];
            });
            e.preventDefault();
          });
        });
      }
    }
  );
}

createComponent("some-element", {
  styles: `* { color: red; }`,
  properties: {
    countExclamations: { default: 1 }
  },
  actionHandlers: {
    "SOME_ELEMENT#CLICK": ({ countExclamations }) => ({
      countExclamations: parseInt(countExclamations) + 1
    })
  },
  view: ({ countExclamations }, dispatch) => {
    return (
      <div on-click={() => dispatch("SOME_ELEMENT#CLICK")}>
        Hello <slot>World</slot>
        {new Array(parseInt(countExclamations)).fill("!").join("")}
      </div>
    );
  }
});
