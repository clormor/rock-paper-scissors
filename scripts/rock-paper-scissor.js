/** Number of rounds in a game*/
const roundsPerGame = 5
/** Number of rounds played so far */
let roundsPlayed = 0
/** Counter to hold the id of the currently active input prompt */
let currentPromptId = 0
/** Track each player's score */
let playerScore = 0, computerScore = 0

/** Base ID string. Combined with ${currentPromptId} to create a CSS id */
const promptIdBase = 'console-input-'
/** CSS class for input prompts, to give a console look and feel */
const promptClass = 'console-prompt'
/** Possible choices in the game */
const possibleChoices = ['rock', 'paper', 'scissors']

/**
 * Determine the winner in a game rock paper scissors
 * @param {number} playerChoice The player's choice
 * @param {number} computerChoice The computer's choice
 * @returns >0 if the player wins, <0 if the computer wins, 0 for a tie
 */
let compareChoices = (playerChoice, computerChoice) => {
    playerChoice = parseChoice(playerChoice)
    computerChoice = parseChoice(computerChoice)

    if (playerChoice === computerChoice) {
        return 0
    }

    if (playerChoice === 'rock') {
        return (computerChoice === 'scissors') ? 1 : -1
    }

    if (playerChoice === 'paper') {
        return (computerChoice === 'rock') ? 1 : -1
    }

    if (playerChoice === 'scissors') {
        return (computerChoice === 'paper') ? 1 : -1
    }
}

/**
 * Parse a choice to ensure that it is valid (e.g. 'rock', 'paper', 'scissors' or an acceptable variant)
 * @param {string} choice The choice to parse
 * @returns The parsed choice (guaranteed to be strictly equal to 'rock', 'paper' or 'scissors') or undefined
 */
function parseChoice(choice) {
    let result = possibleChoices.find(e => e === choice.trim().toLowerCase())
    if (result) {
        return result
    }
}

/**
 * Initiate a computer's turn at rock paper scissors
 * @returns The randomised choice made by the computer
 */
function computerTurn() {
    let randomIndex = Math.floor(Math.random() * possibleChoices.length)
    let randomSelection = possibleChoices[randomIndex]
    return randomSelection
}

/**
 * Get the console (this is the section of the page which is designed to mimick a command-line terminal)
 * @returns The console element on the current page - there should be exactly one of these
 */
function getConsole() {
    let consoleElements = document.getElementsByClassName('console')
    if (consoleElements.length != 1) {
        console.log('Error: Could not find a unique console element in the current page')
        return
    }
    return consoleElements[0]
}

/**
 * Write a message to the console
 * @param {string} message The message to display on the console
 */
function writeToConsole(message) {
    let para = document.createElement('p')
    para.append(generateMessage(message))
    getConsole().append(para)
}

/**
 * @returns The currently active input element (there should only ever be one that we care about)
 */
function getCurrentPrompt() {
    return document.getElementById(promptIdBase + currentPromptId)
}

/**
 * Prompt the user to perform the next appropriate action
 * @param {string} message An optional message to display before the prompt
 */
function promptNextAction(message) {
    writeToConsole(message)
    if (roundsPlayed >= roundsPerGame) {
        writeOverallResult()
        promptPlayAgain()
    } else {
        promptPlayerTurn()
    }
}

/**
 * Prompt the player to take their turn in a game of rock paper scissors
 */
function promptPlayerTurn() {
    let message = 'Round ' + (roundsPlayed + 1) + '. Enter choice [rock/paper/scissors]'
    promptUser(message, parsePlayerChoiceOnEnter)
}

/**
 * Add a new user prompt to the console
 * @param {string} message The message to display before the input
 * @param  {...any} onKeyUp The function(s) to execute on 'keyup' events on the input
 */
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

/**
 * Perform an action only after the user presses Enter
 * @param {event} event The event that fired
 * @param {Function} onEnter The function to execute if the event was triggered by the Enter key
 */
function performOnEnter(event, onEnter) {
    if (event.key === 'Enter') {
        onEnter()
    }
}

/**
 * Function callback to parse the player's choice when they press Enter
 * @param {event} event The event that fired
 */
function parsePlayerChoiceOnEnter(event) {
    performOnEnter(event, parsePlayerChoice)
}

/**
 * Function callback to decide whether or not to restart the game when the user presses Enter
 * @param {event} event The event that fired
 */
function parseRestartOnEnter(event) {
    performOnEnter(event, parseRestart)
}

/**
 * Process a yes / no response and decide whether to start a new game or quit
 */
