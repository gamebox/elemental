import { sink } from "../../src/sink.js";
import handlers from "./handlers.js";

const findNextId = (todos = []) =>
  todos.reduce((acc, t) => (t.id > acc ? t.id : acc), 0) + 1;

sink("todo-store", {
  properties: {
    todos: { default: [] },
    editState: { default: null },
    visibilityFilter: { default: "all" }
  },
  actionHandlers: handlers,
  mapPropsToState: props => ({ ...props, nextId: findNextId(props.todos) })
});
