/**
 * Main server file.
 */
const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

//allow CORS for frontend
app.use(cors());

//gets .env file so that database credentials are hidden
dotenv.config({path: __dirname + '/.env'});

let con = null;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, currUserId");
    next();
  });
  
/**
 * Initiates when server starts at port 8080.
 */
app.listen(8080, (error) => {
    connectDb();
    if (error) {
        console.log(error);
        return false;
    }
    console.log("server started at port: " + 8080);
});

/**
 * Function to connect server to the database.
 */
function connectDb() {
    con = mysql.createConnection({

        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    });

    con.connect(function (err) {
        console.log("db connected");
        if (err) {
            console.log(err);
            throw err;
        }
    });
}


/**
 * Post method to insert the score into the database.
 */
app.post('/memoryGame/insertscore', (req, resp) => {
    let sql = "INSERT INTO scores(name, score) VALUES('" + req.body.name + "', " + req.body.score + ");";
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            resp.send(result);
        }
    });
});

/**
 * Get method to get the top scores from the database.
 */
app.get('/memoryGame/getTopScores', (req, resp) => {
    console.log("get top scores");
    let sql = "SELECT * FROM scores ORDER BY score DESC LIMIT 5;";
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            let highScores = [];
            for (let i = 0; i < result.length; i++) {
                let currHighScore = {
                    name: result[i].name,
                    score: result[i].score
                };

                highScores.push(currHighScore);
            }
            resp.json(highScores);
        }
    });
});

/**
 * Get method to get the current user's rank out of all scores in the database/leaderboard.
 */
app.get('/memoryGame/getCurrRank', (req, resp) => {
    let sql = "SELECT 1 + COUNT(*) AS 'rank' FROM scores WHERE score > (SELECT score FROM scores WHERE id = " + req.header('currUserId') + ");";

    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            resp.send(result[0]);
        }
    });
});