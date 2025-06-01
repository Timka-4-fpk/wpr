
// Переключение тем
document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (document.getElementById("themeToggle")) {
    document.getElementById("themeToggle").addEventListener("click", () => {
      const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
});

// Приложение 1: добавление и удаление привычек
const habits = JSON.parse(localStorage.getItem("habits") || "[]");

function renderHabits() {
  const container = document.getElementById("habitsList");
  if (!container) return;
  container.innerHTML = "";
  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.className = "habit-card";
    div.innerHTML = `<strong>${habit.name}</strong> <button onclick="deleteHabit(${index})">Удалить</button>`;
    container.appendChild(div);
  });
}

function addHabit(name) {
  if (!name) return;
  habits.push({ name, score: 0, log: [] });
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

// Приложение 2: обработка формы и подсчет очков
function completeHabit(index) {
  habits[index].score += 10;
  habits[index].log.push(new Date().toISOString());
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

// Приложение 3: загрузка данных и визуализация
async function fetchQuotes() {
  const container = document.getElementById("quoteBox");
  if (!container) return;
  try {
    const res = await fetch("https://type.fit/api/quotes");
    const data = await res.json();
    const q = data[Math.floor(Math.random() * data.length)];
    container.innerHTML = `<em>"${q.text}"</em><br>— ${q.author || "Неизвестный"}`;
  } catch {
    container.innerHTML = "Не удалось загрузить цитату.";
  }
}
