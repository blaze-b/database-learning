# MongoDB exercises (worked solutions)

Import / seed first so `learning_mongo.profiles` exists:

```bash
node data/seed.js
# or:
# mongoimport --uri="$MONGODB_URI" --db=learning_mongo --collection=profiles --drop --file=data/profiles.json --jsonArray
```

```javascript
use("learning_mongo");
show collections;
```

## Exercise part 1

### 1. Total number of profile documents

```javascript
db.profiles.countDocuments({});
```

### 2. Pretty-print all profiles without `_id`

```javascript
db.profiles.find({}, { _id: 0 });
```

### 3. Names starting with `I` (case-insensitive)

```javascript
db.profiles.find({ "profile.name": { $regex: /^I/i } });
```

With the sanitised seed data this may return zero documents; try `/^A/i` for `Ava Example`.

### 4. Hobbies starting with `D` — print names and hobbies only

```javascript
db.profiles.find(
  { hobbies: { $regex: /^d/i } },
  { "profile.name": 1, hobbies: 1, _id: 0 }
);
```

### 5. Add a `skill` field on one profile

```javascript
db.profiles.updateOne(
  { "profile.name": "Ava Example" },
  { $set: { skill: "mongo" } }
);
```

### 6. Print only names

```javascript
db.profiles.find({}, { "profile.name": 1, _id: 0 });
```

### 7. Names whose work experience is ≥ 2 years

```javascript
db.profiles.find(
  { "work.experience": { $gte: 2 } },
  { "profile.name": 1, _id: 0 }
);
```

### 8. Names who know more than 2 languages, alphabetical

```javascript
db.profiles
  .find(
    { $expr: { $gte: [{ $size: "$languages" }, 2] } },
    { "profile.name": 1, _id: 0 }
  )
  .sort({ "profile.name": 1 });
```

> Note: original training materials used real personal names and an employer name. Those values are replaced here with fake seed data (`Ava Example`, `Acme Learning Co`, etc.).
