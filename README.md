## A repository for CS3100 term project

## PROJECT PART3
- NEW ADDITION TO THE PROJECT LAYOUT<BR>
The view folder contains the html and js for the frontend.

## DB AND COLLECTIONS NAMES

- DB: Stock_Exchange
- Collections: Players, Games

## Status of the project

All the features are working perfectly fine
## Video
 
Part 1: https://screenrec.com/share/7irmhb6RqU<br>
Part 2: https://screenrec.com/share/7p9ra6bQdu

## Setup and run frontend

Go to terminal and run node app.js. <br>After the connection is established, open the localhost link and it will lead you to the register page.

## PROJECT PART2
## Layout and architecture

This project follows the MVC structure, hence when an api request is called, the request goes to app.js which forwards the request to the controller. It has specific methods to deal with various specific problems, the controller then calls the model's methods to perform the CRUD functionality and sends the response to app.js which inturn sends it back to the user. <br>The controller folder contains games.mjs and players.mjs. The model folder contains player.mjs and game.mjs.<br> The utils folder contains db.mjs which has methods to make and close db connection. It has get-stock.mjs which is responsible for calling our external api to get the stock quotes, market status. Validate-fields.mjs is responsible for doing the validations, making sure the inputs are correct. <br> The tests folder contains all the unit tests which makes sure our api's calls and functionality is correct.<br> The view folder contains the html and js for the frontend.

## ADDITIONAL FEATURES
1. Reset Password: player can update their password
2. Market Status: player can only perform buy/sell action when market is open

## API Services
1. /register: POST http://localhost:3000/register<br>This is the endpoint for registering players. This calls the add method in the controller/players.mjs to perform the register functionality. When the player hits this endpoint, they need to provide the registeration credentials in form of json data. If the player provides with an already existing game, then the player will be registered in that game, otherwise it will be automatically registered in a sample game. Unit tests associated with this functionality are: tests/test-cases.js 1-5.
#### Features covered: 
* register players for the game
* provide all players a starting cash account in their portfolio
* admin users that can create games

   
2. /getStockPrice: GET  http://localhost:3000/getStockPrice?symbol=*symbol*<br>This is the endpoint for getting stock price. The user needs to provide a symbol for stock lookup and if the symbol exists, this will provide with the open price of that stock for that day. Our game doesn't provide with functionality like high price, low price but it considers open price as the price of the stock for that day. The player needs to provide the symbol in the form of params. The unit tests associated with this functions are tests/test-cases.js 6-8.
#### Features covered:
* Prerequisite for buy/sell feature


3. /buy: POST http://localhost:3000/buy?quantity=*qnt*&symbol=*symbol*&username=*username*&gameName=*gamename*<br>This is the endpoint for buying a stock. The player needs to provide the valid stock quantity, symbol, their username and the name of the game in which they want to buy the stock(later when we will implement the frontend too, this thing will work such as if the player is registered in one game, it will automatically take that game as the game name for this request). It then verifies everything whether every input is valid or not, if the user and game exists or not and on that basis if everything works out to be fine, then it checks the market status, if the market is open then the stocks with quantity are added to the player and their cash is reduced by the same amount but otherwise it gives that market is closed. The unit tests associated with this are tests/test-cases.js 9-14.
#### Features covered:
* allow player buy action at the current NYSE prices

4. /sell: POST http://localhost:3000/sell?quantity=*qnt*&symbol=*symbol*&username=*username*&gameName=*gamename*<br>This is the endpoint for selling a stock. The player needs to provide the valid stock quantity, symbol, their username and the name of the game in which they want to buy the stock(later when we will implement the frontend too, this thing will work such as if the player is registered in one game, it will automatically take that game as the game name for this request). It then verifies everything whether every input is valid or not, if the user and game exists or not and on that basis if everything works out to be fine, then it checks the market status, if the market is open then the stocks with quantity are reduced from the player portfolio and their cash is increased by the same amount but otherwise it gives that market is closed. The player can only sell the stocks <= the amount of stocks they currently have otherwise an error will be thrown. The unit tests associated with this are tests/test-cases.js 15-20.
#### Features covered:
* allow player sell action at the current NYSE prices


5. /login: POST http://localhost:3000/login<br>This is the endpoint for login. The player needs to provide username and password as json, and if the credentials are valid and match in the db, then the player will be in the game. Everytime this endpoint is hit, the player will be logged in the sample game, then if they want to join a specific game, they can use the endpoint /loginGame. The unit tests associated with this are: 21-23.
#### Features covered:
* maintain player login and profile information
* keep track of each player's portfolio and its value
* declare a winner at the end of the game


6. /createGame: POST http://localhost:3000/createGame?Name=*mygame*&creatorusername=*USERNAME_WITH_ADMIN_ACCESS*&description=*description*<br>This is the endpoint for creating a new game. The player needs to provide game name(which should be unique for every game otherwise exception will be thrown), username(which must have admin access), and a small description about the game. If the name doesn't exists earlier and the user is an admin, then a new game will be created. The unit tests for this one are tests/test-cases.js 24-27.
#### Features covered:
* admin users that can create games


7. /getAllGames: GET http://localhost:3000/getAllGames<br>This the endpoint for getting all the existing games. The player needs no parameters or nothing, just hit this endpoint and this will return all the existing games. The unit tests associated are: tests/test-cases.js 28,29.
#### Features covered:
* Allows to view all available games


8. /getGame: GET http://localhost:3000/getGame?Name=*GAME_NAME*<br>This is the endpoint for getting an existing game, the player needs to provide the game name as params and if they game exists, then it will be returned with all the information like description, admin. If the game name doesn't exists in the db, then our server will notify the player. Unit tests associated with this one are: tests/test-cases.js 30,31
#### Features covered:
* Allows to view specific game


9. /resetPassword: POST http://localhost:3000/resetPassword <br>This is the endpoint for resetting the password. The player needs to provide username, email, new_password and if there is a match found for the given username and email, then the password for that specific record will be updated. The unit tests associated with this are: tests/test-cases.js 32-34
#### Features covered:
* Additional Feature 1 - Allows player to update password


10. /getUserRegisteredGames: GET http://localhost:3000/getUserRegisteredGames?username=*username*<br>This is the endpoint for getting the list of games the user is registered in. It will confirm if there is a match for the given user and if there is, then it will provide the list of games associated with the user. The test cases associated are: tests/test-cases.js 35,36.
#### Features covered:
* List of games a player is registered in


11. /loginGame: POST http://localhost:3000/loginGame<br>This is the endpoint for login in game. The player needs to provide username, password and game name as json, and if the credentials are valid and match in the db, then the player will be in the specific game. The unit tests associated with this are: 37-39.
#### Features covered:
* Allows player to login in a chosen game(if game exists)
* keep track of each player's portfolio and its value



12. /marketStatus: GET http://localhost:3000/marketStatus<br>This is the endpoint for getting the market status. It fetches the market status from our external API and returns true or false. Purchases(buy or sell action) can only be made during the time when market is open, otherwise the user will get something like market is closed. The unit test associated with it is tests/test-cases.js: 40.
#### Features covered:
* Additional Feature 2 - Tells market status(open or close), player can buy/sell depending upon the market status.



## Setup and run server
Use node app.js for running the server and then you can use postman to hit any endpoint. For unit testing, it's the same thing first make sure that the server is running, then use *npx mocha tests/test-cases.js*. 
