/*
 * OVERVIEW/INSTRUCTIONS:
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* 
Create a variable in GLOBAL SCOPE for holding an ampty array and push click targets to this variable that represents the array.
*/
let toggledCards = [];

/*
Create variable in global scope to be referenced in the click event listener for each card (below).
*/
const deck = document.querySelector('.deck');

/*
Create variable in global scope which contains the on/off status of the clock with a Boolean value.
*/
let clockOff = true;

/*
Declare clockID in global scope.
*/
let clockID;

/*
Create variable in global scope to hold the incremented value of time, starting at 0.
*/
let time = 0;

/* 
Create a variable in global scope to set / start number of moves at 0 at beginning of each game. 
*/
let moves = 0;

/* 
Create variable in global scope that records the number of matched pairs, starting at zero.
*/
let matched = 0;

/*
- Create a function that will initialize shuffling the deck. 
- Needs to happen first and the function needs to be called immediately. 
- Declare variable that provides the array to the shuffle(array) function by shuffling the "li" elements inside the deck element. 
- Store the li's in a variable called cardsToShuffle by using querySelectorAll. 
- A Node List is created, so Array.from() method is used to create a copied array from the Node List.
- Need to replace the old card elements in the HTML by adding the new shuffled deck of cards to the DOM. For each card in the shuffledCards array, each card needs to be appended to the deck element. 
- appendChild method is used because the array items are nodes and not strings. The nodes change their order in the HTML file within the parent deck element.
*/
function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li')); 
	const shuffledCards = shuffle(cardsToShuffle); 
	for (card of shuffledCards) {
		deck.appendChild(card);
	}
}
shuffleDeck(); // Shuffle deck immediately.

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
Flip the cards by applying the listener to the deck parent element and listening for each of the 16 child cards. Using event delegation for better performance of the operation. 
*/
deck.addEventListener('click', event => {
	const clickTarget = event.target;
// Add conditionals to determine if a card was clicked, how many cards are clicked, and only populate array with a unique card to prevent double-counting the same card (if clicked more than once). These conditionals are together in a function called isClickValid (see below).
	if (isClickValid(clickTarget)
		) {
		if (clockOff) {
			startClock();
			clockOff = false;
		} 
		toggleCard(clickTarget); // Invokes toggleCard (flip) function, to make the card appear.
		addToggleCard(clickTarget);
		if (toggledCards.length === 2) {
			// Call the checkForMatch function (see below) inside the click event listeners for 2 cards.
			checkForMatch(clickTarget);
			addMove(); // Call function (see below) to increment move++ on scoreboard.
			checkScore(); // Call function (see below) each time a completed 'move' of 2 flipped cards is completed.
		}
	}
});

/*
Separated conditional checks into one function called isClickValid: is the click on a card?, is the click on a match T/F?, how many cards clicked?, and does the array only include unique cards - T/F - to prevent double-counting?
*/
function isClickValid(clickTarget) {
	return (
		clickTarget.classList.contains('card') && 
		!clickTarget.classList.contains('match') && 
		toggledCards.length < 2 && 
		!toggledCards.includes(clickTarget)
	);
}

/*
Separated flipping cards into its own function outside of event listener code (above).
*/
function toggleCard(card) {
	// Pass in each card element in the array cardsToShuffle.
	card.classList.toggle('open');
	card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
	toggledCards.push(clickTarget);
}

/*
Create functionality that will display the current time  elapsed during game play to the clock element on the score-panel in HTML. 
*/	
function startClock() {
	clockID = setInterval(() => {
		time++;
		displayTime();
	}, 1000);
}

