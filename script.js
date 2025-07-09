
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

if (streakGrid) {
  for (let day = 1; day <= daysInMonth; day++) {
    const box = document.createElement('div');
    box.classList.add('streak-day');
    box.textContent = day; 
    streakGrid.appendChild(box);
  }
}

if (monthName) {
  monthName.textContent = `${currentMonth} Streak`;
}

if (input && label) {
  input.addEventListener('input', () => {
    if (input.value) {
      label.style.opacity = '0';
      label.style.transform = 'translateY(-150%)';
    } else {
      label.style.opacity = '1';
      label.style.transform = 'translateY(-50%)';
    }
  });
}

const addTaskBtn1 = document.getElementById("addTaskBtn");
const addTaskBtn2 = document.getElementById("addTaskBtn2");
const addTaskBtn3 = document.getElementById("addTaskBtn3");

if (addTaskBtn1) {
  addTaskBtn1.addEventListener("click", () => {
    localStorage.setItem("taskTargetSection", "upcoming");
    window.location.href = "add-task.html";
  });
}

if (addTaskBtn2) {
  addTaskBtn2.addEventListener("click", () => {
    localStorage.setItem("taskTargetSection", "current");
    window.location.href = "add-task.html";
  });
}

if (addTaskBtn3) {
  addTaskBtn3.addEventListener("click", () => {
    localStorage.setItem("taskTargetSection", "completed");
    window.location.href = "add-task.html";
  });
}

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

window.addEventListener("DOMContentLoaded", () => {
  const containers = {
    upcoming: document.getElementById("taskContainer1"),
    current: document.getElementById("taskContainer2"),
    completed: document.getElementById("taskContainer3")
  };

  const existingContainers = {};
  Object.keys(containers).forEach(key => {
    if (containers[key]) {
      existingContainers[key] = containers[key];
    }
  });

  function moveTask(sourceSection, sourceIndex, targetSection) {
    console.log(`Moving task from ${sourceSection}[${sourceIndex}] to ${targetSection}`);
    
    let sourceTasks = JSON.parse(localStorage.getItem(sourceSection)) || [];
    
    if (sourceIndex >= sourceTasks.length || sourceIndex < 0) {
      console.error("Invalid source index");
      return;
    }
    
    const taskToMove = sourceTasks.splice(sourceIndex, 1)[0];
    
    let targetTasks = JSON.parse(localStorage.getItem(targetSection)) || [];
    targetTasks.push(taskToMove);
    
    localStorage.setItem(sourceSection, JSON.stringify(sourceTasks));
    localStorage.setItem(targetSection, JSON.stringify(targetTasks));
    
    console.log("Task moved successfully");
    
    location.reload();
  }

  Object.keys(existingContainers).forEach(section => {
    const container = existingContainers[section];
    
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      container.classList.add("drag-over");
    });
    container.addEventListener("dragleave", (e) => {
      e.stopPropagation();
      if (!container.contains(e.relatedTarget)) {
        container.classList.remove("drag-over");
      }
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      container.classList.remove("drag-over");
      
      console.log("Drop event triggered on:", section);
      
      try {
        const dragDataText = e.dataTransfer.getData("text/plain");
        console.log("Drag data:", dragDataText);
        
        if (!dragDataText) {
          console.error("No drag data found");
          return;
        }
        
        const dragData = JSON.parse(dragDataText);
        const { section: sourceSection, index: sourceIndex } = dragData;
        const targetSection = section;
        
        console.log(`Attempting to move from ${sourceSection} to ${targetSection}`);
        
        if (sourceSection === targetSection) {
          console.log("Dropping in same section, no action needed");
          return;
        }
        
        const targetTasks = JSON.parse(localStorage.getItem(targetSection)) || [];
        if ((targetSection === "upcoming" || targetSection === "current") && targetTasks.length >= 10) {
          alert(`${targetSection} section has reached the maximum of 10 tasks.`);
          return;
        }
     
        moveTask(sourceSection, parseInt(sourceIndex), targetSection);
        
      } catch (error) {
        console.error("Error handling drop:", error);
      }
    });
  });
  ["upcoming", "current", "completed"].forEach(section => {
    const container = existingContainers[section];
    if (!container) return;
    
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
      
      card.setAttribute("draggable", "true");
      card.dataset.section = section;
      card.dataset.index = index;

      card.addEventListener("dragstart", (e) => {
        console.log("Drag started for:", task.title, "from section:", section, "index:", index);
        
        const dragData = JSON.stringify({ section, index });
        e.dataTransfer.setData("text/plain", dragData);
        e.dataTransfer.effectAllowed = "move";
        
        card.classList.add("dragging");
        
        Object.values(existingContainers).forEach(container => {
          if (container !== card.parentElement) {
            container.classList.add("valid-drop-zone");
          }
        });
      });

      card.addEventListener("dragend", (e) => {
        console.log("Drag ended for:", task.title);
        card.classList.remove("dragging");
        
        Object.values(existingContainers).forEach(container => {
          container.classList.remove("drag-over", "valid-drop-zone");
        });
      });

      card.addEventListener("click", (e) => {
        if (!card.classList.contains("dragging")) {
          openTaskModal(task, section, index);
        }
      });

      container.appendChild(card);
    });
  });
});

window.addEventListener('load', function () {
    const screenWidth = window.innerWidth;

    if (screenWidth > 768) {
        document.body.style.visibility = 'hidden';
        document.body.style.background = 'white'; 
        
        alert("This app is not supported on desktop or tablet.\nPlease click OK then scan the QR code to access it using your phone.\n\nThank you for understanding :)");

        document.body.style.visibility = 'visible';
        document.body.innerHTML = `
            <div style="
                text-align: center;
                margin-top: 80px;
                font-family: 'Segoe UI', sans-serif;
                padding: 0 20px;
            ">
                <h1 style="font-size: 3rem; margin-bottom: 20px;">Mobile Only :'(</h1>
                <p style="font-size: 1.5rem; margin-bottom: 20px;">
                    This web app is built exclusively for mobile devices.
                </p>
                <p style="font-size: 1.3rem; margin-bottom: 30px;">
                    Please scan the QR code below with your phone:
                </p>
                <img src="qrcode.png" alt="Scan QR to open on mobile" style="width: 300px; height: 300px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.2);" />
                <p style="font-size: 1.2rem; margin-top: 30px;">
                    Thanks for understanding :)
                </p>
            </div>
        `;
    }
});