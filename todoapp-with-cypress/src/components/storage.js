export let todos = [];

export function readTodosFromLocalStorage() {
  const todosFromStorage = localStorage.getItem("todos");
  if (todosFromStorage !== null) {
    todos = JSON.parse(todosFromStorage);
  }
}

export function saveTodosToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
