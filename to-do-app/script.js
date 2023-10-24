// 1. implement application state
// 2. Input field and button to add new Todos
// 3. Todo have two properties: description and ID
// 4. Use local storage to save current state of t he app
// 5. checkboxes for the different todos (status of a todo done or not done)
// 6. Duplicate check (no duplicates are allowed)
// 7. Filtering todos (all todos; open todos; done todos)
// 8. Remove done todos (implement a button for this)

let todos = loadTodosFromLocalStorage() || [];

const todoList = document.getElementById("todo-list");
const newTodoInput = document.getElementById("new-todo");
const addTodoButton = document.getElementById("add-todo");
const removeDoneButton = document.getElementById("remove-done");
const filterAllCheckbox = document.getElementById("filter-all");
const filterOpenCheckbox = document.getElementById("filter-open");
const filterDoneCheckbox = document.getElementById("filter-done");

addTodoButton.addEventListener("click", addTodo);
removeDoneButton.addEventListener("click", removeDoneTodos);
filterAllCheckbox.addEventListener("change", updateFilter);
filterOpenCheckbox.addEventListener("change", updateFilter);
filterDoneCheckbox.addEventListener("change", updateFilter);

/* Load Todos */
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      // Assuming that the API returns an array of to-dos
      todos = loadTodosFromLocalStorage() || [];
      renderTodos(); // Call renderTodos here to display the loaded data
    })
    .catch((error) => {
      console.error("Error loading to-dos from the API:", error);
    });
}

loadTodos();

/* ADD TODOS */
function addTodo() {
  const newTodoText = newTodoInput.value.toLowerCase();

  // Check Duplicates
  if (
    newTodoText &&
    !todos.some((todo) => todo.description.toLowerCase() === newTodoText)
  ) {
    const newTodo = {
      description: newTodoText,
      done: false,
    };

    // Send a POST request to the API to add the new to-do
    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((addedTodo) => {
        // The API should return the added to-do with an ID
        todos.push(addedTodo);
        saveTodosToLocalStorage(todos);
        newTodoInput.value = "";
        renderTodos();
      })
      .catch((error) => {
        console.error("Error adding a new to-do:", error);
      });
  } else {
    alert("Input field is empty or the to-do is already in the list!");
  }
}

/* REMOVE TODO */
function removeDoneTodos() {
  const doneTodoIds = todos.filter((todo) => todo.done).map((todo) => todo.id);

  if (doneTodoIds.length > 0) {
    // Send DELETE requests for each completed to-do
    doneTodoIds.forEach((id) => {
      fetch(`http://localhost:4730/todos/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          // Remove the to-do from the local todos array
          todos = todos.filter((todo) => !doneTodoIds.includes(todo.id));
          saveTodosToLocalStorage(todos);
          renderTodos();
        })
        .catch((error) => {
          console.error("Error removing completed to-dos:", error);
        });
    });
  } else {
    alert("No completed to-dos to remove.");
  }
}

/* UPDATE LOCAL STORAGE */
function saveTodosToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* LOAD TODOS FROM LOCALSTORAGE */
function loadTodosFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
}

function renderTodos() {
  todoList.innerHTML = "";

  const showAll = filterAllCheckbox.checked;
  const showOpen = filterOpenCheckbox.checked;
  const showDone = filterDoneCheckbox.checked;

  todos.forEach((todo) => {
    if (showAll || (showOpen && !todo.done) || (showDone && todo.done)) {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${todo.done ? "checked" : ""}>
        <span>${todo.description}</span>
      `;
      const checkbox = li.querySelector("input[type=checkbox");

      checkbox.addEventListener("change", () => {
        // Update the status of the to-do when the checkbox changes
        todo.done = checkbox.checked;

        // Send a PUT request to the API to update the to-do status
        fetch(`http://localhost:4730/todos/${todo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: todo.description,
            done: checkbox.checked,
          }),
        })
          .then(() => {
            saveTodosToLocalStorage(todos);
          })
          .catch((error) => {
            console.error("Error updating to-do status:", error);
          });

        renderTodos();
      });

      todoList.appendChild(li);
    }
  });
}

/* FILTER */
function updateFilter() {
  filterAllCheckbox.checked = false;
  filterOpenCheckbox.checked = false;
  filterDoneCheckbox.checked = false;

  this.checked = true; // Make the clicked checkbox true

  renderTodos();
}
