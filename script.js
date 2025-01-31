const fetchQuizData = async () => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return [];
  }
};

const App = () => {
  const appElement = document.getElementById('app');
  let quizData = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timeLeft = 60;
  let timerInterval;
  let showSummary = false;
  let answerSelected = false;

  fetchQuizData().then((data) => {
    quizData = data;
    startTimer();
    render();
  });

  const startTimer = () => {
    timerInterval = setInterval(() => {
      if (timeLeft <= 1) {
        clearInterval(timerInterval);
        showSummary = true;
        render();
      } else {
        timeLeft--;
        render();
      }
    }, 1000);
  };

  const handleAnswerClick = (selectedAnswer, correctAnswer) => {
    if (answerSelected) return;

    answerSelected = true;
    const isCorrect = selectedAnswer === correctAnswer;
    if (isCorrect) {
      score++;
    }

    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        answerSelected = false;
      } else {
        showSummary = true;
      }
      render();
    }, 1000);
  };

  const render = () => {
    appElement.innerHTML = '';

    if (showSummary) {
      appElement.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} / ${quizData.length}</p>
        <p>Time Left: ${timeLeft} seconds</p>
      `;
    } else if (quizData.length > 0) {
      const currentQuestion = quizData[currentQuestionIndex];
      const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
      const feedbackMessage = answerSelected
        ? (answers.includes(currentQuestion.correct_answer)
          ? 'Correct!'
          : `Wrong! The correct answer is: ${currentQuestion.correct_answer}`)
        : '';

      const answerButtons = answers.map((answer) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.addEventListener('click', () =>
          handleAnswerClick(answer, currentQuestion.correct_answer)
        );
        return button;
      });

      appElement.innerHTML = `
        <h1>Quiz Application</h1>
        <h2>${currentQuestion.question}</h2>
        <div>
          ${answerButtons.map((button) => button.outerHTML).join('')}
        </div>
        <p class="timer">Time Left: ${timeLeft} seconds</p>
        <p class="feedback">${feedbackMessage}</p>
      `;
    }
  };

  render();
};

App();
