/*
 * Create a list that holds all of your cards
 */

// const cards = document.querySelectorAll('.card');
// console.log(cards);

/*
for (card of cards) {
	card.addEventListener('click', () => {
		console.log("Click!");
	});
}
*/

// const card = document.querySelectorAll('.card');
/*
for (card of deck) {
	card.addEventListener('click', event => {
		const clickTarget = event.target;
		if (clickTarget.classList.contains('card')) {
			console.log("Click!");
		}
	});
}
*/
/* The following code represents flipping the cards on both sides by appling the listener to the deck element and listening for each of the 16 child cards. This is using event delegation…for better performance of the operation. */

const deck = document.querySelector('.deck');
	deck.addEventListener('click', event => {
		const clickTarget = event.target;
//			console.log(clickTarget);
		if (clickTarget.classList.contains('card')) {
			clickTarget.classList.toggle('open');
			clickTarget.classList.toggle('show');
		}
	});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
