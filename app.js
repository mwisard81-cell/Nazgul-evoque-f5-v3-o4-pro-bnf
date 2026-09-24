const STORAGE_KEY = "todo-items";
const DEFAULT_TODOS = [
  { id: "bf-connect", text: "Connecter le drone en USB avec un câble de données puis ouvrir Betaflight Configurator.", completed: false },
  { id: "bf-ports", text: "Vérifier l’onglet Ports et activer l’UART du récepteur/VTX si nécessaire.", completed: false },
  { id: "bf-setup", text: "Contrôler l’orientation du drone dans l’onglet Setup et corriger l’alignement de la FC.", completed: false },
  { id: "bf-protocol", text: "Choisir le protocole ESC/moteur et vérifier la fréquence gyro adaptée dans Configuration.", completed: false },
  { id: "bf-receiver", text: "Configurer le type de récepteur (ELRS, Crossfire, SBUS...) et vérifier le mapping des voies.", completed: false },
  { id: "bf-motors", text: "Tester le sens des moteurs sans hélices et corriger si besoin dans BLHeli/Bluejay.", completed: false },
  { id: "bf-modes", text: "Affecter les modes ARM, BEEPER et éventuellement ANGLE/HORIZON sur vos interrupteurs radio.", completed: false },
  { id: "bf-failsafe", text: "Tester le failsafe radio pour confirmer la coupure des moteurs en cas de perte de signal.", completed: false },
  { id: "bf-osd", text: "Régler l’OSD (RSSI/LQ, tension, minuterie) puis sauvegarder le profil.", completed: false },
];

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
      return createDefaultTodos();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return createDefaultTodos();
    }

    return parsed.filter(
      (item) => typeof item?.id === "string" && typeof item?.text === "string" && typeof item?.completed === "boolean",
    );
  } catch {
    return createDefaultTodos();
  }
}

function persistAndRender(nextTodos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
    todos = nextTodos;
    renderTodos();
  } catch {
    status.textContent = "Impossible d’enregistrer les changements dans le stockage local.";
  }
}

function renderTodos() {
  if (todos.length === 0) {
    list.innerHTML = "";
    status.textContent = "Aucune étape dans la checklist.";
    return;
  }

  list.innerHTML = "";
  status.textContent = `${todos.length} étape${todos.length === 1 ? "" : "s"} dans la checklist.`;

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";

    const label = document.createElement("label");
    label.className = "todo-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `${todo.text} (${todo.completed ? "terminée" : "non terminée"})`);
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
    deleteButton.textContent = "Supprimer";

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

function createDefaultTodos() {
  return DEFAULT_TODOS.map((todo) => ({ ...todo }));
}
