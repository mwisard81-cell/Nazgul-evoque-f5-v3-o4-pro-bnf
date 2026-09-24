# To-Do List App

A simple front-end to-do list application that runs entirely in the browser.

## Features

- Add a new to-do item
- Mark items as complete/incomplete
- Delete items
- Persist items in `localStorage`
- Restore saved items automatically on page load

## Run the app

No backend is required.

### Option 1: Open directly

Open `index.html` from the repository root in your browser.

### Option 2: Run a local static server

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Usage

1. Enter a task in the input field and click **Add**.
2. Use the checkbox to mark a task complete/incomplete.
3. Click **Delete** to remove a task.
4. Refresh the page — your list remains saved via `localStorage` when browser storage writes are available.
5. If `localStorage` is blocked/unavailable, updates may not persist after refresh.
