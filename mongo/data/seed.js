#!/usr/bin/env node
/**
 * Seed local MongoDB with sanitised sample datasets for the query reference.
 *
 * Usage:
 *   MONGODB_URI=mongodb://localhost:27017 node data/seed.js
 */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATA_DIR = __dirname;

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), "utf8"));
}

/** Convert extended JSON helpers used in sales.json into native values. */
function reviveSales(docs) {
  return docs.map((doc) => {
    const next = { ...doc };
    if (next.saleDate && next.saleDate.$date) {
      next.saleDate = new Date(next.saleDate.$date);
    }
    if (Array.isArray(next.items)) {
      next.items = next.items.map((item) => {
        const copy = { ...item };
        if (copy.price && copy.price.$numberDecimal) {
          copy.price = Number(copy.price.$numberDecimal);
        }
        return copy;
      });
    }
    return next;
  });
}

async function replaceCollection(db, name, docs) {
  const col = db.collection(name);
  await col.deleteMany({});
  if (docs.length) {
    await col.insertMany(docs);
  }
  console.log(`  ${db.databaseName}.${name}: ${docs.length} docs`);
}

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  console.log(`Connected to ${URI}`);

  const learning = client.db("learning_mongo");
  await replaceCollection(learning, "tours", loadJson("tours.json"));
  await replaceCollection(learning, "profiles", loadJson("profiles.json"));
  await replaceCollection(learning, "users", [loadJson("users.json")]);
  await replaceCollection(learning, "companies", loadJson("companies.json"));

  const training = client.db("sample_training");
  await replaceCollection(training, "zips", loadJson("zips.json"));
  await replaceCollection(training, "inspections", loadJson("inspections.json"));
  await replaceCollection(training, "grades", loadJson("grades.json"));

  const supplies = client.db("sample_supplies");
  await replaceCollection(supplies, "sales", reviveSales(loadJson("sales.json")));

  // Drop scratch collections so CRUD demos start clean
  await training.dropCollection("pets").catch(() => {});
  await training.dropCollection("inspection").catch(() => {});

  await client.close();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
