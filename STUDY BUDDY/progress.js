document.addEventListener("DOMContentLoaded", () => {

    const progressData = {
        tasks: {
            total: parseInt(localStorage.getItem("totalTasks")) || 0,
            completed: parseInt(localStorage.getItem("completedTasks")) || 0,
            streak: parseInt(localStorage.getItem("streak")) || 0,
            lastCompleted: localStorage.getItem("lastTaskCompleted") || null
        },
        quizzes: {
            total: parseInt(localStorage.getItem("totalQuizzes")) || 0,
            bestScore: parseInt(localStorage.getItem("bestScore")) || 0,
            averageScore: parseFloat(localStorage.getItem("averageScore")) || 0,
            attempted: parseInt(localStorage.getItem("quizzesAttempted")) || 0
        },
        flashcards: {
            total: parseInt(localStorage.getItem("totalFlashcards")) || 0,
            mastered: parseInt(localStorage.getItem("masteredFlashcards")) || 0,
            lastStudied: localStorage.getItem("lastFlashcardStudy") || null
        }
    };
  
    const streakDisplay = document.getElementById("streakCount");
    const todoProgress = document.getElementById("todo-progress");
    const todoDetails = document.getElementById("todo-details");
    const quizProgress = document.getElementById("quiz-progress");
    const quizDetails = document.getElementById("quiz-details");
    const flashcardProgress = document.getElementById("flashcard-progress");
    const lastActivity = document.getElementById("last-activity");
  
    function getProgressColor(percent) {
        if (percent >= 80) return '#28a745';
        if (percent >= 60) return '#17a2b8';
        if (percent >= 40) return '#ffc107';
        if (percent >= 20) return '#fd7e14';
        return '#dc3545';
    }
  
    function formatDate(dateString) {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
  
    function animateProgressBar(bar, percent) {
        let width = 0;
        bar.style.width = '0%';
        bar.style.backgroundColor = getProgressColor(percent);
  
        const interval = setInterval(() => {
            if (width >= percent) clearInterval(interval);
            else {
                width += 1;
                bar.style.width = `${width}%`;
                bar.textContent = `${Math.round(width)}%`;
            }
        }, 10);
    }
  
    function updateTaskProgress() {
        const percent = progressData.tasks.total > 0
            ? (progressData.tasks.completed / progressData.tasks.total) * 100
            : 0;
        animateProgressBar(todoProgress, percent);
  
        todoDetails.innerHTML = `
            <div class="progress-detail">Completed: ${progressData.tasks.completed} / ${progressData.tasks.total}</div>
            <div class="progress-detail">Current Streak: 🔥 ${progressData.tasks.streak} days</div>
        `;
        streakDisplay.textContent = `${progressData.tasks.streak} ⭐`;
    }
  
    function updateQuizProgress() {
        const percent = progressData.quizzes.total > 0
            ? (progressData.quizzes.bestScore / progressData.quizzes.total) * 100
            : 0;
        animateProgressBar(quizProgress, percent);
  
        quizDetails.innerHTML = `
            <div class="progress-detail">Best Score: ${progressData.quizzes.bestScore} / ${progressData.quizzes.total}</div>
            <div class="progress-detail">Average Score: ${progressData.quizzes.averageScore.toFixed(1)}%</div>
            <div class="progress-detail">Attempted: ${progressData.quizzes.attempted}</div>
        `;
    }
  
    function updateFlashcardProgress() {
        const percent = progressData.flashcards.total > 0
            ? (progressData.flashcards.mastered / progressData.flashcards.total) * 100
            : 0;
        animateProgressBar(flashcardProgress, percent);
    }
  
    function updateLastActivity() {
        lastActivity.innerHTML = `
            <p>Last Task Completed: ${formatDate(progressData.tasks.lastCompleted)}</p>
            <p>Last Flashcard Study: ${formatDate(progressData.flashcards.lastStudied)}</p>
        `;
    }
  
    function initializeProgress() {
        updateTaskProgress();
        updateQuizProgress();
        updateFlashcardProgress();
        updateLastActivity();
    }
  
    // Theme toggle sync
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
  
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
  
    initializeProgress();
  
    // Listen for localStorage changes to update progress in real-time
    window.addEventListener('storage', () => {
        progressData.tasks.streak = parseInt(localStorage.getItem('streak')) || 0;
        progressData.tasks.completed = parseInt(localStorage.getItem('completedTasks')) || 0;
        progressData.tasks.total = parseInt(localStorage.getItem('totalTasks')) || 0;
  
        progressData.quizzes.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        progressData.quizzes.total = parseInt(localStorage.getItem('totalQuizzes')) || 0;
        progressData.quizzes.averageScore = parseFloat(localStorage.getItem('averageScore')) || 0;
        progressData.quizzes.attempted = parseInt(localStorage.getItem('quizzesAttempted')) || 0;
  
        progressData.flashcards.mastered = parseInt(localStorage.getItem('masteredFlashcards')) || 0;
        progressData.flashcards.total = parseInt(localStorage.getItem('totalFlashcards')) || 0;
        progressData.flashcards.lastStudied = localStorage.getItem('lastFlashcardStudy') || null;
  
        initializeProgress();
    });
  
  });
  