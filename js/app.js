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

/* 
Create a variable in GLOBAL SCOPE for holding an ampty array and push click targets to this variable that represents the array.
*/
let toggledCards = [];

/*
Create variable in global scope which contains the on/off status of the clock with a Boolean value.
*/
let clockOff = true;
// const clock = document.querySelector('.clock');
let clockID;
/*
Create variable in global scope to hold the incremented value of time, starting at 0.
*/
 let time = 0;
/* 
Create a variable in global scope to set / start number of moves at 0 at beginning of each game 
*/
let moves = 0;
const deck = document.querySelector('.deck');


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
//	console.log('Cards to Shuffle', cardsToShuffle);
	const shuffledCards = shuffle(cardsToShuffle);
//	console.log('Shuffled Cards', shuffledCards);
	for (card of shuffledCards) {
		deck.appendChild(card);
	}
}
shuffleDeck();

/* 
Flip the cards on both sides by applying the listener to the deck element and listening for each of the 16 child cards. This is using event delegation for better performance of the operation. 
*/
// const deck = document.querySelector('.deck');
deck.addEventListener('click', event => {
	const clickTarget = event.target;
//		console.log(clickTarget);
// Add conditionals to determine if a card was clicked, how many cards are clicked, and only populate array with the unique card to prevent double-counting the same card.
	if (isClickValid(clickTarget)
		/* Moved the following conditionals 
		clickTarget.classList.contains('card') && 
		!clickTarget.classList.contains('match') && 
		toggledCards.length < 2 && 
		!toggledCards.includes(clickTarget)
		*/
		) {
		if (clockOff) {
			startClock();
			clockOff = false;
		} 
		toggleCard(clickTarget);
		addToggleCard(clickTarget);
		if (toggledCards.length === 2) {
//			console.log('2 cards - YAY!');
			// Call the checkForMatch function inside the click event listeners for 2 cards
			checkForMatch(clickTarget);
			addMove(); // Call function to increment move++ on scoreboard
			checkScore(); // Call function each time a move of 2 flipped cards is completed
		}
	}
});
/*
Separated conditional checks into one function called isClickValid: is the click on a card, is the click on a match T/F, how many cards clicked, and does the array only include unique cards - T/F - to prevent double-counting.
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
Separated flipping cards into its own function outside of event listener code. Old function name line was: function toggleCard(clickTarget) and clickTarget.classList.toggle...lines
*/
	function toggleCard(card) {
		// Pass in each card element in the array
		card.classList.toggle('open');
		card.classList.toggle('show');
	}

	function addToggleCard(clickTarget) {
		toggledCards.push(clickTarget);
		// console.log(toggledCards);
	}

/*
Create functionality that will display the current time to the clock element on the score-panel in HTML. 
Format time correctly:
- use division operator to return how many times 60 goes into variable time and define that number as minutes
- use remainder operator to see what time increments are leftover after dividing by 60 and define the remainder as seconds.
- create a conditional to prepend a 0 when sewconds are less than two digits
*/
	
function startClock() {
	// time = 0;
	clockID = setInterval(() => {
		time++;
		displayTime();
		// console.log(time);
	}, 1000);
}
// startClock();

function displayTime() {
	const clock = document.querySelector('.clock');
	const minutes = Math.floor(time/60);
	const seconds = time % 60;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
	//console.log(clock);
	// clock.innerHTML = time;
}
//displayTime();

/* 
Stop the clock.
*/
function stopClock() {
	clearInterval(clockID);
}

/* 
Create function that checks if the two flipped cards match based on the array items to see if they are equal.
*/
	function checkForMatch() {
		if (
			toggledCards[0].firstElementChild.className ===
			toggledCards[1].firstElementChild.className
		) {
//			console.log('Match!');
// Toggle the .match class on both elements and reset the array
			toggledCards[0].classList.toggle('match');
			toggledCards[1].classList.toggle('match');
			toggledCards = [];

		} else {
			// Add setTimeout so unmatched second flipped card stays visible
			setTimeout(() => {
			// console.log('Different!');
			// Call the function toggleCard for both cards
			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			// Call the toggle function on the array values, but must happen AFTER the timeout
			toggledCards = [];
		}, 1000);
		}
	}

/* 
Create addMove() function that 
- increments moves++ and 
- changes the HTML element on the scoreboard to the new value after every completed move (flipping two cards = 1 move)
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
	if (moves === 16 || moves === 24) {
		hideStar();
	}
}

/*
Create a function that removes/hides one star at a time from the DOM. Includes a conditional and a break to 
- only hide one star at a time
- to maintain previously hidden stars, and 
- will not hide any more stars once two stars are hidden; call hideStar() two times.
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
