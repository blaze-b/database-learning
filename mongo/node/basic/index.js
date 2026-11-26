/**
 * Basic MongoDB Node driver example (mongodb 6.x, async/await).
 * Reads MONGODB_URI from the environment (default: mongodb://localhost:27017).
 */
const { MongoClient } = require("mongodb");

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB || "learning_mongo";

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  console.log("Successfully connected to server");

  const db = client.db(DB_NAME);
  const tours = db.collection("tours");
  const profiles = db.collection("profiles");

  const allTours = await tours.find({}).limit(3).toArray();
  console.log("<---------------Printing sample tour details--------------->");
  console.log(allTours);

  const cycle = await tours.find({ tourPackage: "Cycle California" }).toArray();
  console.log("<---------------Printing tourPackage Cycle California--------------->");
  console.log(cycle);

  const allProfiles = await profiles.find({}).project({ _id: 0 }).toArray();
  console.log("<---------------Printing profile details--------------->");
  console.log(allProfiles);

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
