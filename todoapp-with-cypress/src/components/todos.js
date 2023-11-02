import { saveTodosToLocalStorage, todos } from "./storage.js";

export function addNewTodo() {
  const newTodoEl = document.querySelector("#new-todo");
  const newTodoText = newTodoEl.value.trim();

  // length check
  if (newTodoText.length === 0) {
    return;
  }

  // duplicate check
  if (isDuplicate(newTodoText)) {
    return;
  }

  const newTodo = {
    todo: newTodoText,
    done: false,
  };
  todos.push(newTodo);

  renderTodos();
  saveTodosToLocalStorage();

  newTodoEl.value = "";
}

export function renderTodos() {
  const todoListEl = document.querySelector("#todo-list");
  todoListEl.innerHTML = "";

  todos.forEach(function (currentTodo) {
    const newTodoLiEl = document.createElement("li");

    const todoCheckboxEl = document.createElement("input");
    todoCheckboxEl.setAttribute("type", "checkbox");
    todoCheckboxEl.checked = currentTodo.done;
    newTodoLiEl.appendChild(todoCheckboxEl);

    const textNode = document.createTextNode(currentTodo.todo);
    newTodoLiEl.append(textNode);

    if (currentTodo.done === true) {
      newTodoLiEl.classList.add("done");
    }

    newTodoLiEl.todo = currentTodo;

    const filterValue = getFilterValue();
    if (filterValue === "done") {
      newTodoLiEl.hidden = true;
    }

    todoListEl.appendChild(newTodoLiEl);
  });

  filterTodos();
}

export function isDuplicate(todo) {
  if (typeof todo !== "string" || todo.trim() === "") {
    return false; // Invalid or empty todo, no need to check for duplicates.
  }

  todo = todo.toLowerCase();

  for (let i = 0; i < todos.length; i++) {
    const currentTodo = todos[i];
    if (
      currentTodo &&
      currentTodo.todo &&
      typeof currentTodo.todo === "string"
    ) {
      if (currentTodo.todo.toLowerCase() === todo) {
        return true;
      }
    }
  }
  return false;
}

export function toggleTodoState(event) {
  const checkbox = event.target;
  if (checkbox.checked === true) {
    checkbox.parentElement.classList.add("done");
    checkbox.parentElement.todo.done = true;
  } else {
    checkbox.parentElement.classList.remove("done");
    checkbox.parentElement.todo.done = false;
  }

  saveTodosToLocalStorage();
}

export function filterTodos() {
  const filterValue = getFilterValue();

  const todoListEl = document.querySelector("#todo-list");
  for (let i = 0; i < todoListEl.children.length; i++) {
    const currentTodo = todoListEl.children[i];
    if (filterValue === "all") {
      currentTodo.hidden = false;
    } else if (filterValue === "open") {
      currentTodo.hidden = currentTodo.todo.done;
    } else if (filterValue === "done") {
      currentTodo.hidden = !currentTodo.todo.done;
    }
  }
}

export function getFilterValue() {
  return document.querySelector('#todo-filter input[type="radio"]:checked')
    .value;
}

export function deleteDoneTodos() {
  const newTodos = todos.filter((todo) => todo.done === false);
  todos.length = 0; // Clear the original todos array.
  todos.push(...newTodos); // Push the filtered todos back into the original array.

  saveTodosToLocalStorage();
  renderTodos();
}
