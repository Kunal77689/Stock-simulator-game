import { getDb } from "../utils/db.mjs";
import { getStockValues } from "../utils/get-stock.mjs";

async function _get_players_collection() {
  let db = await getDb();
  return await db.collection("Players");
}

class Player {
  constructor(
    firstName,
    lastName,
    email,
    contact,
    username,
    password,
    isAdmin = false,
    days = 0,
    games = ["Sample game"],
    cashAmount = 1000000,
    stocks = {}
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contact = contact;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
    this.days = days;
    this.games = games;
    this.cashAmount = cashAmount;
    this.stocks = stocks;
  }

  async save() {
    try {
      let collection = await _get_players_collection();
      let mongoObj = await collection.insertOne(this);
      console.log(
        "1 Contact was inserted in the database with id -> " +
          mongoObj.insertedId
      );

      return "Contact correctly inserted in the Database.";
    } catch (err) {
      throw err;
    }
  }

  static async conflictPlayer(username) {
    let collection = await _get_players_collection();
    const user = await collection.findOne({ username: username });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  static async conflictPlayerWithGame(username, gameName) {
    let collection = await _get_players_collection();
    const user = await collection.findOne({
      username: username,
      games: { $in: [gameName] },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  static async getAll() {
    let collection = await _get_players_collection();
    let objs = await collection.find({}).toArray();
    return objs;
  }

  static async get(username) {
    let collection = await _get_players_collection();

    let obj = await collection.find({ username: username }).toArray();
    return obj;
  }
  static async getUsernameWithGame(username, gameName) {
    let collection = await _get_players_collection();

    let obj = await collection
      .find({ username: username, games: { $in: [gameName] } })
      .toArray();
    return obj;
  }

  static async update(username, new_player) {
    let collection = await _get_players_collection();

    let new_vals = {
      $set: {
        firstName: new_player.firstName,
        lastName: new_player.lastName,
        email: new_player.email,
        contact: new_player.contact,
        username: new_player.username,
        password: new_player.password,
        isAdmin: new_player.isAdmin,
        days: new_player.days,
        games: new_player.games,
        cashAmount: new_player.cashAmount,
        stocks: new_player.stocks,
      },
    };

    let obj = await collection.updateOne(
      { username: username, games: { $in: [new_player.games] } },
      new_vals
    );

    if (obj.modifiedCount > 0) {
      return "Contact correctly updated.";
    } else {
      return "Contact was not updated";
    }
  }

  static async updatePassword(username, gameName, email, new_player) {
    let collection = await _get_players_collection();

    let new_vals = {
      $set: {
        firstName: new_player.firstName,
        lastName: new_player.lastName,
        email: new_player.email,
        contact: new_player.contact,
        username: new_player.username,
        password: new_player.password,
        isAdmin: new_player.isAdmin,
        days: new_player.days,
        games: new_player.games,
        cashAmount: new_player.cashAmount,
        stocks: new_player.stocks,
      },
    };

    let obj = await collection.updateOne(
      { username: username, email: email, games: { $in: [gameName] } },
      new_vals
    );

    if (obj.modifiedCount > 0) {
      return "password correctly updated.";
    } else {
      return "password was not updated";
    }
  }

  static async delete(username, gameName, email) {
    let collection = await _get_players_collection();
    let obj = await collection.deleteOne({
      username: username,
      games: { $in: [gameName] },
      email: email,
    });
    if (obj.deletedCount > 0) {
      return "Contact was deleted.";
    } else {
      return "Contact was not found";
    }
  }
}

const _Player = Player;
export { _Player as Player };
