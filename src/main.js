import './style.css';

const numOfDecks = 1;
const suits = ['H', 'D', 'C', 'S'];
const cards = [
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K',
	'A'
];

const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');

let playingCards = [];
let cardIndex = 0;

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

const startRound = () => {
	// Shuffle cards
	playingCards = shuffle(playingCards);

	// Deal Cards
	const interval = setInterval(() => {
		deal(playingCards[cardIndex], cardIndex % 2 == 0);
		if (cardIndex == 4) {
			clearInterval(interval);
		}
	}, 500);
};

const deal = ({ card, suit }, toPlayer) => {
	const newCardDiv = document.createElement('div');
	newCardDiv.setAttribute('class', 'col-2 playing-card');
	newCardDiv.innerHTML = `<div class="card text-white" style="background-color: lightslategray;">
              <div class="card-body my-5">
                <b>${card} ${suit}</b>
              </div>
            </div>`;

	if (toPlayer) {
		playerCardsDiv.appendChild(newCardDiv);
	} else {
		dealerCardsDiv.appendChild(newCardDiv);
	}

	cardIndex++;
};

startRound();
