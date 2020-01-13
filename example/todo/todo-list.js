import { element } from "../../src/element.js";
import { html, nothing } from "../../web_modules/lit-html.js";
import { repeat } from "../../web_modules/lit-html/directives/repeat.js";
import "./todo.js";
import {
  TODO_LIST_ADDED_TODO,
  TODO_LIST_VISIBILTY_FILTER_CHANGED,
  TODO_LIST_CLEARED_COMPLETED,
  FILTERS,
  TODO_LIST_TOGGLED_COMPLETE_ALL
} from "./constants.js";
import { classMap } from "../../web_modules/lit-html/directives/class-map.js";

const numItemsLeft = (todos = []) => todos.filter(t => !t.complete).length;
const matchesFilter = (todos, filter) =>
  todos.filter(
    t =>
      filter === FILTERS.all ||
      (filter === FILTERS.completed && t.complete) ||
      (filter === FILTERS.active && !t.complete)
  );

const view = (
  { todos = [], editState = null, visibilityFilter = FILTERS.all },
  dispatch
) => {
  const visibleTodos = matchesFilter(todos, visibilityFilter);
  const hasCompletedItems = todos.find(t => t.complete) !== undefined;
  return html`
    <div class="todo-list">
      <div class="header">
        <input
          type="text"
          placeholder="What needs to be done?"
          class="new-todo"
          @keydown=${e => {
            if (e.key !== "Enter") {
              return;
            }
            dispatch(TODO_LIST_ADDED_TODO, { text: e.target.value });
            e.target.value = "";
          }}
        />
      </div>
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox" />
        <label
          for="toggle-all"
          @click=${() => dispatch(TODO_LIST_TOGGLED_COMPLETE_ALL)}
        >
          Mark all as complete
        </label>
        ${repeat(
          visibleTodos,
          todo => todo.id,
          todo =>
            html`
              <my-todo
                .todo=${todo}
                .selected=${todo.id === editState}
              ></my-todo>
            `
        )}
      </section>
      <footer class="footer">
        <span class="todo-count">${numItemsLeft(visibleTodos)} items left</span>
        <ul class="filters">
          <li>
            <a
              class=${classMap({ selected: visibilityFilter === FILTERS.all })}
              @click=${() =>
                dispatch(TODO_LIST_VISIBILTY_FILTER_CHANGED, {
                  filter: FILTERS.all
                })}
            >
              All
            </a>
          </li>
          <li>
            <a
              class=${classMap({
                selected: visibilityFilter === FILTERS.active
              })}
              @click=${() =>
                dispatch(TODO_LIST_VISIBILTY_FILTER_CHANGED, {
                  filter: FILTERS.active
                })}
            >
              Active
            </a>
          </li>
          <li>
            <a
              class=${classMap({
                selected: visibilityFilter === FILTERS.completed
              })}
              @click=${() =>
                dispatch(TODO_LIST_VISIBILTY_FILTER_CHANGED, {
                  filter: FILTERS.completed
                })}
            >
              Completed
            </a>
          </li>
        </ul>
        ${hasCompletedItems
          ? html`
              <button
                class="clear-completed"
                @click=${() => dispatch(TODO_LIST_CLEARED_COMPLETED)}
              >
                Clear completed
              </button>
            `
          : nothing}
      </footer>
    </div>
  `;
};

const styles = /*css*/ `
.new-todo {
	position: relative;
	margin: 0;
	width: 100%;
	font-size: 24px;
	font-family: inherit;
	font-weight: inherit;
	line-height: 1.4em;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}

.new-todo:focus, .new-todo:active {
  outline: none;
}

.toggle-all {
	width: 1px;
	height: 1px;
	border: none; /* Mobile Safari */
	opacity: 0;
	position: absolute;
	right: 100%;
	bottom: 100%;
}

.toggle-all + label {
	width: 60px;
	height: 34px;
	font-size: 0;
	position: absolute;
	top: -52px;
	left: -13px;
	-webkit-transform: rotate(90deg);
	transform: rotate(90deg);
}

.toggle-all + label:before {
	content: '❯';
	font-size: 22px;
	color: #e6e6e6;
	padding: 10px 27px 10px 27px;
}

.toggle-all:checked + label:before {
	color: #737373;
}

.main {
	position: relative;
	z-index: 2;
	border-top: 1px solid #e6e6e6;
}

.todo-list {
  background: #fff;
  color: rgb(77, 77, 77);
	margin: 60px 0 40px 0;
	position: relative;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
button {
	margin: 0;
	padding: 0;
	border: 0;
	background: none;
	font-size: 100%;
	vertical-align: baseline;
	font-family: inherit;
	font-weight: inherit;
	color: inherit;
	-webkit-appearance: none;
	appearance: none;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.footer {
	padding: 10px 15px;
	height: 20px;
	text-align: center;
	font-size: 15px;
	border-top: 1px solid #e6e6e6;
}

.footer:before {
	content: '';
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 50px;
	overflow: hidden;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
	            0 8px 0 -3px #f6f6f6,
	            0 9px 1px -3px rgba(0, 0, 0, 0.2),
	            0 16px 0 -6px #f6f6f6,
	            0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
	float: left;
	text-align: left;
}

.todo-count strong {
	font-weight: 300;
}

.filters {
	margin: 0;
	padding: 0;
	list-style: none;
	position: absolute;
	right: 0;
	left: 0;
}

.filters li {
	display: inline;
}

.filters li a {
	color: inherit;
	margin: 3px;
	padding: 3px 7px;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: 3px;
}

.filters li a:hover {
	border-color: rgba(175, 47, 47, 0.1);
}

.filters li a.selected {
	border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed,
html .clear-completed:active {
	float: right;
	position: relative;
	line-height: 20px;
	text-decoration: none;
	cursor: pointer;
}

.clear-completed:hover {
	text-decoration: underline;
}
`;

element("todo-list", {
  view,
  styles,
  properties: {
    todos: {
      default: []
    },
    editState: {
      default: null
    },
    visibilityFilter: {
      default: "all"
    }
  }
});
