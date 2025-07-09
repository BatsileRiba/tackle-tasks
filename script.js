const streakGrid = document.getElementById('streakGrid');
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
const monthName = document.getElementById('month-name');
const currentMonth = new Date().toLocaleString('default', { month: 'long' });
const hour = new Date().getHours();
const userName = "Batsile"  // Placeholder for user's name, will be dynamically set later
const greetingElement = document.getElementById("greeting");
const input = document.getElementById('search-input');
const label = document.querySelector('.placeholder');
const addTask = document.getElementById('addTaskBtn');



let timeGreeting = "Hello";

if (hour < 12) {
  timeGreeting = "Good morning";
} else if (hour < 17) {
  timeGreeting = "Good afternoon";
} else {
  timeGreeting = "Good evening";
}

if (greetingElement) {
  greetingElement.textContent = `${timeGreeting}, ${userName}`;
}

for (let day = 1; day <= daysInMonth; day++) {
  const box = document.createElement('div');
  box.classList.add('streak-day');
  box.textContent = day; 
  streakGrid.appendChild(box);
}

monthName.textContent = `${currentMonth} Streak`;

input.addEventListener('input', () => {
  if (input.value) {
    label.style.opacity = '0';
    label.style.transform = 'translateY(-150%)';
  } else {
    label.style.opacity = '1';
    label.style.transform = 'translateY(-50%)';
  }
});


const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskBtn2 = document.getElementById("addTaskBtn2");
const addTaskBtn3 = document.getElementById("addTaskBtn3");
document.getElementById("addTaskBtn").addEventListener("click", () => {
  localStorage.setItem("taskTargetSection", "upcoming");
  window.location.href = "add-task.html";
});

document.getElementById("addTaskBtn2").addEventListener("click", () => {
  localStorage.setItem("taskTargetSection", "current");
  window.location.href = "add-task.html";
});

document.getElementById("addTaskBtn3").addEventListener("click", () => {
  localStorage.setItem("taskTargetSection", "completed");
  window.location.href = "add-task.html";
});


function openTaskModal(task, section, index) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${task.title}</h2>
      <p><strong>Description:</strong> ${task.description || "(No description)"}</p>
      <p><strong>Due Date:</strong> ${task.dueDate || "(No due date)"}</p>
      <button id="deleteTaskBtn">Delete</button>
      <button id="moveTaskBtn">Move</button>
      <button id="closeModalBtn">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("closeModalBtn").addEventListener("click", () => modal.remove());

  document.getElementById("deleteTaskBtn").addEventListener("click", () => {
    let tasks = JSON.parse(localStorage.getItem(section)) || [];
    tasks.splice(index, 1);
    localStorage.setItem(section, JSON.stringify(tasks));
    modal.remove();
    location.reload();
  });

  document.getElementById("moveTaskBtn").addEventListener("click", () => {
    const options = ["upcoming", "current", "completed"].filter(s => s !== section);
    const target = prompt(`Move to which section? (${options.join(", ")})`);
    if (!options.includes(target)) {
      alert("Invalid section.");
      return;
    }

    let tasks = JSON.parse(localStorage.getItem(section)) || [];
    let taskToMove = tasks.splice(index, 1)[0];

    let targetTasks = JSON.parse(localStorage.getItem(target)) || [];
    if ((target === "upcoming" || target === "current") && targetTasks.length >= 10) {
      alert("Target section has reached the max of 10 tasks.");
      return;
    }

    targetTasks.push(taskToMove);
    localStorage.setItem(section, JSON.stringify(tasks));
    localStorage.setItem(target, JSON.stringify(targetTasks));
    modal.remove();
    location.reload();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const containers = {
    upcoming: document.getElementById("taskContainer1"),
    current: document.getElementById("taskContainer2"),
    completed: document.getElementById("taskContainer3")
  };

  ["upcoming", "current", "completed"].forEach(section => {
    const container = containers[section];
    const tasks = JSON.parse(localStorage.getItem(section)) || [];

    if (tasks.length === 0) {
      container.classList.add("empty");
    } else {
      container.classList.remove("empty");
    }

    container.innerHTML = ""; 

    tasks.forEach((task, index) => {
      const card = document.createElement("div");
      card.classList.add("task-card", section);
      card.textContent = task.title;
      card.addEventListener("click", () => openTaskModal(task, section, index));
      container.appendChild(card);
    });
  });
});

function openTaskModal(task, section, index) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${task.title}</h2>
      <p><strong>Description:</strong> ${task.description || "(No description)"}</p>
      <p><strong>Due Date:</strong> ${task.dueDate || "(No due date)"}</p>
      <div class="modal-buttons">
        <button id="deleteBtn">Delete Task</button>
        ${section !== "completed" ? `<button id="pushCompletedBtn">Mark as Completed</button>` : ""}
        <button id="closeBtn">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("closeBtn").addEventListener("click", () => modal.remove());

  document.getElementById("deleteBtn").addEventListener("click", () => {
    let tasks = JSON.parse(localStorage.getItem(section)) || [];
    tasks.splice(index, 1);
    localStorage.setItem(section, JSON.stringify(tasks));
    modal.remove();
    location.reload();
  });

  if (section !== "completed") {
    document.getElementById("pushCompletedBtn").addEventListener("click", () => {
      let sourceTasks = JSON.parse(localStorage.getItem(section)) || [];
      let taskToMove = sourceTasks.splice(index, 1)[0];

      let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
      completedTasks.push(taskToMove);

      localStorage.setItem(section, JSON.stringify(sourceTasks));
      localStorage.setItem("completed", JSON.stringify(completedTasks));

      modal.remove();
      location.reload();
    });
  }
}

