import { element } from "../../src/index.js";
import { html, nothing } from "../../web_modules/lit-html.js";
import { classMap } from "../../web_modules/lit-html/directives/class-map.js";
import {
  TODO_COMPLETED,
  TODO_DELETED,
  TODO_UNSELECTED,
  TODO_SELECTED
} from "./constants.js";

const view = ({ todo, selected }, dispatch) => html`
  <div class=${classMap({ todoContainer: true, complete: todo.complete })}>
    <div
      class="toggle"
      @click=${e => {
        e.preventDefault();
        dispatch(TODO_COMPLETED, { id: todo.id });
      }}
    ></div>
    ${selected === false
      ? html`
          <div
            class="todo-text"
            @dblclick=${() => {
              dispatch(TODO_SELECTED, { id: todo.id });
            }}
          >
            ${todo.text}
          </div>
        `
      : html`
          <input
            type="text"
            class="todo-input"
            autofocus
            @keydown=${e =>
              (e.code === "Enter" && e.target.blur()) || console.log(e.code)}
            value=${todo.text}
            @blur=${e =>
              dispatch(TODO_UNSELECTED, { id: todo.id, text: e.target.value })}
          />
        `}
    <div
      role="button"
      @click=${e => {
        e.preventDefault();
        dispatch(TODO_DELETED, { id: todo.id });
      }}
      class="destroy"
    ></div>
  </div>
`;

const properties = {
  todo: {
    default: {
      text: ""
    }
  },
  selected: {
    default: false
  }
};

element("my-todo", {
  view,
  properties,
  styles: /*css*/ `
  .todoContainer {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }
  .todo-text {
    flex-grow: 1;
    word-break: break-all;
    padding: 15px 15px 15px 60px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
    font-weight: 400;
    color: #4d4d4d;
  }
  
  .complete .todo-text {
    color: #cdcdcd;
    text-decoration: line-through;
  }
  .toggle {
    text-align: center;
    width: 40px;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    -webkit-appearance: none;
    appearance: none;
  }
  
  .toggle {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: center left;
    width: 32px;
  }
  
  .complete .toggle {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
  }
  
  .todo-input {
    border-bottom: none;
    padding: 0;
    display: block;
    width: calc(100% - 43px);
    padding: 12px 16px;
    margin: 0 0 0 43px;
    word-break: break-all;
    border: 0;
    box-shadow: 0;
    line-height: 1.2;
    transition: color 0.4s;
    font-weight: 400;
    color: #4d4d4d;
    font-size: 24px;
  }
  .todo-input:focus {
    outline: none;
    border: none;
  }

  .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
  }
  
  .todoContainer .destroy:hover {
    color: #af5b5e;
  }
  
  .todoContainer .destroy:after {
    content: '×';
  }
  
  .todoContainer:hover .destroy {
    display: block;
  }
  `
});
