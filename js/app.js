/*
 * Global Variables
 */
const iconsList = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];
const cardsContainer = document.querySelector(".deck");
const cancelBtnModal = document.querySelector('.modal_cancel');
const secondsContainer = document.querySelector("#seconds");
const minutesContainer = document.querySelector("#minutes");
const hoursContainer   = document.querySelector("#hours");
const restartBtnModal = document.querySelector('.modal_replay');
const restartBtn = document.querySelector(".restart");
const movesContainer = document.querySelector(".moves");
const starsContainer = document.querySelector(".stars");
const star = `<li><i class="fa fa-star"></i></li>`;

starsContainer.innerHTML = star + star + star;
movesContainer.innerHTML = 0;


let totalSeconds = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;
let isFirstClick = true;
let openedCards = [];
let matchedCards = [];
let moves = 0;

/*
 * Initializing the game
 */

function init() {
    const icons = shuffle(iconsList);
    for(let i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = `<i class="${icons[i]}"></i>`;
        cardsContainer.appendChild(card);

        // Add Click Event to each Card
        click(card);
    }
}

/*
 * Click Event
 */

function click(card) {

    // Card Click Event
    card.addEventListener("click", function() {

        if(isFirstClick) {
            // Start our timer
            startTimer();
            // Change our First Click indicator's value
            isFirstClick = false;
        }

        const currentCard = this;
        const previousCard = openedCards[0];

        if(openedCards.length === 1) {

            card.classList.add("open", "show", "disable");
            openedCards.push(this);

            // We should compare our 2 opened cards!
            compare(currentCard, previousCard);

        } else {
        // We don't have any opened cards
            currentCard.classList.add("open", "show", "disable");
            openedCards.push(this);
        }

    });
}

/*
 * Compare the 2 cards
 */

function compare(currentCard, previousCard) {

    // Matcher
    if(currentCard.innerHTML === previousCard.innerHTML) {

        // Matched
        currentCard.classList.add("match");
        previousCard.classList.add("match");

        matchedCards.push(currentCard, previousCard);

        openedCards = [];

        // Check if the game is over!
        isOver();

    } else {

        setTimeout(function() {
            currentCard.classList.remove("open", "show", "disable");
            previousCard.classList.remove("open", "show", "disable");

        }, 500);

        openedCards = [];

    }

    addMove();
}

/*
 * Check if the game is over!
 */

function isOver() {
    if(matchedCards.length === iconsList.length) {

        stopTimer();
        toggleModal();
        writeModalStats();

    }
}

/*
 * Add move
 */

function addMove() {
    moves++;
    movesContainer.innerHTML = moves;

    // Set the rating
    rating();
}

/*
 * Rating
 */

function rating() {

    if( moves < 18) {
        starsContainer.innerHTML = star + star + star;
    } else if( moves < 25) {
        starsContainer.innerHTML = star + star;
    } else {
        starsContainer.innerHTML = star;
    }
}

/*
 * Star rating for Modal
 */

function getStars() {
  if( moves < 18) {
      stars = 3;
  } else if( moves < 25) {
      stars = 2;
  } else {
      stars = 1;
  }
  return stars;
}

/*
 * Timer
 */

function startTimer() {
    liveTimer = setInterval(function() {
        // Increase the totalSeconds by 1
        totalSeconds++;

        calculateTime(totalSeconds);

        // Update the HTML Container with the new time

        secondsContainer.innerHTML = seconds;
        minutesContainer.innerHTML = minutes;
        hoursContainer.innerHTML   = hours;

        // Fixing the 00:00:00 format bug

        if (seconds < 10 && minutes < 10) {
          secondsContainer.innerHTML = `0${seconds}`;
          minutesContainer.innerHTML = `0${minutes}`;
          hoursContainer.innerHTML = `0${hours}`;
        } else if (minutes < 10) {
          minutesContainer.innerHTML = `0${minutes}`;
          hoursContainer.innerHTML = `0${hours}`;
        } else {
          hoursContainer.innerHTML = `0${hours}`;
        }

    }, 1000);
}

function stopTimer() {
    clearInterval(liveTimer);
}

/*
 * Timer [ Calculate Time ]
 */

function calculateTime(totalTime) {
    hours   = Math.floor( totalTime / 60 / 60);
    minutes = Math.floor( (totalTime / 60) % 60);
    seconds = totalTime % 60;
}

/*
 * Restart Button
 */

restartBtn.addEventListener("click", function() {
    // Delete ALL cards
    cardsContainer.innerHTML = "";

    init();
    // Reset the game
    reset();

});

/*
 *  Modal
 */

// Show/hide functionality

function toggleModal() {
  const modal = document.querySelector(".modal_background");
  modal.classList.toggle('hide');
}

// Function that displays modal Stats

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const timeModal = document.querySelector('.timer').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starStat = document.querySelector('.modal_stars');
  const stars = getStars();

  starStat.innerHTML = `Stars = ${stars}`;
  timeStat.innerHTML = `Time = ${timeModal}`;
  movesStat.innerHTML = `Moves = ${moves}`;
}

// Modal buttons event listeners

restartBtnModal.addEventListener("click", function() {
  // Delete ALL cards
  cardsContainer.innerHTML = "";

  // Call `init` to create new cards
  init();

  // Reset the game
  reset();
  // Hiding Modal
  toggleModal();

});

cancelBtnModal.addEventListener("click", function() {
  toggleModal();
});

/*
 * Reset All Game Variables
 */
function reset() {
    // Empty the `matchedCards` array
    matchedCards = [];

    // Reset `moves`
    moves = 0;
    movesContainer.innerHTML = moves;

    // Reset `rating`
    starsContainer.innerHTML = star + star + star;

    // Resetting the timer
    stopTimer();

    isFirstClick = true;
    totalSeconds = 0;
    hoursContainer.innerHTML = "00";
    minutesContainer.innerHTML = "00";
    secondsContainer.innerHTML = "00";
    hours = 0;
    minutes = 0;
    seconds = 0;
}




// Starting the game

init();

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
