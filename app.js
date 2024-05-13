import express, { json, urlencoded } from "express";
import { connectToDB, closeDBConnection } from "./utils/db.mjs";
import {
  add,
  getStockPrice,
  buyStock,
  sellStock,
  login,
  updatePassword,
  deleteUser,
  getNumGames,
  loginGame,
  marketStatus,
  getPlayerPortfolio,
} from "./controller/players.mjs";

import {
  addGame,
  getAllGames,
  getGame,
  deleteGame,
} from "./controller/games.mjs";

import session from "express-session";

import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/view"));

var server;

app.use(
  session({
    secret: "wild thing",
    resave: false,
    saveUninitialized: false,
  })
);

async function createServer() {
  try {
    await connectToDB();
    app.post("/register", add);
    app.get("/getStockPrice", getStockPrice);
    app.post("/buy", buyStock);
    app.post("/sell", sellStock);
    app.post("/login", login);
    app.post("/createGame", addGame);
    app.get("/getAllGames", getAllGames);
    app.get("/getGame", getGame);
    app.post("/resetPassword", updatePassword);
    app.post("/deleteContact", deleteUser);
    app.post("/deleteGame", deleteGame);
    app.get("/getUserRegisteredGames", getNumGames);
    app.post("/loginGame", loginGame);
    app.get("/marketStatus", marketStatus);
    app.get("/portfolio", getPlayerPortfolio);

    //client routes
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/view/register.html");
    });

    server = app.listen(port, () => {
      console.log("App listening at http;//localhost:%d", port); //DO CLOSE CONNECTION SIGINT
    });
  } catch (err) {
    console.log(err);
  }
}
createServer();

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  console.log("Closing Mongo Client.");
  server.close(async function () {
    let msg = await closeDBConnection();
    console.log(msg);
  });
});
