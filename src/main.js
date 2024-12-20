const board = document.getElementById("board");
const newGameBtn = document.getElementById("new-game-btn");
const form = document.querySelector(".user-form");
const error = document.querySelector(".error");
const currentPlayer = document.getElementById("current-player");
const turnNumber = document.getElementById("turn-number");
const usernameInput = form.firstElementChild;
const boardStagger = 80;
const hideBoardDelay = 2100;
let errorMessage = null;
let choiceOne = null;
let choiceTwo = null;
let turns = 0;

const cardImages = [
  "planet-1",
  "planet-2",
  "planet-3",
  "planet-4",
  "planet-5",
  "planet-6",
  "planet-7",
  "rocket-1",
  "rocket-2",
  "rocket-3",
];

form.addEventListener("submit", e => {
  e.preventDefault();
  errorMessage = null;
  error.textContent = ""

  if (usernameInput.value.length < 2) {
   errorMessage = "Name must be at least 2 characters.";
   error.textContent = errorMessage;
  } else if (usernameInput.value.length > 12) {
    errorMessage = "Name can not be greater than 12 characters.";
    error.textContent = errorMessage;
  } else {
    currentPlayer.textContent = usernameInput.value;
    turnNumber.textContent = `Turn: ${turns}`;
    form.style.display = "none";
    newGameBtn.style.display = "block";
    renderBoard();
  }
});

newGameBtn.addEventListener("click", () => {
  board.removeEventListener("click", handleClick);
  board.innerHTML = "";
  choiceOne = null;
  choiceTwo = null;
  turns = 0;
  turnNumber.textContent = `Turn: ${turns}`;
  renderBoard();
})

function renderBoard() {
  const cards = getShuffledPairs(cardImages);

  for (let i = 0; i < cards.length; i++) {

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("flipped");
    card.setAttribute("name", cards[i]);
    card.setAttribute("data-matched", false);

    card.innerHTML = `
        <img class="card__front" src="${import.meta.env.BASE_URL}images/space/${cards[i]}.jpg" alt="card front">
        <img class="card__back" src="${import.meta.env.BASE_URL}images/cover.png" alt="card back">
    `;

    setTimeout(() => {
      board.appendChild(card);  
    }, boardStagger * i);

    setTimeout(() => {
      card.classList.remove("flipped")
    }, (boardStagger * i) + hideBoardDelay);

  }

  board.addEventListener("click", handleClick);
}

function handleClick(e) {
  if (e.target.classList.contains("card__back")) {
    handleChoice(e.target.parentElement);
  }
}

function handleChoice(card) {
  card.classList.add("flipped");

  choiceOne ? choiceTwo = card : choiceOne = card;

  if (choiceOne && choiceTwo) {
    if (choiceOne.getAttribute("name") === choiceTwo.getAttribute("name")) {
      console.log("those cards match!");
      choiceOne.setAttribute("data-matched", true);
      choiceTwo.setAttribute("data-matched", true);
      choiceOne = null;
      choiceTwo = null;

      checkIfPlayerWon()

    } else {
      console.log("those cards don't match");
      setTimeout(() => {
        choiceOne.classList.remove("flipped");
        choiceTwo.classList.remove("flipped");
        choiceOne = null;
        choiceTwo = null;
      }, 1000)
    }
    turns++;
    turnNumber.textContent = `Turn: ${turns}`;
  }
}

function checkIfPlayerWon() {
  const cards = document.querySelectorAll(".card");

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].getAttribute("data-matched") !== "true") {
      console.log("keep up the good work!");
      return;
    }
  }
  
  setTimeout(() => {
    alert(`Congrats ${usernameInput.value}! You matched all cards in ${turns} turns.`)
  }, 500);
}


// Helper functions:

function getShuffledPairs(arr) {
  const shuffledArr = shuffle(arr);
  const slicedArr = shuffledArr.slice(0, 8);
  const pairedArr = [...slicedArr, ...slicedArr];
  const shuffledPairs = shuffle(pairedArr);
  return shuffledPairs;
}

function shuffle(arr) {
  const shuffledArr = arr.sort(() => Math.random() - 0.5);
  return shuffledArr;
}
