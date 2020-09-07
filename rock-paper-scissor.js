// set of choices (not a const so that it can be re-run in snippet mode)
let choices = ['rock', 'paper', 'scissors']

// compares two choices
// returns:
//     0 if the choice1 and choice2 are equal
//     > 0 if choice1 beats choice2
//     < 0 if choice1 is defeated by choice2
let compareChoices = (choice1, choice2) => {
    let choice1Index = choices.findIndex(choice => choice === choice1)
    let choice2Index = choices.findIndex(choice => choice === choice2)

    if (choice1Index == choice2Index) {
        return 0
    }

    // choice1 is rock
    if (choice1Index == 0) {
        return (choice2Index == 2) ? 1 : -1
    }

    // choice1 is paper
    if (choice1Index == 1) {
        return (choice2Index == 0) ? 1 : -1
    }

    // choice1 is scissors
    if (choice1Index == 2) {
        return (choice2Index == 1) ? 1 : -1
    }
}

// returns a valid array index of an array, at random
let randomIndex = choices => Math.floor(Math.random() * choices.length)

// returns an array element from an array, at random
let randomSelection = choices => choices[randomIndex(choices)]

// represents the computer's turn in a game of rock, paper, scissors
let computerSelection = () => randomSelection(choices)

// gives the user a turn in a game of rock, paper, scissors
let playerSelection = () => {
    let value = prompt('rock, paper, scissor...', 'rock')
    value = value.toLowerCase().trim()
    return choices.find(choice => choice === value)
}

// Returns a relevant result message based on one round of rock, paper, scissors
// Assumes choice1 is the subject's choice
let generateRoundResultMessage = (choice1, choice2) => {
    let result = compareChoices(choice1, choice2)
    if (result == 0) {
        return 'It\'s a tie!'
    } else {
        return (result > 0) ? 'You win!' : 'Bad luck!'
    }
}

// Returns a relevant result message based an entire game of rock, paper, scissors
// Assumes score1 is the subject's score
let generateOverallResultMessage = (score1, score2) => {
    let result = 'The results are in: '
    if (score1 == score2) {
        result += 'It\'s a tie!'
    } else {
        (score1 > score2) ? result += 'You win!' : result+= 'Bad luck!'
    }
    return result
}

// plays a round of rock, paper, scissors (human vs. computer)
let rockPaperScissors = () => {
    let playerChoice = playerSelection() || displayOnPage('Error: Invalid choice')
    let computerChoice = computerSelection()
    if (playerChoice) {
         displayOnPage('Computer chose: ' + computerChoice)
         displayOnPage('You chose: ' + playerChoice)
         displayOnPage(generateRoundResultMessage(playerChoice, computerChoice))
         return compareChoices(playerChoice, computerChoice)
    }
}

// plays 5 rounds of rock, paper, scissors and returns an overaal result message
let playGame = () => {
    let rounds = 5, playerScore = 0, computerScore = 0
    for (i = 0; i < rounds; i++) {
        let result = rockPaperScissors()
        if (result > 0) {
            playerScore++
        }
        if (result < 0) {
            computerScore++
        }
    }
    displayOnPage(generateOverallResultMessage(playerScore, computerScore))
}

// clear any existing content on the page
// (useful when running this as a snippet)
function clearPage() {
    let allDivs = document.getElementsByTagName('div')
    for (i = 0; i < allDivs.length; i++) {
        clearElement(allDivs[i])
    }
}

// clear all HTML content from a HTML element
function clearElement(element) {
    element.innerHTML = '';
}

// Inserts the given value into a new paragraph
function displayInParagraph(value) {
    let para = document.createElement('p')
    para.innerHTML = value
    return para
}

// Displays a given value on the current web page
function displayOnPage(value) {
    let para = displayInParagraph(value)
    let firstDiv = document.querySelector('div')
    if (!firstDiv) {
        firstDiv = document.createElement('div')
    }
    firstDiv.appendChild(para)
}

// clear the page first (useful if running as a snippet)
clearPage()
// play the game!
playGame()

