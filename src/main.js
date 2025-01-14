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

let playingCards = [];
let cardIndex = 0;

let playerHand = [];
let dealerHand = [];

// Create the required amount of playing cards.
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
	// Shuffle cards
	playingCards = shuffle(playingCards);

	// Deal Cards
	for (let i = 0; i < 4; i++) {
		deal(cardIndex, cardIndex % 2 == 0, cardIndex == 3);
		await delay(500);
	}

	// Calculate Totals
	calculateHandTotal(playerHand);
	dealerScoreDiv.innerHTML = '<b>Total:</b> ???';

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

const calculateHandTotal = (hand, toPlayer = true) => {
	let total = 0;
	let aceCount = 0;

	// Total up card values and count Aces.
	hand.forEach((card) => {
		if (typeof card.card === 'string') {
			if (card.card === 'A') {
				total += 1;
				aceCount++;
			} else {
				total += 10;
			}
		} else {
			total += card.card;
		}
	});

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
};

const dealerTurn = () => {
	const flippedCard = document.getElementById(3);
	const card = playingCards[3];
	flippedCard.innerHTML = `<b>${card.card} ${card.suit}</b>`;
	calculateHandTotal(dealerHand, false);

	// If 16 or less, hit. Otherwise stand.
};

hitButton.addEventListener('click', hitMe);
standButton.addEventListener('click', dealerTurn);

startRound();
