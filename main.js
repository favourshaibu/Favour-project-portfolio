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

// ===== Contact form validation =====
const contactForm = document.querySelector("#contact-form");

// Guard: only run on the contact page
if (contactForm) {
  const formSuccess = document.querySelector("#form-success");

  // Each field has its input, its error paragraph, and a rule function.
  // A rule returns an error message, or "" when the value is valid.
  const fields = [
    {
      input: document.querySelector("#name"),
      error: document.querySelector("#name-error"),
      check: function (value) {
        return value === "" ? "Please enter your name." : "";
      },
    },
    {
      input: document.querySelector("#email"),
      error: document.querySelector("#email-error"),
      check: function (value) {
        if (value === "") return "Please enter your email address.";
        // Pattern: text, an @, text, a dot, text, with no spaces
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) ? "" : "Enter a valid email, like name@example.com.";
      },
    },
    {
      input: document.querySelector("#phone"),
      error: document.querySelector("#phone-error"),
      check: function (value) {
        if (value === "") return "Please enter your phone number.";
        // Pattern: one or more digits from start to end, nothing else
        const digitsOnly = /^\d+$/;
        return digitsOnly.test(value) ? "" : "Phone number must contain digits only.";
      },
    },
    {
      input: document.querySelector("#message"),
      error: document.querySelector("#message-error"),
      check: function (value) {
        return value === "" ? "Please enter a message." : "";
      },
    },
  ];

  // Validate one field and show or clear its error. Returns true when valid.
  function validateField(field) {
    const message = field.check(field.input.value.trim());
    field.error.textContent = message;

    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
    return message === "";
  }

  // On submit: check every field, only proceed if all pass
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    // map() checks every field so all errors show at once
    const results = fields.map(validateField);
    const allValid = results.every(function (isValid) {
      return isValid;
    });

    if (allValid) {
      contactForm.reset();
      formSuccess.hidden = false;
    } else {
      formSuccess.hidden = true;
      // Move focus to the first field with a problem
      const firstInvalid = fields.find(function (field) {
        return field.input.hasAttribute("aria-invalid");
      });
      firstInvalid.input.focus();
    }
  });

  // Live feedback: check a field when the user leaves it,
  // and re-check as they type once it has been marked invalid
  fields.forEach(function (field) {
    field.input.addEventListener("blur", function () {
      validateField(field);
    });
    field.input.addEventListener("input", function () {
      formSuccess.hidden = true;
      if (field.input.hasAttribute("aria-invalid")) {
        validateField(field);
      }
    });
  });
}
