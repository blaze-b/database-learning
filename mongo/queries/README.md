# Queries

Numbered mongosh scripts organised as chapters. Each file starts with a header comment describing the topic, what it demonstrates, and which collection(s) it uses.

**Previous:** [Chapter 2: Data](../data/) · **Next:** [Chapter 4: Templates](../templates/)

## How To Run

From `mongo/` (after Docker is up and data is seeded):

```bash
mongosh "${MONGODB_URI:-mongodb://localhost:27017}" --file queries/02-crud-find.mongodb
```

Run every file:

```bash
for f in queries/*.mongodb; do
  mongosh "${MONGODB_URI:-mongodb://localhost:27017}" --quiet --file "$f"
done
```

## Query Chapters

| Chapter | Title | File | What It Shows |
|---------|-------|------|---------------|
| Chapter 1 | Crud Insert | [`01-crud-insert.mongodb`](01-crud-insert.mongodb) | `insertOne` / `insertMany`, duplicate `_id`, `ordered: false` |
| Chapter 2 | Crud Find | [`02-crud-find.mongodb`](02-crud-find.mongodb) | `find` / `findOne`, equality filters, `countDocuments` |
| Chapter 3 | Crud Update | [`03-crud-update.mongodb`](03-crud-update.mongodb) | `updateOne` / `updateMany` with `$set`, `$inc`, `$push` |
| Chapter 4 | Crud Delete | [`04-crud-delete.mongodb`](04-crud-delete.mongodb) | `deleteOne` / `deleteMany`, `drop` |
| Chapter 5 | Filters And Operators | [`05-filters-operators.mongodb`](05-filters-operators.mongodb) | Comparison, logical, `$exists`, `$regex` |
| Chapter 6 | Projection | [`06-projection.mongodb`](06-projection.mongodb) | Include/exclude fields, hide `_id` |
| Chapter 7 | Sort And Limit | [`07-sort-limit.mongodb`](07-sort-limit.mongodb) | `sort`, `limit`, `skip` pagination |
| Chapter 8 | Arrays And Embedded Docs | [`08-arrays-embedded.mongodb`](08-arrays-embedded.mongodb) | Dot notation, `$size`/`$expr`, `$addToSet` |
| Chapter 9 | Indexes | [`09-indexes.mongodb`](09-indexes.mongodb) | `createIndex`, `explain`, compound indexes |
| Chapter 10 | Aggregation | [`10-aggregation.mongodb`](10-aggregation.mongodb) | `$match`, `$group`, `$sort`, `$project`, `$unwind` |
| Chapter 11 | Update Operators | [`11-update-operators.mongodb`](11-update-operators.mongodb) | `$set`/`$unset`/`$inc`/`$push`/`$pull`, upsert |
| Chapter 12 | Text Search | [`12-text-search.mongodb`](12-text-search.mongodb) | Text index, `$text`, `textScore` |

Full collection list: [Mongo chapters](../README.md#query-chapters).

## Conventions

- Prefer `use("dbName")` and modern mongosh helpers (`countDocuments`, `insertOne`, …).
- Catch expected duplicate-key errors in demos so CI exits zero.
- After destructive demos, rely on `npm run seed` to restore a known state.

---

**Previous:** [Chapter 2: Data](../data/) · **Next:** [Chapter 4: Templates](../templates/)
