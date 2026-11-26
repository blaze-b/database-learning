# MongoDB concept notes

Merged and tidied notes from project and essential training materials. Typos corrected; secrets and personal details removed.

## What MongoDB is

- A database is a structured way to store and access data.
- MongoDB is a document (NoSQL) database: data is stored as **documents** in **collections**.
- Documents are closer to application objects than relational rows.

### Terminology

| Term | Meaning |
|------|---------|
| **Document** | A set of field–value pairs (BSON/JSON-like object) |
| **Field** | A unique identifier for a datapoint |
| **Value** | Data for a given field |
| **Collection** | An organised store of documents (often sharing common fields) |
| **URI** | Uniform Resource Identifier used to connect |
| **SRV** | DNS SRV-style connection string format for Atlas (`mongodb+srv://…`) |

Example document shape:

```json
{
  "name": "Ava Example",
  "title": "Team Lead",
  "age": 26
}
```

## JSON vs BSON

**JSON**

- Starts/ends with `{}`; `key: value` pairs separated by commas.
- Pros: familiar, readable, user-friendly.
- Cons: text-based, space-consuming, limited types (string, boolean, number, array, object, null).

**BSON** (Binary JSON — how MongoDB stores data)

- Bridged gap between binary representation and JSON.
- Optimised for speed, space, and flexibility.
- Extra types: integers, long, float, date, raw binary, ObjectId, Decimal128, etc.

## Why document databases

- Flexible schema; easy to adapt common coding practices.
- Embedded data: fewer joins, simpler reads, easier to query and index.
- References: more operations for inserts/access; aggregation can be complex; better when consistency of shared entities matters.

## Big data and NoSQL (high level)

- Common “V”s: Volume, Variety, Velocity (and Veracity for data quality).
- NoSQL ≈ “Not Only SQL”: non-tabular models suited to large or flexible data and real-time apps.
- Types: document (MongoDB, CouchDB), column (Cassandra), key-value (Redis), graph (Neo4j), caches.

**Advantages vs classic RDBMS (when they apply):** flexible schemas, horizontal scale-out, unstructured data.

**Trade-offs:** relational integrity, well-known SQL joins, strong ACID patterns for multi-row business rules.

## MongoDB features worth knowing

- **Indexing** — improves query performance; ADHOC full scans are expensive on large collections. Up to 64 indexes per collection. Single-field, compound, unique (`_id` is the primary unique key).
- **Sharding** — partition by shard key across machines; software scalability; can be challenging to set up.
- **Replication** — primary/secondary replica sets; automatic failover; reliability and uptime.
- **Projection, aggregation, sorting, limiting** — shape and summarise results without pulling whole documents.

Default local port: **27017**.

## MongoDB Atlas (cloud)

- Database as a Service (DBaaS) built on MongoDB.
- **Cluster**: group of servers storing data.
- **Replica set**: connected instances that store the same data. Free Atlas clusters are typically a 3-node replica set with limited storage.
- You choose a cloud provider/region; Atlas manages create/run/maintain of the deployment.

### Safe connection patterns

Prefer environment variables — never commit real credentials:

```bash
export MONGODB_URI='mongodb://localhost:27017'
# or Atlas placeholder:
# export MONGODB_URI='mongodb+srv://<username>:<password>@<cluster>.mongodb.net'
```

Authentication database for Atlas admin users is often `admin`.

Allowing access from anywhere (`0.0.0.0/0`) is **not** appropriate for production clusters.

### Import / export

| Format | Export | Import |
|--------|--------|--------|
| BSON | `mongodump` | `mongorestore` |
| JSON | `mongoexport` | `mongoimport` |

Examples against local (scrubbed):

```bash
mongodump --uri "mongodb://localhost:27017/sample_supplies"
mongoexport --uri="mongodb://localhost:27017/sample_supplies" --collection=sales --out=sales.json
mongorestore --uri "mongodb://localhost:27017/sample_supplies" --drop dump
mongoimport --uri="mongodb://localhost:27017/sample_supplies" --collection=sales --drop --file=sales.json --jsonArray
```

## Shell basics

```javascript
show dbs
use learning_mongo
show collections
db.tours.find()
db.cars.insertOne({ make: "Suzuki" })
print("Hello")
```

Variables and loops work in the shell (mongosh / legacy `mongo`).

`explain()` / `explain("executionStats")` show whether a query used an index (`IXSCAN`) or a collection scan (`COLLSCAN`).

## `_id`

- Every document needs a unique `_id`.
- Default type is `ObjectId` unless you supply your own.
- Identical-looking documents can coexist if `_id` values differ.
- Schema validation can enforce document structure when you need it.

## CRUD overview

| Operation | One | Many |
|-----------|-----|------|
| Create | `insertOne` | `insertMany` |
| Read | `findOne` | `find` |
| Update | `updateOne` | `updateMany` |
| Delete | `deleteOne` | `deleteMany` |

- `insertMany` is **ordered** by default: stops on first error (for example duplicate `_id`). Pass `{ ordered: false }` to continue.
- Creating a collection happens automatically on first write.
- `db.collection.drop()` removes a collection.

## Finding, projecting, sorting

```javascript
db.profiles.find({ "profile.name": { $regex: /^a/i } })
db.profiles.find({ hobbies: { $regex: /^d/i } }, { "profile.name": 1, hobbies: 1, _id: 0 })
db.profiles.find({}, { "profile.name": 1, _id: 0 }).sort({ "profile.name": 1 })
```

Regex patterns approximate SQL `LIKE`.

## Update operators (common)

- `$set` — set fields
- `$inc` — increment numeric fields
- `$push` / `$addToSet` — array append / unique append
- `$pull` — remove array elements matching a condition

## Indexing example pattern

1. Run a query with `explain("executionStats")` and note `totalDocsExamined`.
2. `createIndex({ field: 1 })` or a compound index `{ a: 1, b: 1 }`.
3. Re-run explain and confirm fewer docs examined / `IXSCAN`.

## Aggregation (intro)

Pipelines transform documents stage by stage (`$match`, `$group`, `$project`, `$sort`, `$limit`, `$unwind`, …). See `queries/10-aggregation.mongodb`.

## Text search (intro)

Create a text index, then query with `$text` / `$search`. See `queries/12-text-search.mongodb`.

## Tooling (modern names)

- **mongosh** — current MongoDB shell (prefer over legacy `mongo`).
- **MongoDB Compass** — GUI explorer.
- **Atlas Charts** — visualisation (paid features may apply).
- Older “Stitch” branding evolved into Atlas App Services; prefer current Atlas docs for APIs.

## Node drivers

This repo’s examples use the official **mongodb** driver **6.x** with `async`/`await`, and **`@hapi/hapi`** for the HTTP API sample. Read `MONGODB_URI` from the environment.
