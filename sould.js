////DOM ELEMENTS SELECTION
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalTaskElement = document.getElementById("total-tasks");
const completedTaskElement = document.getElementById("completed-tasks");
const pendingTaskElement = document.getElementById("pending-tasks");
const filterButtons = document.querySelectorAll(".filter-btn");

////TASK DATA STORAGE
let tasks = [];
let taskIdCounter = 1;
let currentFilter = "all";

///CLICK EVENT ON BUTTON
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

////INPUT VALIDATION
taskInput.addEventListener("input", function () {
  const isEmpty = this.value.trim() === "";
  addBtn.disabled = isEmpty;
});

////FILTERING BUTTON AND REMOVING/ADDING ACTIVE STATE
filterButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

///Adding Task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  ////create task object
  const task = {
    id: taskIdCounter++,
    text: taskText,
    completed: false,
    createdAt: new Date(),
  };

  ////Updating the Array with new task
  tasks.push(task);

  ///Clear input
  taskInput.value = "";
  addBtn.disabled = true;

  ///update ui
  renderTasks();
  updateStats();
}

function toggleTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (task) {
    task.completed = !task.completed;
    renderTasks();
    updateStats();
  }
}

function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
    updateStats();
  }
}

function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (task) {
    const newText = prompt("Edit task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      renderTasks();
    }
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";

    filteredTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-item ${task.completed ? "completed" : ""}`;
  li.setAttribute("data-task-id", task.id);

  li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${
              task.completed ? "checked" : ""
            }>
            <span class="task-text ${task.completed ? "completed" : ""}">${
    task.text
  }</span>
            <div class="task-buttons">
                <button class="btn edit-btn" onclick="editTask(${task.id})">
                    Edit
                </button>
                <button class="btn delete-btn" onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        </div>
    `;

  // Add event listener for checkbox toggle
  const checkbox = li.querySelector(".task-checkbox");
  checkbox.addEventListener("change", () => toggleTask(task.id));

  return li;
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  totalTaskElement.textContent = total;
  completedTaskElement.textContent = completed;
  pendingTaskElement.textContent = pending;
}

function init() {
  addBtn.disabled = true;
  renderTasks();
  updateStats();
}

// Initialize the app
init();



