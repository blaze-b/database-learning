# data/

Sanitised JSON sample datasets and the seed script that loads them into local MongoDB.

## Contents

| File | Loaded into |
|------|-------------|
| `tours.json` | `learning_mongo.tours` |
| `profiles.json` | `learning_mongo.profiles` |
| `users.json` | `learning_mongo.users` |
| `companies.json` | `learning_mongo.companies` |
| `zips.json` | `sample_training.zips` |
| `inspections.json` | `sample_training.inspections` |
| `grades.json` | `sample_training.grades` |
| `sales.json` | `sample_supplies.sales` (small fake subset) |
| `seed.js` | Node seeder (`MONGODB_URI`) |
| `json-demo.html` | Browser JSON.parse demo (no server required) |

## How to seed

```bash
# from mongo/
npm install
npm run seed
# or: node data/seed.js
```

Seed **replaces** the collections listed above. Scratch collections such as `pets` are dropped when present.

Values are intentionally fake (`Ava Example`, `user000@example.test`, `Acme Learning Co`, …). Do not reintroduce real personal or employer data.
