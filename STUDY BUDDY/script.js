document.addEventListener("DOMContentLoaded", () => {

  // ======== Streak & Task Data ========
  let streak = parseInt(localStorage.getItem('streak')) || 0;
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const btn = document.getElementById('streakBtn');
  const countDisplay = document.getElementById('streakCount');
  const taskList = document.getElementById('taskList');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const newTaskInput = document.getElementById('newTask');
  const streakSound = document.getElementById('streakSound');
  const progressBar = document.getElementById('progressBar');
  const quoteBox = document.getElementById('quoteBox');
  const newQuoteBtn = document.getElementById('newQuoteBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimerBtn');
  const pauseBtn = document.getElementById('pauseTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');

  const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Stay positive, work hard, make it happen.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream it. Wish it. Do it.",
    "Don’t stop when you’re tired. Stop when you’re done."
  ];

  // ======== Task Rendering ========
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.className = 'task';
      if (task.completed) div.classList.add('completed');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateProgress();
        checkAllTasks();
      });

      const label = document.createElement('span');
      label.textContent = task.text;

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText) {
          tasks[index].text = newText;
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
        }
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateProgress();
      });

      div.append(checkbox, label, editBtn, delBtn);
      taskList.appendChild(div);
    });
  }

  // ======== Progress Bar ========
  function updateProgress() {
    if (tasks.length === 0) {
      progressBar.style.width = '0%';
      localStorage.setItem('totalTasks', 0);
      localStorage.setItem('completedTasks', 0);
      return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
    progressBar.style.width = `${percent}%`;

    // 🔥 Sync with global progress data
    localStorage.setItem('totalTasks', tasks.length);
    localStorage.setItem('completedTasks', completed);

    // Recalculate overall task progress if available
    if (window.updateProgress?.tasks) {
      window.updateProgress.tasks();
    }
  }

  // ======== Streak ========
  function increaseStreak() {
    streak++;
    localStorage.setItem('streak', streak);
    updateEmoji();
    streakSound.play();
    countDisplay.classList.add('pop');
    setTimeout(() => countDisplay.classList.remove('pop'), 500);
  }

  function updateEmoji() {
    let emoji = '⭐';
    if (streak >= 20) emoji = '🔥';
    else if (streak >= 10) emoji = '💪';
    else if (streak >= 5) emoji = '🌟';
    countDisplay.textContent = `${streak} ${emoji}`;
  }

  function checkAllTasks() {
    const allDone = tasks.length && tasks.every(t => t.completed);
    if (allDone) increaseStreak();
  }

  // ======== Add Task ========
  addTaskBtn.addEventListener('click', () => {
    const text = newTaskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    newTaskInput.value = '';
    renderTasks();
    updateProgress();
  });

  // ======== Quote Generator ========
  function showRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteBox.textContent = `"${random}"`;
  }
  newQuoteBtn.addEventListener('click', showRandomQuote);

  // ======== Pomodoro Timer ========
  let timer = null;
  let timeLeft = 25 * 60;

  function updateTimerDisplay() {
    let min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    let sec = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
  }

  startBtn.addEventListener('click', () => {
    if (timer) return;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        timer = null;
        alert('Pomodoro finished!');
      }
    }, 1000);
  });

  pauseBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
  });

  // ======== Theme Toggle ========
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);

  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  });

  // ======== Init ========
  renderTasks();
  updateProgress();
  updateEmoji();
  showRandomQuote();
});