let parseRestart = () => parseYesOrNo(startGame, endGame, promptPlayAgain)

/**
 * Process a yes / no response and decide how to proceed
 * @param {Function} onYes Executed if the response is parsed as 'yes'
 * @param {Function} onNo Executed if the response is parsed as 'no'
 * @param {Function} onUnrecognised Executed if the response cannot be parsed
 */
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

/**
 * Prompts the to see if they'd like to play another game
 */
function promptPlayAgain() {
    promptUser('Would you like to play again? [yes/no]', parseRestartOnEnter)
}

/**
 * Create a label to store a console message, and add it to the given parent element
 * @returns The newly-created label element
 */
function generateMessage(message) {
    let label = document.createElement('label')
    label.textContent=message
    return label
}

/**
 * Create a label to store a console prompt, and add it to the given parent element
 * @returns The newly-created label element
 */
let generatePromptMessage = (message) => generateMessage('> ' + message + ': ')

/**
 * Create an input prompt with associated functions that fire when a key is released
 * @returns The newly-created input element
 */
function generatePromptInput(parent, ...onKeyUp) {
    // create the input and add appropriate style attributes
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', promptClass)
    input.setAttribute('autocomplete', 'false')
    input.setAttribute('spellcheck', 'false')

    // set this input to be the current input that will be read from next
    input.setAttribute('id', promptIdBase + ++currentPromptId)

    // fix the caret position to the end of the input (for a console look and feel)
    let caretChangedEvents = ['click', 'select', 'change', 'keydown', 'keyup']
    caretChangedEvents.forEach(event => input.addEventListener(event, fixCaretPosition))

    // add the provided function callbacks as event listeners
    onKeyUp.forEach(f => input.addEventListener('keyup', f))

    return input
}

/**
 * Fix the caret position to the end of the input
 */
function fixCaretPosition() {
    this.focus()
    let setCaretPosition = this.value.length
    this.selectionStart = setCaretPosition
    this.selectionEnd = setCaretPosition
}

/**
 * Get the contents of the current input prompt
 * @returns The text contained in the active input prompt
 */
function readCurrentPrompt() {
    let currentPrompt = getCurrentPrompt()
    // disable the input from future edits
    currentPrompt.setAttribute('disabled', 'disabled')
    // return its text content
    return currentPrompt.value
}

/**
 * Process the player's choice and decide how to proceed 
 */
function parsePlayerChoice() {
    let playerChoice = readCurrentPrompt()
    playerChoice = parseChoice(playerChoice)
    if (playerChoice) {
        // if the choice was valid, play out the round
        playRound(playerChoice)
    } else {
        // if the choice was invalid, alert the user and re-prompt
        promptNextAction('Unrecgonised Input.')
    }
}

/**
 * Given a valid player choice, play a round of rock paper scissors against the computer
 */
function playRound(playerChoice) {
    let computerChoice = computerTurn()
    let result = compareChoices(playerChoice, computerChoice)
    updateScores(result)
    writeResultOfRound(result, computerChoice)
    roundsPlayed++
    promptNextAction()
}

/**
 * Update the global score variables based on a round result
 * @param {number} result The result of a round
 */
function updateScores(result) {
    if (result > 0) {
        playerScore++
    }
    if (result < 0) {
        computerScore++
    }
}

/**
 * Display a message to the console based on the result of a round
 */
function writeResultOfRound(result, computerChoice) {
    let message = 'Computer chose ' +
        computerChoice +
        '... ' +
        generateResultMessage(result)
    writeToConsole(message)
}

/**
 * Construct a string to congratulate or console a user based on a given result
 * Assumes the user has won if the result is >0, and lost if the result is <0.
 * @param {number} result The result of either a round or an overall result of several rounds
 * @returns An appropriate message in the form of a string
 */
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

/**
 * Display an overall result message in the console, scoring all rounds of the game
 */
function writeOverallResult() {
    writeToConsole('The results are in... ' + generateOverallResultMessage())
}

/**
 * Generate a message based on the overall aggregate score of all rounds
 * @returns An appropriate message in the form of a string
 */
function generateOverallResultMessage() {
    return generateResultMessage(playerScore - computerScore)
}

/**
 * Starts a new game of rock paper scissors
 */
function startGame() {
    playerScore = 0
    computerScore = 0
    roundsPlayed = 0
    promptNextAction('Let\'s play a game of rock paper scissors! Best of ' + roundsPerGame + '...')
}

/**
 * Ends the game
 */
function endGame() {
    writeToConsole('Thank you for playing!')
}
