import { Game } from "../model/game.mjs";
import { Player } from "../model/player.mjs";

export async function addGame(req, res) {
  let Name = req.query.Name;
  let creatorusername = req.query.creatorusername;
  let description = req.query.description;

  console.log(Name, creatorusername, description);
  let player = await Player.get(creatorusername);

  if (player.length > 0) {
    if (player[0].isAdmin) {
      let new_game = new Game(Name, creatorusername, description);

      let checkConflict = await Game.conflictGame(Name);

      if (checkConflict) {
        res.status(403).send("A game with same name already exists");
      } else {
        let msg = await new_game.save();

        res.send(msg);
      }
    } else {
      res
        .status(403)
        .send("Forbidden! Don't have admin access to create a new game");
    }
  } else {
    res
      .status(404)
      .send("Player with username " + creatorusername + " not found");
  }
}

export async function createSampleGame(Name) {
  let name = Name;
  let username = "Admin";
  let description = "A sample game";

  let new_game = new Game(name, username, description);
  await new_game.save();
}

export async function getAllGames(req, res) {
  let games = await Game.getAll();
  if (games.length > 0) {
    res.send(games);
  } else {
    res.status(404).send("No games found");
  }
}

export async function getGame(req, res) {
  let name = req.query.Name;

  let game = await Game.get(name);
  if (game.length > 0) {
    res.send(game);
  } else {
    res.status(404).send("Game not found");
  }
}

export async function deleteGame(req, res) {
  let name = req.query.name;
  console.log(name);
  let msg = await Game.delete(name);
  console.log(msg);
  if (msg === "Game was deleted.") {
    res.send("Game deleted");
  } else {
    res.status(404).send("Game not found");
  }
}
