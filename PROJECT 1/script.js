const addBtn = document.getElementById("addBtn");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");

const lists = {
  backlog: document.getElementById("backlogList"),
  doing: document.getElementById("doingList"),
  done: document.getElementById("doneList"),
  wontdo: document.getElementById("wontdoList")
};

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
renderTasks();

// Add Task
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  if (!title) return alert("Please enter a title.");

  const newTask = { id: Date.now(), title, desc, status: "backlog" };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  titleInput.value = "";
  descInput.value = "";
});

// Render Tasks
function renderTasks() {
  Object.values(lists).forEach(list => (list.innerHTML = ""));
  tasks.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task");
    div.draggable = true;
    div.dataset.id = task.id;
    div.innerHTML = `
      <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
      <h3>${task.title}</h3>
      <p>${task.desc}</p>
    `;
    lists[task.status].appendChild(div);
  });
  addDragAndDrop();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Drag & Drop
function addDragAndDrop() {
  const allTasks = document.querySelectorAll(".task");
  const allLists = document.querySelectorAll(".task-list");

  allTasks.forEach(task => {
    task.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.dataset.id);
      e.dataTransfer.effectAllowed = "move";
      e.target.classList.add("dragging");
    });

    task.addEventListener("dragend", e => {
      e.target.classList.remove("dragging");
    });
  });

  allLists.forEach(list => {
    list.addEventListener("dragover", e => {
      e.preventDefault(); // required for drop to fire
      e.dataTransfer.dropEffect = "move";
      list.classList.add("highlight");
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("highlight");
    });

    list.addEventListener("drop", e => {
      e.preventDefault();
      list.classList.remove("highlight");
      const id = e.dataTransfer.getData("text/plain");
      const task = tasks.find(t => t.id == id);
      if (!task) return;

      switch (list.id) {
        case "backlogList": task.status = "backlog"; break;
        case "doingList": task.status = "doing"; break;
        case "doneList": task.status = "done"; break;
        case "wontdoList": task.status = "wontdo"; break;
      }
      saveTasks();
      renderTasks();
    });
  });
}

// Save
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

