// number of rounds in a game, and number of rounds remaining
const roundsPerGame = 5
let roundsPlayed = 0
// track the id of the current input prompt
let currentPromptId = 0
// track each players score
let playerScore = 0, computerScore = 0

const promptIdBase = 'console-input-'
const promptClass = 'console-prompt'
const possibleChoices = ['rock', 'paper', 'scissors']

// compares two choices of rock paper scissors
// returns:
//     0 if the choice1 and choice2 are equal
//     > 0 if choice1 beats choice2
//     < 0 if choice1 is defeated by choice2
let compareChoices = (choice1, choice2) => {
    choice1 = parseChoice(choice1)
    choice2 = parseChoice(choice2)

    if (choice1 === choice2) {
        return 0
    }

    if (choice1 === 'rock') {
        return (choice2 === 'scissors') ? 1 : -1
    }

    if (choice1 === 'paper') {
        return (choice2 === 'rock') ? 1 : -1
    }

    if (choice1 === 'scissors') {
        return (choice2 === 'paper') ? 1 : -1
    }
}

// attempts to validate the given choice and returns the corresponding matched choice
// returns undefined if the choice is not valid (e.g. the player made a typo)
function parseChoice(choice) {
    let result = possibleChoices.find(e => e === choice.trim().toLowerCase())
    if (result) {
        return result
    }
}

// returns a valid array index of an array, at random
let randomIndex = array => Math.floor(Math.random() * array.length)

// returns an array element from an array, at random
let randomSelection = array => array[randomIndex(array)]

// represents a computer's turn at rock paper scissors by making a random choice
let computerTurn = () => randomSelection(possibleChoices)

// returns the console element on the current page - expects there to be exactly one of these
function getConsole() {
    let consoleElements = document.getElementsByClassName('console')
    if (consoleElements.length != 1) {
        console.log('Error: Could not find a unique console element in the current page')
        return
    }
    return consoleElements[0]
}

// write a message to the console
function writeToConsole(message) {
    let para = document.createElement('p')
    para.append(generateMessage(message))
    getConsole().append(para)
}

// gets the currently active prompt
function getCurrentPrompt() {
    return document.getElementById(promptIdBase + currentPromptId)
}

// prompt the player with the appropriate next action
function promptPlayer() {
    if (roundsPlayed >= roundsPerGame) {
        displayOverallResult()
        promptPlayAgain()
    } else {
        playerTurn()
    }
}

// gives the player the opportunity to play a turn of rock paper scissors
function playerTurn() {
    let message = 'Round ' + (roundsPlayed + 1) + '. Enter choice [rock/paper/scissors]'
    promptUser(message, parsePlayerChoiceOnEnter)
}

// prompt the user to type an input, using the given functions to process the input's key presses
function promptUser(message, ...onKeyUp) {
    // create a container for the message + input prompt
    let para = document.createElement('p')

    // create the message
    para.append(generatePromptMessage(message))

    // create the input prompt
    let input = generatePromptInput(para, ...onKeyUp)
    let inputId = input.getAttribute('id')
    para.append(input)

    // add to the console and focus the input prompt
    getConsole().append(para)
    document.getElementById(inputId).focus()
}

// perform a given function after a fired event if the event was triggered by the enter key
function performOnEnter(event, onEnter) {
    if (event.key === 'Enter') {
        onEnter()
    }
}

// process a player's rock/paper/scissors choice if they pressed the enter key
function parsePlayerChoiceOnEnter(event) {
    performOnEnter(event, parsePlayerChoice)
}

// process the player's decision to restart the game if they pressed the enter key
function parseRestartOnEnter(event) {
    performOnEnter(event, parseRestart)
}

// function callback to parse a yes or no response and determine whether to restart the game
let parseRestart = () => parseYesOrNo(startGame, endGame, promptPlayAgain)

