# queries/

Numbered mongosh scripts organised by topic. Each file starts with a header comment describing the topic, what it demonstrates, and which collection(s) it uses.

## How to run

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

## Files

See the [topic table in the mongo README](../README.md#topic-table-query-files) for a one-line summary and collection list per file.

## Conventions

- Prefer `use("dbName")` and modern mongosh helpers (`countDocuments`, `insertOne`, …).
- Catch expected duplicate-key errors in demos so CI exits zero.
- After destructive demos, rely on `npm run seed` to restore a known state.
