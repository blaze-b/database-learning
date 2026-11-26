# mongo/

MongoDB query reference for writing and testing scripts locally. Notes, sanitised datasets, numbered mongosh files, Node examples, and exercises — without real Atlas hosts or credentials.

## What it covers

- Document model basics (JSON/BSON, collections, `_id`)
- CRUD, filters, projection, sort/limit
- Arrays and embedded documents
- Indexes and `explain`
- Aggregation pipelines
- Update operators and text search
- Modern Node driver (6.x) and `@hapi/hapi` HTTP sample

## Prerequisites

| Tool | Why |
|------|-----|
| Docker Compose | Local MongoDB 7 (`docker-compose.yml`) |
| Node.js 18+ | `data/seed.js` and `node/` examples |
| mongosh | Run files under `queries/` and `templates/` |

## Quick start

```bash
# from this folder (mongo/)
cp .env.example .env
docker compose up -d

npm install
npm --prefix node install
npm run seed

# run one query file
mongosh "${MONGODB_URI:-mongodb://localhost:27017}" --file queries/02-crud-find.mongodb

# Node examples
node node/basic/index.js
SMOKE=1 node node/hapi/index.js   # request cycle then exit
# or leave the API up:
# npm --prefix node run hapi
```

Atlas-style URI (placeholders only — never commit real values):

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net
```

## Topic table (query files)

| File | What it shows | Collection(s) |
|------|---------------|---------------|
| [`queries/01-crud-insert.mongodb`](queries/01-crud-insert.mongodb) | `insertOne` / `insertMany`, duplicate `_id`, `ordered: false` | `sample_training.inspections`, `sample_training.pets` |
| [`queries/02-crud-find.mongodb`](queries/02-crud-find.mongodb) | `find` / `findOne`, equality filters, `countDocuments` | `sample_training.zips`, `learning_mongo.tours` |
| [`queries/03-crud-update.mongodb`](queries/03-crud-update.mongodb) | `updateOne` / `updateMany` with `$set`, `$inc`, `$push` | `sample_training.zips`, `grades`, `pets` |
| [`queries/04-crud-delete.mongodb`](queries/04-crud-delete.mongodb) | `deleteOne` / `deleteMany`, `drop` | `sample_training.inspections`, `inspection` |
| [`queries/05-filters-operators.mongodb`](queries/05-filters-operators.mongodb) | `$lt`/`$gte`/`$in`/`$ne`/`$or`/`$and`/`$exists`/`$regex` | `learning_mongo.tours`, `profiles`, `sample_training.zips` |
| [`queries/06-projection.mongodb`](queries/06-projection.mongodb) | Include/exclude fields, hide `_id` | `learning_mongo.profiles`, `tours` |
| [`queries/07-sort-limit.mongodb`](queries/07-sort-limit.mongodb) | `sort`, `limit`, `skip` pagination | `learning_mongo.tours`, `profiles` |
| [`queries/08-arrays-embedded.mongodb`](queries/08-arrays-embedded.mongodb) | Dot notation, `$size`/`$expr`, `$addToSet` | `learning_mongo.profiles`, `tours`, `users` |
| [`queries/09-indexes.mongodb`](queries/09-indexes.mongodb) | `createIndex`, `explain` COLLSCAN vs IXSCAN, compound indexes | `learning_mongo.tours`, `numbers` |
| [`queries/10-aggregation.mongodb`](queries/10-aggregation.mongodb) | `$match`, `$group`, `$sort`, `$project`, `$unwind` | `sample_supplies.sales`, `learning_mongo.tours` |
| [`queries/11-update-operators.mongodb`](queries/11-update-operators.mongodb) | `$set`/`$unset`/`$inc`/`$push`/`$pull`/`$addToSet`, upsert | `learning_mongo.tours`, `profiles` |
| [`queries/12-text-search.mongodb`](queries/12-text-search.mongodb) | Text index, `$text`, `textScore` | `learning_mongo.tours` |

More detail: [`queries/README.md`](queries/README.md).

## Databases after seed

| Database | Collections |
|----------|-------------|
| `learning_mongo` | `tours`, `profiles`, `users`, `companies` |
| `sample_training` | `zips`, `inspections`, `grades` (+ scratch `pets` from demos) |
| `sample_supplies` | `sales` |

## Query cheat-sheet

```javascript
use("learning_mongo");

