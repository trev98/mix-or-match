class AudioController {
    constructor() {
        //music and sound effects
        //Use the "this.name = new Audio"
        this.backGroundMusic = new Audio('assets/audio/Simple .mp3');
        this.flipSound = new Audio('assets/audio/whoosh-6316.mp3');
        this.matchSound = new Audio('assets/audio/mixkit-game-loot-win-2013.wav');
        this.victorySound = new Audio('assets/audio/mixkit-japanese-music-box-notification-697.wav');
        this.gameOverSound = new Audio('assets/audio/shakuhachi-stretching-25-41799.mp3');
        this.backGroundMusic.volume = 0.5;
        this.backGroundMusic.loop = true;
    }
        startMusic() {
            this.backGroundMusic.play();
        }

        stopMusic() {
            this.backGroundMusic.pause();
            this.backGroundMusic.currentTime = 0;
        }
        flip() {
            this.flipSound.play();
        }
        match() {
            this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}
//assign game information container elements
class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
this.timeRemaining = totalTime;
this.timer = document.getElementById('time-remaining');
this.ticker = document.getElementById('flips');
this.audioController = new AudioController();
    }
    // total clicks and time. game info container
    startGame() {
this.cardToCheck = null;
this.totalClicks = 0;
this.timeRemaining = this.totalTime;
this.matchedCards = [];
this.busy = true;
        setTimeout(() => {
this.audioController.startMusic();
this.shuffleCards();
this.countDown = this.startCountDown();
this.busy = false;
        }, 500);
this.hideCards();
this.timer.innerText = this.timeRemaining;
this.ticker.innerText = this.totalClicks;
    }
    //flip cards back if they dont match. cards stay up if they do
    hideCards(){
this.cardsArray.forEach(card => {
        card.classList.remove('visible');
        card.classList.remove('matched');
        });
    }
// Card flip sounds
    flipCard(card) {
 if(this.canFlipCard(card)) {
this.audioController.flip();
this.totalClicks++;
this.ticker.innerText = this.totalClicks;
    card.classList.add('visible');

    if(this.cardToCheck)
    this.checkForCardMatch(card);
    else
    this.cardToCheck = card;
}
    }
checkForCardMatch(card) {
if(this.getCardType(card) === this.getCardType(this.cardToCheck))
this.cardMatch(card, this.cardToCheck);
    else
this.cardMisMatch(card, this.cardToCheck);

this.cardToCheck = null;
}
//Cards stay face up if matched
cardMatch(card1, card2) {
this.matchedCards.push(card1);
this.matchedCards.push(card2);
card1.classList.add('matched');
card2.classList.add('matched');
this.audioController.match();
if(this.matchedCards.length === this.cardsArray.length)
this.victory();
}
//cards stay face up if Mismatched
cardMisMatch(card1, card2) {
this.busy = true;
setTimeout(() => {
card1.classList.remove('visible');
card2.classList.remove('visible');
this.busy = false;
}, 1000);
}

getCardType(card) {
        return card.getElementsByClassName('card-word')[0].src;
}
    //Assign music to actions
startCountDown() {
    return setInterval(() => {
this.timeRemaining--;
this.timer.innerText = this.timeRemaining;
if(this.timeRemaining === 0)
this.gameOver();
    }, 1000);
}
gameOver() {
clearInterval(this.countDown);
this.audioController.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
}

victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById('victory-text').classList.add('visible');
}
// fisher and yates formula to shuffle cards
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
let rndmIndex = Math.floor(Math.random() * (i+1));
this.cardsArray[rndmIndex].style.order = i;
this.cardsArray[i].style.order = rndmIndex;
        }
    } 
//All 3 statements are false which will return true. If the statement is true, card will flip. Boolean. card wont flip is there is an action/card is busy.
    canFlipCard(card) {
        return!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}   
function ready() { 
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(120, cards);
    //initialize the game
overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        game.startGame();
    });
});

cards.forEach(card => {
    card.addEventListener('click', () => {
game.flipCard(card);
    });
});
}

if(document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}



