import {element, sink} from '../src/index.js';
import { html } from '/web_modules/lit-html.js';
import { render } from '../web_modules/lit-html.js';

const properties = { countExclamations: { default: 1 } };

const view = ({ countExclamations }, dispatch) => html`
  <div @click=${() => dispatch("SOME_ELEMENT#CLICK")}>
    Hello <slot>World</slot>${new Array(parseInt(countExclamations)).fill("!").join("")}
  </div>
`;

const styles = `
* {
  color: ${Math.random() > .5 ? 'red' : 'blue'};
}
`;


element("some-element", { styles, properties, view });

sink('some-sink', {
  properties: {
    initialValue: {
      default: 0
    }
  },
  mapPropsToState(props) {
    return { value: parseInt(props.initialValue) };
  },
  actionHandlers: {
    'SOME_ELEMENT#CLICK': ({state, setState}) => {
      setState({ value: state.value + 1 });
    }
  }
});

const template = html`
  <some-sink initial-value="3" name="a">
      <some-element countExclamations="@a/value"></some-element>
  </some-sink>
  <some-sink initialValue="2" name="b">
      <some-element countExclamations="@b/value">Tony</some-element>
  </some-sink>
  <some-sink initialValue="3" name="c">
      <some-element countExclamations="@c/value">Someone</some-element>
  </some-sink>
  
  Some other text
`;

render(template, document.body);