import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });

var db;

export async function connectToDB() {
  try {
    await client.connect();

    db = await client.db("Stock_Exchange");
    console.log("Connected successfully to mongodb");
  } catch (err) {
    throw err;
  }
}

export async function getDb() {
  return db;
}

export async function closeDBConnection() {
  await client.close();
  return "Connection closed";
}

export default { connectToDB, getDb, closeDBConnection };
