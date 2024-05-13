import { getDb } from "../utils/db.mjs";

async function _get_games_collection() {
  let db = await getDb();
  return await db.collection("Games");
}

class Game {
  constructor(Name, creatorusername, description) {
    this.Name = Name;
    this.creatorusername = creatorusername;
    this.description = description;
  }

  async save() {
    try {
      let collection = await _get_games_collection();
      let mongoObj = await collection.insertOne(this);
      console.log(
        "1 game was inserted in the database with id -> " + mongoObj.insertedId
      );

      return "Game correctly inserted in the Database.";
    } catch (err) {
      throw err;
    }
  }

  static async insert(obj) {
    let collection = await _get_games_collection();
    const game = await collection.insertOne({
      Name: obj.Name,
      creatorusername: obj.creatorusername,
      description: description,
    });
    if (game) {
      return true;
    } else {
      return false;
    }
  }
  static async conflictGame(Name) {
    let collection = await _get_games_collection();
    const game = await collection.findOne({ Name: Name });
    if (game) {
      return true;
    } else {
      return false;
    }
  }
  static async getAll() {
    let collection = await _get_games_collection();
    let objs = await collection.find({}).toArray();
    return objs;
  }

  static async get(Name) {
    let collection = await _get_games_collection();

    let obj = await collection.find({ Name: Name }).toArray();

    return obj;
  }

  static async update(Name, new_game) {
    let collection = await _get_games_collection();
    let new_vals = {
      $set: {
        Name: new_game.Name,
        createrusername: new_game.createrusername,
        description: new_game.description,
      },
    };
    let obj = await collection.updateOne({ Name: Name }, new_vals);
    if (obj.modifiedCount > 0) {
      return "Game correctly updated.";
    } else {
      return "Game was not updated";
    }
  }

  static async delete(Name) {
    let collection = await _get_games_collection();
    let obj = await collection.deleteOne({ Name: Name });
    if (obj.deletedCount > 0) {
      return "Game was deleted.";
    } else {
      return "Game was not found";
    }
  }
}

const _Game = Game;
export { _Game as Game };
