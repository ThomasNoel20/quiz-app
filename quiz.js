const quizContainer = document.getElementById("quiz-container");
const resultDiv = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let quizData = [];  // Vide au départ, on va le remplir via fetch
let currentQuestionIndex = 0;
let totalQuestions = 0;
let userAnswers = [];

function loadQuestion() {
  if (quizData.length === 0) return;
  quizContainer.style.display = "block";
  const currentQuestion = quizData[currentQuestionIndex];

  // Barre de progression
  const progressPercent = (currentQuestionIndex / totalQuestions) * 100;
  progressBar.style.width = progressPercent + "%";

  // Construire les boutons réponses, en mettant en évidence la réponse sélectionnée si elle existe
  quizContainer.innerHTML = `
    <div class="counter">Question ${currentQuestionIndex + 1} / ${totalQuestions}</div>
    <div class="question">${currentQuestion.question}</div>
    <div class="answers">
      ${currentQuestion.answers.map((answer, idx) => `
        <button 
          class="${userAnswers[currentQuestionIndex] === idx ? 'selected' : ''}" 
          onclick="selectAnswer(${idx})"
        >
          ${answer}
        </button>
      `).join('')}
    </div>
  `;

  // Mise à jour des états des boutons navigation
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === totalQuestions - 1;

  // Cacher résultat en navigation normale
  resultDiv.textContent = "";
  restartBtn.style.display = "inline-block";
}

function selectAnswer(selectedIndex) {
  userAnswers[currentQuestionIndex] = selectedIndex;

  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResult();
  }
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (userAnswers[i] === quizData[i].correct) {
      score++;
    }
  }
  return score;
}

function showResult() {
  progressBar.style.width = "100%";
  quizContainer.innerHTML = "";
  quizContainer.style.display = "none"; // cacher le quiz

  const score = calculateScore();
  resultDiv.textContent = `Tu as obtenu ${score} / ${totalQuestions} bonnes réponses.`;

  prevBtn.disabled = true;
  nextBtn.disabled = true;

  // Lancement du feu d'artifice (si tu as la lib confetti.js chargée)
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  userAnswers = Array(totalQuestions).fill(null);
  resultDiv.textContent = "";
  loadQuestion();
});

// Charger les questions depuis questions.json avant de démarrer le quiz
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    quizData = data;
    totalQuestions = quizData.length;
    userAnswers = Array(totalQuestions).fill(null);
    loadQuestion();
  })
  .catch(error => {
    console.error("Erreur lors du chargement des questions :", error);
    quizContainer.textContent = "Impossible de charger le quiz.";
  });
