document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const startBtn = document.getElementById('start-quiz-btn');
    const quizIntroElement = document.getElementById('quiz-intro');
    const questionContainerElement = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const timeDisplay = document.getElementById('time');
    const resultContainer = document.getElementById('result-container');
    const finalScore = document.getElementById('score');
    const submitScoreForm = document.getElementById('submit-score-form');
    const initialsInput = document.getElementById('initials');
    const highScoresList = document.getElementById('high-scores-list');
    const highScoresContainer = document.getElementById('high-scores-container');
    const goBackBtn = document.getElementById('go-back-btn');
    const clearHighScoresBtn = document.getElementById('clear-high-scores-btn');
    const viewHighScoresBtn = document.getElementById('view-high-scores');

    // Variables
    let currentQuestionIndex, timer, timeLeft;

    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    answerButtonsElement.addEventListener('click', handleAnswerButtonClick);
    submitScoreForm.addEventListener('submit', saveHighScore);

    // Starting the quiz
    function startQuiz() {
        quizIntroElement.classList.add('hidden');
        questionContainerElement.classList.remove('hidden');
        currentQuestionIndex = 0;
        timeLeft = 75;
        timeDisplay.textContent = timeLeft;
        timer = setInterval(updateTimer, 1000);
        setNextQuestion();
    }

    // Timer update
    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz(); 
        } else {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
        }
    }

    // Showing the next question
    function setNextQuestion() {
        resetState();
        showQuestion(questions[currentQuestionIndex]);
    }

    // Showing the current question
    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.dataset.correct = answer.correct;
            answerButtonsElement.appendChild(button);
        });
    }

    // Resetting the state for the next question
    function resetState() {
        clearStatusClasses();
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    // Handling answer button click
    function handleAnswerButtonClick(e) {
        if (e.target.matches('.btn')) {
            const selectedButton = e.target;
            const correct = selectedButton.dataset.correct === 'true';
            setStatusClass(selectedButton, correct);
            Array.from(answerButtonsElement.children).forEach(button => {
                button.disabled = true; // Disable all buttons
            });
            showFeedback(correct);
        }
    }

     // Setting status classes
    function setStatusClass(element, correct) {
        clearStatusClasses();
        element.classList.add(correct ? 'correct' : 'wrong');
    }

    function clearStatusClasses() {
        answerButtonsElement.querySelectorAll('.btn').forEach(button => {
            button.classList.remove('correct', 'wrong');
        });
    }

    // Clearing status classes
    function showFeedback(correct) {
        const feedbackElement = document.getElementById('feedback') || createFeedbackElement();
        feedbackElement.textContent = correct ? 'Correct!' : 'Incorrect!';
        feedbackElement.style.display = 'block'; // Show feedback
        setTimeout(() => {
            feedbackElement.style.display = 'none'; // Hide feedback
            if (questions.length > currentQuestionIndex + 1) {
                currentQuestionIndex++;
                setNextQuestion();
            } else {
                endQuiz();
            }
        }, 1000);
    }

    // Showing feedback for the answer
    function createFeedbackElement() {
        const feedbackElement = document.createElement('div');
        feedbackElement.id = 'feedback';
        document.body.appendChild(feedbackElement);
        return feedbackElement;
    }

    // Ending the quiz
    function endQuiz() {
        clearInterval(timer); // Stop the timer
        questionContainerElement.classList.add('hidden'); // Hide the questions
        quizIntroElement.classList.add('hidden'); // Also ensure the quiz intro is hidden
        resultContainer.classList.remove('hidden'); // Show the result container
        finalScore.textContent = timeLeft; // Set the final score text
    }
    

    submitScoreForm.addEventListener('submit', saveHighScore);

    // Saving high score
    function saveHighScore(event) {
        event.preventDefault();
        const score = {
            initials: initialsInput.value.trim().toUpperCase(),
            score: timeLeft
        };
        
        if (score.initials.length !== 2) {
            alert('Please enter your initials (2 characters).');
            return;
        }

        // Save the high score
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores));

        // Show high scores
        showHighScores();
    }

    // Showing high scores
    function showHighScores() {
        // Clear out the existing list of high scores
        highScoresList.innerHTML = '';
    
        // Retrieve high scores from local storage
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
        // Create and append a list item for each high score
        highScores.forEach(score => {
            const scoreElement = document.createElement('li');
            scoreElement.textContent = `${score.initials} - ${score.score}`;
            highScoresList.appendChild(scoreElement);
        });
    
        // Hide other quiz elements
        quizIntroElement.classList.add('hidden');
        questionContainerElement.classList.add('hidden');
        resultContainer.classList.add('hidden');
    
        // Show the high scores container
        highScoresContainer.classList.remove('hidden');
    }

    // Event listener for the 'View high scores' button
    viewHighScoresBtn.addEventListener('click', () => {
        quizIntroElement.classList.add('hidden');
        questionContainerElement.classList.add('hidden');
        resultContainer.classList.add('hidden');
        showHighScores();
    });

document.getElementById('go-back-btn').addEventListener('click', () => {
    document.getElementById('high-scores-container').classList.add('hidden');
    quizIntroElement.classList.remove('hidden');
    });
    
document.getElementById('clear-high-scores-btn').addEventListener('click', () => {
localStorage.removeItem('highScores');
    showHighScores(); 
    });

    const questions = [
        {
            question: "Commonly used data types DO NOT include:",
            answers: [
                { text: "strings", correct: false },
                { text: "booleans", correct: false },
                { text: "alerts", correct: true },
                { text: "numbers", correct: false }
            ]
        },
        {
            question: "Which of these values is NOT considered false in a boolean context?",
            answers: [
                { text: "0", correct: false },
                { text: "'0'", correct: true },
                { text: "'' (an empty string)", correct: false },
                { text: "null", correct: false }
            ]
        },
        {
            question: "What does 'DOM' stand for?",
            answers: [
                { text: "Document Object Model", correct: true },
                { text: "Display Object Management", correct: false },
                { text: "Digital Ordinance Model", correct: false },
                { text: "Desktop Oriented Mode", correct: false }
            ]
        },
        {
            question: "How do you create a function in JavaScript?",
            answers: [
                { text: "function = myFunction()", correct: false },
                { text: "function:myFunction()", correct: false },
                { text: "function myFunction()", correct: true },
                { text: "create myFunction()", correct: false }
            ]
        },
        {
            question: "Which event occurs when the user clicks on an HTML element?",
            answers: [
                { text: "onchange", correct: false },
                { text: "onmouseover", correct: false },
                { text: "onclick", correct: true },
                { text: "onmouseclick", correct: false }
            ]
        }
    ]
    });