import './style.css';

const numOfDecks = 1;
const suits = ['H', 'D', 'C', 'S'];
const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const dealerScoreDiv = document.getElementById('dealer-score');
const playerScoreDiv = document.getElementById('player-score');

let playingCards = [];
let cardIndex = 0;

let playerHand = [];
let dealerHand = [];

// Create the required amount of playing cards.
for (let i = 0; i < numOfDecks; i++) {
	cards.forEach((card) => {
		suits.forEach((suit) => {
			playingCards.push({
				card,
				suit
			});
		});
	});
}

// Fisher-Yates Algorithim for Shuffling
const shuffle = (cards) => {
	// for (let i = cards.length - 1; i > 0; i--) {
	// 	// Generate a random index from 0 to i.
	// 	const randomIndex = Math.floor(Math.random() * (i + 1));

	// 	// Swap elements at i and randomIndex.
	// 	[cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
	// }

	return cards.reverse();
};

const delay = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const startRound = async () => {
	// Shuffle cards
	playingCards = shuffle(playingCards);

	// Deal Cards
	for (let i = 0; i < 4; i++) {
		// deal(playingCards[cardIndex], cardIndex % 2 == 0, cardIndex == 3);
		deal(playingCards[cardIndex], cardIndex % 2 == 0, false);
		await delay(500);
	}

	// Calculate Totals
	let playerTotal = calculateHandTotal(playerHand);
	let dealerTotal = calculateHandTotal(dealerHand);

	playerScoreDiv.innerHTML = `<b>Total:</b> ${playerTotal}`;
	dealerScoreDiv.innerHTML = `<b>Total:</b> ${dealerTotal}`;
};

const deal = (card, toPlayer, faceDown) => {
	const newCardDiv = document.createElement('div');
	newCardDiv.setAttribute('class', 'col-2 playing-card');
	newCardDiv.innerHTML = `<div class="card text-white" style="background-color: lightslategray;">
              <div class="card-body my-5">
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

const calculateHandTotal = (hand) => {
	let total = 0;
	let aceCount = 0;

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

		if (total + aceAddition <= 21) {
			totalString += ` / ${total + aceAddition}`;
		}
	}

	return totalString;
};

startRound();
