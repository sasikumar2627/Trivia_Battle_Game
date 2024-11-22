let player1 = '';
let player2 = '';
let currentPlayer = '';
let categories = [];
let usedCategories = [];
let selectedCategory = '';
let questions = [];
let questionIndex = 0;
let scores = { player1: 0, player2: 0 };

function startGame() {
  player1 = document.getElementById('player1').value;
  player2 = document.getElementById('player2').value;

  if (player1 && player2) {
    document.getElementById('game-setup').classList.add('hidden');
    document.getElementById('category-selection').classList.remove('hidden');
    fetchCategories();
  } else {
    alert("Please enter names for both players.");
  }
}

function fetchCategories() {
  fetch('https://the-trivia-api.com/api/categories')
    .then(response => response.json())
    .then(data => {
      categories = Object.keys(data);
      populateCategoryOptions();
    })
    .catch(error => console.error('Error fetching categories:', error));
}

function populateCategoryOptions() {
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = categories
    .filter(cat => !usedCategories.includes(cat))
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
}

function selectCategory() {
  selectedCategory = document.getElementById('category').value;
  usedCategories.push(selectedCategory);
  fetchQuestions(selectedCategory);
  document.getElementById('category-selection').classList.add('hidden');
  document.getElementById('question-area').classList.remove('hidden');
}

function fetchQuestions(category) {
  fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=6`)
    .then(response => response.json())
    .then(data => {
      questions = data;
      questionIndex = 0;
      currentPlayer = player1;
      showQuestion();
    })
    .catch(error => console.error('Error fetching questions:', error));
}

function showQuestion() {
  const question = questions[questionIndex];
  document.getElementById('question-text').innerText = `${currentPlayer}, ${question.question}`;
  
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  const options = [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5);
  
  options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.onclick = () => checkAnswer(option, question.correctAnswer);
    optionsDiv.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  const points = questionIndex < 2 ? 10 : questionIndex < 4 ? 15 : 20;
  
  if (selected === correct) {
    scores[currentPlayer === player1 ? 'player1' : 'player2'] += points;
  }
  
  questionIndex++;
  currentPlayer = currentPlayer === player1 ? player2 : player1;
  
  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    endRound();
  }
}

function endRound() {
  document.getElementById('question-area').classList.add('hidden');
  if (usedCategories.length < categories.length) {
    document.getElementById('category-selection').classList.remove('hidden');
  } else {
    showGameOver();
  }
}

function showGameOver() {
  document.getElementById('game-over').classList.remove('hidden');

  const winner = scores.player1 > scores.player2 ? player1 : scores.player2 > scores.player1 ? player2 : "It's a Tie";
  document.getElementById('result').innerText = `Final Scores - ${player1}: ${scores.player1}, ${player2}: ${scores.player2}. Winner: ${winner}`;
}

function resetGame() {
  scores = { player1: 0, player2: 0 };
  usedCategories = [];
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('game-setup').classList.remove('hidden');
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
}
