
const form = document.getElementById("habit-form");
const list = document.getElementById("habits-list");

function formatDuration(startDate) {
  const now = new Date();
  const then = new Date(startDate);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  return `${diffDays} д. ${diffHours} ч.`;
}

function isTodayLogged(logs) {
  const today = new Date().toISOString().split('T')[0];
  return logs && logs.some(d => d.startsWith(today));
}

function loadHabits() {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  list.innerHTML = "";
  habits.forEach((habit, index) => {
    const el = document.createElement("div");
    el.className = "habit-card";
    const duration = formatDuration(habit.createdAt);
    const doneToday = isTodayLogged(habit.logs || []);
    el.innerHTML = \`
      <div>
        <strong>\${habit.name}</strong> — \${habit.frequency}, цель: \${habit.goal}<br>
        <small>Привычке: \${duration}</small><br>
        <button onclick="markToday(\${index})" \${doneToday ? 'disabled' : ''}>
          \${doneToday ? '✔ Сегодня выполнено' : 'Отметить за сегодня'}
        </button>
      </div>
      <div>
        <button onclick="editHabit(\${index})">✏️</button>
        <button onclick="deleteHabit(\${index})">🗑️</button>
      </div>
    \`;
    list.appendChild(el);
  });
}

function saveHabit(habit) {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  habit.createdAt = new Date().toISOString();
  habit.logs = [];
  habits.push(habit);
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function deleteHabit(index) {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function editHabit(index) {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const habit = habits[index];
  document.getElementById("habit-name").value = habit.name;
  document.getElementById("habit-frequency").value = habit.frequency;
  document.getElementById("habit-goal").value = habit.goal;
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function markToday(index) {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const today = new Date().toISOString();
  if (!habits[index].logs) habits[index].logs = [];
  if (!isTodayLogged(habits[index].logs)) {
    habits[index].logs.push(today);
  }
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const habit = {
    name: document.getElementById("habit-name").value,
    frequency: document.getElementById("habit-frequency").value,
    goal: document.getElementById("habit-goal").value
  };
  saveHabit(habit);
  form.reset();
});

window.onload = loadHabits;
