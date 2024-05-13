import { Player } from "../model/player.mjs";
import {
  validate_fields,
  validate_email,
  validate_alphanumeric,
  validate_phone,
} from "../utils/validate-fields.mjs";
import { getStockValues, getMarketStatus } from "../utils/get-stock.mjs";
import { Game } from "../model/game.mjs";
import { createSampleGame } from "./games.mjs";
const DAYS = 28;

export async function marketStatusResult() {
  let status = await getMarketStatus();
  if (status !== undefined) {
    return status;
  } else {
    return undefined;
  }
}

export async function marketStatus(req, res) {
  let status = await getMarketStatus();
  if (status !== undefined) {
    res.send(status);
  } else {
    res.status(404).send("Market status not found");
  }
}

export async function getNumGames(req, res) {
  let username = req.query.username;
  let arr = [];
  let foundPlayer = await Player.get(username);
  if (foundPlayer.length > 0) {
    for (var i = 0; i < foundPlayer.length; i++) {
      let gameName = foundPlayer[i].games[0];
      arr.push(gameName);
    }
    res.send(arr);
  } else {
    res.status(404).send("No player found with matching credentials");
  }
}

export async function updatePassword(req, res) {
  let username = req.body.username;

  let email = req.body.email;
  let isValidEmail = await validate_email(email);
  let updatedPassword = req.body.newPassword;

  if (isValidEmail) {
    let foundPlayer = await Player.get(username);
    if (foundPlayer.length > 0) {
      for (var i = 0; i < foundPlayer.length; i++) {
        let gameName = foundPlayer[i].games[0];

        let new_player = new Player(
          foundPlayer[i].firstName,
          foundPlayer[i].lastName,
          foundPlayer[i].email,
          foundPlayer[i].contact,
          foundPlayer[i].username,
          updatedPassword,
          foundPlayer[i].isAdmin,
          foundPlayer[i].days,
          foundPlayer[i].games,
          foundPlayer[i].cashAmount,
          foundPlayer[i].stocks
        );
        await Player.updatePassword(
          foundPlayer[i].username,
          gameName,
          email,
          new_player
        );
      }
      res.send("Password updated");
    } else {
      res.status(404).send("No player found with matching credentials");
    }
  } else {
    res.status(401).send("Invalid credentials");
  }
}

export async function loginGame(req, res) {
  let username = req.body.username;

  let password = req.body.password;

  let gameName = req.body.gameName;

  let currPlayer = await Player.getUsernameWithGame(username, gameName);
  if (currPlayer.length > 0) {
    if (currPlayer[0].password === password) {
      var today = new Date();

      let day = 20; //today.getDate()
      let days = DAYS - day;
      let newDays = days;
      if (newDays > 0) {
        let newPlayer = new Player(
          currPlayer[0].firstName,
          currPlayer[0].lastName,
          currPlayer[0].email,
          currPlayer[0].contact,
          currPlayer[0].username,
          currPlayer[0].password,
          currPlayer[0].isAdmin,
          newDays,
          currPlayer[0].games,
          currPlayer[0].cashAmount,
          currPlayer[0].stocks
        );
        await Player.update(username, newPlayer);
        res.send(newPlayer);
      } else {
        let allPlayers = await Player.getAll();
        if (allPlayers.length > 0) {
          var maxCashIndex = 0;
          for (var i = 0; i < allPlayers.length; i++) {
            let currPlayerFromList = allPlayers[i];
            let currPlayerFromListCash = currPlayerFromList.cashAmount;
            let currPlayerFromListStocks = currPlayerFromList.stocks;

            var keys = Object.keys(allPlayers[i].stocks);
            for (var j = 0; j < keys.length; j++) {
              let currStock = keys[j];

              let price = await getStockPriceToBuy(currStock);
              let currStocksNum = parseInt(currPlayerFromListStocks[currStock]);
              let totalPrice = price * currStocksNum;

              currPlayerFromListCash += totalPrice;
            }
            let newPlayer_ = new Player(
              currPlayerFromList.firstName,
              currPlayerFromList.lastName,
              currPlayerFromList.email,
              currPlayerFromList.contact,
              currPlayerFromList.username,
              currPlayerFromList.password,
              currPlayerFromList.isAdmin,
              newDays,
              currPlayerFromList.games,
              currPlayerFromListCash
            );
            await Player.update(currPlayerFromList.username, newPlayer_);
          }

          let allPlayersWithNoStockRemaining = await Player.getAll();
          if (allPlayersWithNoStockRemaining.length > 0) {
            for (var i = 1; i < allPlayersWithNoStockRemaining.length; i++) {
              if (
                allPlayersWithNoStockRemaining[i].cashAmount >
                allPlayersWithNoStockRemaining[maxCashIndex].cashAmount
              ) {
                maxCashIndex = i;
              }
            }
            res.send(
              "Game has been ended, and the winner is " +
                allPlayersWithNoStockRemaining[maxCashIndex].username +
                " with cash amount = " +
                allPlayersWithNoStockRemaining[maxCashIndex].cashAmount
            );
          } else {
            res.status(404).send("No players found");
          }
        } else {
          res.status(404).send("No players found");
        }
      }
    } else {
      res.status(404).send("Incorrect password");
    }
  } else {
    res.status(404).send("Incorrect Username or game name");
  }
}

