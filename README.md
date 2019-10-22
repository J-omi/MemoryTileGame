# MemoryTileGame

## Goal of the Game
The goal of the game is to memorize the green tiles in a grid which will disappear and rotate so that it tests the user's memory. As the user gets more answers correct, the game grid gets progressively larger and more difficult. 

## Summary
This is a memory tile game that I had developed myself using HTML/CSS, Bootstrap, JavaScript, MySQL, and Node.js/Express. I refined the code a bit to add some features while also cleaning up any leftover user tests that I had. Some things I added were: additional game logic fixes, incorporating lives in the game, hiding the database credentials by using environment variables, as well as using swapi to generate a random enemy that you face.

## SWapi
I incorporated the Star Wars api by making a random character show up as an enemy in the game. When the user loses, it shows them which character was last faced before the game ended. I did notice that sometimes the api does take a bit of time to get a character. To improve this from a UI perspective I would: 
- Ensure that the game grid won't be displayed until the swapi has loaded because sometimes the game will load before a character is retrieved from swapi. I would also add a loading wheel to show the user that something is loading

## What could be improved
As this is a small project, there are several things I would improve if this was an industry project. Some of these would include: 
- Improving the UI of the game to make it more clean and implementing visuals from Star Wars
- Separating the game logic in multiple files instead of one for clearer code and future development
- Make it more satisfying when user completes a level (currently there is a blaster sound from Star Wars when a level is complete)
- If the server was larger I would move backend database logic into another file and have the main index.js 'require' them
- Improve game on mobile and smaller screens
- Make api more reliable by dealing with possible database errors
- Handle any HTTP errors and server errors in the front end
- Make the game less vulnerable to changing the scores

## Running the game
The game can be run locally if interested as it doesn't require the node server until after the game is done and the user is wanted to submit their score into the database/server. [I also hosted the frontend on my website](http://joygomi.com/memoryTiles.html) (Be aware there is a sound effect and it is best run on larger screens).
