import './style.css';

// TODO - Minify Code for enhance deciphering trouble.

const numOfDecks = 1;
const suits = ['H', 'D', 'C', 'S'];
const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const dealerScoreDiv = document.getElementById('dealer-score');
const playerScoreDiv = document.getElementById('player-score');
const buttonsDiv = document.getElementById('buttons');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
const modalHeaderH1 = document.getElementById('modal-header');
const modalBodyDiv = document.getElementById('modal-body');
const modalButton = document.getElementById('modal-button');

let playingCards;
let cardIndex = 0;

let playerHand = [];
let dealerHand = [];

// Create the required amount of playing cards.
const createDeck = () => {
	playingCards = [];

	for (let i = 0; i < numOfDecks; i++) {
		suits.forEach((suit) => {
			cards.forEach((card) => {
				playingCards.push({
					card,
					suit
				});
			});
		});
	}
};

// Fisher-Yates Algorithim for Shuffling
const shuffle = (cards) => {
	for (let i = cards.length - 1; i > 0; i--) {
		// Generate a random index from 0 to i.
		const randomIndex = Math.floor(Math.random() * (i + 1));

		// Swap elements at i and randomIndex.
		[cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
	}

	return cards;
};

const delay = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const startRound = async () => {
	createDeck();

	// Shuffle cards
	playingCards = shuffle(playingCards);

	// Deal Cards
	for (let i = 0; i < 4; i++) {
		deal(cardIndex, cardIndex % 2 == 0, cardIndex == 3);
		await delay(500);
	}

	// Calculate Totals
	calculateHandTotal(playerHand);

	const { total } = calcTotal(dealerHand, true);

	if (total == 21) {
		dealerScoreDiv.innerHTML = '<b>Total:</b> 21';
		endGame();
		return;
	} else {
		dealerScoreDiv.innerHTML = '<b>Total:</b> ???';
	}

	// Show Action Buttons
	buttonsDiv.setAttribute('class', 'row');
};

const deal = (cardIdx, toPlayer, faceDown) => {
	const card = playingCards[cardIdx];
	const newCardDiv = document.createElement('div');
	newCardDiv.setAttribute('class', 'col-2 playing-card');
	newCardDiv.innerHTML = `<div class="card text-white" style="background-color: lightslategray;">
              <div id=${cardIdx} class="card-body my-5" ${
		faceDown ? "alt='Trying to look at the code? Unacceptable.'" : ''
	}>
                <b>${faceDown ? '???' : `${card.card} ${card.suit}`}</b>
              </div>
            </div>`;

	if (toPlayer) {
		playerCardsDiv.appendChild(newCardDiv);
		playerHand.push(card);
	} else {
		dealerCardsDiv.appendChild(newCardDiv);
		dealerHand.push(card);
	}

	cardIndex++;
};

const calcTotal = (hand, calcAce = false) => {
	let total = 0;
	let aceCount = 0;

	// Total up card values and count Aces.
	hand.forEach((card) => {
		if (typeof card.card === 'string') {
			if (card.card === 'A') {
				total++;
				aceCount++;
			} else {
				total += 10;
			}
		} else {
			total += card.card;
		}
	});

	if (calcAce) {
		for (let i = 0; i < aceCount; i++) {
			let aceAddition = 10 * (i + 1);

			if (total + aceAddition <= 21) {
				total += aceAddition;
			}
		}
	}

	return { total, aceCount };
};

const calculateHandTotal = (hand, toPlayer = true) => {
	const { total, aceCount } = calcTotal(hand);

	let totalString = `${total}`;

	// Add up potential scores for Aces.
	for (let i = 0; i < aceCount; i++) {
		let aceAddition = 10 * (i + 1);

		if (total + aceAddition == 21) {
			totalString = 21;
		} else if (total + aceAddition <= 21) {
			totalString += ` / ${total + aceAddition}`;
		}
	}

	if (toPlayer) {
		playerScoreDiv.innerHTML = `<b>Total:</b> ${totalString}`;
	} else {
		dealerScoreDiv.innerHTML = `<b>Total:</b> ${totalString}`;
	}
};

const hitMe = async () => {
	deal(cardIndex, true, false);
	calculateHandTotal(playerHand);

	const { total } = calcTotal(playerHand);
	if (total > 21) {
		return endGame();
	}
};

const dealerTurn = async (flipCard = true) => {
	if (flipCard) {
		const flippedCard = document.getElementById(3);
		const card = playingCards[3];
		flippedCard.innerHTML = `<b>${card.card} ${card.suit}</b>`;
		calculateHandTotal(dealerHand, false);
	}

	await delay(1000);

	const { total, aceCount } = calcTotal(dealerHand);

	// Blackjack
	if (total == 21) {
		return endGame();
	}

	// Bust
	if (total > 21) {
		return endGame();
	}

	// Stand (check for soft 17 below)
	if (total > 17) {
		return endGame();
	}

	// No Aces Play
	if (aceCount == 0) {
		if (total < 17) {
			return hitDealer();
		} else {
			return endGame();
		}
	}

	// Aces Play
	for (let i = aceCount; aceCount > -1; i--) {
		let aceAddition = 10 * i;
		let tempTotal = total + aceAddition;

		// Stand or Win
		if (tempTotal == 21 || (tempTotal > 17 && tempTotal < 21)) {
			return endGame();
		}

		// Hit (Includes soft 17)
		if (tempTotal <= 17) {
			return hitDealer();
		}

		// Bust
		if (i == 0 && tempTotal > 21) {
			return endGame();
		}
	}
};

const hitDealer = async () => {
	deal(cardIndex, false, false);
	calculateHandTotal(dealerHand, false);
	await dealerTurn(false);
	return;
};

const endGame = () => {
	const playerTotalObj = calcTotal(playerHand, true);
	const dealerTotalObj = calcTotal(dealerHand, true);

	let headerMessage = '';
	let message = '';

	if (playerTotalObj.total == dealerTotalObj.total) {
		// Push
		headerMessage = 'Push';
		message = "Y'all tied";
	} else if (dealerTotalObj.total == 21) {
		// Dealer Blackjack
		headerMessage = 'You lose';
		message = 'Dealer Blackjack';
	} else if (dealerTotalObj.total > 21) {
		// Dealer Bust
		headerMessage = 'You win';
		message = 'Dealer Bust';
	} else if (playerTotalObj.total == 21) {
		// Player Blackjack
		headerMessage = 'You win';
		message = 'Player Blackjack';
	} else if (playerTotalObj.total > 21) {
		// Player Bust
		headerMessage = 'You lose';
		message = 'Player Bust';
	} else if (playerTotalObj.total > dealerTotalObj.total) {
		// Compare Totals
		headerMessage = 'You win';
		message = 'Player total beats Dealer';
	} else if (dealerTotalObj.total > playerTotalObj.total) {
		// Compare Totals
		headerMessage = 'You lose';
		message = 'Dealer total beats Player';
	}

	modalHeaderH1.innerText = headerMessage;
	modalBodyDiv.innerText = message;
	modal.show();

	return;
};

const removeChildElements = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.lastChild);
	}
};

const reset = async () => {
	modal.hide();

	cardIndex = 0;
	playerHand = [];
	dealerHand = [];

	playerScoreDiv.innerHTML = '';
	dealerScoreDiv.innerHTML = '';

	removeChildElements(playerCardsDiv);
	removeChildElements(dealerCardsDiv);

	await delay(500);

	return startRound();
};

hitButton.addEventListener('click', hitMe);
standButton.addEventListener('click', dealerTurn);
modalButton.addEventListener('click', reset);

startRound();
