/**
 * Summary.js frontend file for summary.html
 * Shows summary of stats for the user that just played the game and allows user to
 * submit their score.
 */

let finalScore;
gameSummary();

/**
 * Initializes the summary of the game. 
 * Gets the sessionStorage variables for the score and the enemy name.
 * Updates the html to have proper results.
 */
function gameSummary() {
    finalScore = sessionStorage.getItem(SCORE);
    let enemy = sessionStorage.getItem(ENEMY_NAME);
    document.getElementById(finalScoreText).innerHTML += finalScore;
    document.getElementById(finalEnemy).innerHTML += enemy;
}

/**
 * Function to submit the scores to the database.
 */
function submitScore() {
    submitToDb();
}

/**
 * Sets the user scores to the session storage.
 */
function getUserRecord() {
    sessionStorage.setItem(cUserName, document.getElementById(inputBox).value);
    sessionStorage.setItem(cUserScore, finalScore);
}

/**
 * Posts to the api to be added to the database.
 */
function submitToDb() {
    getUserRecord();
    let httpXml = new XMLHttpRequest();

    let reqBody = {
        name: document.getElementById(inputBox).value,
        score: finalScore
    };

    httpXml.responseType = jsonType;
    httpXml.open(postMethod, insertScoreExt); 
    httpXml.setRequestHeader(contentType, appJson);

    httpXml.onreadystatechange = () => {
        if (httpXml.readyState === 4 && httpXml.status === 200) {
            let id = httpXml.response.insertId;
            sessionStorage.setItem(cUserId, id);
            window.location.href = leaderboardPage;
        }
    };
    httpXml.send(JSON.stringify(reqBody));
}

