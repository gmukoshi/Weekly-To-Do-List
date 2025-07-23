document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById("taskInput");
  const daySelect = document.getElementById("daySelect");
  const API_URL = "https://weekly-to-do-list4.onrender.com/tasks"; // ✅ Relative path for combined frontend/backend

  function addActivity() {
    const taskText = taskInput.value.trim();
    const selectedDay = daySelect.value;

    if (taskText === "") {
      alert("Please enter a task.");
      return;
    }

    const newTask = {
      day: selectedDay,
      text: taskText,
      completed: false
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
    .then(res => res.json())
    .then(task => {
      renderTask(task);
      taskInput.value = "";
    })
    .catch(err => console.error("Failed to add task:", err));
  }

  function fetchTasks() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach(task => renderTask(task));
        }
      })
      .catch(err => console.error("Failed to load tasks:", err));
  }

  function renderTask(task) {
    const dayList = document.getElementById(task.day);
    const li = document.createElement("li");
    li.textContent = task.text;
    li.style.cursor = "pointer";

    if (task.completed) {
      li.style.textDecoration = "line-through";
    }

    li.addEventListener("click", () => {
      task.completed = !task.completed;
      updateTask(task, li);
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(task.id, li);
    };

    li.appendChild(removeBtn);
    dayList.appendChild(li);
  }

  function updateTask(task, li) {
    fetch(`${API_URL}/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: task.completed })
    })
    .then(() => {
      li.style.textDecoration = task.completed ? "line-through" : "none";
    })
    .catch(err => console.error("Failed to update task:", err));
  }

  function deleteTask(id, li) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => li.remove())
      .catch(err => console.error("Failed to delete task:", err));
  }

  window.addActivity = addActivity;
  fetchTasks();
});
