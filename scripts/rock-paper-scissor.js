const choices = ['rock', 'paper', 'scissors']
// number of rounds in a game
const numTurns = 5
// used to track the id of the input prompt that needs to have focus
let promptIdCounter = 0
// track each players score
let playerScore = 0, computerScore = 0

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

// returns the console element - expects there to be only one of these
function getConsole() {
    let consoleElements = document.getElementsByClassName('console')
    if (consoleElements.length != 1) {
        console.log('Error: Could not find a unique console element in the current page')
        return
    }
    return consoleElements[0]
}

// create a new paragraph element
function generateParagraph() {
    return document.createElement('p')
}

// write a message to the console element
function consoleMessage(message) {
    let console = getConsole()
    let para = generateParagraph()
    generateMessageLabel(message, para)
    console.append(para)
}

// generate the next id for an input prompt
function generateNextPromptId() {
    return 'console-input-' + promptIdCounter++
}

// write a prompt to the console to let the user play the next round, and give it focus
function roundPrompt(message, remainingRounds) {
    let console = getConsole()
    let para = generateParagraph()
    let inputId = generateNextPromptId()
    generateMessagePrompt(message, para)
    generateRoundPrompt(para, inputId, remainingRounds)
    console.append(para)
    document.getElementById(inputId).focus()
}

// write a prompt to the console to give the user a yes/no choice
function yesNoPrompt(message, onYes, onNo, onUnrecognised) {
    let console = getConsole()
    let para = generateParagraph()
    let inputId = generateNextPromptId()
    generateMessagePrompt(message, para)
    generateYesNoPrompt(para, inputId, onYes, onNo, onUnrecognised)
    console.append(para)
    document.getElementById(inputId).focus()
}

// create a label to store a console message, and add it to the given parent element
function generateMessageLabel(message, parent) {
    let label = document.createElement('label')
    label.setAttribute('class', 'console-label')
    label.innerHTML=message
    parent.append(label)
}

// create a label to store a console prompt, and add it to the given parent element
let generateMessagePrompt = (message, parent) => generateMessageLabel('> ' + message + ': ', parent)

// creates an input to store and process the users choice in a round of rock paper scissors
function generateRoundPrompt(parent, id, remainingRounds) {
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', 'console-prompt')
    input.setAttribute('id', id)

    input.addEventListener("keyup", function(event) {
        // process the player's choice when they hit enter (to give a console feel)
        if (event.keyCode === 13) {
            validatePlayerChoice(input, remainingRounds)
        }
    });
    parent.append(input)
}

// generate an input prompt for a yes no question
function generateYesNoPrompt(parent, id, onYes, onNo, onUnrecognised) {
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', 'console-prompt')
    input.setAttribute('id', id)

    input.addEventListener("keyup", function(event) {
        // process the player's choice when they hit enter (to give a console feel)
        if (event.keyCode === 13) {
            validateYesNo(input, onYes, onNo, onUnrecognised)
        }
    });
    parent.append(input)
}

// disable an input so its read only (helps give the page a console-like look and feel)
function disableInput(input) {
    input.setAttribute('readonly', 'readony')
    input.setAttribute('disabled', 'disabled')
}

// process the player's choice and decide how to proceed
function validatePlayerChoice(input, remainingRounds) {
    disableInput(input)
    // parse the player's choice
    let playerChoice = input.value.trim().toLowerCase()
    playerChoice = choices.find(i => i === playerChoice)
    if (playerChoice) {
        // valid choice, score this round and start the next round
        let computerChoice = randomSelection(choices)
        let result = compareChoices(playerChoice, computerChoice)
        scoreRound(result)
        displayRoundResult(result, computerChoice)
        playerTurn(remainingRounds - 1)
    } else {
        // invalid choice, repeat the round
        consoleMessage('Unrecgonised Input.')
        playerTurn(remainingRounds)
    }
}

// process a yes / no response, decide how to proceed
//     onYes : function to execute if the response is parsed as 'yes'
//     onNo : function to execute if the response is parsed as 'no'
//     onUnrecognised : function to execute if the response cannot be parsed correctly
function validateYesNo(input, onYes, onNo, onUnrecognised) {
    disableInput(input)
    let playerChoice = input.value.trim().toLowerCase()
    if (playerChoice === 'y' || playerChoice == 'yes') {
        onYes()
        return
    }
    if (playerChoice === 'n' || playerChoice == 'no') {
        onNo()
        return
    }
    consoleMessage('Please enter either \'yes\' or \'no\'')
    onUnrecognised()
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
            generateRoundResultMessage(result)
    consoleMessage(message)
}

// return a win, lose or draw message based on a result. If the result is:
//     0   : this is considered a tie
//     < 0 : this is considered a defeat
//     > 0 : this is considered a victory
function generateRoundResultMessage(result) {
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
    let message = 'The results are in... ' + generateOverallResultMessage()
    consoleMessage(message)
}

// return a message based on the overall aggregate score of all rounds
function generateOverallResultMessage() {
    return generateRoundResultMessage(playerScore - computerScore)
}

// prompts the player to play a round of rock paper or scissors, keeps track of how many rounds are remaining
function playerTurn(remainingRounds) {
    if (remainingRounds > 0) {
        roundPrompt('Round ' + (numTurns - remainingRounds + 1) + '. Enter choice [rock/paper/scissors]', remainingRounds)
    } else {
        displayOverallResult()
        playAgain()
    }
}

// log a message to the console at the start of a game
function welcome() {
    consoleMessage('Let\'s play a game of rock paper scissors! Best of ' + numTurns + '...')
}

// offer to play another game
function playAgain() {
    yesNoPrompt('Would you like to play again? [yes/no]', startGame, endGame, playAgain)
}

// start a game of rock paper scissors
function startGame() {
    welcome()
    playerScore = 0
    computerScore = 0
    playerTurn(numTurns)
}

function endGame() {
    consoleMessage('Thank you for playing!')
}