export async function getPlayerPortfolio(req, res) {
  let username = req.query.username;

  let game = req.query.game;

  if (!game) {
    game = "sample";
  }
  let currPlayer = await Player.getUsernameWithGame(username, game);

  if (currPlayer.length > 0) {
    if (currPlayer) var obj = {};
    obj.cashAmount = currPlayer[0].cashAmount;
    obj.stocks = currPlayer[0].stocks;
    res.send(obj);
  } else {
    res.status(404).send("Player not found");
  }
}
export async function login(req, res) {
  let username = req.body.username;

  let password = req.body.password;

  let currPlayer = await Player.get(username);
  if (currPlayer.length > 0) {
    console.log(currPlayer);
    if (currPlayer[0].password === password) {
      var today = new Date();

      let day = today.getDate();
      let days = DAYS - day;
      let newDays = days;
      if (newDays > 0) {
        let newPlayer = new Player(
          currPlayer[0].firstName,
          currPlayer[0].lastName,
          currPlayer[0].email,
          currPlayer[0].contact,
          currPlayer[0].username,
          currPlayer[0].password,
          currPlayer[0].isAdmin,
          newDays,
          currPlayer[0].games,
          currPlayer[0].cashAmount,
          currPlayer[0].stocks
        );
        await Player.update(username, newPlayer);
        res.send(newPlayer);
      } else {
        let allPlayers = await Player.getAll();
        if (allPlayers.length > 0) {
          var maxCashIndex = 0;
          for (var i = 0; i < allPlayers.length; i++) {
            let currPlayerFromList = allPlayers[i];
            let currPlayerFromListCash = currPlayerFromList.cashAmount;
            let currPlayerFromListStocks = currPlayerFromList.stocks;

            var keys = Object.keys(allPlayers[i].stocks);
            for (var j = 0; j < keys.length; j++) {
              let currStock = keys[j];

              let price = await getStockPriceToBuy(currStock);
              let currStocksNum = parseInt(currPlayerFromListStocks[currStock]);
              let totalPrice = price * currStocksNum;

              currPlayerFromListCash += totalPrice;
            }
            let newPlayer_ = new Player(
              currPlayerFromList.firstName,
              currPlayerFromList.lastName,
              currPlayerFromList.email,
              currPlayerFromList.contact,
              currPlayerFromList.username,
              currPlayerFromList.password,
              currPlayerFromList.isAdmin,
              newDays,
              currPlayerFromList.games,
              currPlayerFromListCash
            );
            await Player.update(currPlayerFromList.username, newPlayer_);
          }

          let allPlayersWithNoStockRemaining = await Player.getAll();
          if (allPlayersWithNoStockRemaining.length > 0) {
            for (var i = 1; i < allPlayersWithNoStockRemaining.length; i++) {
              if (
                allPlayersWithNoStockRemaining[i].cashAmount >
                allPlayersWithNoStockRemaining[maxCashIndex].cashAmount
              ) {
                maxCashIndex = i;
              }
            }
            res.send(
              "Game has been ended, and the winner is " +
                allPlayersWithNoStockRemaining[maxCashIndex].username +
                " with cash amount = " +
                allPlayersWithNoStockRemaining[maxCashIndex].cashAmount
            );
          } else {
            res.status(404).send("No players found");
          }
        } else {
          res.status(404).send("No players found");
        }
      }
    } else {
      res.status(404).send("Incorrect password");
    }
  } else {
    res.status(404).send("Incorrect Username");
  }
}