// Find + project + sort + limit
db.tours
  .find({ tourPrice: { $lte: 500 } }, { tourName: 1, tourPrice: 1, _id: 0 })
  .sort({ tourPrice: 1 })
  .limit(10);

// Update operators
db.tours.updateOne(
  { tourName: "Big Sur Retreat" },
  { $set: { tourRegion: "Central Coast" }, $addToSet: { tourTags: "coastal" } }
);

// Embedded / array filters
db.profiles.find(
  { "work.experience": { $gte: 2 } },
  { "profile.name": 1, _id: 0 }
);

// Aggregation
db.tours.aggregate([
  { $group: { _id: "$tourPackage", avgPrice: { $avg: "$tourPrice" }, count: { $sum: 1 } } },
  { $sort: { avgPrice: 1 } },
]);
```

Copy-paste starters: [`templates/`](templates/).

## Write a new query script (from templates)

1. Copy [`templates/find-template.mongodb`](templates/find-template.mongodb) or [`templates/aggregation-template.mongodb`](templates/aggregation-template.mongodb) into `queries/`.
2. Name it with the next number and topic, for example `13-lookup-joins.mongodb`.
3. Add a header comment: topic, collection(s), and what the file demonstrates.
4. Point `use("...")` at a seeded database (`learning_mongo`, `sample_training`, or `sample_supplies`).
5. Replace the filter / pipeline stubs; keep examples idempotent when you can (or reseed before CI).
6. Run locally: `mongosh "${MONGODB_URI:-mongodb://localhost:27017}" --file queries/13-lookup-joins.mongodb`
7. Link the file in the topic table above and in [`queries/README.md`](queries/README.md).

## Exercises

Worked solutions against `profiles`: [`exercises/mongodb-exercises.md`](exercises/mongodb-exercises.md). Seed first so counts and field paths match.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb://localhost:27017` | Connection string for seed, mongosh, and Node |
| `MONGODB_DB` | `learning_mongo` | Default DB for Node examples |
| `PORT` | `8081` | Hapi server port |
| `SMOKE` | unset | Set to `1` to run one Hapi inject cycle and exit (CI) |

See [`.env.example`](.env.example). Do not commit a real `.env`.

## Folder map

| Path | README |
|------|--------|
| [`notes/`](notes/) | [`notes/README.md`](notes/README.md) |
| [`queries/`](queries/) | [`queries/README.md`](queries/README.md) |
| [`exercises/`](exercises/) | [`exercises/README.md`](exercises/README.md) |
| [`data/`](data/) | [`data/README.md`](data/README.md) |
| [`node/`](node/) | [`node/README.md`](node/README.md) |
| [`templates/`](templates/) | [`templates/README.md`](templates/README.md) |

## Troubleshooting

| Symptom | What to try |
|---------|-------------|
| Port `27017` already in use | Stop the other MongoDB, or change the host port mapping in `docker-compose.yml` and update `MONGODB_URI` |
| `ECONNREFUSED` from seed/Node | `docker compose up -d` and wait for healthy; confirm `docker compose ps` |
| Auth errors against Atlas | Use placeholders only in git; put real URI in local `.env` (gitignored). Local Docker needs no auth by default |
| Query results look wrong / missing docs | Reseed: `npm run seed` (drops/reloads seed collections) |
| Text search / index errors on re-run | `12-text-search.mongodb` drops existing text indexes first; reseed if tours were heavily edited |
| Hapi port busy | `PORT=8082 SMOKE=1 node node/hapi/index.js` |

## Privacy

Personal names, employer names, phones, emails, hostnames, and Atlas connection strings from source training materials were replaced with fake/generated values or placeholders before this public copy.
