const board = document.getElementById('board');
const tiles = [];
const cardImages = ['ffcard.webp'];

// Define the players
const player1 = {
  name: '',
  fp: 50,
  cardLabel: ''
};

const player2 = {
  name: 'Bot',
  fp: 50,
  cardLabel: ''
};
// Track current turn
let currentPlayer;

// Function to create the game board
function createBoard() {
  for (let i = 0; i < 25; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const card = document.createElement('div');
    card.className = 'card';
    const front = document.createElement('div');
    front.className = 'front';
    const back = document.createElement('div');
    back.className = 'back';
    const label = document.createElement('label');
    const randomHP = getRandomFP();
    label.innerText = randomHP;
    back.appendChild(label);
    card.appendChild(front);
    card.appendChild(back);
    tile.appendChild(card);
    tiles.push(tile);
    board.appendChild(tile);

    // Add click event listener to each card
    card.addEventListener('click', handleCardClick);
  }
}

// Function to handle player movement
function movePlayer(playerIndex) {
  tiles[playerIndex].classList.add('player');

  // Handle player movement logic here
}

// Function to generate a random favor point label (+FP or -FP) with a value between 10 and 30
function getRandomFP() {
  // Generate a random value between 10 and 30 (inclusive)
  const fpValue = Math.floor(Math.random() * 21) + 10;

  // Generate a random label: '+FP' or '-FP'
  const fpLabel = Math.random() < 0.5 ? '+FP' : '-FP';

  // Combine the label and value into a string
  const fp = fpLabel + fpValue;

  // Return the generated string
  return fp;
}

// Function to handle card click event
function handleCardClick() {
  if (this.classList.contains('flipped')) {
    // Card is already flipped, do nothing
    return;
  }

  // Flip the card
  this.classList.add('flipped');

  // Determine the current player's turn
  const currentPlayer = getCurrentPlayer();

  // Get the value and label of the flipped card
  const cardLabel = this.querySelector('.back label').innerText;
  const cardValue = parseInt(cardLabel.substring(3)); // Extract the value part

  // Update FP based on the card label and value
  if (cardLabel.startsWith('+FP')) {
    currentPlayer.fp += cardValue;
  } else if (cardLabel.startsWith('-FP')) {
    const opponent = currentPlayer === player1 ? player2 : player1;
    opponent.fp -= cardValue;
  }

  // Set the card label for the current player
  currentPlayer.cardLabel = cardLabel;

  // Update the FP display table
  updateFPDisplayTable();

  // Log the current player's turn result
  console.log(`${currentPlayer.name} flipped a card with label: ${cardLabel} and value: ${cardValue}`);
  console.log(`${currentPlayer.name} has ${currentPlayer.fp} FP.`);

  // Check if all cards are flipped
  const allCardsFlipped = document.querySelectorAll('.card.flipped');
  if (allCardsFlipped.length === tiles.length) {
    determineWinner();
  } else {
    // Switch to the next player's turn
    switchPlayerTurn();

    // Perform the next player's turn automatically if it is player2
    if (currentPlayer === player2) {
      // Prompt player1 to click a card for their turn
      console.log(`${player1.name}, click a card for your turn.`);
    } else {
      // Prompt player2 to click a card for their turn
      console.log(`${player2.name}, click a card for your turn.`);
      setTimeout(player2Turn, 1000); // Delay for 1 second before player2's turn
    }
  }
}


// Function to get the current player
function getCurrentPlayer() {
  return currentPlayer === player1 ? player1 : player2;
}

// Function to switch player turn
function switchPlayerTurn() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

// Function to randomly select the first player
function selectFirstPlayer() {
  const player1Name = prompt('Enter the name of Player 1:');


  player1.name = player1Name;


  const isFirstPlayerPlayer1 = Math.random() < 0.5;

  if (isFirstPlayerPlayer1) {
    currentPlayer = player1;
    alert(`${player1.name} goes first!`);
    // Start the game with player1's turn
    movePlayer(0); // Move player to the starting position (tile index 0)
    console.log(`${player1.name}, click a card for your turn.`);
  } else {
    currentPlayer = player2;
    player2.name = 'Bot'; // Fix player2's name to "Bot"
    alert(`${player2.name} goes first!`);
    // Perform player2's turn automatically
    setTimeout(player2Turn, 2000); // Delay for 1 second before player2's turn
  }
}

// Function to simulate player2's turn
function player2Turn() {
  // Automatically select a card for player2's turn
  const unflippedCards = document.querySelectorAll('.card:not(.flipped)');
  const randomIndex = Math.floor(Math.random() * unflippedCards.length);
  const gameCard = unflippedCards[randomIndex];
  gameCard.classList.add('flipped');

  // Get the value and label of the flipped card
  const cardLabel = gameCard.querySelector('.back label').innerText;
  const cardValue = parseInt(cardLabel.substring(3)); // Extract the value part

  // Update player2's FP based on the card label and value
  if (cardLabel.startsWith('+FP')) {
    player2.fp += cardValue;
  } else if (cardLabel.startsWith('-FP')) {
    player1.fp -= cardValue;
  }

  // Log player2's turn result
  console.log(`${player2.name} drew a card with label: ${cardLabel} and value: ${cardValue}`);
  console.log(`${player2.name} has ${player2.fp} FP.`);

  // Update the FP display table
  updateFPDisplayTable();

  // Switch to player1's turn
  currentPlayer = player1;

  // Check if all cards are flipped after player2's turn
  const allCardsFlipped = document.querySelectorAll('.card.flipped');
  if (allCardsFlipped.length === tiles.length) {
    determineWinner();
  }
}

// Function to update the FP display table with the current FP values
function updateFPDisplayTable() {
  const player1NameElement = document.getElementById('player1Name');
  const player1FPElement = document.getElementById('player1FP');
  const player1CardLabelElement = document.getElementById('player1CardLabel');
  const player2NameElement = document.getElementById('player2Name');
  const player2FPElement = document.getElementById('player2FP');
  const player2CardLabelElement = document.getElementById('player2CardLabel');

  player1NameElement.textContent = player1.name;
  player1FPElement.textContent = player1.fp;
  player1CardLabelElement.textContent = player1.cardLabel || '';
  player2NameElement.textContent = player2.name;
  player2FPElement.textContent = player2.fp;
  player2CardLabelElement.textContent = player2.cardLabel || '';

  // Fade out player1's card label after 3 seconds
  const player1CardLabel = player1CardLabelElement.textContent;
  if (player1CardLabel) {
    player1CardLabelElement.style.opacity = 1;
    setTimeout(() => {
      player1CardLabelElement.style.opacity = 0;
    }, 3000);
  }

  // Fade out player2's card label after 3 seconds
  const player2CardLabel = player2CardLabelElement.textContent;
  if (player2CardLabel) {
    player2CardLabelElement.style.opacity = 1;
    setTimeout(() => {
      player2CardLabelElement.style.opacity = 0;
    }, 3000);
  }
}

// Function to start the game
function startGame() {
  createBoard();
  selectFirstPlayer();
  updateFPDisplayTable();
}

// Function to determine the winner based on the highest FP
function determineWinner() {
  let winner;
  if (player1.fp > player2.fp) {
    winner = player1;
  } else if (player1.fp < player2.fp) {
    winner = player2;
  } else {
    // Tie game
    document.getElementById('winner').textContent = "It's a tie!";
    return;
  }

  document.getElementById('winner').textContent = `The winner is ${winner.name} with ${winner.fp} FP!`;
}

// Start the game when the page loads
window.onload = startGame;
