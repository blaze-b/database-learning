# Node

Modern Node.js examples using the official **mongodb** driver **6.x** and **`@hapi/hapi`**. Connection comes from `MONGODB_URI` (default `mongodb://localhost:27017`).

**Previous:** [Chapter 5: Exercises](../exercises/) · **Next:** [Mongo](../README.md)

## Setup

```bash
# from mongo/
npm install                 # seed dependency
npm --prefix node install   # example dependencies
npm run seed
```

## Examples

| Path | What It Does |
|------|----------------|
| [`basic/index.js`](basic/index.js) | Connect, print sample tours and profiles, exit |
| [`hapi/index.js`](hapi/index.js) | REST API over `tours` on `PORT` (default `8081`) |

```bash
node node/basic/index.js
SMOKE=1 node node/hapi/index.js          # CI-friendly single inject + exit
node node/hapi/index.js                  # leave server running
```

## Useful Hapi Routes

When the server is up:

- `GET /api/tours?tourPackage=Backpack%20Cal`
- `GET /api/tours/Big%20Sur%20Retreat`
- `POST /api/tours` with a JSON body
- `PUT /api/tours/{name}`
- `DELETE /api/tours/{name}`

---

**Previous:** [Chapter 5: Exercises](../exercises/) · **Next:** [Mongo](../README.md)
