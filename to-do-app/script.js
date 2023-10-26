const todos = [];

const todoList = document.getElementById("todo-list");
const newTodoInput = document.getElementById("new-todo");
const addTodoButton = document.getElementById("add-todo");
const removeDoneButton = document.getElementById("remove-done");
const filterCheckboxes = {
  all: document.getElementById("filter-all"),
  open: document.getElementById("filter-open"),
  done: document.getElementById("filter-done"),
};

addTodoButton.addEventListener("click", addTodo);
removeDoneButton.addEventListener("click", removeDoneTodos);
Object.values(filterCheckboxes).forEach((checkbox) => {
  checkbox.addEventListener("change", updateFilter);
});

// LOAD TODOS //

async function loadTodos() {
  try {
    const response = await fetch("http://localhost:4730/todos");
    if (response.ok) {
      const todosFromApi = await response.json();
      todos.length = 0;
      todos.push(...todosFromApi);
      renderTodos();
    } else {
      throw new Error(`Failed to load to-dos: ${response.status}`);
    }
  } catch (error) {
    console.error("Error loading to-dos from the API:", error);
  }
}

// ADD TODO //

async function addTodo() {
  const newTodoText = newTodoInput.value.trim().toLowerCase();

  if (
    newTodoText &&
    !todos.some((todo) => todo.description.toLowerCase() === newTodoText)
  ) {
    const newTodo = {
      description: newTodoText,
      done: false,
    };

    try {
      const response = await fetch("http://localhost:4730/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        newTodoInput.value = "";
        loadTodos();
      } else {
        throw new Error(`Failed to add a new to-do: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding a new to-do:", error);
    }
  } else {
    alert("Input field is empty or the to-do is already in the list!");
  }
}

// REMOVE TODOS //

async function removeDoneTodos() {
  const doneTodoIds = todos.filter((todo) => todo.done).map((todo) => todo.id);

  if (doneTodoIds.length > 0) {
    try {
      await Promise.all(
        doneTodoIds.map(async (id) => {
          const response = await fetch(`http://localhost:4730/todos/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            todos.splice(
              todos.findIndex((todo) => todo.id === id),
              1
            );
          } else {
            throw new Error(`Failed to delete to-do ${id}: ${response.status}`);
          }
        })
      );
      renderTodos();
    } catch (error) {
      console.error("Error removing completed to-dos:", error);
    }
  } else {
    alert("No completed to-dos to remove.");
  }
}

// RENDER TODOS //

function renderTodos() {
  todoList.innerHTML = "";

  const showAll = filterCheckboxes.all.checked;
  const showOpen = filterCheckboxes.open.checked;
  const showDone = filterCheckboxes.done.checked;

  todos.forEach((todo) => {
    if (showAll || (showOpen && !todo.done) || (showDone && todo.done)) {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${todo.done ? "checked" : ""}>
        <span>${todo.description}</span>
      `;
      const checkbox = li.querySelector("input[type=checkbox]");

      checkbox.addEventListener("change", async () => {
        todo.done = checkbox.checked;

        try {
          const response = await fetch(
            `http://localhost:4730/todos/${todo.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                description: todo.description,
                done: checkbox.checked,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to update to-do status: ${response.status}`
            );
          }
          renderTodos();
        } catch (error) {
          console.error("Error updating to-do status:", error);
        }
      });

      todoList.appendChild(li);
    }
  });
}

// UPDATE FILER

function updateFilter() {
  Object.values(filterCheckboxes).forEach((checkbox) => {
    checkbox.checked = false;
  });
  this.checked = true;
}

// ON LOAD //
async function initialize() {
  await loadTodos();
  renderTodos();
}

initialize();
