// ===== Mobile navigation toggle =====
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

// Guard: only run if both elements exist on this page
if (navToggle && navMenu) {
  // Open or close the menu and keep the button's ARIA state in sync
  function setMenu(isOpen) {
    navMenu.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  // Clicking the hamburger flips the current state
  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  // Clicking any link closes the menu
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  // Pressing Escape closes the menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });
}

// ===== Academic planner =====
const taskForm = document.querySelector("#task-form");

// Guard: only run on the planner page
if (taskForm) {
  const taskInput = document.querySelector("#task-input");
  const taskError = document.querySelector("#task-error");
  const taskList = document.querySelector("#task-list");
  const taskCount = document.querySelector("#task-count");
  const emptyMessage = document.querySelector("#empty-message");
  const STORAGE_KEY = "planner-tasks";

  // The array of task objects: { id, text, completed }
  let tasks = loadTasks();

  // Read saved tasks from the browser (falls back to an empty array)
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  // Save the array as text so it survives a page refresh
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      // Storage unavailable: the planner still works for this visit
    }
  }

  // ADD: create a task object and push it into the array
  function addTask(text) {
    tasks.push({ id: Date.now(), text: text, completed: false });
    saveTasks();
    renderTasks();
  }

  // COMPLETE: flip the completed value of the matching task
  function toggleTask(id) {
    tasks = tasks.map(function (task) {
      return task.id === id ? { ...task, completed: !task.completed } : task;
    });
    saveTasks();
    renderTasks();
  }

  // DELETE: keep every task except the one with this id
  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
  }

  // Rebuild the list on screen from the array (dynamic content update)
  function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(function (task) {
      const item = document.createElement("li");
      item.className = "task-item" + (task.completed ? " completed" : "");
      item.dataset.id = task.id;

      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text; // textContent is safe: it never runs HTML

      label.append(checkbox, text);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "task-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);

      item.append(label, deleteBtn);
      taskList.append(item);
    });

    const done = tasks.filter(function (task) {
      return task.completed;
    }).length;

    taskCount.textContent = tasks.length ? done + " of " + tasks.length + " completed" : "";
    emptyMessage.hidden = tasks.length > 0;
  }

  // Form submit: validate, then add
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading
    const text = taskInput.value.trim();

    if (text === "") {
      taskError.textContent = "Enter a task first.";
      taskInput.setAttribute("aria-invalid", "true");
      return;
    }

    addTask(text);
    taskInput.value = "";
    taskInput.focus();
  });

  // Clear the error as soon as the user starts typing
  taskInput.addEventListener("input", function () {
    taskError.textContent = "";
    taskInput.removeAttribute("aria-invalid");
  });

  // EVENT DELEGATION: one listener on the list handles every task
  taskList.addEventListener("click", function (event) {
    const item = event.target.closest(".task-item");
    if (!item) return;
    const id = Number(item.dataset.id);

    if (event.target.matches(".task-delete")) {
      deleteTask(id);
    } else if (event.target.matches("input[type='checkbox']")) {
      toggleTask(id);
    }
  });

  renderTasks(); // draw the saved tasks when the page loads
}
