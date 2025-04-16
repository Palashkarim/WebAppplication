const questions = [
    {
      question: "What is the capital of France?",
      answers: ["Berlin", "Madrid", "Paris", "Rome"],
      correct: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: "Mars"
    },
    {
      question: "What is 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct: "4"
    },
    {
      question: "What is the largest ocean on Earth?",
      answers: ["Atlantic", "Indian", "Pacific", "Arctic"],
      correct: "Pacific"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      answers: ["Charles Dickens", "William Shakespeare", "Leo Tolstoy", "Jane Austen"],
      correct: "William Shakespeare"
    }
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  
  const questionEl = document.getElementById("question");
  const answerButtons = document.getElementById("answer-buttons");
  const nextBtn = document.getElementById("nextBtn");
  const scoreEl = document.getElementById("score");
  const restartBtn = document.getElementById("restartBtn");
  const lastScoreDiv = document.getElementById("lastScore");
  
  // Display last score from localStorage
  const last = localStorage.getItem("quizApp_lastScore");
  if (last !== null) {
    lastScoreDiv.textContent = `Your last score was: ${last}`;
  }
  
  function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
  
    currentQuestion.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", selectAnswer);
      answerButtons.appendChild(button);
  
      setTimeout(() => {
        button.classList.add("show");
      }, 100 * index);
    });
  }
  
  function resetState() {
    nextBtn.style.display = "none";
    answerButtons.innerHTML = "";
  }
  
  function selectAnswer(e) {
    const selectedAnswer = e.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].correct;
  
    if (selectedAnswer === correctAnswer) {
      score++;
      e.target.style.backgroundColor = "lightgreen";
    } else {
      e.target.style.backgroundColor = "lightcoral";
    }
  
    Array.from(answerButtons.children).forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === correctAnswer && selectedAnswer !== correctAnswer) {
        btn.style.backgroundColor = "lightgreen";
      }
    });
  
    setTimeout(() => {
      nextBtn.style.display = "inline";
    }, 800);
  }
  
  function showScore() {
    document.getElementById("quiz").style.display = "none";
    scoreEl.style.display = "block";
    scoreEl.textContent = `You scored ${score} out of ${questions.length}!`;
    localStorage.setItem("quizApp_lastScore", score);
    restartBtn.style.display = "inline";
  }
  
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  });
  
  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.style.display = "none";
    restartBtn.style.display = "none";
    document.getElementById("quiz").style.display = "block";
    showQuestion();
  });
  
  // Start the quiz
  showQuestion();
  