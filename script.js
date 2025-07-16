document.addEventListener("DOMContentLoaded", function(){
  console.log("page fully loaded");document.addEventListener
  const API_URL = "http://localhost:3000/activities";
  renderWeekOverview();
  fetchTasks();

  document.getElementById("acitivity-form").addEventListener("submit", handleAddActivity);


function renderWeekOverview() {
  const weeklyOverview = document.getElementById("week-view");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  weekView.innerHTML = "";

  days.forEach(day => {
    const col = document.createElement("div");
    col.className = "day-column";
    col.dataset.day = day;
    col.innerHTML = `<h3>${day}</h3><ul class="activity-list"></ul>`;
    weekView.appendChild(col);
  });
}

function fetchTasks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      tasks.forEach(renderActivity);
    });
}

function renderActivity(activity) {
  const col = document.querySelector(`[data-day="${activity.day}"] .activity-list`);
  const li = document.createElement("li");
  li.className = "activity";
  if (activity.completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${task.title}</span>
    <div>
      <button onclick="toggleComplete(${activity.id}, ${activity.completed})">✔️</button>
      <button onclick="deleteActivity(${activity.id})">🗑️</button>
    </div>
  `;

  col.appendChild(li);
}

function handleAddActivity(e) {
  e.preventDefault();
  const title = document.getElementById("activity-title").value;
  const day = document.getElementById("activity-day").value;

  const newActivity = {
    title,
    completed: false,
    day
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newActivity)
  })
    .then(res => res.json())
    .then(activity => {
      renderActivity(activity);
      e.target.reset();
    });
}

function toggleComplete(id, currentStatus) {
  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !currentStatus })
  })
    .then(res => res.json())
    .then(() => {
      // Reload tasks
      renderWeekOverview();
      fetchActivity();
    });
}

function deleteActivity(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => {
      renderWeekOverview();
      fetchActivity();
    });
}
});
