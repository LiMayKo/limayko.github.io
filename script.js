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

function createBoard() {
  const newLabels = [
    'Double-edged sword',
    'Double-edged favor',
    'Silver lining with a cloud',
    'Mixed Curse',
    'Divine favor',
    'Golden plate',
    'Reversed Reciprocity',
    'Stroke of luck',
    'Sucking Favor',
    'Rescinded',
    'Execute',
    'Mirror and Negate',
    'Counted Favor',
    'Silver plate',
    'Ruler',
    '****',
    'Heal +10 damage -50',
    'Heal +10 damage -50',
    'Reverse/switch health',
    'Heal +10',
    'Heal +10',
    'Heal +10',
    'Damage -10',
    'Damage -10',
    'Damage -10'
  ];

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
    const randomLabelIndex = Math.floor(Math.random() * newLabels.length);
    const randomLabel = newLabels[randomLabelIndex];
    label.innerText = randomLabel;
    newLabels.splice(randomLabelIndex, 1); // Remove the used label from the array
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
  const player1Name = prompt('Enter the name of yours human:');


  player1.name = player1Name;


  const isFirstPlayerPlayer1 = Math.random() < 0.5;

  if (isFirstPlayerPlayer1) {
    currentPlayer = player1;
    alert(`${player1.name} goes first!`);
    // Start the game with player1's turn
    console.log(`${player1.name}, click a card for your turn.`);
  } else {
    currentPlayer = player2;
    player2.name = 'Bot'; // Fix player2's name to "Bot"
    alert(`${player2.name} goes first!`);
    // Perform player2's turn automatically
    setTimeout(player2Turn, 2000); // Delay for 1 second before player2's turn
  }
}


