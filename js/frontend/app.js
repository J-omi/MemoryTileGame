/**
 * App.js frontend file for index.html
 * Includes all the game logic as well as uses the star wars api to get a random
 * character. 
 */

// Initialize the base statistics for the memory game 
let gameStatistics = {
    gridYSize: 3,
    gridXSize: 3,
    goodTileAmt: 3,
    get totalTiles() {
        return this.gridXSize * this.gridYSize;
    },
    currEnemy: "",
    lives: 3,
    userFailedLast: false,
    score: 0
};

// Array of the tiles that are needed to be pressed.
let goodTiles = [];
// Array of the tiles that the user clicked.
let userClickedTiles = [];
// Array of the tiles that user was correct on.
let userClickedGoodTiles = [];

setupGame();

/**
 * Function to setup the memory game.
 */
function setupGame() {
    gameStatistics.userFailedLast = false;
    generateGrid();
    assignGoodTiles();
    displayGoodTiles();
    generateEnemy();
    setTimeout(hideGoodTiles, 3800);
    setTimeout(function () {
        rotateGame(90);
        makeTileClickable();
    }, 4000);
}


/**
 * Generate the grid according to the size stated by the gameStatistics and display it on the page.
 */
function generateGrid() {
    let currTile = 0;
    for (let x = 0; x < gameStatistics.gridXSize; x++) {
        for (let y = 0; y < gameStatistics.gridYSize; y++) {
            let tile = document.createElement(DIV);
            tile.className = TILE;
            tile.id = TILE + currTile;
            document.getElementById(MEMORY_GAME).appendChild(tile);
            currTile++;
        }

        let breakElement = document.createElement(br);
        document.getElementById(MEMORY_GAME).appendChild(breakElement);
    }
}

/**
 * Returns a random integer in rnage of min and max. 
 * @param min - lowest possible value
 * @param max - highest value 
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets a character from the star wars api (index 1-87) and displays it on the html page.
 */
function generateEnemy() {
    let randomEnemy = getRandomInt(1,87);
    let characterSearch = "https://swapi.co/api/people/" + randomEnemy;
    let httpXml = new XMLHttpRequest();

    httpXml.responseType = jsonType;
    httpXml.open(getMethod, characterSearch); 
    httpXml.onreadystatechange = () => {
        if (httpXml.readyState === 4 && httpXml.status === 200) {
            let enemyName = httpXml.response.name;
            document.getElementById(CHALLENGER).innerHTML = CHALLENGER_OUTPUT + enemyName;
            gameStatistics.currEnemy = "" + enemyName;
        } else {
            gameStatistics.currEnemy = "Enemy not found";
        }
    };
    httpXml.send();
    document.getElementById(CHALLENGER).innerHTML = CHALLENGER_OUTPUT + gameStatistics.currEnemy;

}

/**
 * Makes all tiles in the grid clickable by adding an event listener. Calls helper function to check if clicked tile is valid.
 */
function makeTileClickable() {
    for (let i = 0; i < gameStatistics.totalTiles; i++) {
        let currTile = TILE + i;
        document.getElementById(currTile).addEventListener(CLICK_EVENT, function (event) {
            checkUserClick(currTile);
        });
    }
}

/**
 * Assigns the tiles in the grid that need to be clicked to progress in the game. 
 */
function assignGoodTiles() {
    goodTiles = [];
    for (let i = 0; i < gameStatistics.goodTileAmt; i++) {
        let randomTile = TILE + getRandomInt(0, (gameStatistics.totalTiles - 1));
        while (goodTiles.includes(randomTile)) {
            randomTile = TILE + getRandomInt(0, (gameStatistics.totalTiles - 1));
        }
        goodTiles[i] = randomTile;
    }
    goodTiles = goodTiles.sort(sortArray);
}

/**
 * Function to compare elements in array to be used by sort().
 * @param a - first element
 * @param b - second element
 */
function sortArray(a, b) {
    let _a = a.slice(4, a.length);
    let _b = b.slice(4, b.length);
    return _a - _b;
}

/**
 * Display the valid tiles in green.
 */