/*
Display time in correct format:
- use division operator to return how many times 60 goes into variable time and define that number as minutes
- use remainder operator to see what time increments are leftover after dividing by 60 and define the remainder as seconds.
- create a conditional to prepend a 0 when seconds are less than two digits
*/
function displayTime() {
	const clock = document.querySelector('.clock');
	const minutes = Math.floor(time/60);
	const seconds = time % 60;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

/* 
Create functionality to stop the clock.
*/
function stopClock() {
	clearInterval(clockID);
}

/* 
Declare a constant variable designating the highest number of matched pairs is 8. Create function that checks if the two flipped cards match based on the array items to see if they are equal. 
*/
const TOTAL_PAIRS = 8; 
function checkForMatch() {
	if (
		toggledCards[0].firstElementChild.className ===
		toggledCards[1].firstElementChild.className
	) {
// Toggle the .match class on both elements and reset the array.
		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
		matched++;
		if (matched === TOTAL_PAIRS) {
		gameOver();
		}
		
	} else {
		// Add setTimeout so unmatched second flipped card stays visible long enough for user to view.
		setTimeout(() => {
		// Call the function toggleCard for both cards.
		toggleCard(toggledCards[0]);
		toggleCard(toggledCards[1]);
		// Call the toggle function on the array values, but must happen AFTER the timeout.
		toggledCards = [];
		}, 1000);
	}
}

/*
Create functionality to turn off the game once all card pairs are matched. Create conditional to check when the total matched pairs is 8.  Then invoke the gameOver function that will stop the clock, write stats on the modal, and show the modal.
*/
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
	matched = 0; 
	shuffleDeck();
}

/* 
Create addMove() function:
- increments moves++ and 
- changes the HTML element on the scoreboard to the new value after every completed move (flipping two cards = 1 move).
*/
function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

/*
Create function that checks score and removes/hides stars based on number of moves executed. Use a conditional to remove one star at a time once the threshold of moves is true.
*/
function checkScore() {
	if (moves === 15 || moves === 30) {
		hideStar();
	}
}

/*
Create a function that removes/hides one star at a time from the DOM. Includes a conditional and a break to: 
- only hide one star at a time
- maintain previously hidden stars, and 
- not hide any more stars once two stars are hidden (lowest star rating is 1 star).
*/
function hideStar() {
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

/*
Create function that makes the modal appear and disappear when appropriate.
*/
function toggleModal() {
	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
}

/* 
Create function to populate game player stats in the modal.
*/
function writeModalStats() {
	const timeStat = document.querySelector('.modal_time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal_moves');
	const starsStat = document.querySelector('.modal_stars');
	const stars = getStars();

	timeStat.innerHTML = `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

/*
Create functionality to populate the modal with the correct amount of stars at the end of the game.
*/
function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	//console.log(starCount); 2 for testing
	return starCount;
}

/*
Create functionality for the two modal buttons. Query the element and attach a click event listener to execute the function and then call toggleModal() function to close the modal after the clicking.
*/
document.querySelector('.modal_cancel').addEventListener('click', () => {
	toggleModal(); 
});

/*
Link replayGame() function to a click event listener on the modal replay button.
*/
document.querySelector('.modal_replay').addEventListener('click', () => {
	replayGame(); 
});

/*
Link resetGame() function to a click event listener on the RESTART BUTTON located at the top right of the game board (NOT THE MODAL).
*/
document.querySelector('.restart').addEventListener('click', resetGame);

/*
Create functionality to reset game. Nest other functions inside of resetGame(): resetClockAndTime(), resetMoves(), resetStars(), and shuffleDeck() so that game is ready to be played again. Declare matched = 0 before executing shuffleDeck() to ensure all cards are face down before shuffling.
*/
function resetGame() {
	resetClockAndTime();
	resetMoves();
	resetStars();
	resetDeck();
	matched = 0;
	shuffleDeck();
}

function resetClockAndTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

/* 
Create functionality to reset the number of moves by setting the global variable moves to zero (see above) to change the moves display to 0.
*/
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

/*
Create functionality to reset stars variable to zero. Loop through starList to reset star display property back to inline.
*/
function resetStars() { 
	stars = 0; 
	const starList = document.querySelectorAll('stars li');
	for  (star of starList) {
		star.style.display = 'inline';
	}
}

/*
Reset all cards to face down to prep for new game. Must be done before shuffling cards again.
*/
function resetDeck() {
	const cardsToReset = Array.from(document.querySelectorAll('.match'));
	for (card of cardsToReset){
		card.classList.remove('open', 'show', 'match');
	}
}

/*
Create functionality to replay game. This function invokes the resetGame() function and the toggleModal() function. Link this to the click event listener for the replay button on the modal.
*/
function replayGame() {
	resetGame();
	toggleModal();
}
