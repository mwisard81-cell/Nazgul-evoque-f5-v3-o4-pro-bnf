const STORAGE_KEY = "todo-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const status = document.getElementById("todo-status");

let todos = loadTodos();
renderTodos();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    return;
  }

  const nextTodos = [
    ...todos,
    {
      id: generateId(),
      text,
      completed: false,
    },
  ];

  persistAndRender(nextTodos);
  form.reset();
  input.focus();
});

list.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.dataset.action === "toggle") {
    const id = event.target.dataset.id;
    const nextTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: event.target.checked } : todo));
    persistAndRender(nextTodos);
  }
});

list.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement && event.target.dataset.action === "delete") {
    const id = event.target.dataset.id;
    const nextTodos = todos.filter((todo) => todo.id !== id);
    persistAndRender(nextTodos);
  }
});

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) => typeof item?.id === "string" && typeof item?.text === "string" && typeof item?.completed === "boolean",
    );
  } catch {
    return [];
  }
}

function persistAndRender(nextTodos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
    todos = nextTodos;
    renderTodos();
  } catch {
    status.textContent = "Unable to save changes in local storage.";
  }
}

function renderTodos() {
  if (todos.length === 0) {
    list.innerHTML = "";
    status.textContent = "No tasks in the list.";
    return;
  }

  list.innerHTML = "";
  status.textContent = `${todos.length} task${todos.length === 1 ? "" : "s"} in the list.`;

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";

    const label = document.createElement("label");
    label.className = "todo-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `${todo.text} (${todo.completed ? "completed" : "not completed"})`);
    checkbox.dataset.action = "toggle";
    checkbox.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = `todo-text${todo.completed ? " completed" : ""}`;
    text.textContent = todo.text;

    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = todo.id;
    deleteButton.textContent = "Delete";

    item.append(label, deleteButton);
    list.appendChild(item);
  }
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(4);
    crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("-");
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
