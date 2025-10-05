// ===== Flashcards Data =====
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [
    { 
        question: "What is a pointer in C?", 
        answer: "A variable that stores the memory address of another variable.",
        lastReviewed: null,
        confidence: 0 // 0-3: Not sure, Learning, Good, Mastered
    },
    { 
        question: "Define OOP.", 
        answer: "Object-Oriented Programming: programming using objects and classes.",
        lastReviewed: null,
        confidence: 0
    },
    { 
        question: "What does HTML stand for?", 
        answer: "HyperText Markup Language",
        lastReviewed: null,
        confidence: 0
    }
];

let currentIndex = 0;
let studyMode = 'all'; // all, needReview, mastered

// ===== Elements =====
const flashcard = document.getElementById('flashcard');
const front = flashcard.querySelector('.front');
const back = flashcard.querySelector('.back');

const flipBtn = document.getElementById('flipBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const addCardBtn = document.getElementById('addCardBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

// ===== Display Flashcard =====
function showFlashcard(index) {
    if (flashcards.length === 0) {
        front.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📝</span>
                <p>No flashcards yet!</p>
                <p class="empty-subtitle">Click 'Add Flashcard' to get started</p>
            </div>`;
        back.textContent = "";
        flashcard.classList.remove('flipped');
        return;
    }

    const card = flashcards[index];
    front.innerHTML = `
        <div class="card-content">
            <div class="confidence-indicator confidence-${card.confidence}"></div>
            <div class="question-text">${card.question}</div>
            <div class="card-footer">
                ${card.lastReviewed ? `Last reviewed: ${new Date(card.lastReviewed).toLocaleDateString()}` : 'Not reviewed yet'}
            </div>
        </div>`;
    
    back.innerHTML = `
        <div class="card-content">
            <div class="answer-text">${card.answer}</div>
            <div class="confidence-buttons">
                <button onclick="updateConfidence(0)">Not Sure</button>
                <button onclick="updateConfidence(1)">Learning</button>
                <button onclick="updateConfidence(2)">Good</button>
                <button onclick="updateConfidence(3)">Mastered</button>
            </div>
        </div>`;
    
    flashcard.classList.remove('flipped');
    updateProgress();
}

// ===== Confidence Management =====
function updateFlashcardProgress() {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.confidence === 3).length;
    
    localStorage.setItem("totalFlashcards", total);
    localStorage.setItem("masteredFlashcards", mastered);
    localStorage.setItem("lastFlashcardStudy", new Date().toISOString());
}

// Add this call after confidence updates
function updateConfidence(level) {
    if (flashcards.length === 0) return;
    flashcards[currentIndex].confidence = level;
    flashcards[currentIndex].lastReviewed = new Date().toISOString();
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    updateFlashcardProgress(); // Add this line
    showFlashcard(currentIndex);
}

function updateProgress() {
    const total = flashcards.length;
    const mastered = flashcards.filter(card => card.confidence === 3).length;
    const learning = flashcards.filter(card => card.confidence > 0 && card.confidence < 3).length;
    
    // Update progress bar if it exists in your HTML
    const progressElement = document.getElementById('studyProgress');
    if (progressElement) {
        progressElement.innerHTML = `
            <div class="progress-stats">
                <span>Mastered: ${mastered}/${total}</span>
                <span>Learning: ${learning}/${total}</span>
            </div>`;
    }
}

// ===== Enhanced Card Management =====
function addNewCard() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Flashcard</h3>
            <textarea placeholder="Enter question..." id="newQuestion"></textarea>
            <textarea placeholder="Enter answer..." id="newAnswer"></textarea>
            <div class="modal-buttons">
                <button onclick="saveNewCard()">Save</button>
                <button onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function saveNewCard() {
    const questionEl = document.getElementById('newQuestion');
    const answerEl = document.getElementById('newAnswer');
    
    if (questionEl.value && answerEl.value) {
        flashcards.push({
            question: questionEl.value,
            answer: answerEl.value,
            lastReviewed: null,
            confidence: 0
        });
        currentIndex = flashcards.length - 1;
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        showFlashcard(currentIndex);
        closeModal();
    }
}

// ===== Event Listeners =====
flipBtn.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
    if (flashcard.classList.contains('flipped')) {
        flashcards[currentIndex].lastReviewed = new Date().toISOString();
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
});

nextBtn.addEventListener('click', () => {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex + 1) % flashcards.length;
    showFlashcard(currentIndex);
});

prevBtn.addEventListener('click', () => {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showFlashcard(currentIndex);
});

// ===== Edit Flashcard =====
editBtn.addEventListener('click', ()=>{
  if(flashcards.length===0) return;
  const newQ = prompt("Edit Question:", flashcards[currentIndex].question);
  const newA = prompt("Edit Answer:", flashcards[currentIndex].answer);
  if(newQ && newA){
    flashcards[currentIndex].question = newQ;
    flashcards[currentIndex].answer = newA;
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    showFlashcard(currentIndex);
  }
});

// ===== Delete Flashcard =====
deleteBtn.addEventListener('click', ()=>{
  if(flashcards.length===0) return;
  flashcards.splice(currentIndex,1);
  if(currentIndex >= flashcards.length) currentIndex = flashcards.length - 1;
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
  showFlashcard(currentIndex);
});

// ===== Add Flashcard =====
addCardBtn.addEventListener('click', ()=>{
  const newQ = prompt("New Question:");
  const newA = prompt("New Answer:");
  if(newQ && newA){
    flashcards.push({question:newQ, answer:newA});
    currentIndex = flashcards.length-1;
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    showFlashcard(currentIndex);
  }
});

// ===== Light/Dark Mode =====
let currentTheme = localStorage.getItem('theme');
if(!currentTheme){ currentTheme='light'; localStorage.setItem('theme','light'); }
document.body.classList.add(currentTheme);

toggleThemeBtn.addEventListener('click', ()=>{
  if(document.body.classList.contains('light')){
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme','dark');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('theme','light');
  }
});

showFlashcard(currentIndex);
updateProgress();


function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function editCard() {
    if (flashcards.length === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Edit Flashcard</h3>
            <textarea id="editQuestion" placeholder="Question">${flashcards[currentIndex].question}</textarea>
            <textarea id="editAnswer" placeholder="Answer">${flashcards[currentIndex].answer}</textarea>
            <div class="modal-buttons">
                <button onclick="saveEdit()">Save</button>
                <button onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function saveEdit() {
    const questionEl = document.getElementById('editQuestion');
    const answerEl = document.getElementById('editAnswer');
    
    if (questionEl.value && answerEl.value) {
        flashcards[currentIndex].question = questionEl.value;
        flashcards[currentIndex].answer = answerEl.value;
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        showFlashcard(currentIndex);
        closeModal();
    }
}

function deleteCard() {
    if (flashcards.length === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Delete Flashcard</h3>
            <p>Are you sure you want to delete this flashcard?</p>
            <div class="modal-buttons">
                <button onclick="confirmDelete()" class="danger">Delete</button>
                <button onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

function confirmDelete() {
    flashcards.splice(currentIndex, 1);
    if (currentIndex >= flashcards.length) currentIndex = flashcards.length - 1;
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    showFlashcard(currentIndex);
    closeModal();
}

editBtn.addEventListener('click', editCard);
deleteBtn.addEventListener('click', deleteCard);
addCardBtn.addEventListener('click', addNewCard);


