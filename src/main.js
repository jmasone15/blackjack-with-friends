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

let playingCards = [];

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

console.log(shuffle(playingCards));
