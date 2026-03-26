const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const quoteText = document.getElementById("quote");
const newQuoteBtn = document.getElementById("newQuote");

const levelEl = document.getElementById("level");
const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const streakEl = document.getElementById("streak");
const doneCount = document.getElementById("doneCount");
const totalCount = document.getElementById("totalCount");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const rewardText = document.getElementById("rewardText");

let tasks = JSON.parse(localStorage.getItem("focusforgeTasks")) || [];
let filter = "all";
let xp = parseInt(localStorage.getItem("focusforgeXP")) || 0;
let streak = parseInt(localStorage.getItem("focusforgeStreak")) || 0;
let theme = localStorage.getItem("focusforgeTheme") || "dark";

const quotes = [
  "Small progress is still progress.",
  "Discipline beats motivation.",
  "One task at a time. One win at a time.",
  "You don’t need more time. You need more focus.",
  "Done is better than perfect."
];

if (theme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
}

function saveData() {
  localStorage.setItem("focusforgeTasks", JSON.stringify(tasks));
  localStorage.setItem("focusforgeXP", xp);
  localStorage.setItem("focusforgeStreak", streak);
  localStorage.setItem("focusforgeTheme", document.body.classList.contains("light") ? "light" : "dark");
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const realIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleTask(${realIndex})">Done</button>
        <button class="delete-btn" onclick="deleteTask(${realIndex})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveData();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  xp = tasks[index].completed ? Math.min(xp + 20, 100) : Math.max(xp - 20, 0);
  saveData();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  renderTasks();
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const level = Math.floor(xp / 100) + 1;

  levelEl.textContent = level;
  xpText.textContent = `XP: ${xp} / 100`;
  xpFill.style.width = `${xp}%`;
  streakEl.textContent = `${streak} 🔥`;

  doneCount.textContent = completed;
  totalCount.textContent = total;
  progressFill.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;

  if (completed >= 1) rewardText.textContent = "Nice work. Keep the momentum going.";
  if (completed >= 3) rewardText.textContent = "Strong progress today. Stay locked in.";
  if (completed >= 5) rewardText.textContent = "Excellent consistency. You’re in flow.";
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  saveData();
});

newQuoteBtn.addEventListener("click", () => {
  const random = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[random];
});

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function updateStreak() {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem("focusforgeLastVisit");

  if (lastVisit !== today) {
    streak += 1;
    localStorage.setItem("focusforgeLastVisit", today);
  }
}

updateStreak();
renderTasks();
saveData();