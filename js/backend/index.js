const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
app.use(cors());

let con = null;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, currUserId");
    next();
  });
  

app.post('/memoryGame/insertscore', (req, resp) => {
    let sql = "INSERT INTO scores(name, score) VALUES('" + req.body.name + "', " + req.body.score + ");";
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(result);
            resp.send(result);
        }
    });
});

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
            console.log(highScores);
            resp.json(highScores);
        }
    });
});

app.get('/memoryGame/getCurrRank', (req, resp) => {
    console.log("curr user rank");
    console.log(req.header('currUserId'));
    let sql = "SELECT 1 + COUNT(*) AS 'rank' FROM scores WHERE score > (SELECT score FROM scores WHERE id = " + req.header('currUserId') + ");";

    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            
            console.log(result[0]);
            resp.send(result[0]);
        }
    });
});


app.listen(8080, (error) => {
    connectDb();
    if (error) {
        console.log(error);
        return false;
    }
    console.log("server started at port: " + 8080);
});

function connectDb() {
    con = mysql.createConnection({

        host: "localhost",
        user: "joy",
        password: "admin",
        database: "memoryGame"
    });

    con.connect(function (err) {
        console.log("db connected");
        if (err) {
            console.log(err);
            throw err;
        }
    });
}