export async function buyStock(req, res) {
  let qnt = req.query.quantity;
  let symbol = req.query.symbol;
  let username = req.query.username;
  let game = req.query.gameName;

  let isValidQnt = await validate_alphanumeric(qnt);

  let isValidSymbol = await validate_alphanumeric(symbol);

  if (isValidQnt && isValidSymbol) {
    let price = await getStockPriceToBuy(symbol);

    if (price > 0) {
      let marketStatus_ = await marketStatusResult();

      let currGame = await Game.get(game);
      console.log(currGame);

      if (currGame.length > 0) {
        let totalPrice = price * qnt;

        let currPlayer = await Player.getUsernameWithGame(username, game);
        if (currPlayer.length > 0) {
          let currCash = currPlayer[0].cashAmount;

          let currStocks = currPlayer[0].stocks;
          if (currStocks[symbol] !== undefined) {
            currStocks[symbol] = parseInt(currStocks[symbol]) + parseInt(qnt);
          } else {
            currStocks[symbol] = parseInt(qnt);
          }

          if (currCash > totalPrice) {
            currCash = currCash - totalPrice;

            if (marketStatus_ !== undefined) {
              if (marketStatus_ === true) {
                let newPlayer = new Player(
                  currPlayer[0].firstName,
                  currPlayer[0].lastName,
                  currPlayer[0].email,
                  currPlayer[0].contact,
                  currPlayer[0].username,
                  currPlayer[0].password,
                  currPlayer[0].isAdmin,
                  currPlayer[0].days,
                  currPlayer[0].games,
                  currCash,
                  currStocks
                );
                await Player.update(username, newPlayer);
                res.send(newPlayer);
              } else {
                res.status(200).send("Market is closed");
              }
            } else {
              res.status(404).send("Market not found");
            }
          } else {
            res.status(403).send("Not sufficient money");
          }
        } else {
          res.status(404).send("Username not found");
        }
      } else {
        res.status(404).send("Game not found");
      }
    } else {
      res.status(404).send("Stock not found");
    }
  } else {
    res.status(401).send("Invalid credentials");
  }
}
export async function sellStock(req, res) {
  let qnt = req.query.quantity;
  let symbol = req.query.symbol;
  let username = req.query.username;
  let game = req.query.gameName;

  let isValidQnt = await validate_alphanumeric(qnt);
  let isValidSymbol = await validate_alphanumeric(symbol);

  if (isValidQnt && isValidSymbol) {
    let price = await getStockPriceToBuy(symbol);
    if (price > 0) {
      let marketStatus_ = await marketStatusResult();

      let currGame = await Game.get(game);
      console.log(currGame);
      if (currGame.length > 0) {
        let totalPrice = price * qnt;

        let currPlayer = await Player.getUsernameWithGame(username, game);

        if (currPlayer.length > 0) {
          let currCash = currPlayer[0].cashAmount;

          let currStocks = currPlayer[0].stocks;

          if (
            currStocks.hasOwnProperty(symbol) ||
            currStocks[symbol] !== undefined
          ) {
            let currStocksNum = parseInt(currStocks[symbol]);
            if (currStocksNum >= qnt) {
              currCash += totalPrice;
              if (currStocksNum - qnt > 0) {
                currStocks[symbol] = currStocksNum - qnt;
                if (marketStatus_ !== undefined) {
                  if (marketStatus_ === true) {
                    let newPlayer = new Player(
                      currPlayer[0].firstName,
                      currPlayer[0].lastName,
                      currPlayer[0].email,
                      currPlayer[0].contact,
                      currPlayer[0].username,
                      currPlayer[0].password,
                      currPlayer[0].isAdmin,
                      currPlayer[0].days,
                      currPlayer[0].games,
                      currCash,
                      currStocks
                    );
                    await Player.update(username, newPlayer);
                    res.send(newPlayer);
                  } else {
                    res.status(200).send("Market is closed");
                  }
                } else {
                  res.status(404).send("Market not found");
                }
              } else {
                delete currStocks[symbol];
                if (marketStatus_ !== undefined) {
                  if (marketStatus_ === true) {
                    let newPlayer = new Player(
                      currPlayer[0].firstName,
                      currPlayer[0].lastName,
                      currPlayer[0].email,
                      currPlayer[0].contact,
                      currPlayer[0].username,
                      currPlayer[0].password,
                      currPlayer[0].isAdmin,
                      currPlayer[0].days,
                      currPlayer[0].games,
                      currCash,
                      currStocks
                    );
                    await Player.update(username, newPlayer);
                    res.send(newPlayer);
                  } else {
                    res.send("Market is closed");
                  }
                } else {
                  res.status(404).send("Market not found");
                }
              }
            } else {
              res.status(403).send("Not sufficient shares in hand");
            }
          } else {
            res.status(403).send("Zero shares of " + symbol + "available");
          }
        } else {
          res.status(404).send("User not found");
        }
      } else {
        res.status(404).send("Game not found");
      }
    } else {
      res.status(404).send("Stock not found");
    }
  } else {
    res.status(401).send("Invalid credentials");
  }
}

