import { element } from "../../src/element.js";
import { html } from "../../web_modules/lit-html.js";
import "./store.js";
import "./todo-list.js";
import "./todo.js";

const todos = [
  { id: "0", text: "First" },
  { id: "1", text: "Second" },
  { id: "2", text: "Third" },
  { id: "3", text: "fourth" },
  { id: "4", text: "Fifth" }
];

const view = () => html`
  <div>
    <h2>todos</h2>
    <todo-store .todos=${todos} name="store">
      <todo-list
        todos="@store/todos"
        editState="@store/editState"
        visibilityFilter="@store/visibilityFilter"
      ></todo-list>
    </todo-store>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Created by <a href="http://github.com/gamebox/">Anthony Bullard</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  </div>
`;

const styles = /*css*/ `
:root {
  color: rgb(77, 77, 77);
}
div {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  padding: 32px;
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
}

h2 {
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
  -webkit-text-rendering: optimizeLegibility;
  -moz-text-rendering: optimizeLegibility;
  text-rendering: optimizeLegibility;
  margin-block-end: 0.35em;
}

.info {
	margin: 65px auto 0;
	color: #4d4d4d;
	font-size: 11px;
	text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
	text-align: center;
}

.info p {
	line-height: 1;
}

.info a {
	color: inherit;
	text-decoration: none;
	font-weight: 400;
}

.info a:hover {
	text-decoration: underline;
}
`;

element("todo-app", {
  view,
  styles
});
