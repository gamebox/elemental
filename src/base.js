import { kebabCase, firstDefined } from "./util.js";
import { SINK_NAME, SELECT_SINK_PROP, PROPS, DISPATCH } from "./constants.js";

const CREATE_SELECTABLE = Symbol("Create Selectable");
const CREATE_PROP = Symbol("Create Prop");
const WITH_SELECTABLES = Symbol("With Selectables");
const PROPERTIES = Symbol("Properties Definition");
const PROP_KEYS = Symbol("Prop Keys");
const CONNECTED = Symbol("Connected");
const PENDING_SELECTABLES = Symbol("Pending Selectables");

const selectableSyntax = val => typeof val === "string" && val.startsWith("@");

export default class extends HTMLElement {
  constructor(properties) {
    super();
    this[PROPERTIES] = properties;
    this[PROP_KEYS] = Object.keys(properties);
    this.componentId = `${btoa(Date.now() * Math.floor(Math.random() * 30))}`;
    this.setAttribute("component-id", this.componentId);
    this[PENDING_SELECTABLES] = new Set();
  }

  static get observedAttributes() {
    return this[PROP_KEYS];
  }

  get [CONNECTED]() {
    return this[PENDING_SELECTABLES].size === 0;
  }

  [CREATE_SELECTABLE](key, rawValue) {
    if (rawValue === undefined || rawValue === null) {
      return;
    }
    const [sinkName, propName] = rawValue.slice(1).split("/");
    let parent = this.parentElement;
    while (parent.tagName.toLowerCase() !== "body") {
      if (parent[SINK_NAME] && parent[SINK_NAME] === sinkName) {
        const init = parent[SELECT_SINK_PROP](
          propName,
          function(val) {
            this[key] = val;
          }.bind(this)
        );
        this[PENDING_SELECTABLES].delete(key);
        this[key] = firstDefined(init, this[PROPERTIES][key].default);
        break;
      } else {
        parent = parent.parentElement;
      }
    }
  }

  render() {}

  [CREATE_PROP](key) {
    const that = this;
    const initialVal = this[key];
    Object.defineProperty(this, key, {
      get() {
        return that[PROPS][key];
      },
      set(val) {
        if (selectableSyntax(val)) {
          that[PENDING_SELECTABLES].add(key);
        }
        that[PROPS][key] = val;
        if (that[CONNECTED]) {
          that.render();
        }
        return val;
      }
    });

    this[key] = firstDefined(
      initialVal,
      this.getAttribute(key),
      this.getAttribute(kebabCase(key)),
      this[PROPERTIES][key].default
    );

    if (
      this[WITH_SELECTABLES] &&
      typeof this[key] === "string" &&
      this[key].startsWith("@")
    ) {
      // Attempt to select prop from sink above it
      const selectable = this[key];
      this[key] = this[PROPERTIES][key].default;
      setTimeout(() => {
        this[CREATE_SELECTABLE].bind(this)(key, selectable);
      }, 0);
    }
  }

  [DISPATCH](type, payload) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: payload,
        bubbles: true,
        composed: true
      })
    );
  }

  createShadowRoot() {
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this[PROP_KEYS].indexOf(name) > 0 && oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  createProps(withSelectables = false) {
    this[WITH_SELECTABLES] = withSelectables;
    this[PROPS] = {};
    this[PROP_KEYS].forEach(this[CREATE_PROP].bind(this));
  }
}
