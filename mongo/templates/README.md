# templates/

Copy-paste starters for new mongosh scripts. They are stubs — edit database, collection, filters, and stages before relying on the output.

## Files

| File | Use when |
|------|----------|
| [`find-template.mongodb`](find-template.mongodb) | Building a `find` + projection + sort + limit script |
| [`aggregation-template.mongodb`](aggregation-template.mongodb) | Building a `$match` / `$group` / `$sort` pipeline |

## Workflow

1. Copy a template into [`../queries/`](../queries/) with the next numeric prefix.
2. Fill in the header comment and replace placeholders.
3. Run with mongosh against a seeded local database.
4. Document the new file in [`../README.md`](../README.md) and [`../queries/README.md`](../queries/README.md).

Step-by-step checklist: [Write a new query script](../README.md#write-a-new-query-script-from-templates).
