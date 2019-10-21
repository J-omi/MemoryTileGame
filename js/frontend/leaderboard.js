let currUser;
init();

/**
 * Initializes the leaderboard. 
 * Uses helper function to get the top scores and the current users rank.
 */
function init() {
    currUser = sessionStorage.getItem(cUserId);
    getTopScores();
    getCurrentUserRank();
}

/**
 * Calls on node api to get the top 5 scores for the game.
 */
function getTopScores() {
    let httpXml = new XMLHttpRequest();

    httpXml.responseType = jsonType;
    httpXml.open(getMethod, topScoreExt); 
    httpXml.onreadystatechange = () => {
        if (httpXml.readyState === 4 && httpXml.status === 200) {
            for (let i = 0; i < httpXml.response.length; i++) {
                let list = document.createElement(listElement);

                list.innerHTML = httpXml.response[i].name + doubleDash + httpXml.response[i].score;
                document.getElementById(highscores).appendChild(list);
            }
        }
    };
    httpXml.send();
}

/**
 * Calls node api to get the current users rank out of all users.
 */
function getCurrentUserRank() {
    let httpXml = new XMLHttpRequest();

    httpXml.responseType = jsonType;
    httpXml.open(getMethod, currRankExt); 
    httpXml.setRequestHeader(contentType, appJson);
    httpXml.setRequestHeader(cUserId, currUser);
    httpXml.onreadystatechange = () => {
        if (httpXml.readyState === 4 && httpXml.status === 200) {
            let userName = sessionStorage.getItem(cUserName);
            let userScore = sessionStorage.getItem(cUserScore);
            document.getElementById(userScoreId).innerHTML = httpXml.response.rank + period + userName + doubleDash + userScore;
        }
    };

    httpXml.send();
}
