# Mongo

MongoDB query reference for writing and testing scripts locally. Notes, sanitised datasets, numbered mongosh files, Node examples, and exercises — without real Atlas hosts or credentials.

## What It Covers

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

## Quick Start

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

## Chapters

Learning path through this folder, then the numbered query topics.

### Folder Chapters

| Chapter | Title | Path |
|---------|-------|------|
| Chapter 1 | Notes | [`notes/`](notes/) |
| Chapter 2 | Data | [`data/`](data/) |
| Chapter 3 | Queries | [`queries/`](queries/) |
| Chapter 4 | Templates | [`templates/`](templates/) |
| Chapter 5 | Exercises | [`exercises/`](exercises/) |
| Chapter 6 | Node | [`node/`](node/) |

### Query Chapters

| Chapter | Title | File | Collection(s) |
|---------|-------|------|---------------|
| Chapter 1 | Crud Insert | [`queries/01-crud-insert.mongodb`](queries/01-crud-insert.mongodb) | `sample_training.inspections`, `sample_training.pets` |
| Chapter 2 | Crud Find | [`queries/02-crud-find.mongodb`](queries/02-crud-find.mongodb) | `sample_training.zips`, `learning_mongo.tours` |
| Chapter 3 | Crud Update | [`queries/03-crud-update.mongodb`](queries/03-crud-update.mongodb) | `sample_training.zips`, `grades`, `pets` |
| Chapter 4 | Crud Delete | [`queries/04-crud-delete.mongodb`](queries/04-crud-delete.mongodb) | `sample_training.inspections`, `inspection` |
| Chapter 5 | Filters And Operators | [`queries/05-filters-operators.mongodb`](queries/05-filters-operators.mongodb) | `learning_mongo.tours`, `profiles`, `sample_training.zips` |
| Chapter 6 | Projection | [`queries/06-projection.mongodb`](queries/06-projection.mongodb) | `learning_mongo.profiles`, `tours` |
| Chapter 7 | Sort And Limit | [`queries/07-sort-limit.mongodb`](queries/07-sort-limit.mongodb) | `learning_mongo.tours`, `profiles` |
| Chapter 8 | Arrays And Embedded Docs | [`queries/08-arrays-embedded.mongodb`](queries/08-arrays-embedded.mongodb) | `learning_mongo.profiles`, `tours`, `users` |
| Chapter 9 | Indexes | [`queries/09-indexes.mongodb`](queries/09-indexes.mongodb) | `learning_mongo.tours`, `numbers` |
| Chapter 10 | Aggregation | [`queries/10-aggregation.mongodb`](queries/10-aggregation.mongodb) | `sample_supplies.sales`, `learning_mongo.tours` |
| Chapter 11 | Update Operators | [`queries/11-update-operators.mongodb`](queries/11-update-operators.mongodb) | `learning_mongo.tours`, `profiles` |
| Chapter 12 | Text Search | [`queries/12-text-search.mongodb`](queries/12-text-search.mongodb) | `learning_mongo.tours` |

More detail: [`queries/README.md`](queries/README.md).

## Databases After Seed

| Database | Collections |
|----------|-------------|
| `learning_mongo` | `tours`, `profiles`, `users`, `companies` |
| `sample_training` | `zips`, `inspections`, `grades` (+ scratch `pets` from demos) |
| `sample_supplies` | `sales` |

## Query Cheat-Sheet

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

## Write A New Query Script (From Templates)

1. Copy [`templates/find-template.mongodb`](templates/find-template.mongodb) or [`templates/aggregation-template.mongodb`](templates/aggregation-template.mongodb) into `queries/`.
2. Name it with the next number and topic, for example `13-lookup-joins.mongodb`.
3. Add a header comment: topic, collection(s), and what the file demonstrates.
4. Point `use("...")` at a seeded database (`learning_mongo`, `sample_training`, or `sample_supplies`).
5. Replace the filter / pipeline stubs; keep examples idempotent when you can (or reseed before CI).
6. Run locally: `mongosh "${MONGODB_URI:-mongodb://localhost:27017}" --file queries/13-lookup-joins.mongodb`
7. Link the file in the chapters table above and in [`queries/README.md`](queries/README.md).

## Exercises

Worked solutions against `profiles`: [`exercises/mongodb-exercises.md`](exercises/mongodb-exercises.md). Seed first so counts and field paths match.

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb://localhost:27017` | Connection string for seed, mongosh, and Node |
| `MONGODB_DB` | `learning_mongo` | Default DB for Node examples |
| `PORT` | `8081` | Hapi server port |
| `SMOKE` | unset | Set to `1` to run one Hapi inject cycle and exit (CI) |

See [`.env.example`](.env.example). Do not commit a real `.env`.

## Troubleshooting

| Symptom | What To Try |
|---------|-------------|
| Port `27017` already in use | Stop the other MongoDB, or change the host port mapping in `docker-compose.yml` and update `MONGODB_URI` |
| `ECONNREFUSED` from seed/Node | `docker compose up -d` and wait for healthy; confirm `docker compose ps` |
| Auth errors against Atlas | Use placeholders only in git; put real URI in local `.env` (gitignored). Local Docker needs no auth by default |
| Query results look wrong / missing docs | Reseed: `npm run seed` (drops/reloads seed collections) |
| Text search / index errors on re-run | `12-text-search.mongodb` drops existing text indexes first; reseed if tours were heavily edited |
| Hapi port busy | `PORT=8082 SMOKE=1 node node/hapi/index.js` |

## Privacy

Personal names, employer names, phones, emails, hostnames, and Atlas connection strings from source training materials were replaced with fake/generated values or placeholders before this public copy.
