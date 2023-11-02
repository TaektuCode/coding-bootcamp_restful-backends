import {
  readTodosFromLocalStorage,
  saveTodosToLocalStorage,
  todos,
} from "./components/storage.js";
import {
  addNewTodo,
  toggleTodoState,
  deleteDoneTodos,
  renderTodos,
  filterTodos,
  getFilterValue,
} from "./components/todos.js";

document.querySelector("#add-todo").addEventListener("click", addNewTodo);
document
  .querySelector("#delete-todos")
  .addEventListener("click", deleteDoneTodos);
document
  .querySelector("#todo-list")
  .addEventListener("change", toggleTodoState);
document.querySelector("#todo-filter").addEventListener("change", filterTodos);

function initTodoApp() {
  readTodosFromLocalStorage();
  renderTodos();
}

initTodoApp();