// process a yes / no response, decide how to proceed
//     onYes : function to execute if the response is parsed as 'yes'
//     onNo : function to execute if the response is parsed as 'no'
//     onUnrecognised : function to execute if the response cannot be parsed correctly
function parseYesOrNo(onYes, onNo, onUnrecognised) {
    let playerChoice = readCurrentPrompt()
    if (playerChoice === 'y' || playerChoice == 'yes') {
        onYes()
        return
    }
    if (playerChoice === 'n' || playerChoice == 'no') {
        onNo()
        return
    }
    writeToConsole('Please enter either \'yes\' or \'no\'')
    onUnrecognised()
}

// ask the user if they'd like to play again
function promptPlayAgain() {
    promptUser('Would you like to play again? [yes/no]', parseRestartOnEnter)
}

// create a label to store a console message, and add it to the given parent element
function generateMessage(message) {
    let label = document.createElement('label')
    label.textContent=message
    return label
}

// create a label to store a console prompt, and add it to the given parent element
let generatePromptMessage = (message) => generateMessage('> ' + message + ': ')

// creates and returns an input prompt with associated functions that fire when a key is released
function generatePromptInput(parent, ...onKeyUp) {
    let caretChangedEvents = ['click', 'select', 'change', 'keydown', 'keyup']
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', promptClass)
    input.setAttribute('id', promptIdBase + ++currentPromptId)
    input.setAttribute('autocomplete', 'false')
    input.setAttribute('spellcheck', 'false')
    caretChangedEvents.forEach(event => input.addEventListener(event, fixCaretPosition))
    onKeyUp.forEach(f => input.addEventListener('keyup', f))
    return input
}

// ensure the caret position is fixed to the end of the input
function fixCaretPosition() {
    this.focus()
    let setCaretPosition = this.value.length
    this.selectionStart = setCaretPosition
    this.selectionEnd = setCaretPosition
}

// get the contents of the current input prompt
function readCurrentPrompt() {
    let currentPrompt = getCurrentPrompt()
    // disable the input from future edits
    currentPrompt.setAttribute('disabled', 'disabled')
    // return its contents (trimmed and lowercased for convenience)
    return currentPrompt.value.trim().toLowerCase()
}

// process the player's choice and decide how to proceed
function parsePlayerChoice() {
    let playerChoice = readCurrentPrompt()
    playerChoice = parseChoice(playerChoice)
    if (playerChoice) {
        playRound(playerChoice)
    } else {
        writeToConsole('Unrecgonised Input.')
        promptPlayer()
    }
}

// given a valid player choice, play out a round of rock paper scissors
function playRound(playerChoice) {
    let computerChoice = computerTurn()
    let result = compareChoices(playerChoice, computerChoice)
    scoreRound(result)
    displayRoundResult(result, computerChoice)
    roundsPlayed++
    promptPlayer()
}

// update the global score variables based on a round result
function scoreRound(result) {
    if (result > 0) {
        playerScore++
    }
    if (result < 0) {
        computerScore++
    }
}

// display a message to the console based on the result of a round
function displayRoundResult(result, computerChoice) {
    let message = 'Computer chose ' +
            computerChoice +
            '... ' +
            generateResultMessage(result)
    writeToConsole(message)
}

// return a win, lose or draw message based on a result. If the result is:
//     0   : this is considered a tie
//     < 0 : this is considered a defeat
//     > 0 : this is considered a victory
function generateResultMessage(result) {
    if (result == 0) {
        return 'It\'s a tie!'
    }
    if (result > 0) {
        return 'You win!'
    }
    if (result < 0) {
        return 'Bad luck!'
    }
}

// display an overall result message in the console, scoring all rounds of the game
function displayOverallResult() {
    writeToConsole('The results are in... ' + generateOverallResultMessage())
}

// return a message based on the overall aggregate score of all rounds
function generateOverallResultMessage() {
    return generateResultMessage(playerScore - computerScore)
}

// start a game of rock paper scissors
function startGame() {
    writeToConsole('Let\'s play a game of rock paper scissors! Best of ' + roundsPerGame + '...')
    playerScore = 0
    computerScore = 0
    roundsPlayed = 0
    promptPlayer()
}

function endGame() {
    writeToConsole('Thank you for playing!')
}