export async function getStockPriceToBuy(symbol) {
  let price = await getStockValues(symbol);

  if (price.o > 0) {
    let openPriceValue = price.o;
    return openPriceValue;
  } else {
    return 0;
  }
}
export async function getStockPrice(req, res) {
  let symb = req.query.symbol;
  let isValidSymbol = await validate_alphanumeric(symb);
  if (isValidSymbol) {
    let price = await getStockValues(symb);
    console.log(price);
    if (price.o > 0) {
      let openprice = price.o;

      if (openprice > 0) {
        res.send(openprice.toString());

        return openprice;
      } else {
        res.status(404).send("No items were found");
      }
    } else {
      res.status(404).send("Stock not found");
    }
  } else {
    res.status(401).send("Invalid symbol");
  }
}

export async function add(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let contact = req.body.contact;
  let username = req.body.username;
  let password = req.body.password; //hash the password
  let admin = req.body.isAdmin !== undefined ? req.body.isAdmin : false;
  let game = req.body.game !== undefined ? req.body.game : "sample";

  let gameList = [];
  let gameCheck = await Game.get(game);

  if (game === "sample") {
    if (!gameCheck.length > 0) {
      await createSampleGame(game);
    }
  } else {
    if (!gameCheck.length > 0) {
      res
        .status(404)
        .send(
          "Game not found, try with an already existing game or don't fill game column to enroll in a sample game"
        );
      return;
    }
  }

  var today = new Date();
  gameList.push(game); //put inside loop
  let day = today.getDate();
  let days = DAYS - day;
  if (days > 0) {
    let isValid = await validate_fields(firstName, lastName, email, contact);

    if (isValid) {
      let checkConflict = await Player.conflictPlayerWithGame(username, game);
      if (checkConflict) {
        res.status(403).send("Player with same username exists");
      } else {
        let new_player = new Player(
          firstName,
          lastName,
          email,
          contact,
          username,
          password,
          admin,
          days,
          gameList
        );
        let msg = await new_player.save();
        res.send(msg);
      }
    } else {
      console.log(
        "The Player was not inserted in the database since it is not valid."
      );
      res
        .status(403)
        .send(
          "Error. The Player was not inserted in the database since it is not valid."
        );
    }
  } else {
    res
      .status(403)
      .send("All games ended, new games starting on the 1st of next month");
  }
}

export async function deleteUser(req, res) {
  let name = req.body.username;
  let gameName = req.body.gameName;
  let email = req.body.email;

  console.log(name, gameName, email);
  let msg = await Player.delete(name, gameName, email);
  console.log(msg);
  if (msg === "Contact was deleted.") {
    res.send("Contact deleted");
  } else {
    res.status(403).send("Invalid credentials");
  }
}

export default { add };
