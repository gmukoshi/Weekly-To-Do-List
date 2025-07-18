document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'http://localhost:3000/activities';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDiv = document.getElementById('week');

  days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerHTML = `
      <h2>${day}</h2>
      <ul id="${day}-list"></ul>
      <input type="text" placeholder="Add a activity" id="${day}-input" />
    `;
    weekDiv.appendChild(dayDiv);

    const input = dayDiv.querySelector('input');
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && input.value.trim() !== '') {
        addActivityToServer(day, input.value);
        input.value = '';
      }
    });
  });

  function renderActivity(activity) {
    const list = document.getElementById(`${activity.day}-list`);
    if (!list) return;

    const li = document.createElement('li');
    if (activity.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = activity.text;
    span.style.flexGrow = 1;
    span.addEventListener('click', () => {
      li.classList.toggle('completed');
      toggleCompletion(activity.id, !activity.completed);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      deleteActivity(activity.id);
      li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }

  function fetchActivites() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => data.forEach(activity => renderActivities(activity)))
      .catch(err => console.error("Failed to fetch activity:", err));
  }

  function addActivityToServer(day, text) {
    const activity = { day, text, completed: false };
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    })
      .then(res => res.json())
      .then(data => renderActivity(data))
      .catch(err => console.error("Failed to add activity:", err));
  }

  function deleteActivity(id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error("Failed to delete activity:", err));
  }

  function toggleCompletion(id, completed) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    }).catch(err => console.error("Failed to update activity:", err));
  }

  // 📂 Bulk JSON Upload Handler
  window.uploadActivities = function () {
    const fileInput = document.getElementById('activityFileInput');
    const file = fileInput.files[0];
    if (!file) {
      alert("Please choose a JSON file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const activities = JSON.parse(e.target.result);

        if (!Array.isArray(activities)) {
          alert("The file must contain a JSON array of activities.");
          return;
        }

        activities.forEach(activity => {
          if (!activity.day || !activities.text) {
            console.warn("Invalid activity skipped:", activity);
            return;
          }

          fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              day: activity.day,
              text: activity.text,
              completed: activity.completed || false
            })
          })
            .then(res => res.json())
            .then(data => renderActivity(data));
        });

      } catch (err) {
        alert("Error parsing JSON file.");
        console.error(err);
      }
    };

    reader.readAsText(file);
  };

  // Load activities on page load
  fetchActivites();
});
