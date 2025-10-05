const quizData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
        correct: 0,
        explanation: "HTML (HyperText Markup Language) is the standard markup language for creating web pages."
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        correct: 2,
        explanation: "CSS (Cascading Style Sheets) is used to style and layout web pages."
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        options: ["<js>", "<javascript>", "<script>", "<scripting>"],
        correct: 2,
        explanation: "The <script> tag is used to embed JavaScript code in an HTML document."
    }
];

let currentQuiz = 0;
let score = 0;
let selected = new Array(quizData.length).fill(null);
let quizCompleted = false;

// Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const submitBtn = document.getElementById("submit");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progressBar");
const questionCounter = document.getElementById("questionCounter");
const explanationEl = document.getElementById("explanation");

function updateProgress() {
    const progress = ((currentQuiz + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${currentQuiz + 1} of ${quizData.length}`;
}

function loadQuiz() {
    if (quizCompleted) {
        showResults();
        return;
    }

    const current = quizData[currentQuiz];
    questionEl.textContent = current.question;
    optionsEl.innerHTML = "";
    resultEl.textContent = "";
    explanationEl.textContent = "";

    current.options.forEach((opt, index) => {
        const button = document.createElement("button");
        button.className = 'option-btn';
        button.textContent = opt;
        
        if (selected[currentQuiz] === index) {
            button.classList.add('selected');
        }
        
        button.onclick = () => selectOption(index, button);
        optionsEl.appendChild(button);
    });

    updateProgress();
    updateNavigationButtons();
}

function selectOption(index, button) {
    selected[currentQuiz] = index;
    Array.from(optionsEl.children).forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Add this function after showResults()
function updateQuizProgress(score, total) {
    const currentTotal = parseInt(localStorage.getItem("totalQuizzes")) || 0;
    const currentBest = parseInt(localStorage.getItem("bestScore")) || 0;
    const currentAttempts = parseInt(localStorage.getItem("quizzesAttempted")) || 0;
    const currentAvg = parseFloat(localStorage.getItem("averageScore")) || 0;

    // Update quiz attempts
    localStorage.setItem("quizzesAttempted", currentAttempts + 1);
    
    // Update best score if current score is better
    if (score > currentBest) {
        localStorage.setItem("bestScore", score);
    }

    // Update average score
    const newAverage = ((currentAvg * currentAttempts) + (score/total * 100)) / (currentAttempts + 1);
    localStorage.setItem("averageScore", newAverage.toFixed(1));
    
    // Update total quizzes if this is a new quiz
    localStorage.setItem("totalQuizzes", Math.max(currentTotal, total));
}

// Modify the showResults() function to include this update
function showResults() {
    score = selected.filter((ans, i) => ans === quizData[i].correct).length;
    const percentage = (score / quizData.length) * 100;
    
    // Update progress
    updateQuizProgress(score, quizData.length);
    
    // Save to localStorage
    localStorage.setItem("lastQuizScore", score);
    localStorage.setItem("totalQuizzes", (parseInt(localStorage.getItem("totalQuizzes") || 0) + 1));
    
    const container = document.querySelector('.quiz-container');
    container.innerHTML = `
        <div class="results-container">
            <h2>Quiz Completed! 🎉</h2>
            <div class="score-circle">
                <span class="score-text">${percentage}%</span>
            </div>
            <p>You got ${score} out of ${quizData.length} questions correct</p>
            <div class="review-section">
                ${quizData.map((q, i) => `
                    <div class="review-item ${selected[i] === q.correct ? 'correct' : 'incorrect'}">
                        <p class="question">${q.question}</p>
                        <p class="answer">Your answer: ${q.options[selected[i]]}</p>
                        <p class="correct-answer">Correct answer: ${q.options[q.correct]}</p>
                        <p class="explanation">${q.explanation}</p>
                    </div>
                `).join('')}
            </div>
            <button onclick="restartQuiz()" class="restart-btn">Retry Quiz</button>
            <button onclick="location.href='index.html'" class="home-btn">Back to Home</button>
        </div>
    `;
}

function restartQuiz() {
    currentQuiz = 0;
    score = 0;
    selected = new Array(quizData.length).fill(null);
    quizCompleted = false;
    location.reload();
}

submitBtn.addEventListener("click", () => {
    if (selected[currentQuiz] === null) {
        resultEl.textContent = "Please select an option!";
        resultEl.className = "error-message";
        return;
    }

    const isCorrect = selected[currentQuiz] === quizData[currentQuiz].correct;
    resultEl.textContent = isCorrect ? "✅ Correct!" : "❌ Incorrect";
    resultEl.className = isCorrect ? "success-message" : "error-message";
    explanationEl.textContent = quizData[currentQuiz].explanation;
});

nextBtn.addEventListener("click", () => {
    if (currentQuiz < quizData.length - 1) {
        currentQuiz++;
        loadQuiz();
    } else if (!quizCompleted) {
        quizCompleted = true;
        showResults();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentQuiz > 0) {
        currentQuiz--;
        loadQuiz();
    }
});

function updateNavigationButtons() {
    prevBtn.disabled = currentQuiz === 0;
    nextBtn.textContent = currentQuiz === quizData.length - 1 ? "Finish Quiz" : "Next";
}

loadQuiz();


// Add near the top with other element selections
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

// Add after other event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if theme exists in localStorage, if not set light as default
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
        document.body.classList.add('light');
    } else {
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme');
        document.body.classList.add(savedTheme);
    }

    // Toggle theme on button click
    toggleThemeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    });
});