function showModal(title, options, callback) {
  // Disable the board
  const board = document.getElementById('board');
  board.classList.add('disabled');

  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Create title element
  const titleElement = document.createElement('h2');
  titleElement.innerText = title;
  modalContent.appendChild(titleElement);

  // Create card options
  options.forEach(option => {
    const card = document.createElement('div');
    card.classList.add('modal-card');
    card.innerText = option;

    // Attach click event listener to the card
    card.addEventListener('click', () => {
      // Remove modal from DOM
      modalContainer.remove();

      // Re-enable the board
      board.classList.remove('disabled');

      // Call the callback function with the selected option
      callback(option);
    });

    modalContent.appendChild(card);
  });

  // Append modal content to modal container
  modalContainer.appendChild(modalContent);

  // Append modal container to the body
  document.body.appendChild(modalContainer);

  // Focus on the first card option
  const firstCard = modalContent.querySelector('.modal-card');
  if (firstCard) {
    firstCard.focus();
  }
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
 console.log('Card Label:', cardLabel);
  if (currentPlayer.fp <= 0) {
    // Opponent wins instantly
    determineWinner();
    return;
  }
  if (cardLabel.startsWith('Execute')) {
    currentPlayer.cardLabel = cardLabel;
    player2.fp = 0;
  console.log(`${player1.name} drew a card with label: ${cardLabel} and value: Execute`);
  console.log(`${player1.name} has ${player1.fp} FP.`);

  updateFPDisplayTable();

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
 else if (cardLabel.startsWith('Reverse/switch health')) {
    currentPlayer.cardLabel = cardLabel;
    const tempFP = player1.fp;
    player1.fp = player2.fp;
    player2.fp = tempFP;
    
  console.log(`${player1.name} drew a card with label: ${cardLabel} and value: Reverse/switch health`);
  console.log(`${player1.name} has ${player1.fp} FP.`);

  updateFPDisplayTable();

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
    
  } else if (cardLabel.startsWith('Double-edged sword')) {
    currentPlayer.cardLabel = cardLabel;

  // Show modal with "Life" and "Death" options
  showModal('Double-edged sword', ['Life', 'Death'], option => {
    // Handle the selected option
    if (option === 'Life') {
      currentPlayer.fp += 101;
      console.log(`${currentPlayer.name} drew a card with label: ${currentPlayer.cardLabel} and selected: ${option}`);
      console.log(`${currentPlayer.name} gained 101 FP. Total FP: ${currentPlayer.fp}`);
    } else if (option === 'Death') {
      currentPlayer.fp -= 101;
      console.log(`${currentPlayer.name} drew a card with label: ${currentPlayer.cardLabel} and selected: ${option}`);
      console.log(`${currentPlayer.name} lost 101 FP. Total FP: ${currentPlayer.fp}`);
    }
    

    updateFPDisplayTable();

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
  });
  } else {
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

}






















// Function to simulate player2's turn
function player2Turn() {
  // Automatically select a card for player2's turn
  const unflippedCards = document.querySelectorAll('.card:not(.flipped)');
  const randomIndex = Math.floor(Math.random() * unflippedCards.length);
  const gameCard = unflippedCards[randomIndex];
  gameCard.classList.add('flipped');

  // Get the value and label of the flipped card
  const labelElement = gameCard.querySelector('.back label');
  if (labelElement === null) {
    console.log('Error: Label element is null');
    return;
  }
  const cardLabel = labelElement.innerText;
  const cardValue = parseInt(cardLabel.substring(3)); // Extract the value part

  // Update player2's FP based on the card label and value
  if (cardLabel.startsWith('Execute')) {
    currentPlayer.cardLabel = cardLabel;
    player1.fp = 0;
    console.log(`${player1.name} drew a card with label: ${cardLabel} and value: Execute`);
    console.log(`${player1.name} has ${player2.fp} FP.`);
  } else if (cardLabel.startsWith('Reverse/switch health')) {
    currentPlayer.cardLabel = cardLabel;
    const tempFP = player2.fp;
    player2.fp = player1.fp;
    player1.fp = tempFP;

    console.log(`${player1.name} drew a card with label: ${cardLabel} and value: Reverse/switch health`);
    console.log(`${player1.name} has ${player2.fp} FP.`);
  }
  if (currentPlayer.fp <= 0) {
    // Opponent wins instantly
    determineWinner();
    return;
  }
  // Set the card label for the current player
  currentPlayer.cardLabel = cardLabel;

  // Update the FP display table
  updateFPDisplayTable();

  // Log player2's turn result
  console.log(`${player2.name} drew a card with label: ${cardLabel} and value: ${cardValue}`);
  console.log(`${player2.name} has ${player2.fp} FP.`);

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
  }

  // Fade out player2's card label after 3 seconds
  const player2CardLabel = player2CardLabelElement.textContent;
  if (player2CardLabel) {
    player2CardLabelElement.style.opacity = 1;
  }
}

// Function to start the game
function startGame() {
  alert("Warning: This game might get you depressed. Enjoy!");
  createBoard();
  selectFirstPlayer();
  updateFPDisplayTable();
}

// Function to determine the winner based on the highest FP
// Function to determine the winner based on the highest FP
function determineWinner() {
  let winner;
  if (player1.fp <= 0 || player1.fp < player2.fp) {
    winner = player2;
  } else if (player2.fp <= 0 || player2.fp < player1.fp) {
    winner = player1;
  } else {
    // Tie game
    document.getElementById('winner').textContent = "It's a tie!";
    alert("It's a tie!");
    return;
  }

  document.getElementById('winner').textContent = `The winner is ${winner.name} with ${winner.fp} FP!`;
  alert(`The winner is ${winner.name} with ${winner.fp} FP!`);

  // Redirect to the next HTML file if player 1 wins
  if (winner === player1) {
    window.location.href = 'round2.html'; // Replace 'next.html' with the actual filename of the next HTML file
  } else {
    window.location.href = 'index2.html'; 
  }
}

// Start the game when the page loads
window.onload = startGame;