function displayGoodTiles() {
    for (let i = 0; i < goodTiles.length; i++) {
        let currGoodTile = goodTiles[i];
        document.getElementById(currGoodTile).style = BACKGROUND_GREEN;
    }
}

/**
 * Hides the valid tiles from green background to no background.
 */
function hideGoodTiles() {
    for (let i = 0; i < goodTiles.length; i++) {
        let currGoodTile = goodTiles[i];
        document.getElementById(currGoodTile).style = BACKGROUND_NONE;
    }
}

/**
 * Rotate the memory game.
 * @param deg - amount of degrees to rotate.
 */
function rotateGame(deg) {
    let gameDiv = document.getElementById(MEMORY_GAME);
    gameDiv.style.webkitTransform = ROTATE + deg + DEGREE;
    gameDiv.style.mozTransform = ROTATE + deg + DEGREE;
    gameDiv.style.msTransform = ROTATE + deg + DEGREE;
    gameDiv.style.oTransform = ROTATE + deg + DEGREE;
    gameDiv.style.transform = ROTATE + deg + DEGREE;
}

/**
 * Check if the tile the user clicks is a valid tile.
 * If tile is correct it will colour it green.
 * If it is wrong the game will refresh and a life will be lost. Function also checks score to ensure user has not lost.
 * @param  id - the id of the tile that is being clicked.
 */
function checkUserClick(id) {
    if (goodTiles.includes(id)) {
        document.getElementById(id).style = BACKGROUND_GREEN;
        if (!userClickedGoodTiles.includes(id)) {
            userClickedTiles.push(id);
            userClickedGoodTiles.push(id);
            userClickedGoodTiles.sort(sortArray);
            updateScore();
        }
        if (JSON.stringify(goodTiles) === JSON.stringify(userClickedGoodTiles)) levelRefresh();
    } else {
        document.getElementById(id).style = BACKGROUND_RED;
        userClickedTiles.push(id);
        updateLives(-1);
        gameStatistics.userFailedLast = true;
        checkScore();
        levelRefresh();
    }
}

/**
 * Increase and update the score in the html.
 */
function updateScore() {
    gameStatistics.score++;
    document.getElementById(SCORE).innerHTML = SCORE_OUTPUT + gameStatistics.score;
}

/**
 * Deduct a life point.
 * @param  a - life decreases if value is below 0
 */
function updateLives(a) {
    if (a < 0) {
        gameStatistics.lives--;
        document.getElementById(LIVES).innerHTML = LIVES_OUTPUT + gameStatistics.lives;
    }
}

/**
 * Grid is recreated and ensures that the grid does not get too large.
 */
function levelRefresh() {
    userClickedTiles = [];
    userClickedGoodTiles = [];
    if (gameStatistics.userFailedLast === false) {
        if (gameStatistics.gridXSize < 7 || gameStatistics.gridYSize < 7) {
            if (gameStatistics.gridXSize === gameStatistics.gridYSize) {
                gameStatistics.gridYSize++;
            } else {
                gameStatistics.gridXSize++;
            }
            gameStatistics.goodTileAmt++;
        }
    } 
    remakeGrid();
    setTimeout(setupGame, 1000);
}

/**
 * Reset the grid and make a sound after completing the level.
 */
function remakeGrid() {
    document.getElementById(MEMORY_GAME).innerHTML = blankQuotes;
    let sound = new Audio(sound_file);
    rotateGame(0);
    sound.play();
}

/**
 * Checks to see if user does not have a negative score or 0 lives.
 */
function checkScore() {
    if (gameStatistics.score <= 0 || gameStatistics.lives <= 0) {
        terminate();
    }
}

/**
 * Button press will show prompt to end the game.
 */
function terminateBtn() {
    let confirmTerminate = confirm(END_PROMPT);
    if (confirmTerminate === true) {
        terminate();
    }
}

/**
 * Ends the game and sends data to the sessionStorage.
 */
function terminate() {
    sessionStorage.setItem(ENEMY_NAME, gameStatistics.currEnemy);
    sessionStorage.setItem(SCORE, gameStatistics.score);
    window.location.href = SUMMARY_page;
}